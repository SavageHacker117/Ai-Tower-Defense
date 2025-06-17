import * as THREE from 'three';
import { GameLoop } from './GameLoop.js';
import { ResourceManager } from './ResourceManager.js';
import { PlayerHealthSystem } from './PlayerHealthSystem.js';
import { HealthSystem } from './HealthSystem.js';
import { AudioManager } from './AudioManager.js';
import { InputManager } from './InputManager.js';
import { NotificationManager } from './NotificationManager.js';
import { HUDManager } from './HUDManager.js';
import { EnemyUIManager, initEnemyUIStyles } from './EnemyUIManager.js';
import { MapData } from './MapData.js';
import { LevelData } from './LevelData.js';
import { Pathfinding } from './Pathfinding.js';
import { Enemy } from './enemy.js';
import { WaveManager } from './WaveManager.js';
import { TowerSystem } from './TowerSystem.js';
import { ProjectileSystem } from './ProjectileSystem.js';
import { TargetingSystem } from './TargetingSystem.js';
import { StatusEffectSystem } from './StatusEffectSystem.js';
import { VisualFeedbackSystem } from './VisualFeedbackSystem.js';
import { MultiplayerManager } from './MultiplayerManager.js';
import { AuthManager } from './AuthManager.js';
import UIController from './UIController.js';

class Game {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.canvas = null;
    this.socket = null;
    this.updateLoading('Starting game engine...');
    this.init();
  }

  updateLoading(text) {
    const progress = document.getElementById('loadingProgress');
    if (progress) progress.textContent = text;
  }

  async init() {
    this.updateLoading('Initializing graphics...');
    await this.initThreeJS();
    this.updateLoading('Setting up systems...');
    await this.initGameSystems();
    this.updateLoading('Configuring UI and input...');
    this.setupEventListeners();
    this.updateLoading('Ready!');
    this.prepareIntro();
  }

  async initThreeJS() {
    this.canvas = document.getElementById('gameCanvas');
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1d2953);
    this.camera = new THREE.PerspectiveCamera(75, this.canvas.width / this.canvas.height, 0.1, 1000);
    this.camera.position.set(0, 30, 25);
    this.camera.lookAt(0, 0, 0);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setSize(this.canvas.width, this.canvas.height);
    this.renderer.shadowMap.enabled = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 15);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    const groundGeo = new THREE.PlaneGeometry(50, 50);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x346751 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  async initGameSystems() {
    this.notificationManager = new NotificationManager();
    this.audioManager = new AudioManager();
    await this.audioManager.init();
    initEnemyUIStyles();

    this.socket = io('http://127.0.0.1:5000');
    this.authManager = new AuthManager();
    this.multiplayerManager = new MultiplayerManager({
      authManager: this.authManager,
      notificationManager: this.notificationManager,
      socket: this.socket,
      eventBus: this
    });

    this.resourceManager = new ResourceManager(this.notificationManager);
    this.playerHealthSystem = new PlayerHealthSystem(20, {
      notificationManager: this.notificationManager,
      audioManager: this.audioManager,
      onGameOver: () => this.handleGameOver()
    });
    this.healthSystem = new HealthSystem({
      notificationManager: this.notificationManager,
      audioManager: this.audioManager
    });
    this.statusEffectSystem = new StatusEffectSystem(this.healthSystem);
    this.levelData = new LevelData();
    this.mapData = new MapData();
    await this.mapData.loadLevel(1);
    this.pathfinding = new Pathfinding();
    this.pathfinding.initializeGrid(this.mapData);
    this.enemyPath = this.pathfinding.generatePath(this.mapData.getSpawnPoint(), this.mapData.getEndPoint());
    this.enemies = [];

    this.targetingSystem = new TargetingSystem({ notificationManager: this.notificationManager });
    this.projectileSystem = new ProjectileSystem({
      healthSystem: this.healthSystem,
      statusEffectSystem: this.statusEffectSystem,
      gameCanvas: this.canvas
    });

    this.towerSystem = new TowerSystem({
      gameMap: this.mapData,
      healthSystem: this.healthSystem,
      targetingSystem: this.targetingSystem,
      notificationManager: this.notificationManager,
      resourceManager: this.resourceManager
    });

    this.waveManager = new WaveManager({
      levelData: this.levelData,
      notificationManager: this.notificationManager,
      resourceManager: this.resourceManager,
      playerHealthSystem: this.playerHealthSystem,
      addEnemy: (enemy) => this.addEnemy(enemy),
      getEnemyPath: () => this.enemyPath,
      getEnemies: () => this.enemies,
      mapData: this.mapData
    });
    await this.waveManager.initialize(1);

    const hudElements = {
      minimapElement: document.getElementById('minimap-container'),
      scoreDisplayElement: document.getElementById('score-display'),
      waveIndicatorElement: document.getElementById('wave-indicator'),
      goldDisplayElement: document.getElementById('gold-display'),
      livesDisplayElement: document.getElementById('lives-display'),
      waveCountdownElement: document.getElementById('wave-countdown'),
      startWaveButtonElement: document.getElementById('start-wave-button'),
      towerSelectionContainer: document.getElementById('tower-selection')
    };

    this.hudManager = new HUDManager(
      hudElements.minimapElement,
      hudElements.scoreDisplayElement,
      hudElements.waveIndicatorElement,
      hudElements.goldDisplayElement,
      hudElements.livesDisplayElement,
      hudElements.waveCountdownElement,
      hudElements.startWaveButtonElement,
      hudElements.towerSelectionContainer
    );

    this.uiController = new UIController(this.hudManager);
    this.uiController.updateAll({
      gold: this.resourceManager.gold,
      lives: this.playerHealthSystem.lives,
      wave: this.waveManager.getCurrentWave(),
      totalWaves: this.waveManager.getTotalWaves(),
      score: 0,
      waveCountdown: 30
    });

    this.enemyUIManager = new EnemyUIManager({
      camera: this.camera,
      renderer: this.renderer,
      gameContainer: document.getElementById('game-container')
    });

    this.inputManager = new InputManager({
      audioManager: this.audioManager,
      notificationManager: this.notificationManager,
      resourceManager: this.resourceManager,
      towerSystem: this.towerSystem,
      getCamera: () => this.camera,
      getRenderer: () => this.renderer,
      getScene: () => this.scene,
      getTowers: () => this.towerSystem.getAllTowers(),
      getEnemies: () => this.enemies,
      getEnemyPath: () => this.enemyPath,
      togglePause: () => this.togglePause()
    });

    this.gameLoop = new GameLoop({
      updateCallback: (dt) => this.update(dt),
      renderCallback: () => this.render(),
      notificationManager: this.notificationManager
    });

    this.addEventListener('remoteTowerPlaced', (data) => {
      this.towerSystem.placeTower(data.type, data.position.x, data.position.z);
    });
  }

  setupEventListeners() {
    document.addEventListener('startWave', () => {
      this.waveManager.startNextWave();
      this.uiController.hideStartWave();
    });
    document.addEventListener('selectTower', (e) => {
      this.inputManager.prepareTowerPlacement(e.detail.towerType);
    });
    document.addEventListener('upgradeTower', (e) => {
      const { towerId, upgradeType, cost } = e.detail;
      if (this.resourceManager.gold >= cost) {
        this.resourceManager.spendGold(cost);
        this.towerSystem.upgradeTower(towerId, upgradeType);
        this.uiController.updateAll({
          gold: this.resourceManager.gold,
          lives: this.playerHealthSystem.lives,
          wave: this.waveManager.getCurrentWave(),
          totalWaves: this.waveManager.getTotalWaves(),
          score: 0,
          waveCountdown: 30
        });
        this.uiController.hideUpgradeOptions();
      }
    });
  }

  prepareIntro() {
    const loadingScreen = document.getElementById('loadingScreen');
    const startButton = document.getElementById('startGameBtn');
    loadingScreen.querySelector('h1').textContent = 'Tower Defense';
    startButton.style.display = 'block';
    startButton.addEventListener('click', () => {
      loadingScreen.style.transition = 'opacity 0.5s ease-out';
      loadingScreen.style.opacity = '0';
      setTimeout(() => (loadingScreen.style.display = 'none'), 500);
      this.startGame();
    }, { once: true });
  }

  startGame() {
    if (this.gameLoop.isRunning) return;
    this.isPaused = false;
    this.gameSpeed = 1;
    this.gameLoop.start();
    this.audioManager.playBackgroundMusic('default');
    this.uiController.showStartWave();
  }

  handleGameOver() {
    this.gameLoop.stop();
    this.isPaused = true;
    this.notificationManager.showGameOver();
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    this.notificationManager.showInfo(this.isPaused ? 'Game Paused' : 'Game Resumed');
  }

  addEnemy(enemyData) {
    const enemy = new Enemy(enemyData.type, enemyData.template, enemyData.position, enemyData.path);
    this.enemies.push(enemy);
    this.scene.add(enemy.mesh);
    enemy.setDependencies({ enemyUIManager: this.enemyUIManager });
  }

  addEventListener(event, callback) {
    if (!this._events) this._events = {};
    if (!this._events[event]) this._events[event] = [];
    this._events[event].push(callback);
  }

  triggerEvent(event, data) {
    if (this._events && this._events[event]) {
      this._events[event].forEach((cb) => cb(data));
    }
  }

  update(deltaTime) {
    if (this.isPaused) return;
    const dt = deltaTime * this.gameSpeed;
    this.waveManager.update(dt);
    this.enemies.forEach((enemy) => {
      if (enemy.reachedEnd && !enemy.isDead) {
        this.playerHealthSystem.takeDamage(enemy.damage);
        enemy.isDead = true;
        this.scene.remove(enemy.mesh);
      }
      enemy.update(dt, this.enemyPath);
    });
    this.enemies = this.enemies.filter((enemy) => !enemy.isDead);
    this.towerSystem.update(dt, this.enemies);
    this.projectileSystem.update(dt, this.enemies);
    this.enemyUIManager.update(this.enemies);
    this.visualFeedbackSystem.update(dt);
    this.hudManager.update();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    this.visualFeedbackSystem.render();
  }
}

window.addEventListener('load', () => {
  const game = new Game();
  window.game = game;
});

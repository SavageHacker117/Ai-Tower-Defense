// Main Game Entry Point
import * as THREE from 'three';
import { GameLoop } from './GameLoop.js';
import { ResourceManager } from './ResourceManager.js';
import { PlayerHealthSystem } from './PlayerHealthSystem.js';
import { AudioManager } from './AudioManager.js';
import { InputManager } from './InputManager.js';
import { NotificationManager } from './NotificationManager.js';
import { HUDManager } from './HUDManager.js';
import { EnemyUIManager, initEnemyUIStyles } from './EnemyUIManager.js';
import { MapData } from './MapData.js';
import { LevelData } from './LevelData.js';
import { Pathfinding } from './Pathfinding.js';
import { Enemy } from './enemy.js'; // Enemy class, not the factory
import { WaveManager } from './WaveManager.js';
import { TowerSystem } from './TowerSystem.js';
import { ProjectileSystem } from './ProjectileSystem.js';
import { TargetingSystem } from './TargetingSystem.js';
import { StatusEffectSystem } from './StatusEffectSystem.js';
import { VisualFeedbackSystem } from './VisualFeedbackSystem.js';
import { MultiplayerManager } from './MultiplayerManager.js';
import { AuthManager } from './AuthManager.js';

// --- Main Game Class ---
class Game {
  constructor() {
    console.log("Calling method: constructor");
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.canvas = null;
    this.socket = null;
    this.init();
  }
  async init() {
    console.log("Calling method: init");
    console.log('Initializing Game...');
    await this.initThreeJS();
    await this.initGameSystems();
    this.setupEventListeners();
    this.prepareIntro(); // Changed from hideLoadingScreen
    console.log('Game Initialized Successfully!');
  }
  async initThreeJS() {
    console.log("Calling method: initThreeJS");
    this.canvas = document.getElementById('gameCanvas');
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1d2953);
    this.camera = new THREE.PerspectiveCamera(75, this.canvas.width / this.canvas.height, 0.1, 1000);
    this.camera.position.set(0, 30, 25);
    this.camera.lookAt(0, 0, 0);
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    });
    this.renderer.setSize(this.canvas.width, this.canvas.height);
    this.renderer.shadowMap.enabled = true;
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 15);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
    const groundGeo = new THREE.PlaneGeometry(50, 50);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x346751
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }
  async initGameSystems() {
    console.log("Calling method: initGameSystems");
    // --- Core Managers ---
    this.notificationManager = new NotificationManager();
    this.audioManager = new AudioManager();
    await this.audioManager.init();
    initEnemyUIStyles();

    // --- Backend and Multiplayer ---
    this.socket = io('http://127.0.0.1:5000');
    this.authManager = new AuthManager();
    // The Game class acts as an event bus for remote events
    this.multiplayerManager = new MultiplayerManager({
      authManager: this.authManager,
      notificationManager: this.notificationManager,
      socket: this.socket,
      eventBus: this
    });

    // --- Gameplay Systems ---
    this.resourceManager = new ResourceManager(this.notificationManager);
    this.playerHealthSystem = new PlayerHealthSystem(20, {
      notificationManager: this.notificationManager,
      audioManager: this.audioManager,
      onGameOver: function () {
        return this.handleGameOver();
      }
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
    this.targetingSystem = new TargetingSystem({
      notificationManager: this.notificationManager
    });
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
      addEnemy: function (enemy) {
        return this.addEnemy(enemy);
      },
      getEnemyPath: function () {
        return this.enemyPath;
      },
      getEnemies: function () {
        return this.enemies;
      },
      mapData: this.mapData
    });
    await this.waveManager.initialize(1);

    // --- UI, Input, and Visuals ---
    this.visualFeedbackSystem = new VisualFeedbackSystem(this.canvas, this.canvas.getContext('2d'), {
      audioManager: this.audioManager,
      notificationManager: this.notificationManager
    });
    this.hudManager = new HUDManager({
      resourceManager: this.resourceManager,
      playerHealthSystem: this.playerHealthSystem,
      waveManager: this.waveManager,
      getTowers: function () {
        return this.towerSystem.getAllTowers();
      },
      getEnemies: function () {
        return this.enemies;
      },
      getEnemyPath: function () {
        return this.enemyPath;
      },
      isPaused: function () {
        return this.isPaused;
      },
      getGameSpeed: function () {
        return this.gameSpeed;
      }
    });
    this.enemyUIManager = new EnemyUIManager({
      camera: this.camera,
      renderer: this.renderer,
      gameContainer: document.getElementById('gameContainer')
    });
    this.inputManager = new InputManager({
      audioManager: this.audioManager,
      notificationManager: this.notificationManager,
      resourceManager: this.resourceManager,
      towerSystem: this.towerSystem,
      getCamera: function () {
        return this.camera;
      },
      getRenderer: function () {
        return this.renderer;
      },
      getScene: function () {
        return this.scene;
      },
      getTowers: function () {
        return this.towerSystem.getAllTowers();
      },
      getEnemies: function () {
        return this.enemies;
      },
      getEnemyPath: function () {
        return this.enemyPath;
      },
      togglePause: function () {
        return this.togglePause();
      }
    });

    // --- Game Loop ---
    this.gameLoop = new GameLoop({
      updateCallback: function (dt) {
        return this.update(dt);
      },
      renderCallback: function () {
        return this.render();
      },
      notificationManager: this.notificationManager
    });
    this.addEventListener('remoteTowerPlaced', function (data) {
      this.towerSystem.placeTower(data.type, data.position.x, data.position.z);
    });
  }
  setupEventListeners() {
    console.log("Calling method: setupEventListeners");
    this.waveManager.onWaveStart(function (waveNumber) {
      if (this.visualFeedbackSystem) {
        this.visualFeedbackSystem.createScreenShake(5, 300);
      }
    });
    this.waveManager.onWaveComplete(function (waveNumber, results) {
      if (this.waveManager.canStartNextWave()) {
        const startWaveBtn = document.getElementById('startWaveBtn');
        if (startWaveBtn) {
          startWaveBtn.style.display = 'block';
          startWaveBtn.textContent = `▶ Start Wave ${this.waveManager.getCurrentWave() + 1}`;
        }
      }
    });
  }
  prepareIntro() {
    console.log("Calling method: prepareIntro");
    const loadingScreen = document.getElementById('loadingScreen');
    const startButton = document.getElementById('startGameBtn');
    loadingScreen.querySelector('h1').textContent = 'Tower Defense';
    startButton.style.display = 'block'; // Make button visible

    startButton.addEventListener('click', function () {
      loadingScreen.style.transition = 'opacity 0.5s ease-out';
      loadingScreen.style.opacity = '0';
      setTimeout(function () {
        loadingScreen.style.display = 'none';
      }, 500);
      this.startGame();
    }, {
      once: true
    });
  }
  startGame() {
    console.log("Calling method: startGame");
    if (this.gameLoop.isRunning) return;
    this.isPaused = false;
    this.gameSpeed = 1;
    this.gameLoop.start();
    this.audioManager.playBackgroundMusic('default');
    const startWaveBtn = document.getElementById('startWaveBtn');
    if (startWaveBtn) {
      startWaveBtn.style.display = 'block';
      startWaveBtn.onclick = function () {
        this.waveManager.startNextWave();
        startWaveBtn.style.display = 'none';
      };
    }
  }
  handleGameOver() {
    console.log("Calling method: handleGameOver");
    this.gameLoop.stop();
    this.isPaused = true;
    this.notificationManager.showGameOver();
    // You could add logic here to show a restart button in the UI
  }
  togglePause() {
    console.log("Calling method: togglePause");
    this.isPaused = !this.isPaused;
    this.notificationManager.showInfo(this.isPaused ? 'Game Paused' : 'Game Resumed');
  }
  addEnemy(enemyData) {
    console.log("Calling method: addEnemy");
    // This function now receives data and creates the enemy object
    const enemy = new Enemy(enemyData.type, enemyData.template, enemyData.position, enemyData.path);
    this.enemies.push(enemy);
    this.scene.add(enemy.mesh);
    enemy.setDependencies({
      enemyUIManager: this.enemyUIManager
    });
  }
  addEventListener(event, callback) {
    console.log("Calling method: addEventListener");
    if (!this._events) this._events = {};
    if (!this._events[event]) this._events[event] = [];
    this._events[event].push(callback);
  }
  triggerEvent(event, data) {
    console.log("Calling method: triggerEvent");
    if (this._events && this._events[event]) {
      this._events[event].forEach(function (callback) {
        return callback(data);
      });
    }
  }
  update(deltaTime) {
    console.log("Calling method: update");
    if (this.isPaused) return;
    const dt = deltaTime * this.gameSpeed;
    this.waveManager.update(dt);
    this.enemies.forEach(function (enemy) {
      if (enemy.reachedEnd && !enemy.isDead) {
        this.playerHealthSystem.takeDamage(enemy.damage);
        enemy.isDead = true; // Mark as dead to be removed
        this.scene.remove(enemy.mesh);
      }
      enemy.update(dt, this.enemyPath);
    });
    // Filter out dead enemies
    this.enemies = this.enemies.filter(function (enemy) {
      return !enemy.isDead;
    });
    this.towerSystem.update(dt, this.enemies);
    this.projectileSystem.update(dt, this.enemies);
    this.enemyUIManager.update(this.enemies);
    this.hudManager.update();
    this.visualFeedbackSystem.update(dt);
  }
  render() {
    console.log("Calling method: render");
    this.renderer.render(this.scene, this.camera);
    // Important: render 2D UI on top if it's canvas-based
    if (this.visualFeedbackSystem) {
      this.visualFeedbackSystem.render();
    }
  }
}

// Initialize game when page loads
window.addEventListener('load', function () {
  const game = new Game();
  window.game = game; // For easy debugging
});
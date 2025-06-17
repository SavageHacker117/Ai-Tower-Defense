// HUD Manager System - Refactored for ES6 Modules and Dependency Injection
export class HUDManager {
  constructor({
    resourceManager,
    playerHealthSystem,
    waveManager,
    getTowers,
    getEnemies,
    getEnemyPath,
    isPaused,
    gameSpeed
  }) {
    console.log("Calling method: constructor");
    // Store only the specific dependencies we need (Dependency Injection)
    this.resourceManager = resourceManager;
    this.playerHealthSystem = playerHealthSystem;
    this.waveManager = waveManager;

    // Store functions instead of the whole game object
    this.getTowers = getTowers;
    this.getEnemies = getEnemies;
    this.getEnemyPath = getEnemyPath;
    this.getIsPaused = isPaused;
    this.getGameSpeed = gameSpeed;

    // HUD elements
    this.elements = {
      // Health/Lives
      healthHearts: document.getElementById('healthHearts'),
      // Resources
      gold: document.getElementById('gold'),
      energy: document.getElementById('energy'),
      // Wave info
      currentWave: document.getElementById('currentWave'),
      totalWaves: document.getElementById('totalWaves'),
      score: document.getElementById('score'),
      // Control buttons
      pauseBtn: document.getElementById('pauseBtn'),
      speedBtn: document.getElementById('speedBtn'),
      nextWaveBtn: document.getElementById('nextWaveBtn'),
      // Minimap
      minimapCanvas: document.getElementById('minimapCanvas')
    };

    // Minimap context
    this.minimapCtx = null;
    this.minimapScale = 10;
    this.minimapWidth = 200;
    this.minimapHeight = 150;

    // Animation states
    this.animations = {
      goldPulse: false,
      energyPulse: false,
      healthFlash: false,
      scoreGlow: false
    };

    // Update intervals
    this.updateInterval = null;
    this.minimapUpdateInterval = null;

    // Initialize HUD
    this.init();
    console.log('HUDManager initialized');
  }
  init() {
    console.log("Calling method: init");
    // Initialize minimap
    this.initMinimap();

    // Setup event listeners
    this.setupEventListeners();

    // Start update loops
    this.startUpdateLoops();

    // Initial update
    this.updateAll();
  }
  initMinimap() {
    console.log("Calling method: initMinimap");
    if (this.elements.minimapCanvas) {
      this.minimapCtx = this.elements.minimapCanvas.getContext('2d');
      this.elements.minimapCanvas.width = this.minimapWidth;
      this.elements.minimapCanvas.height = this.minimapHeight;
    }
  }
  setupEventListeners() {
    console.log("Calling method: setupEventListeners");
    // Resource manager events
    if (this.resourceManager) {
      this.resourceManager.onResourceChanged(function (type, newValue, oldValue) {
        this.updateResource(type, newValue, oldValue);
      });
      this.resourceManager.onInsufficientResource(function (type, required, available) {
        this.showInsufficientResourceFeedback(type);
      });
    }

    // Player health events
    if (this.playerHealthSystem) {
      this.playerHealthSystem.onHealthChanged(function (newLives, oldLives) {
        this.updateHealth(newLives, oldLives);
      });
      this.playerHealthSystem.onDamage(function () {
        this.triggerHealthFlash();
      });
    }

    // Wave manager events
    if (this.waveManager) {
      this.waveManager.onWaveStart(function (waveNumber) {
        this.updateWaveInfo();
        this.triggerWaveStartEffect();
      });
      this.waveManager.onWaveComplete(function (waveNumber) {
        this.updateWaveInfo();
        this.triggerWaveCompleteEffect();
      });
    }
  }
  startUpdateLoops() {
    console.log("Calling method: startUpdateLoops");
    // Main HUD update (every 100ms)
    this.updateInterval = setInterval(function () {
      this.updateAll();
    }, 100);

    // Minimap update (every 200ms for performance)
    this.minimapUpdateInterval = setInterval(function () {
      this.updateMinimap();
    }, 200);
  }

  // Main update method
  update() {
    console.log("Calling method: update");
    this.updateAll();
  }
  updateAll() {
    console.log("Calling method: updateAll");
    this.updateResources();
    this.updateHealth();
    this.updateWaveInfo();
    this.updateScore();
    this.updateControlButtons();
  }

  // Resource updates
  updateResources() {
    console.log("Calling method: updateResources");
    if (this.resourceManager) {
      this.updateGold(this.resourceManager.getGold());
      this.updateEnergy(this.resourceManager.getEnergy());
    }
  }
  updateResource(type, newValue, oldValue) {
    console.log("Calling method: updateResource");
    switch (type) {
      case 'gold':
        this.updateGold(newValue);
        if (newValue > oldValue) {
          this.triggerResourceGainEffect('gold');
        }
        break;
      case 'energy':
        this.updateEnergy(newValue);
        if (newValue > oldValue) {
          this.triggerResourceGainEffect('energy');
        }
        break;
      case 'score':
        this.updateScore(newValue);
        if (newValue > oldValue) {
          this.triggerScoreGainEffect();
        }
        break;
    }
  }
  updateGold(amount) {
    console.log("Calling method: updateGold");
    if (this.elements.gold) {
      this.elements.gold.textContent = amount;

      // Color coding based on amount
      if (amount < 50) {
        this.elements.gold.style.color = '#ff6666';
      } else if (amount < 100) {
        this.elements.gold.style.color = '#ffaa66';
      } else {
        this.elements.gold.style.color = '#ffdd44';
      }
    }
  }
  updateEnergy(amount) {
    console.log("Calling method: updateEnergy");
    if (this.elements.energy) {
      this.elements.energy.textContent = amount;

      // Color coding based on amount
      if (amount < 20) {
        this.elements.energy.style.color = '#ff6666';
      } else if (amount < 50) {
        this.elements.energy.style.color = '#ffaa66';
      } else {
        this.elements.energy.style.color = '#66aaff';
      }
    }
  }

  // Health updates
  updateHealth(lives = null) {
    console.log("Calling method: updateHealth");
    if (!this.elements.healthHearts) return;
    const currentLives = lives !== null ? lives : this.playerHealthSystem ? this.playerHealthSystem.getCurrentLives() : 3;

    // Clear existing hearts
    this.elements.healthHearts.innerHTML = '';

    // Add heart icons
    for (let i = 0; i < currentLives; i++) {
      const heart = document.createElement('span');
      heart.className = 'health-heart';
      heart.style.animationDelay = `${i * 0.1}s`;
      this.elements.healthHearts.appendChild(heart);
    }

    // Add empty hearts for lost lives
    const maxLives = this.playerHealthSystem ? this.playerHealthSystem.getMaxLives() : 3;
    for (let i = currentLives; i < maxLives; i++) {
      const heart = document.createElement('span');
      heart.className = 'health-heart';
      heart.style.opacity = '0.3';
      heart.style.filter = 'grayscale(100%)';
      this.elements.healthHearts.appendChild(heart);
    }
  }

  // Wave info updates
  updateWaveInfo() {
    console.log("Calling method: updateWaveInfo");
    if (this.waveManager) {
      const currentWave = this.waveManager.getCurrentWave();
      const totalWaves = this.waveManager.getTotalWaves();
      if (this.elements.currentWave) {
        this.elements.currentWave.textContent = currentWave;
      }
      if (this.elements.totalWaves) {
        this.elements.totalWaves.textContent = totalWaves;
      }
    }
  }

  // Score updates
  updateScore(score = null) {
    console.log("Calling method: updateScore");
    if (!this.elements.score) return;
    const currentScore = score !== null ? score : this.resourceManager ? this.resourceManager.getScore() : 0;
    this.elements.score.textContent = this.formatNumber(currentScore);
  }

  // Control button updates
  updateControlButtons() {
    console.log("Calling method: updateControlButtons");
    // Update pause button
    if (this.elements.pauseBtn) {
      const isPaused = this.getIsPaused();
      this.elements.pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
      this.elements.pauseBtn.style.backgroundColor = isPaused ? '#4CAF50' : '#f44336';
    }

    // Update speed button
    if (this.elements.speedBtn) {
      const gameSpeed = this.getGameSpeed();
      this.elements.speedBtn.textContent = `Speed x${gameSpeed}`;
    }

    // Update next wave button
    if (this.elements.nextWaveBtn && this.waveManager) {
      const canStartNext = this.waveManager.canStartNextWave();
      this.elements.nextWaveBtn.disabled = !canStartNext;
      this.elements.nextWaveBtn.style.opacity = canStartNext ? '1' : '0.5';
    }
  }

  // Minimap updates
  updateMinimap() {
    console.log("Calling method: updateMinimap");
    if (!this.minimapCtx) return;
    const ctx = this.minimapCtx;
    const width = this.minimapWidth;
    const height = this.minimapHeight;

    // Clear canvas
    ctx.fillStyle = '#001122';
    ctx.fillRect(0, 0, width, height);

    // Draw border
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, width - 2, height - 2);

    // Draw enemy path
    this.drawMinimapPath(ctx);

    // Draw towers
    this.drawMinimapTowers(ctx);

    // Draw enemies
    this.drawMinimapEnemies(ctx);

    // Draw player base
    this.drawMinimapBase(ctx);
  }
  drawMinimapPath(ctx) {
    console.log("Calling method: drawMinimapPath");
    const path = this.getEnemyPath();
    if (!path || path.length < 2) return;
    ctx.strokeStyle = '#ff6600';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < path.length; i++) {
      const point = this.worldToMinimap(path[i].x, path[i].z);
      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    }
    ctx.stroke();
  }
  drawMinimapTowers(ctx) {
    console.log("Calling method: drawMinimapTowers");
    const towers = this.getTowers();
    towers.forEach(function (tower) {
      const point = this.worldToMinimap(tower.position.x, tower.position.z);

      // Tower body
      ctx.fillStyle = this.getTowerColor(tower.type);
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
      ctx.fill();

      // Tower range (if selected)
      if (tower.isSelected) {
        ctx.strokeStyle = this.getTowerColor(tower.type);
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(point.x, point.y, tower.range * this.minimapScale / 40, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    });
  }
  drawMinimapEnemies(ctx) {
    console.log("Calling method: drawMinimapEnemies");
    const enemies = this.getEnemies();
    enemies.forEach(function (enemy) {
      const point = this.worldToMinimap(enemy.position.x, enemy.position.z);

      // Enemy dot
      ctx.fillStyle = this.getEnemyColor(enemy.type);
      ctx.beginPath();
      ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
      ctx.fill();

      // Health indicator
      if (enemy.health < enemy.maxHealth) {
        const healthPercent = enemy.health / enemy.maxHealth;
        ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : '#ff0000';
        ctx.fillRect(point.x - 3, point.y - 6, 6 * healthPercent, 1);
      }
    });
  }
  drawMinimapBase(ctx) {
    console.log("Calling method: drawMinimapBase");
    const path = this.getEnemyPath();
    if (!path || path.length === 0) return;
    const endPoint = path[path.length - 1];
    const point = this.worldToMinimap(endPoint.x, endPoint.z);

    // Base structure
    ctx.fillStyle = '#00ff88';
    ctx.fillRect(point.x - 4, point.y - 4, 8, 8);

    // Base health indicator
    const healthPercent = this.playerHealthSystem ? this.playerHealthSystem.getHealthPercentage() / 100 : 1;
    ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : '#ff0000';
    ctx.fillRect(point.x - 4, point.y - 7, 8 * healthPercent, 2);
  }
  worldToMinimap(worldX, worldZ) {
    console.log("Calling method: worldToMinimap");
    // Convert world coordinates to minimap coordinates
    const mapWidth = 40; // World map width
    const mapHeight = 30; // World map height

    const x = (worldX + mapWidth / 2) / mapWidth * this.minimapWidth;
    const y = (worldZ + mapHeight / 2) / mapHeight * this.minimapHeight;
    return {
      x: Math.max(0, Math.min(this.minimapWidth, x)),
      y: Math.max(0, Math.min(this.minimapHeight, y))
    };
  }
  getTowerColor(towerType) {
    console.log("Calling method: getTowerColor");
    const colors = {
      basic: '#4CAF50',
      laser: '#2196F3',
      missile: '#FF5722',
      freeze: '#00BCD4'
    };
    return colors[towerType] || '#FFFFFF';
  }
  getEnemyColor(enemyType) {
    console.log("Calling method: getEnemyColor");
    const colors = {
      basic: '#FF4444',
      fast: '#FF8844',
      heavy: '#884444',
      flying: '#8844FF',
      boss: '#FF0000'
    };
    return colors[enemyType] || '#FF4444';
  }

  // Visual effects
  triggerResourceGainEffect(resourceType) {
    console.log("Calling method: triggerResourceGainEffect");
    const element = this.elements[resourceType];
    if (!element) return;

    // Pulse animation
    element.style.transform = 'scale(1.2)';
    element.style.transition = 'transform 0.2s ease-out';
    setTimeout(function () {
      element.style.transform = 'scale(1)';
    }, 200);

    // Glow effect
    element.style.textShadow = '0 0 10px currentColor';
    setTimeout(function () {
      element.style.textShadow = 'none';
    }, 500);
  }
  triggerScoreGainEffect() {
    console.log("Calling method: triggerScoreGainEffect");
    if (!this.elements.score) return;
    this.elements.score.style.animation = 'scoreGlow 0.5s ease-out';
    setTimeout(function () {
      this.elements.score.style.animation = '';
    }, 500);
  }
  triggerHealthFlash() {
    console.log("Calling method: triggerHealthFlash");
    if (!this.elements.healthHearts) return;
    this.elements.healthHearts.style.animation = 'healthFlash 0.5s ease-out';
    setTimeout(function () {
      this.elements.healthHearts.style.animation = '';
    }, 500);
  }
  triggerWaveStartEffect() {
    console.log("Calling method: triggerWaveStartEffect");
    // Flash wave counter
    if (this.elements.currentWave) {
      this.elements.currentWave.style.animation = 'waveFlash 1s ease-out';
      setTimeout(function () {
        this.elements.currentWave.style.animation = '';
      }, 1000);
    }
  }
  triggerWaveCompleteEffect() {
    console.log("Calling method: triggerWaveCompleteEffect");
    // Glow effect on wave counter
    if (this.elements.currentWave) {
      this.elements.currentWave.style.textShadow = '0 0 15px #00ff88';
      setTimeout(function () {
        this.elements.currentWave.style.textShadow = '';
      }, 2000);
    }
  }
  showInsufficientResourceFeedback(resourceType) {
    console.log("Calling method: showInsufficientResourceFeedback");
    const element = this.elements[resourceType];
    if (!element) return;

    // Shake animation
    element.style.animation = 'resourceShake 0.5s ease-out';
    element.style.color = '#ff4444';
    setTimeout(function () {
      element.style.animation = '';
      // Restore original color
      if (resourceType === 'gold') {
        this.updateGold(this.resourceManager.getGold());
      } else if (resourceType === 'energy') {
        this.updateEnergy(this.resourceManager.getEnergy());
      }
    }, 500);
  }

  // Utility methods
  formatNumber(num) {
    console.log("Calling method: formatNumber");
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  // Show/hide HUD elements
  showElement(elementName) {
    console.log("Calling method: showElement");
    const element = this.elements[elementName];
    if (element) {
      element.style.display = 'block';
    }
  }
  hideElement(elementName) {
    console.log("Calling method: hideElement");
    const element = this.elements[elementName];
    if (element) {
      element.style.display = 'none';
    }
  }
  toggleElement(elementName) {
    console.log("Calling method: toggleElement");
    const element = this.elements[elementName];
    if (element) {
      element.style.display = element.style.display === 'none' ? 'block' : 'none';
    }
  }

  // HUD visibility
  showHUD() {
    console.log("Calling method: showHUD");
    const hud = document.getElementById('hud');
    if (hud) {
      hud.style.display = 'block';
    }
  }
  hideHUD() {
    console.log("Calling method: hideHUD");
    const hud = document.getElementById('hud');
    if (hud) {
      hud.style.display = 'none';
    }
  }

  // Cleanup
  dispose() {
    console.log("Calling method: dispose");
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    if (this.minimapUpdateInterval) {
      clearInterval(this.minimapUpdateInterval);
    }
  }
}

// Add CSS animations
const hudStyles = document.createElement('style');
hudStyles.textContent = `
    @keyframes scoreGlow {
        0% { text-shadow: none; transform: scale(1); }
        50% { text-shadow: 0 0 20px #ffdd44; transform: scale(1.1); }
        100% { text-shadow: none; transform: scale(1); }
    }
    
    @keyframes healthFlash {
        0%, 100% { filter: none; }
        50% { filter: brightness(2) drop-shadow(0 0 10px #ff4444); }
    }
    
    @keyframes waveFlash {
        0%, 100% { background: transparent; }
        50% { background: rgba(255, 170, 0, 0.3); }
    }
    
    @keyframes resourceShake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
        20%, 40%, 60%, 80% { transform: translateX(3px); }
    }
`;
document.head.appendChild(hudStyles);
// Import dependencies
import { EnemyFactory } from './enemy.js';

// Wave Manager System - Refactored with ES6 modules and dependency injection
export class WaveManager {
  constructor({
    levelData,
    notificationManager,
    resourceManager,
    playerHealthSystem,
    addEnemy,
    getEnemyPath,
    getEnemies,
    mapData
  }) {
    console.log("Calling method: constructor");
    // Store injected dependencies instead of the whole game object
    this.levelData = levelData;
    this.notificationManager = notificationManager;
    this.resourceManager = resourceManager;
    this.playerHealthSystem = playerHealthSystem;
    this.mapData = mapData;

    // Store callback functions
    this.addEnemyToGame = addEnemy;
    this.getEnemyPathFromGame = getEnemyPath;
    this.getEnemiesFromGame = getEnemies;

    // Wave state
    this.currentWave = 0;
    this.totalWaves = 0;
    this.isWaveActive = false;
    this.waveData = null;
    this.loadedLevelData = null;

    // Spawning
    this.spawnQueue = [];
    this.spawnedEnemies = [];
    this.lastSpawnTime = 0;
    this.waveStartTime = 0;
    this.waveEndTime = 0;

    // Timing
    this.preWaveDelay = 5000; // 5 seconds between waves
    this.waveTimer = null;
    this.spawnTimer = null;

    // Auto-progression
    this.autoStartNextWave = false;
    this.autoStartDelay = 3000; // 3 seconds

    // Event callbacks
    this.onWaveStartCallbacks = [];
    this.onWaveCompleteCallbacks = [];
    this.onWaveFailedCallbacks = [];
    this.onAllWavesCompleteCallbacks = [];

    // Statistics
    this.waveStats = {
      enemiesSpawned: 0,
      enemiesKilled: 0,
      enemiesReachedEnd: 0,
      waveStartTime: 0,
      waveEndTime: 0,
      waveDuration: 0
    };
    console.log('WaveManager initialized');
  }

  // Initialize with level data
  async initialize(levelNumber) {
    console.log("Calling method: initialize");
    try {
      // Load level data using injected levelData manager
      this.loadedLevelData = await this.levelData.loadLevel(levelNumber);
      if (!this.loadedLevelData) {
        throw new Error(`Failed to load level ${levelNumber}`);
      }
      this.totalWaves = this.loadedLevelData.totalWaves;
      this.currentWave = 0;
      this.isWaveActive = false;

      // Reset state
      this.spawnQueue = [];
      this.spawnedEnemies = [];
      this.resetWaveStats();
      console.log(`WaveManager initialized for level ${levelNumber} with ${this.totalWaves} waves`);
      return true;
    } catch (error) {
      console.error('Failed to initialize WaveManager:', error);
      return false;
    }
  }

  // Start the next wave
  startNextWave() {
    console.log("Calling method: startNextWave");
    if (this.isWaveActive) {
      console.warn('Cannot start wave: wave already active');
      return false;
    }
    if (this.currentWave >= this.totalWaves) {
      console.warn('Cannot start wave: all waves completed');
      return false;
    }
    this.currentWave++;
    this.waveData = this.loadedLevelData.waves[this.currentWave - 1];
    if (!this.waveData) {
      console.error(`Wave data not found for wave ${this.currentWave}`);
      return false;
    }

    // Setup wave
    this.setupWave();

    // Start wave after delay
    setTimeout(function () {
      this.beginWave();
    }, this.waveData.preWaveDelay || this.preWaveDelay);
    return true;
  }
  setupWave() {
    console.log("Calling method: setupWave");
    // Reset wave state
    this.isWaveActive = true;
    this.spawnQueue = [];
    this.spawnedEnemies = [];
    this.lastSpawnTime = 0;
    this.resetWaveStats();

    // Create spawn queue from wave data
    this.createSpawnQueue();

    // Notify wave start
    this.triggerWaveStartCallbacks();
    console.log(`Wave ${this.currentWave} setup complete: ${this.spawnQueue.length} spawn events`);
  }
  createSpawnQueue() {
    console.log("Calling method: createSpawnQueue");
    const waveStartTime = Date.now();
    this.waveData.enemies.forEach(function (enemyGroup) {
      const spawnDelay = enemyGroup.delay || 0;
      const spawnInterval = enemyGroup.interval || 1000;
      for (let i = 0; i < enemyGroup.count; i++) {
        const spawnTime = waveStartTime + spawnDelay + i * spawnInterval;
        this.spawnQueue.push({
          enemyType: enemyGroup.type,
          spawnTime: spawnTime,
          spawned: false
        });
      }
    });

    // Sort by spawn time
    this.spawnQueue.sort(function (a, b) {
      return a.spawnTime - b.spawnTime;
    });
  }
  beginWave() {
    console.log("Calling method: beginWave");
    this.waveStartTime = Date.now();
    this.waveStats.waveStartTime = this.waveStartTime;

    // Show wave start notification using injected notificationManager
    if (this.notificationManager) {
      this.notificationManager.showWaveStart(this.currentWave);
    }

    // Start spawn timer
    this.startSpawnTimer();
    console.log(`Wave ${this.currentWave} started`);
  }
  startSpawnTimer() {
    console.log("Calling method: startSpawnTimer");
    this.spawnTimer = setInterval(function () {
      this.updateSpawning();
    }, 100); // Check every 100ms
  }
  updateSpawning() {
    console.log("Calling method: updateSpawning");
    const now = Date.now();

    // Process spawn queue
    this.spawnQueue.forEach(function (spawnEvent) {
      if (!spawnEvent.spawned && now >= spawnEvent.spawnTime) {
        this.spawnEnemy(spawnEvent.enemyType);
        spawnEvent.spawned = true;
        this.waveStats.enemiesSpawned++;
      }
    });

    // Check if all enemies spawned
    const allSpawned = this.spawnQueue.every(function (event) {
      return event.spawned;
    });
    if (allSpawned) {
      this.stopSpawnTimer();
      this.startWaveCompletionCheck();
    }
  }
  spawnEnemy(enemyType) {
    console.log("Calling method: spawnEnemy");
    try {
      // Get spawn position using injected mapData
      const spawnPos = this.mapData.getSpawnPoint();

      // Get enemy path using injected callback
      const path = this.getEnemyPathFromGame();

      // Create enemy using imported EnemyFactory
      const enemy = EnemyFactory.createEnemy(enemyType, this.loadedLevelData.levelNumber, spawnPos, path);
      if (enemy) {
        this.spawnedEnemies.push(enemy);

        // Add to game using injected callback
        this.addEnemyToGame(enemy);
        console.log(`Spawned ${enemyType} enemy`);
      } else {
        console.error(`Failed to spawn ${enemyType} enemy`);
      }
    } catch (error) {
      console.error('Error spawning enemy:', error);
    }
  }
  startWaveCompletionCheck() {
    console.log("Calling method: startWaveCompletionCheck");
    this.waveTimer = setInterval(function () {
      this.checkWaveCompletion();
    }, 500); // Check every 500ms
  }
  checkWaveCompletion() {
    console.log("Calling method: checkWaveCompletion");
    // Use injected callback to get enemies
    const activeEnemies = this.getEnemiesFromGame().filter(function (enemy) {
      return !enemy.isDead;
    });
    if (activeEnemies.length === 0) {
      this.completeWave();
    }
  }
  completeWave() {
    console.log("Calling method: completeWave");
    this.isWaveActive = false;
    this.waveEndTime = Date.now();
    this.waveStats.waveEndTime = this.waveEndTime;
    this.waveStats.waveDuration = this.waveEndTime - this.waveStartTime;

    // Stop timers
    this.stopSpawnTimer();
    this.stopWaveTimer();

    // Calculate wave results
    const waveResults = this.calculateWaveResults();

    // Award rewards
    this.awardWaveRewards(waveResults);

    // Show completion notification using injected notificationManager
    if (this.notificationManager) {
      this.notificationManager.showWaveComplete(this.currentWave);
    }

    // Trigger callbacks
    this.triggerWaveCompleteCallbacks(waveResults);

    // Check if all waves completed
    if (this.currentWave >= this.totalWaves) {
      this.completeAllWaves();
    } else if (this.autoStartNextWave) {
      // Auto-start next wave
      setTimeout(function () {
        this.startNextWave();
      }, this.autoStartDelay);
    }
    console.log(`Wave ${this.currentWave} completed in ${this.waveStats.waveDuration}ms`);
  }
  calculateWaveResults() {
    console.log("Calling method: calculateWaveResults");
    const totalEnemies = this.waveStats.enemiesSpawned;
    const enemiesKilled = this.waveStats.enemiesKilled;
    const enemiesReachedEnd = this.waveStats.enemiesReachedEnd;
    const killRate = totalEnemies > 0 ? enemiesKilled / totalEnemies : 0;
    const survivalRate = totalEnemies > 0 ? (totalEnemies - enemiesReachedEnd) / totalEnemies : 1;
    return {
      waveNumber: this.currentWave,
      totalEnemies: totalEnemies,
      enemiesKilled: enemiesKilled,
      enemiesReachedEnd: enemiesReachedEnd,
      killRate: killRate,
      survivalRate: survivalRate,
      waveDuration: this.waveStats.waveDuration,
      perfect: enemiesReachedEnd === 0,
      rating: this.calculateWaveRating(killRate, survivalRate)
    };
  }
  calculateWaveRating(killRate, survivalRate) {
    console.log("Calling method: calculateWaveRating");
    const score = (killRate * 0.6 + survivalRate * 0.4) * 100;
    if (score >= 95) return 'S';
    if (score >= 85) return 'A';
    if (score >= 75) return 'B';
    if (score >= 65) return 'C';
    return 'D';
  }
  awardWaveRewards(results) {
    console.log("Calling method: awardWaveRewards");
    if (!this.waveData.rewards) return;
    const baseRewards = this.waveData.rewards;
    const multiplier = results.survivalRate;
    const rewards = {
      gold: Math.floor(baseRewards.gold * multiplier),
      energy: Math.floor(baseRewards.energy * multiplier),
      score: Math.floor(baseRewards.score * multiplier)
    };

    // Award to resource manager using injected dependency
    if (this.resourceManager) {
      this.resourceManager.addGold(rewards.gold);
      this.resourceManager.addEnergy(rewards.energy);
      this.resourceManager.addScore(rewards.score);
    }

    // Show reward notifications using injected notificationManager
    if (this.notificationManager) {
      if (rewards.gold > 0) {
        this.notificationManager.showResourceGained('gold', rewards.gold);
      }
      if (rewards.energy > 0) {
        this.notificationManager.showResourceGained('energy', rewards.energy);
      }
      if (rewards.score > 0) {
        this.notificationManager.showResourceGained('score', rewards.score);
      }
    }
    console.log('Wave rewards awarded:', rewards);
  }
  completeAllWaves() {
    console.log("Calling method: completeAllWaves");
    // Calculate level results
    const levelResults = this.calculateLevelResults();

    // Award level completion rewards
    this.awardLevelRewards(levelResults);

    // Show completion notification using injected notificationManager
    if (this.notificationManager) {
      this.notificationManager.showLevelComplete();
    }

    // Trigger callbacks
    this.triggerAllWavesCompleteCallbacks(levelResults);
    console.log(`All waves completed for level ${this.loadedLevelData.levelNumber}`);
  }
  calculateLevelResults() {
    console.log("Calling method: calculateLevelResults");
    // Aggregate statistics from all waves
    return {
      levelNumber: this.loadedLevelData.levelNumber,
      totalWaves: this.totalWaves,
      completed: true
      // Add more level statistics as needed
    };
  }
  awardLevelRewards(results) {
    console.log("Calling method: awardLevelRewards");
    if (!this.loadedLevelData.rewards) return;
    const rewards = this.loadedLevelData.rewards;

    // Award to resource manager using injected dependency
    if (this.resourceManager) {
      this.resourceManager.addGold(rewards.gold);
      this.resourceManager.addEnergy(rewards.energy);
      this.resourceManager.addScore(rewards.score);
    }
    console.log('Level completion rewards awarded:', rewards);
  }

  // Handle enemy events
  onEnemyKilled(enemy) {
    console.log("Calling method: onEnemyKilled");
    this.waveStats.enemiesKilled++;

    // Remove from spawned enemies list
    const index = this.spawnedEnemies.findIndex(function (e) {
      return e.id === enemy.id;
    });
    if (index >= 0) {
      this.spawnedEnemies.splice(index, 1);
    }
  }
  onEnemyReachedEnd(enemy) {
    console.log("Calling method: onEnemyReachedEnd");
    this.waveStats.enemiesReachedEnd++;

    // Remove from spawned enemies list
    const index = this.spawnedEnemies.findIndex(function (e) {
      return e.id === enemy.id;
    });
    if (index >= 0) {
      this.spawnedEnemies.splice(index, 1);
    }

    // Damage player using injected playerHealthSystem
    if (this.playerHealthSystem) {
      this.playerHealthSystem.takeDamage(enemy.damage);
    }
  }

  // Wave control
  skipWave() {
    console.log("Calling method: skipWave");
    if (!this.isWaveActive) return false;

    // Kill all remaining enemies
    this.spawnedEnemies.forEach(function (enemy) {
      if (!enemy.isDead) {
        enemy.die();
      }
    });

    // Force wave completion
    this.completeWave();
    return true;
  }
  pauseWave() {
    console.log("Calling method: pauseWave");
    if (this.spawnTimer) {
      clearInterval(this.spawnTimer);
      this.spawnTimer = null;
    }
    if (this.waveTimer) {
      clearInterval(this.waveTimer);
      this.waveTimer = null;
    }
  }
  resumeWave() {
    console.log("Calling method: resumeWave");
    if (this.isWaveActive) {
      // Check if still spawning
      const allSpawned = this.spawnQueue.every(function (event) {
        return event.spawned;
      });
      if (!allSpawned) {
        this.startSpawnTimer();
      } else {
        this.startWaveCompletionCheck();
      }
    }
  }

  // Timer management
  stopSpawnTimer() {
    console.log("Calling method: stopSpawnTimer");
    if (this.spawnTimer) {
      clearInterval(this.spawnTimer);
      this.spawnTimer = null;
    }
  }
  stopWaveTimer() {
    console.log("Calling method: stopWaveTimer");
    if (this.waveTimer) {
      clearInterval(this.waveTimer);
      this.waveTimer = null;
    }
  }

  // Event system
  onWaveStart(callback) {
    console.log("Calling method: onWaveStart");
    this.onWaveStartCallbacks.push(callback);
  }
  onWaveComplete(callback) {
    console.log("Calling method: onWaveComplete");
    this.onWaveCompleteCallbacks.push(callback);
  }
  onWaveFailed(callback) {
    console.log("Calling method: onWaveFailed");
    this.onWaveFailedCallbacks.push(callback);
  }
  onAllWavesComplete(callback) {
    console.log("Calling method: onAllWavesComplete");
    this.onAllWavesCompleteCallbacks.push(callback);
  }
  triggerWaveStartCallbacks() {
    console.log("Calling method: triggerWaveStartCallbacks");
    this.onWaveStartCallbacks.forEach(function (callback) {
      try {
        callback(this.currentWave);
      } catch (error) {
        console.error('Error in wave start callback:', error);
      }
    });
  }
  triggerWaveCompleteCallbacks(results) {
    console.log("Calling method: triggerWaveCompleteCallbacks");
    this.onWaveCompleteCallbacks.forEach(function (callback) {
      try {
        callback(this.currentWave, results);
      } catch (error) {
        console.error('Error in wave complete callback:', error);
      }
    });
  }
  triggerWaveFailedCallbacks() {
    console.log("Calling method: triggerWaveFailedCallbacks");
    this.onWaveFailedCallbacks.forEach(function (callback) {
      try {
        callback(this.currentWave);
      } catch (error) {
        console.error('Error in wave failed callback:', error);
      }
    });
  }
  triggerAllWavesCompleteCallbacks(results) {
    console.log("Calling method: triggerAllWavesCompleteCallbacks");
    this.onAllWavesCompleteCallbacks.forEach(function (callback) {
      try {
        callback(results);
      } catch (error) {
        console.error('Error in all waves complete callback:', error);
      }
    });
  }

  // Getters
  getCurrentWave() {
    console.log("Calling method: getCurrentWave");
    return this.currentWave;
  }
  getTotalWaves() {
    console.log("Calling method: getTotalWaves");
    return this.totalWaves;
  }
  isActive() {
    console.log("Calling method: isActive");
    return this.isWaveActive;
  }
  canStartNextWave() {
    console.log("Calling method: canStartNextWave");
    return !this.isWaveActive && this.currentWave < this.totalWaves;
  }
  getWaveProgress() {
    console.log("Calling method: getWaveProgress");
    if (!this.isWaveActive || this.spawnQueue.length === 0) return 0;
    const spawnedCount = this.spawnQueue.filter(function (event) {
      return event.spawned;
    }).length;
    return spawnedCount / this.spawnQueue.length;
  }
  getTimeUntilNextSpawn() {
    console.log("Calling method: getTimeUntilNextSpawn");
    if (!this.isWaveActive) return 0;
    const now = Date.now();
    const nextSpawn = this.spawnQueue.find(function (event) {
      return !event.spawned;
    });
    if (!nextSpawn) return 0;
    return Math.max(0, nextSpawn.spawnTime - now);
  }
  getRemainingEnemies() {
    console.log("Calling method: getRemainingEnemies");
    return this.spawnQueue.filter(function (event) {
      return !event.spawned;
    }).length;
  }
  getActiveEnemies() {
    console.log("Calling method: getActiveEnemies");
    return this.spawnedEnemies.filter(function (enemy) {
      return !enemy.isDead;
    });
  }
  getWaveStats() {
    console.log("Calling method: getWaveStats");
    return {
      ...this.waveStats
    };
  }
  getWaveData() {
    console.log("Calling method: getWaveData");
    return this.waveData;
  }

  // Settings
  setAutoStartNextWave(enabled) {
    console.log("Calling method: setAutoStartNextWave");
    this.autoStartNextWave = enabled;
  }
  setAutoStartDelay(delay) {
    console.log("Calling method: setAutoStartDelay");
    this.autoStartDelay = Math.max(1000, delay);
  }
  setPreWaveDelay(delay) {
    console.log("Calling method: setPreWaveDelay");
    this.preWaveDelay = Math.max(1000, delay);
  }

  // Utility methods
  resetWaveStats() {
    console.log("Calling method: resetWaveStats");
    this.waveStats = {
      enemiesSpawned: 0,
      enemiesKilled: 0,
      enemiesReachedEnd: 0,
      waveStartTime: 0,
      waveEndTime: 0,
      waveDuration: 0
    };
  }
  getEstimatedWaveDuration() {
    console.log("Calling method: getEstimatedWaveDuration");
    if (!this.waveData) return 0;
    return this.waveData.totalDuration || 30000; // Default 30 seconds
  }
  getWaveDescription() {
    console.log("Calling method: getWaveDescription");
    if (!this.waveData) return '';
    const enemyTypes = [...new Set(this.waveData.enemies.map(function (e) {
      return e.type;
    }))];
    const totalEnemies = this.waveData.enemies.reduce(function (sum, e) {
      return sum + e.count;
    }, 0);
    return `${totalEnemies} enemies (${enemyTypes.join(', ')})`;
  }

  // Debug methods
  getDebugInfo() {
    console.log("Calling method: getDebugInfo");
    return {
      currentWave: this.currentWave,
      totalWaves: this.totalWaves,
      isWaveActive: this.isWaveActive,
      spawnQueueLength: this.spawnQueue.length,
      spawnedEnemiesCount: this.spawnedEnemies.length,
      waveStats: this.waveStats,
      autoStartNextWave: this.autoStartNextWave
    };
  }

  // Cleanup
  dispose() {
    console.log("Calling method: dispose");
    this.stopSpawnTimer();
    this.stopWaveTimer();
    this.spawnQueue = [];
    this.spawnedEnemies = [];
    this.onWaveStartCallbacks = [];
    this.onWaveCompleteCallbacks = [];
    this.onWaveFailedCallbacks = [];
    this.onAllWavesCompleteCallbacks = [];
  }
}
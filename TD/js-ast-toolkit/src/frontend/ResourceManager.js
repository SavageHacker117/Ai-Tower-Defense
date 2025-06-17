// Resource Manager System
export class ResourceManager {
  constructor(notificationManager = null) {
    console.log("Calling method: constructor");
    // Dependency injection - inject notification manager instead of accessing globally
    this.notificationManager = notificationManager;

    // Initialize resources
    this.resources = {
      gold: 100,
      // Starting gold
      energy: 50,
      // Starting energy
      score: 0,
      // Player score
      lives: 3 // Player lives
    };

    // Resource generation
    this.goldPerSecond = 2;
    this.energyPerSecond = 1;
    this.lastIncomeTime = Date.now();

    // Statistics
    this.stats = {
      totalGoldEarned: 100,
      totalEnergyEarned: 50,
      totalGoldSpent: 0,
      totalEnergySpent: 0,
      enemiesDefeated: 0,
      towersBuilt: 0,
      wavesSurvived: 0
    };

    // Resource limits
    this.limits = {
      maxGold: 9999,
      maxEnergy: 999,
      maxScore: 999999
    };

    // Event callbacks
    this.onResourceChange = [];
    this.onInsufficientResources = [];

    // Passive income interval reference for cleanup
    this.passiveIncomeInterval = null;

    // Start passive income
    this.startPassiveIncome();
    console.log('ResourceManager initialized');
  }

  // Passive income system
  startPassiveIncome() {
    console.log("Calling method: startPassiveIncome");
    // Clear any existing interval to prevent duplicates
    if (this.passiveIncomeInterval) {
      clearInterval(this.passiveIncomeInterval);
    }
    this.passiveIncomeInterval = setInterval(function () {
      this.addGold(this.goldPerSecond);
      this.addEnergy(this.energyPerSecond);
    }, 1000); // Every second
  }

  // Method to stop passive income (useful for cleanup)
  stopPassiveIncome() {
    console.log("Calling method: stopPassiveIncome");
    if (this.passiveIncomeInterval) {
      clearInterval(this.passiveIncomeInterval);
      this.passiveIncomeInterval = null;
    }
  }

  // Gold management
  addGold(amount) {
    console.log("Calling method: addGold");
    const oldGold = this.resources.gold;
    this.resources.gold = Math.min(this.resources.gold + amount, this.limits.maxGold);
    this.stats.totalGoldEarned += amount;
    if (this.resources.gold !== oldGold) {
      this.notifyResourceChange('gold', this.resources.gold, oldGold);
    }
    return this.resources.gold;
  }
  spendGold(amount) {
    console.log("Calling method: spendGold");
    if (this.resources.gold >= amount) {
      const oldGold = this.resources.gold;
      this.resources.gold -= amount;
      this.stats.totalGoldSpent += amount;
      this.notifyResourceChange('gold', this.resources.gold, oldGold);
      return true;
    } else {
      this.notifyInsufficientResources('gold', amount, this.resources.gold);
      return false;
    }
  }
  getGold() {
    console.log("Calling method: getGold");
    return this.resources.gold;
  }

  // Energy management
  addEnergy(amount) {
    console.log("Calling method: addEnergy");
    const oldEnergy = this.resources.energy;
    this.resources.energy = Math.min(this.resources.energy + amount, this.limits.maxEnergy);
    this.stats.totalEnergyEarned += amount;
    if (this.resources.energy !== oldEnergy) {
      this.notifyResourceChange('energy', this.resources.energy, oldEnergy);
    }
    return this.resources.energy;
  }
  spendEnergy(amount) {
    console.log("Calling method: spendEnergy");
    if (this.resources.energy >= amount) {
      const oldEnergy = this.resources.energy;
      this.resources.energy -= amount;
      this.stats.totalEnergySpent += amount;
      this.notifyResourceChange('energy', this.resources.energy, oldEnergy);
      return true;
    } else {
      this.notifyInsufficientResources('energy', amount, this.resources.energy);
      return false;
    }
  }
  getEnergy() {
    console.log("Calling method: getEnergy");
    return this.resources.energy;
  }

  // Score management
  addScore(amount) {
    console.log("Calling method: addScore");
    const oldScore = this.resources.score;
    this.resources.score = Math.min(this.resources.score + amount, this.limits.maxScore);
    if (this.resources.score !== oldScore) {
      this.notifyResourceChange('score', this.resources.score, oldScore);
    }
    return this.resources.score;
  }
  getScore() {
    console.log("Calling method: getScore");
    return this.resources.score;
  }

  // Lives management
  getLives() {
    console.log("Calling method: getLives");
    return this.resources.lives;
  }
  loseLive() {
    console.log("Calling method: loseLive");
    if (this.resources.lives > 0) {
      const oldLives = this.resources.lives;
      this.resources.lives--;
      this.notifyResourceChange('lives', this.resources.lives, oldLives);
      return true;
    }
    return false;
  }

  // Resource checking
  canAfford(goldCost = 0, energyCost = 0) {
    console.log("Calling method: canAfford");
    return this.resources.gold >= goldCost && this.resources.energy >= energyCost;
  }

  // Bulk operations
  spendResources(goldCost = 0, energyCost = 0) {
    console.log("Calling method: spendResources");
    if (this.canAfford(goldCost, energyCost)) {
      this.spendGold(goldCost);
      this.spendEnergy(energyCost);
      return true;
    }
    return false;
  }

  // Statistics
  recordEnemyDefeated() {
    console.log("Calling method: recordEnemyDefeated");
    this.stats.enemiesDefeated++;
  }
  recordTowerBuilt() {
    console.log("Calling method: recordTowerBuilt");
    this.stats.towersBuilt++;
  }
  recordWaveSurvived() {
    console.log("Calling method: recordWaveSurvived");
    this.stats.wavesSurvived++;
  }
  getEnemiesDefeated() {
    console.log("Calling method: getEnemiesDefeated");
    return this.stats.enemiesDefeated;
  }
  getTowersBuilt() {
    console.log("Calling method: getTowersBuilt");
    return this.stats.towersBuilt;
  }
  getWavesSurvived() {
    console.log("Calling method: getWavesSurvived");
    return this.stats.wavesSurvived;
  }

  // Income management
  setGoldPerSecond(amount) {
    console.log("Calling method: setGoldPerSecond");
    this.goldPerSecond = Math.max(0, amount);
  }
  setEnergyPerSecond(amount) {
    console.log("Calling method: setEnergyPerSecond");
    this.energyPerSecond = Math.max(0, amount);
  }
  getGoldPerSecond() {
    console.log("Calling method: getGoldPerSecond");
    return this.goldPerSecond;
  }
  getEnergyPerSecond() {
    console.log("Calling method: getEnergyPerSecond");
    return this.energyPerSecond;
  }

  // Upgrade income rates
  upgradeGoldIncome(cost) {
    console.log("Calling method: upgradeGoldIncome");
    if (this.spendGold(cost)) {
      this.goldPerSecond += 1;
      return true;
    }
    return false;
  }
  upgradeEnergyIncome(cost) {
    console.log("Calling method: upgradeEnergyIncome");
    if (this.spendGold(cost)) {
      this.energyPerSecond += 1;
      return true;
    }
    return false;
  }

  // Event system
  onResourceChanged(callback) {
    console.log("Calling method: onResourceChanged");
    this.onResourceChange.push(callback);
  }
  onInsufficientResource(callback) {
    console.log("Calling method: onInsufficientResource");
    this.onInsufficientResources.push(callback);
  }
  notifyResourceChange(resourceType, newValue, oldValue) {
    console.log("Calling method: notifyResourceChange");
    this.onResourceChange.forEach(function (callback) {
      try {
        callback(resourceType, newValue, oldValue);
      } catch (error) {
        console.error('Error in resource change callback:', error);
      }
    });
  }
  notifyInsufficientResources(resourceType, required, available) {
    console.log("Calling method: notifyInsufficientResources");
    // Use injected notification manager if available
    if (this.notificationManager) {
      this.notificationManager.showInsufficientResources(resourceType, required, available);
    }

    // Also call registered callbacks
    this.onInsufficientResources.forEach(function (callback) {
      try {
        callback(resourceType, required, available);
      } catch (error) {
        console.error('Error in insufficient resources callback:', error);
      }
    });
  }

  // Save/Load system
  saveState() {
    console.log("Calling method: saveState");
    return {
      resources: {
        ...this.resources
      },
      stats: {
        ...this.stats
      },
      goldPerSecond: this.goldPerSecond,
      energyPerSecond: this.energyPerSecond
    };
  }
  loadState(state) {
    console.log("Calling method: loadState");
    if (state.resources) {
      this.resources = {
        ...state.resources
      };
    }
    if (state.stats) {
      this.stats = {
        ...state.stats
      };
    }
    if (state.goldPerSecond !== undefined) {
      this.goldPerSecond = state.goldPerSecond;
    }
    if (state.energyPerSecond !== undefined) {
      this.energyPerSecond = state.energyPerSecond;
    }

    // Restart passive income with new rates
    this.startPassiveIncome();

    // Notify all resource changes
    Object.keys(this.resources).forEach(function (resourceType) {
      this.notifyResourceChange(resourceType, this.resources[resourceType], 0);
    });
  }

  // Reset resources
  reset() {
    console.log("Calling method: reset");
    this.resources = {
      gold: 100,
      energy: 50,
      score: 0,
      lives: 3
    };
    this.stats = {
      totalGoldEarned: 100,
      totalEnergyEarned: 50,
      totalGoldSpent: 0,
      totalEnergySpent: 0,
      enemiesDefeated: 0,
      towersBuilt: 0,
      wavesSurvived: 0
    };
    this.goldPerSecond = 2;
    this.energyPerSecond = 1;

    // Restart passive income
    this.startPassiveIncome();

    // Notify reset
    Object.keys(this.resources).forEach(function (resourceType) {
      this.notifyResourceChange(resourceType, this.resources[resourceType], 0);
    });
  }

  // Cleanup method (important for proper resource management)
  destroy() {
    console.log("Calling method: destroy");
    this.stopPassiveIncome();
    this.onResourceChange = [];
    this.onInsufficientResources = [];
    this.notificationManager = null;
  }

  // Debug methods
  getAllResources() {
    console.log("Calling method: getAllResources");
    return {
      ...this.resources
    };
  }
  getAllStats() {
    console.log("Calling method: getAllStats");
    return {
      ...this.stats
    };
  }
  getDebugInfo() {
    console.log("Calling method: getDebugInfo");
    return {
      resources: this.resources,
      stats: this.stats,
      income: {
        goldPerSecond: this.goldPerSecond,
        energyPerSecond: this.energyPerSecond
      },
      limits: this.limits,
      hasNotificationManager: !!this.notificationManager
    };
  }

  // Cheat methods (for testing)
  cheatAddGold(amount) {
    console.log("Calling method: cheatAddGold");
    this.addGold(amount);
  }
  cheatAddEnergy(amount) {
    console.log("Calling method: cheatAddEnergy");
    this.addEnergy(amount);
  }
  cheatMaxResources() {
    console.log("Calling method: cheatMaxResources");
    this.resources.gold = this.limits.maxGold;
    this.resources.energy = this.limits.maxEnergy;
    this.notifyResourceChange('gold', this.resources.gold, 0);
    this.notifyResourceChange('energy', this.resources.energy, 0);
  }
}

// No longer attaching to window - use ES6 modules instead
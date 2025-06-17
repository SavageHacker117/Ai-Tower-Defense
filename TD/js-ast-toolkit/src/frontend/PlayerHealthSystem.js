// Player Health System - Refactored with ES6 Modules and Dependency Injection
export class PlayerHealthSystem {
  constructor(initialLives = 3, dependencies = {}) {
    console.log("Calling method: constructor");
    // Inject dependencies instead of relying on global objects
    this.notificationManager = dependencies.notificationManager;
    this.audioManager = dependencies.audioManager;
    this.onGameOver = dependencies.onGameOver; // Function callback for game over

    this.maxLives = initialLives;
    this.currentLives = initialLives;
    this.isInvulnerable = false;
    this.invulnerabilityDuration = 1000; // 1 second
    this.invulnerabilityTimer = 0;

    // Health regeneration
    this.canRegenerate = false;
    this.regenerationRate = 1; // Lives per minute
    this.lastRegenerationTime = Date.now();

    // Damage tracking
    this.totalDamageTaken = 0;
    this.damageHistory = [];
    this.maxDamageHistoryLength = 10;

    // Event callbacks - using a more structured approach
    this.eventCallbacks = {
      healthChange: [],
      damageTaken: [],
      death: [],
      lifeLost: [],
      healthRegenerated: []
    };

    // Visual feedback
    this.damageFlashDuration = 500;
    this.isFlashing = false;
    console.log(`PlayerHealthSystem initialized with ${initialLives} lives`);
  }

  // Core health methods
  takeDamage(damage = 1) {
    console.log("Calling method: takeDamage");
    if (this.isInvulnerable || this.isDead()) {
      return false;
    }

    // Apply damage
    const oldLives = this.currentLives;
    this.currentLives = Math.max(0, this.currentLives - damage);

    // Track damage
    this.totalDamageTaken += damage;
    this.addDamageToHistory(damage);

    // Trigger invulnerability
    this.triggerInvulnerability();

    // Trigger visual feedback
    this.triggerDamageFlash();

    // Play damage sound through injected audio manager
    if (this.audioManager) {
      this.audioManager.playSound('damage');
    }

    // Show notification through injected notification manager
    if (this.notificationManager) {
      this.notificationManager.showDamage(damage);
    }

    // Notify callbacks
    this.notifyDamageTaken(damage, oldLives, this.currentLives);
    this.notifyHealthChange(this.currentLives, oldLives);
    if (this.currentLives < oldLives) {
      this.notifyLifeLost(oldLives - this.currentLives);
    }

    // Check for death
    if (this.isDead()) {
      this.handleDeath();
    }
    return true;
  }
  heal(amount = 1) {
    console.log("Calling method: heal");
    if (this.isDead()) {
      return false;
    }
    const oldLives = this.currentLives;
    this.currentLives = Math.min(this.maxLives, this.currentLives + amount);
    if (this.currentLives > oldLives) {
      // Play heal sound through injected audio manager
      if (this.audioManager) {
        this.audioManager.playSound('heal');
      }

      // Show notification through injected notification manager
      if (this.notificationManager) {
        this.notificationManager.showHeal(this.currentLives - oldLives);
      }
      this.notifyHealthRegenerated(this.currentLives - oldLives);
      this.notifyHealthChange(this.currentLives, oldLives);
      return true;
    }
    return false;
  }

  // Handle death with proper dependency injection
  handleDeath() {
    console.log("Calling method: handleDeath");
    // Play death sound
    if (this.audioManager) {
      this.audioManager.playSound('playerDeath');
    }

    // Show death notification
    if (this.notificationManager) {
      this.notificationManager.showPlayerDeath();
    }

    // Trigger game over callback
    if (this.onGameOver && typeof this.onGameOver === 'function') {
      this.onGameOver();
    }
    this.notifyDeath();
  }

  // Status checks
  isDead() {
    console.log("Calling method: isDead");
    return this.currentLives <= 0;
  }
  isFullHealth() {
    console.log("Calling method: isFullHealth");
    return this.currentLives >= this.maxLives;
  }
  isLowHealth() {
    console.log("Calling method: isLowHealth");
    return this.currentLives <= 1;
  }

  // Getters
  getCurrentLives() {
    console.log("Calling method: getCurrentLives");
    return this.currentLives;
  }
  getMaxLives() {
    console.log("Calling method: getMaxLives");
    return this.maxLives;
  }
  getHealthPercentage() {
    console.log("Calling method: getHealthPercentage");
    return this.maxLives > 0 ? this.currentLives / this.maxLives * 100 : 0;
  }
  getTotalDamageTaken() {
    console.log("Calling method: getTotalDamageTaken");
    return this.totalDamageTaken;
  }

  // Invulnerability system
  triggerInvulnerability() {
    console.log("Calling method: triggerInvulnerability");
    this.isInvulnerable = true;
    this.invulnerabilityTimer = this.invulnerabilityDuration;
  }
  update(deltaTime) {
    console.log("Calling method: update");
    // Update invulnerability
    if (this.isInvulnerable) {
      this.invulnerabilityTimer -= deltaTime * 1000;
      if (this.invulnerabilityTimer <= 0) {
        this.isInvulnerable = false;
        this.invulnerabilityTimer = 0;
      }
    }

    // Update damage flash
    if (this.isFlashing) {
      this.damageFlashDuration -= deltaTime * 1000;
      if (this.damageFlashDuration <= 0) {
        this.isFlashing = false;
        this.damageFlashDuration = 500;
      }
    }

    // Handle regeneration
    if (this.canRegenerate && !this.isFullHealth()) {
      this.updateRegeneration();
    }
  }

  // Regeneration system
  enableRegeneration() {
    console.log("Calling method: enableRegeneration");
    this.canRegenerate = true;
    this.lastRegenerationTime = Date.now();
  }
  disableRegeneration() {
    console.log("Calling method: disableRegeneration");
    this.canRegenerate = false;
  }
  updateRegeneration() {
    console.log("Calling method: updateRegeneration");
    const now = Date.now();
    const timeSinceLastRegen = now - this.lastRegenerationTime;
    const regenInterval = 60 * 1000 / this.regenerationRate; // Convert rate to milliseconds

    if (timeSinceLastRegen >= regenInterval) {
      this.heal(1);
      this.lastRegenerationTime = now;
    }
  }
  setRegenerationRate(livesPerMinute) {
    console.log("Calling method: setRegenerationRate");
    this.regenerationRate = Math.max(0, livesPerMinute);
  }

  // Visual feedback
  triggerDamageFlash() {
    console.log("Calling method: triggerDamageFlash");
    this.isFlashing = true;
    this.damageFlashDuration = 500;

    // Apply screen flash effect
    this.applyScreenFlash();
  }
  applyScreenFlash() {
    console.log("Calling method: applyScreenFlash");
    const flashOverlay = document.createElement('div');
    flashOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(255, 0, 0, 0.3);
            pointer-events: none;
            z-index: 9999;
            animation: damageFlash 0.5s ease-out;
        `;

    // Add flash animation
    const style = document.createElement('style');
    style.textContent = `
            @keyframes damageFlash {
                0% { opacity: 0.6; }
                100% { opacity: 0; }
            }
        `;
    document.head.appendChild(style);
    document.body.appendChild(flashOverlay);

    // Remove after animation
    setTimeout(function () {
      if (flashOverlay.parentNode) {
        flashOverlay.parentNode.removeChild(flashOverlay);
      }
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    }, 500);
  }

  // Damage history
  addDamageToHistory(damage) {
    console.log("Calling method: addDamageToHistory");
    const damageEntry = {
      damage: damage,
      timestamp: Date.now()
    };
    this.damageHistory.push(damageEntry);

    // Keep history within limits
    if (this.damageHistory.length > this.maxDamageHistoryLength) {
      this.damageHistory.shift();
    }
  }
  getDamageHistory() {
    console.log("Calling method: getDamageHistory");
    return [...this.damageHistory];
  }
  getRecentDamage(timeWindow = 5000) {
    console.log("Calling method: getRecentDamage");
    const now = Date.now();
    return this.damageHistory.filter(function (entry) {
      return now - entry.timestamp <= timeWindow;
    }).reduce(function (total, entry) {
      return total + entry.damage;
    }, 0);
  }

  // Upgrades and modifications
  increaseMaxLives(amount = 1) {
    console.log("Calling method: increaseMaxLives");
    const oldMax = this.maxLives;
    this.maxLives += amount;

    // Also heal to new maximum if currently at full health
    if (this.currentLives === oldMax) {
      this.currentLives = this.maxLives;
      this.notifyHealthChange(this.currentLives, oldMax);
    }
    return this.maxLives;
  }
  setMaxLives(newMax) {
    console.log("Calling method: setMaxLives");
    const oldMax = this.maxLives;
    this.maxLives = Math.max(1, newMax);

    // Adjust current lives if necessary
    if (this.currentLives > this.maxLives) {
      const oldCurrent = this.currentLives;
      this.currentLives = this.maxLives;
      this.notifyHealthChange(this.currentLives, oldCurrent);
    }
    return this.maxLives;
  }

  // Refined event system using structured callbacks
  addEventListener(eventType, callback) {
    console.log("Calling method: addEventListener");
    if (this.eventCallbacks[eventType]) {
      this.eventCallbacks[eventType].push(callback);
    } else {
      console.warn(`Unknown event type: ${eventType}`);
    }
  }
  removeEventListener(eventType, callback) {
    console.log("Calling method: removeEventListener");
    if (this.eventCallbacks[eventType]) {
      const index = this.eventCallbacks[eventType].indexOf(callback);
      if (index > -1) {
        this.eventCallbacks[eventType].splice(index, 1);
      }
    }
  }

  // Backward compatibility methods (deprecated - use addEventListener instead)
  onHealthChanged(callback) {
    console.log("Calling method: onHealthChanged");
    console.warn('onHealthChanged is deprecated. Use addEventListener("healthChange", callback) instead.');
    this.addEventListener('healthChange', callback);
  }
  onDamage(callback) {
    console.log("Calling method: onDamage");
    console.warn('onDamage is deprecated. Use addEventListener("damageTaken", callback) instead.');
    this.addEventListener('damageTaken', callback);
  }
  onPlayerDeath(callback) {
    console.log("Calling method: onPlayerDeath");
    console.warn('onPlayerDeath is deprecated. Use addEventListener("death", callback) instead.');
    this.addEventListener('death', callback);
  }
  onLifeLoss(callback) {
    console.log("Calling method: onLifeLoss");
    console.warn('onLifeLoss is deprecated. Use addEventListener("lifeLost", callback) instead.');
    this.addEventListener('lifeLost', callback);
  }
  onRegeneration(callback) {
    console.log("Calling method: onRegeneration");
    console.warn('onRegeneration is deprecated. Use addEventListener("healthRegenerated", callback) instead.');
    this.addEventListener('healthRegenerated', callback);
  }

  // Notification methods
  notifyHealthChange(newLives, oldLives) {
    console.log("Calling method: notifyHealthChange");
    this.eventCallbacks.healthChange.forEach(function (callback) {
      try {
        callback(newLives, oldLives);
      } catch (error) {
        console.error('Error in health change callback:', error);
      }
    });
  }
  notifyDamageTaken(damage, oldLives, newLives) {
    console.log("Calling method: notifyDamageTaken");
    this.eventCallbacks.damageTaken.forEach(function (callback) {
      try {
        callback(damage, oldLives, newLives);
      } catch (error) {
        console.error('Error in damage taken callback:', error);
      }
    });
  }
  notifyDeath() {
    console.log("Calling method: notifyDeath");
    this.eventCallbacks.death.forEach(function (callback) {
      try {
        callback();
      } catch (error) {
        console.error('Error in death callback:', error);
      }
    });
  }
  notifyLifeLost(livesLost) {
    console.log("Calling method: notifyLifeLost");
    this.eventCallbacks.lifeLost.forEach(function (callback) {
      try {
        callback(livesLost);
      } catch (error) {
        console.error('Error in life lost callback:', error);
      }
    });
  }
  notifyHealthRegenerated(livesRegained) {
    console.log("Calling method: notifyHealthRegenerated");
    this.eventCallbacks.healthRegenerated.forEach(function (callback) {
      try {
        callback(livesRegained);
      } catch (error) {
        console.error('Error in health regenerated callback:', error);
      }
    });
  }

  // Save/Load system
  saveState() {
    console.log("Calling method: saveState");
    return {
      maxLives: this.maxLives,
      currentLives: this.currentLives,
      totalDamageTaken: this.totalDamageTaken,
      canRegenerate: this.canRegenerate,
      regenerationRate: this.regenerationRate,
      damageHistory: [...this.damageHistory]
    };
  }
  loadState(state) {
    console.log("Calling method: loadState");
    if (state.maxLives !== undefined) this.maxLives = state.maxLives;
    if (state.currentLives !== undefined) this.currentLives = state.currentLives;
    if (state.totalDamageTaken !== undefined) this.totalDamageTaken = state.totalDamageTaken;
    if (state.canRegenerate !== undefined) this.canRegenerate = state.canRegenerate;
    if (state.regenerationRate !== undefined) this.regenerationRate = state.regenerationRate;
    if (state.damageHistory) this.damageHistory = [...state.damageHistory];

    // Reset temporary states
    this.isInvulnerable = false;
    this.invulnerabilityTimer = 0;
    this.isFlashing = false;
    this.lastRegenerationTime = Date.now();

    // Notify of health change after loading
    this.notifyHealthChange(this.currentLives, this.currentLives);
  }

  // Reset system
  reset(newMaxLives = null) {
    console.log("Calling method: reset");
    this.maxLives = newMaxLives || this.maxLives;
    this.currentLives = this.maxLives;
    this.isInvulnerable = false;
    this.invulnerabilityTimer = 0;
    this.totalDamageTaken = 0;
    this.damageHistory = [];
    this.isFlashing = false;
    this.lastRegenerationTime = Date.now();
    this.notifyHealthChange(this.currentLives, 0);
  }

  // Debug methods
  getDebugInfo() {
    console.log("Calling method: getDebugInfo");
    return {
      currentLives: this.currentLives,
      maxLives: this.maxLives,
      isInvulnerable: this.isInvulnerable,
      invulnerabilityTimer: this.invulnerabilityTimer,
      totalDamageTaken: this.totalDamageTaken,
      canRegenerate: this.canRegenerate,
      regenerationRate: this.regenerationRate,
      damageHistory: this.damageHistory,
      healthPercentage: this.getHealthPercentage(),
      dependencies: {
        hasNotificationManager: !!this.notificationManager,
        hasAudioManager: !!this.audioManager,
        hasGameOverCallback: !!this.onGameOver
      }
    };
  }

  // Method to update dependencies after instantiation if needed
  updateDependencies(newDependencies) {
    console.log("Calling method: updateDependencies");
    if (newDependencies.notificationManager) {
      this.notificationManager = newDependencies.notificationManager;
    }
    if (newDependencies.audioManager) {
      this.audioManager = newDependencies.audioManager;
    }
    if (newDependencies.onGameOver) {
      this.onGameOver = newDependencies.onGameOver;
    }
  }
}

// Export for ES6 module usage - no more window global assignment
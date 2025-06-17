/**
 * TargetingSystem.js
 * Manages targeting algorithms and strategies for towers in the tower defense game
 * Provides various targeting modes like closest, strongest, weakest, first, last, etc.
 * Refactored to use ES6 modules and dependency injection
 */

export class TargetingSystem {
  constructor({
    notificationManager = null
  } = {}) {
    console.log("Calling method: constructor");
    this.targetingModes = new Map();
    this.towerTargetingModes = new Map(); // towerId -> targetingMode
    this.eventListeners = new Map();
    this.notificationManager = notificationManager;
    this.initializeTargetingModes();
  }

  /**
   * Initialize available targeting modes
   */
  initializeTargetingModes() {
    console.log("Calling method: initializeTargetingModes");
    const modes = {
      closest: {
        name: 'Closest',
        description: 'Target the closest enemy',
        priority: this.getClosestTarget.bind(this),
        icon: 'target_closest'
      },
      strongest: {
        name: 'Strongest',
        description: 'Target the enemy with the most health',
        priority: this.getStrongestTarget.bind(this),
        icon: 'target_strongest'
      },
      weakest: {
        name: 'Weakest',
        description: 'Target the enemy with the least health',
        priority: this.getWeakestTarget.bind(this),
        icon: 'target_weakest'
      },
      first: {
        name: 'First',
        description: 'Target the enemy closest to the exit',
        priority: this.getFirstTarget.bind(this),
        icon: 'target_first'
      },
      last: {
        name: 'Last',
        description: 'Target the enemy furthest from the exit',
        priority: this.getLastTarget.bind(this),
        icon: 'target_last'
      },
      fastest: {
        name: 'Fastest',
        description: 'Target the fastest moving enemy',
        priority: this.getFastestTarget.bind(this),
        icon: 'target_fastest'
      },
      slowest: {
        name: 'Slowest',
        description: 'Target the slowest moving enemy',
        priority: this.getSlowestTarget.bind(this),
        icon: 'target_slowest'
      },
      highest_value: {
        name: 'Highest Value',
        description: 'Target the enemy worth the most money',
        priority: this.getHighestValueTarget.bind(this),
        icon: 'target_value'
      },
      random: {
        name: 'Random',
        description: 'Target a random enemy in range',
        priority: this.getRandomTarget.bind(this),
        icon: 'target_random'
      },
      smart: {
        name: 'Smart',
        description: 'Intelligent targeting based on situation',
        priority: this.getSmartTarget.bind(this),
        icon: 'target_smart'
      }
    };
    Object.entries(modes).forEach(function ([key, mode]) {
      this.targetingModes.set(key, mode);
    });
  }

  /**
   * Set targeting mode for a tower
   * @param {string} towerId 
   * @param {string} mode 
   * @returns {boolean} Success
   */
  setTargetingMode(towerId, mode) {
    console.log("Calling method: setTargetingMode");
    if (!this.targetingModes.has(mode)) {
      return false;
    }
    const previousMode = this.towerTargetingModes.get(towerId);
    this.towerTargetingModes.set(towerId, mode);
    const eventData = {
      towerId,
      mode,
      previousMode,
      modeName: this.targetingModes.get(mode).name
    };
    this.triggerEvent('targetingModeChanged', eventData);

    // Notify user of targeting mode change if notification manager is available
    if (this.notificationManager && previousMode !== mode) {
      this.notificationManager.showInfo(`Tower targeting changed to ${this.targetingModes.get(mode).name}`);
    }
    return true;
  }

  /**
   * Get targeting mode for a tower
   * @param {string} towerId 
   * @returns {string}
   */
  getTargetingMode(towerId) {
    console.log("Calling method: getTargetingMode");
    return this.towerTargetingModes.get(towerId) || 'closest';
  }

  /**
   * Find the best target for a tower based on its targeting mode
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object|null}
   */
  findTarget(tower, enemies) {
    console.log("Calling method: findTarget");
    if (!enemies || enemies.length === 0) return null;

    // Filter enemies in range and alive
    const enemiesInRange = this.getEnemiesInRange(tower, enemies);
    if (enemiesInRange.length === 0) return null;

    // Get targeting mode
    const mode = this.getTargetingMode(tower.id);
    const targetingFunction = this.targetingModes.get(mode)?.priority;
    if (!targetingFunction) {
      return this.getClosestTarget(tower, enemiesInRange);
    }
    return targetingFunction(tower, enemiesInRange);
  }

  /**
   * Get enemies in tower's range
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Array}
   */
  getEnemiesInRange(tower, enemies) {
    console.log("Calling method: getEnemiesInRange");
    return enemies.filter(function (enemy) {
      if (!enemy.isAlive) return false;
      const distance = this.getDistance(tower.x, tower.y, enemy.x, enemy.y);
      return distance <= tower.range;
    });
  }

  /**
   * Get closest enemy to tower
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object|null}
   */
  getClosestTarget(tower, enemies) {
    console.log("Calling method: getClosestTarget");
    if (enemies.length === 0) return null;
    return enemies.reduce(function (closest, enemy) {
      const distance = this.getDistance(tower.x, tower.y, enemy.x, enemy.y);
      const closestDistance = this.getDistance(tower.x, tower.y, closest.x, closest.y);
      return distance < closestDistance ? enemy : closest;
    });
  }

  /**
   * Get enemy with most health
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object|null}
   */
  getStrongestTarget(tower, enemies) {
    console.log("Calling method: getStrongestTarget");
    if (enemies.length === 0) return null;
    return enemies.reduce(function (strongest, enemy) {
      const health = enemy.currentHealth || enemy.health || 0;
      const strongestHealth = strongest.currentHealth || strongest.health || 0;
      return health > strongestHealth ? enemy : strongest;
    });
  }

  /**
   * Get enemy with least health
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object|null}
   */
  getWeakestTarget(tower, enemies) {
    console.log("Calling method: getWeakestTarget");
    if (enemies.length === 0) return null;
    const aliveEnemies = enemies.filter(function (enemy) {
      const health = enemy.currentHealth || enemy.health || 0;
      return health > 0;
    });
    if (aliveEnemies.length === 0) return null;
    return aliveEnemies.reduce(function (weakest, enemy) {
      const health = enemy.currentHealth || enemy.health || 0;
      const weakestHealth = weakest.currentHealth || weakest.health || 0;
      return health < weakestHealth ? enemy : weakest;
    });
  }

  /**
   * Get enemy closest to the exit (furthest along path)
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object|null}
   */
  getFirstTarget(tower, enemies) {
    console.log("Calling method: getFirstTarget");
    if (enemies.length === 0) return null;
    return enemies.reduce(function (first, enemy) {
      const progress = enemy.pathProgress || enemy.distanceTraveled || 0;
      const firstProgress = first.pathProgress || first.distanceTraveled || 0;
      return progress > firstProgress ? enemy : first;
    });
  }

  /**
   * Get enemy furthest from the exit (least progress along path)
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object|null}
   */
  getLastTarget(tower, enemies) {
    console.log("Calling method: getLastTarget");
    if (enemies.length === 0) return null;
    return enemies.reduce(function (last, enemy) {
      const progress = enemy.pathProgress || enemy.distanceTraveled || 0;
      const lastProgress = last.pathProgress || last.distanceTraveled || 0;
      return progress < lastProgress ? enemy : last;
    });
  }

  /**
   * Get fastest moving enemy
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object|null}
   */
  getFastestTarget(tower, enemies) {
    console.log("Calling method: getFastestTarget");
    if (enemies.length === 0) return null;
    return enemies.reduce(function (fastest, enemy) {
      const speed = enemy.speed || enemy.moveSpeed || 0;
      const fastestSpeed = fastest.speed || fastest.moveSpeed || 0;
      return speed > fastestSpeed ? enemy : fastest;
    });
  }

  /**
   * Get slowest moving enemy
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object|null}
   */
  getSlowestTarget(tower, enemies) {
    console.log("Calling method: getSlowestTarget");
    if (enemies.length === 0) return null;
    return enemies.reduce(function (slowest, enemy) {
      const speed = enemy.speed || enemy.moveSpeed || 0;
      const slowestSpeed = slowest.speed || slowest.moveSpeed || 0;
      return speed < slowestSpeed ? enemy : slowest;
    });
  }

  /**
   * Get enemy with highest reward value
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object|null}
   */
  getHighestValueTarget(tower, enemies) {
    console.log("Calling method: getHighestValueTarget");
    if (enemies.length === 0) return null;
    return enemies.reduce(function (valuable, enemy) {
      const value = enemy.reward || enemy.bounty || enemy.value || 0;
      const valuableValue = valuable.reward || valuable.bounty || valuable.value || 0;
      return value > valuableValue ? enemy : valuable;
    });
  }

  /**
   * Get random enemy in range
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object|null}
   */
  getRandomTarget(tower, enemies) {
    console.log("Calling method: getRandomTarget");
    if (enemies.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * enemies.length);
    return enemies[randomIndex];
  }

  /**
   * Smart targeting that considers multiple factors
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object|null}
   */
  getSmartTarget(tower, enemies) {
    console.log("Calling method: getSmartTarget");
    if (enemies.length === 0) return null;

    // Score each enemy based on multiple factors
    const scoredEnemies = enemies.map(function (enemy) {
      const score = this.calculateTargetScore(tower, enemy);
      return {
        enemy,
        score
      };
    });

    // Sort by score and return best target
    scoredEnemies.sort(function (a, b) {
      return b.score - a.score;
    });
    return scoredEnemies[0].enemy;
  }

  /**
   * Calculate target score for smart targeting
   * @param {Object} tower 
   * @param {Object} enemy 
   * @returns {number}
   */
  calculateTargetScore(tower, enemy) {
    console.log("Calling method: calculateTargetScore");
    let score = 0;

    // Distance factor (closer is better)
    const distance = this.getDistance(tower.x, tower.y, enemy.x, enemy.y);
    const distanceScore = (tower.range - distance) / tower.range;
    score += distanceScore * 0.3;

    // Health factor (prefer enemies we can kill)
    const health = enemy.currentHealth || enemy.health || 100;
    const canKill = health <= (tower.damage || 0);
    if (canKill) {
      score += 0.4; // High priority for enemies we can kill
    } else {
      // Prefer weaker enemies if we can't one-shot
      score += (1 - health / 200) * 0.2;
    }

    // Progress factor (prefer enemies closer to exit)
    const progress = enemy.pathProgress || enemy.distanceTraveled || 0;
    const progressScore = Math.min(progress / 100, 1); // Normalize to max 100
    score += progressScore * 0.2;

    // Value factor (prefer high-value targets)
    const value = enemy.reward || enemy.bounty || enemy.value || 10;
    const valueScore = Math.min(value / 50, 1); // Normalize to max 50
    score += valueScore * 0.1;
    return score;
  }

  /**
   * Get enemies that can be hit by splash damage
   * @param {number} centerX 
   * @param {number} centerY 
   * @param {number} radius 
   * @param {Array} enemies 
   * @param {Object} excludeEnemy 
   * @returns {Array}
   */
  getEnemiesInSplashRadius(centerX, centerY, radius, enemies, excludeEnemy = null) {
    console.log("Calling method: getEnemiesInSplashRadius");
    return enemies.filter(function (enemy) {
      if (!enemy.isAlive || enemy === excludeEnemy) return false;
      const distance = this.getDistance(centerX, centerY, enemy.x, enemy.y);
      return distance <= radius;
    });
  }

  /**
   * Find targets for chain lightning
   * @param {Object} initialTarget 
   * @param {Array} enemies 
   * @param {number} maxTargets 
   * @param {number} chainRange 
   * @returns {Array}
   */
  getChainLightningTargets(initialTarget, enemies, maxTargets, chainRange) {
    console.log("Calling method: getChainLightningTargets");
    const targets = [initialTarget];
    const usedTargets = new Set([initialTarget.id]);
    let currentTarget = initialTarget;
    for (let i = 1; i < maxTargets; i++) {
      const nextTarget = this.findNearestUnusedTarget(currentTarget, enemies, chainRange, usedTargets);
      if (!nextTarget) break;
      targets.push(nextTarget);
      usedTargets.add(nextTarget.id);
      currentTarget = nextTarget;
    }
    return targets;
  }

  /**
   * Find nearest unused target for chain lightning
   * @param {Object} currentTarget 
   * @param {Array} enemies 
   * @param {number} chainRange 
   * @param {Set} usedTargets 
   * @returns {Object|null}
   */
  findNearestUnusedTarget(currentTarget, enemies, chainRange, usedTargets) {
    console.log("Calling method: findNearestUnusedTarget");
    let nearestTarget = null;
    let closestDistance = Infinity;
    for (const enemy of enemies) {
      if (!enemy.isAlive || usedTargets.has(enemy.id)) continue;
      const distance = this.getDistance(currentTarget.x, currentTarget.y, enemy.x, enemy.y);
      if (distance <= chainRange && distance < closestDistance) {
        closestDistance = distance;
        nearestTarget = enemy;
      }
    }
    return nearestTarget;
  }

  /**
   * Predict enemy position based on movement
   * @param {Object} enemy 
   * @param {number} projectileSpeed 
   * @returns {Object} Predicted position
   */
  predictEnemyPosition(enemy, projectileSpeed) {
    console.log("Calling method: predictEnemyPosition");
    if (!enemy.velocityX || !enemy.velocityY || !projectileSpeed) {
      return {
        x: enemy.x,
        y: enemy.y
      };
    }

    // Calculate time to intercept
    const distance = this.getDistance(0, 0, enemy.x, enemy.y);
    const timeToHit = distance / projectileSpeed;
    return {
      x: enemy.x + enemy.velocityX * timeToHit,
      y: enemy.y + enemy.velocityY * timeToHit
    };
  }

  /**
   * Check if target is still valid
   * @param {Object} tower 
   * @param {Object} target 
   * @returns {boolean}
   */
  isValidTarget(tower, target) {
    console.log("Calling method: isValidTarget");
    if (!target || !target.isAlive) return false;
    const distance = this.getDistance(tower.x, tower.y, target.x, target.y);
    return distance <= tower.range;
  }

  /**
   * Get optimal targeting mode for tower type
   * @param {string} towerType 
   * @returns {string}
   */
  getOptimalTargetingMode(towerType) {
    console.log("Calling method: getOptimalTargetingMode");
    const recommendations = {
      basic: 'closest',
      cannon: 'strongest',
      // Good for high-health enemies
      laser: 'first',
      // Fast attacks good for stopping enemies
      ice: 'fastest',
      // Slow down fast enemies
      poison: 'strongest',
      // DoT good for high-health enemies
      lightning: 'smart' // Chain lightning benefits from smart targeting
    };
    return recommendations[towerType] || 'closest';
  }

  /**
   * Get all available targeting modes
   * @returns {Array}
   */
  getAvailableTargetingModes() {
    console.log("Calling method: getAvailableTargetingModes");
    return Array.from(this.targetingModes.entries()).map(function ([key, mode]) {
      return {
        key,
        name: mode.name,
        description: mode.description,
        icon: mode.icon
      };
    });
  }

  /**
   * Calculate targeting efficiency for a tower
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object}
   */
  calculateTargetingEfficiency(tower, enemies) {
    console.log("Calling method: calculateTargetingEfficiency");
    const enemiesInRange = this.getEnemiesInRange(tower, enemies);
    const totalEnemies = enemies.filter(function (e) {
      return e.isAlive;
    }).length;
    const coverage = totalEnemies > 0 ? enemiesInRange.length / totalEnemies : 0;
    const currentTarget = this.findTarget(tower, enemies);
    const hasTarget = currentTarget !== null;
    return {
      enemiesInRange: enemiesInRange.length,
      totalEnemies,
      coverage,
      hasTarget,
      efficiency: coverage * (hasTarget ? 1 : 0.5)
    };
  }

  /**
   * Get distance between two points
   * @param {number} x1 
   * @param {number} y1 
   * @param {number} x2 
   * @param {number} y2 
   * @returns {number}
   */
  getDistance(x1, y1, x2, y2) {
    console.log("Calling method: getDistance");
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Add event listener
   * @param {string} event 
   * @param {Function} callback 
   */
  addEventListener(event, callback) {
    console.log("Calling method: addEventListener");
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  /**
   * Remove event listener
   * @param {string} event 
   * @param {Function} callback 
   */
  removeEventListener(event, callback) {
    console.log("Calling method: removeEventListener");
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Trigger event
   * @param {string} event 
   * @param {Object} data 
   */
  triggerEvent(event, data) {
    console.log("Calling method: triggerEvent");
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(function (callback) {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} event listener:`, error);
        }
      });
    }
  }

  /**
   * Get system statistics
   * @returns {Object}
   */
  getSystemStats() {
    console.log("Calling method: getSystemStats");
    const totalTowers = this.towerTargetingModes.size;
    const modeUsage = {};
    this.towerTargetingModes.forEach(function (mode) {
      modeUsage[mode] = (modeUsage[mode] || 0) + 1;
    });
    return {
      totalTowers,
      modeUsage,
      availableModes: this.targetingModes.size,
      mostUsedMode: this.getMostUsedTargetingMode(modeUsage)
    };
  }

  /**
   * Get the most used targeting mode
   * @param {Object} modeUsage 
   * @returns {string|null}
   */
  getMostUsedTargetingMode(modeUsage) {
    console.log("Calling method: getMostUsedTargetingMode");
    const entries = Object.entries(modeUsage);
    if (entries.length === 0) return null;
    return entries.reduce(function (most, [mode, count]) {
      return count > most.count ? {
        mode,
        count
      } : most;
    }, {
      mode: null,
      count: 0
    }).mode;
  }

  /**
   * Reset targeting modes for all towers
   */
  resetAllTargetingModes() {
    console.log("Calling method: resetAllTargetingModes");
    this.towerTargetingModes.clear();
    this.triggerEvent('allTargetingModesReset', {});
  }

  /**
   * Remove tower from targeting system
   * @param {string} towerId 
   */
  removeTower(towerId) {
    console.log("Calling method: removeTower");
    const wasRemoved = this.towerTargetingModes.delete(towerId);
    if (wasRemoved) {
      this.triggerEvent('towerRemoved', {
        towerId
      });
    }
    return wasRemoved;
  }

  /**
   * Batch update targeting modes for multiple towers
   * @param {Array} updates - Array of {towerId, mode} objects
   * @returns {Object} Results of batch update
   */
  batchUpdateTargetingModes(updates) {
    console.log("Calling method: batchUpdateTargetingModes");
    const results = {
      successful: [],
      failed: []
    };
    updates.forEach(function ({
      towerId,
      mode
    }) {
      if (this.setTargetingMode(towerId, mode)) {
        results.successful.push({
          towerId,
          mode
        });
      } else {
        results.failed.push({
          towerId,
          mode,
          reason: 'Invalid targeting mode'
        });
      }
    });
    return results;
  }

  /**
   * Get targeting recommendations for a tower based on current game state
   * @param {Object} tower 
   * @param {Array} enemies 
   * @param {Object} gameState 
   * @returns {Array} Recommended targeting modes
   */
  getTargetingRecommendations(tower, enemies, gameState = {}) {
    console.log("Calling method: getTargetingRecommendations");
    const recommendations = [];
    const enemiesInRange = this.getEnemiesInRange(tower, enemies);
    if (enemiesInRange.length === 0) {
      return [{
        mode: 'closest',
        reason: 'No enemies in range',
        priority: 1
      }];
    }

    // Analyze enemy composition
    const strongEnemies = enemiesInRange.filter(function (e) {
      return (e.currentHealth || e.health) > 100;
    });
    const fastEnemies = enemiesInRange.filter(function (e) {
      return (e.speed || e.moveSpeed) > 50;
    });
    const nearExitEnemies = enemiesInRange.filter(function (e) {
      return (e.pathProgress || 0) > 80;
    });

    // Generate recommendations based on analysis
    if (nearExitEnemies.length > 0) {
      recommendations.push({
        mode: 'first',
        reason: 'Enemies near exit',
        priority: 1
      });
    }
    if (strongEnemies.length > enemiesInRange.length * 0.5) {
      recommendations.push({
        mode: 'weakest',
        reason: 'Many strong enemies',
        priority: 2
      });
    }
    if (fastEnemies.length > 0) {
      recommendations.push({
        mode: 'fastest',
        reason: 'Fast enemies detected',
        priority: 3
      });
    }

    // Default fallback
    if (recommendations.length === 0) {
      recommendations.push({
        mode: 'smart',
        reason: 'Balanced approach',
        priority: 4
      });
    }
    return recommendations.sort(function (a, b) {
      return a.priority - b.priority;
    });
  }
}
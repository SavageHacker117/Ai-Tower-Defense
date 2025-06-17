/**
 * HealthSystem.js
 * Manages health, damage, healing, and death mechanics for all game entities
 * including players, enemies, towers, and bosses
 * 
 * Refactored to use ES6 modules and dependency injection
 */

export class HealthSystem {
  constructor(dependencies = {}) {
    console.log("Calling method: constructor");
    // Dependency injection - only store what we need
    const {
      notificationManager = null,
      audioManager = null,
      eventEmitter = null
    } = dependencies;
    this.notificationManager = notificationManager;
    this.audioManager = audioManager;
    this.eventEmitter = eventEmitter;
    this.entities = new Map(); // entityId -> healthData
    this.damageQueue = [];
    this.healingQueue = [];
    this.eventListeners = new Map();
    this.regenerationTimers = new Map();
  }

  /**
   * Register an entity with the health system
   * @param {string} entityId - Unique identifier for the entity
   * @param {Object} healthConfig - Health configuration
   */
  registerEntity(entityId, healthConfig) {
    console.log("Calling method: registerEntity");
    const defaultConfig = {
      maxHealth: 100,
      currentHealth: 100,
      armor: 0,
      magicResistance: 0,
      regeneration: 0,
      regenerationRate: 1000,
      // ms between regen ticks
      invulnerable: false,
      damageReduction: 0,
      entityType: 'generic',
      // player, enemy, tower, boss
      statusEffects: new Set(),
      lastDamageTime: 0,
      deathCallbacks: []
    };
    const config = {
      ...defaultConfig,
      ...healthConfig
    };
    config.currentHealth = Math.min(config.currentHealth, config.maxHealth);
    this.entities.set(entityId, config);

    // Start regeneration if applicable
    if (config.regeneration > 0) {
      this.startRegeneration(entityId);
    }
    this.triggerEvent('entityRegistered', {
      entityId,
      config
    });
  }

  /**
   * Remove entity from health system
   * @param {string} entityId 
   */
  unregisterEntity(entityId) {
    console.log("Calling method: unregisterEntity");
    if (this.entities.has(entityId)) {
      this.stopRegeneration(entityId);
      this.entities.delete(entityId);
      this.triggerEvent('entityUnregistered', {
        entityId
      });
    }
  }

  /**
   * Deal damage to an entity
   * @param {string} entityId 
   * @param {number} damage 
   * @param {Object} damageInfo - Additional damage information
   * @returns {Object} Damage result
   */
  dealDamage(entityId, damage, damageInfo = {}) {
    console.log("Calling method: dealDamage");
    const entity = this.entities.get(entityId);
    if (!entity || entity.invulnerable) {
      return {
        dealt: 0,
        blocked: damage,
        killed: false
      };
    }
    const {
      damageType = 'physical',
      // physical, magical, true
      source = null,
      critical = false,
      piercing = false,
      statusEffect = null
    } = damageInfo;
    let finalDamage = damage;

    // Apply critical damage
    if (critical) {
      finalDamage *= 2;
      // Play critical hit sound if audio manager is available
      if (this.audioManager) {
        this.audioManager.playSound('criticalHit');
      }
    }

    // Apply resistances unless piercing or true damage
    if (!piercing && damageType !== 'true') {
      if (damageType === 'physical') {
        const reduction = entity.armor / (entity.armor + 100);
        finalDamage *= 1 - reduction;
      } else if (damageType === 'magical') {
        const reduction = entity.magicResistance / (entity.magicResistance + 100);
        finalDamage *= 1 - reduction;
      }
    }

    // Apply general damage reduction
    finalDamage *= 1 - entity.damageReduction;

    // Round damage
    finalDamage = Math.round(finalDamage);
    const blocked = damage - finalDamage;

    // Apply damage
    const oldHealth = entity.currentHealth;
    entity.currentHealth = Math.max(0, entity.currentHealth - finalDamage);
    entity.lastDamageTime = Date.now();

    // Apply status effect if any
    if (statusEffect) {
      entity.statusEffects.add(statusEffect);
    }
    const killed = entity.currentHealth === 0;

    // Trigger events
    this.triggerEvent('damageTaken', {
      entityId,
      damage: finalDamage,
      blocked,
      damageType,
      source,
      critical,
      oldHealth,
      newHealth: entity.currentHealth,
      killed
    });

    // Handle death
    if (killed) {
      this.handleDeath(entityId, source);
    }
    return {
      dealt: finalDamage,
      blocked,
      killed,
      remainingHealth: entity.currentHealth
    };
  }

  /**
   * Heal an entity
   * @param {string} entityId 
   * @param {number} healAmount 
   * @param {Object} healInfo 
   * @returns {Object} Healing result
   */
  heal(entityId, healAmount, healInfo = {}) {
    console.log("Calling method: heal");
    const entity = this.entities.get(entityId);
    if (!entity || entity.currentHealth === 0) {
      return {
        healed: 0,
        overflow: healAmount
      };
    }
    const {
      source = null,
      healType = 'direct',
      // direct, regeneration, lifesteal
      canOverheal = false
    } = healInfo;
    const oldHealth = entity.currentHealth;
    const maxPossibleHeal = canOverheal ? healAmount : entity.maxHealth - entity.currentHealth;
    const actualHeal = Math.min(healAmount, maxPossibleHeal);
    const overflow = healAmount - actualHeal;
    entity.currentHealth = Math.min(entity.maxHealth, entity.currentHealth + actualHeal);

    // Play healing sound if significant heal and audio manager is available
    if (actualHeal > 0 && healType === 'direct' && this.audioManager) {
      this.audioManager.playSound('heal');
    }
    this.triggerEvent('healed', {
      entityId,
      healed: actualHeal,
      overflow,
      healType,
      source,
      oldHealth,
      newHealth: entity.currentHealth
    });
    return {
      healed: actualHeal,
      overflow,
      newHealth: entity.currentHealth
    };
  }

  /**
   * Set entity health directly
   * @param {string} entityId 
   * @param {number} health 
   */
  setHealth(entityId, health) {
    console.log("Calling method: setHealth");
    const entity = this.entities.get(entityId);
    if (!entity) return;
    const oldHealth = entity.currentHealth;
    entity.currentHealth = Math.max(0, Math.min(health, entity.maxHealth));
    this.triggerEvent('healthChanged', {
      entityId,
      oldHealth,
      newHealth: entity.currentHealth
    });
    if (entity.currentHealth === 0 && oldHealth > 0) {
      this.handleDeath(entityId);
    }
  }

  /**
   * Get entity health information
   * @param {string} entityId 
   * @returns {Object|null}
   */
  getHealthInfo(entityId) {
    console.log("Calling method: getHealthInfo");
    const entity = this.entities.get(entityId);
    if (!entity) return null;
    return {
      currentHealth: entity.currentHealth,
      maxHealth: entity.maxHealth,
      healthPercentage: entity.currentHealth / entity.maxHealth,
      armor: entity.armor,
      magicResistance: entity.magicResistance,
      regeneration: entity.regeneration,
      isAlive: entity.currentHealth > 0,
      statusEffects: Array.from(entity.statusEffects),
      lastDamageTime: entity.lastDamageTime
    };
  }

  /**
   * Modify entity stats
   * @param {string} entityId 
   * @param {Object} statChanges 
   */
  modifyStats(entityId, statChanges) {
    console.log("Calling method: modifyStats");
    const entity = this.entities.get(entityId);
    if (!entity) return;
    const oldStats = {
      ...entity
    };
    Object.keys(statChanges).forEach(function (stat) {
      if (entity.hasOwnProperty(stat)) {
        entity[stat] = Math.max(0, entity[stat] + statChanges[stat]);
      }
    });

    // Ensure current health doesn't exceed max health
    if (statChanges.maxHealth) {
      entity.currentHealth = Math.min(entity.currentHealth, entity.maxHealth);
    }
    this.triggerEvent('statsModified', {
      entityId,
      oldStats,
      newStats: {
        ...entity
      },
      changes: statChanges
    });
  }

  /**
   * Start health regeneration for an entity
   * @param {string} entityId 
   */
  startRegeneration(entityId) {
    console.log("Calling method: startRegeneration");
    const entity = this.entities.get(entityId);
    if (!entity || entity.regeneration <= 0) return;

    // Clear existing timer
    this.stopRegeneration(entityId);
    const timer = setInterval(function () {
      if (!this.entities.has(entityId)) {
        clearInterval(timer);
        return;
      }
      const currentEntity = this.entities.get(entityId);
      if (currentEntity.currentHealth > 0 && currentEntity.currentHealth < currentEntity.maxHealth) {
        this.heal(entityId, currentEntity.regeneration, {
          healType: 'regeneration'
        });
      }
    }, entity.regenerationRate);
    this.regenerationTimers.set(entityId, timer);
  }

  /**
   * Stop health regeneration for an entity
   * @param {string} entityId 
   */
  stopRegeneration(entityId) {
    console.log("Calling method: stopRegeneration");
    const timer = this.regenerationTimers.get(entityId);
    if (timer) {
      clearInterval(timer);
      this.regenerationTimers.delete(entityId);
    }
  }

  /**
   * Handle entity death
   * @param {string} entityId 
   * @param {string} source 
   */
  handleDeath(entityId, source = null) {
    console.log("Calling method: handleDeath");
    const entity = this.entities.get(entityId);
    if (!entity) return;

    // Play death sound based on entity type
    if (this.audioManager) {
      const soundMap = {
        'player': 'playerDeath',
        'enemy': 'enemyDeath',
        'tower': 'towerDestroyed',
        'boss': 'bossDeath'
      };
      const sound = soundMap[entity.entityType] || 'genericDeath';
      this.audioManager.playSound(sound);
    }

    // Show death notification
    if (this.notificationManager && entity.entityType === 'player') {
      this.notificationManager.showError('Player has died!');
    }

    // Execute death callbacks
    entity.deathCallbacks.forEach(function (callback) {
      try {
        callback(entityId, source);
      } catch (error) {
        console.error('Error in death callback:', error);
      }
    });
    this.triggerEvent('entityDied', {
      entityId,
      source,
      entityType: entity.entityType
    });

    // Stop regeneration
    this.stopRegeneration(entityId);
  }

  /**
   * Add death callback for an entity
   * @param {string} entityId 
   * @param {Function} callback 
   */
  addDeathCallback(entityId, callback) {
    console.log("Calling method: addDeathCallback");
    const entity = this.entities.get(entityId);
    if (entity) {
      entity.deathCallbacks.push(callback);
    }
  }

  /**
   * Apply status effect to entity
   * @param {string} entityId 
   * @param {string} effectId 
   * @param {Object} effectData 
   */
  applyStatusEffect(entityId, effectId, effectData) {
    console.log("Calling method: applyStatusEffect");
    const entity = this.entities.get(entityId);
    if (!entity) return;
    entity.statusEffects.add(effectId);

    // Show status effect notification
    if (this.notificationManager && effectData.showNotification) {
      this.notificationManager.showInfo(`${effectId} applied to ${entityId}`);
    }
    this.triggerEvent('statusEffectApplied', {
      entityId,
      effectId,
      effectData
    });
  }

  /**
   * Remove status effect from entity
   * @param {string} entityId 
   * @param {string} effectId 
   */
  removeStatusEffect(entityId, effectId) {
    console.log("Calling method: removeStatusEffect");
    const entity = this.entities.get(entityId);
    if (!entity) return;
    entity.statusEffects.delete(effectId);
    this.triggerEvent('statusEffectRemoved', {
      entityId,
      effectId
    });
  }

  /**
   * Get all entities with specific health conditions
   * @param {Function} condition 
   * @returns {Array}
   */
  getEntitiesByCondition(condition) {
    console.log("Calling method: getEntitiesByCondition");
    const results = [];
    this.entities.forEach(function (entity, entityId) {
      if (condition(entity, entityId)) {
        results.push({
          entityId,
          ...entity
        });
      }
    });
    return results;
  }

  /**
   * Get all alive entities
   * @returns {Array}
   */
  getAliveEntities() {
    console.log("Calling method: getAliveEntities");
    return this.getEntitiesByCondition(function (entity) {
      return entity.currentHealth > 0;
    });
  }

  /**
   * Get all dead entities
   * @returns {Array}
   */
  getDeadEntities() {
    console.log("Calling method: getDeadEntities");
    return this.getEntitiesByCondition(function (entity) {
      return entity.currentHealth === 0;
    });
  }

  /**
   * Get entities by type
   * @param {string} entityType 
   * @returns {Array}
   */
  getEntitiesByType(entityType) {
    console.log("Calling method: getEntitiesByType");
    return this.getEntitiesByCondition(function (entity) {
      return entity.entityType === entityType;
    });
  }

  /**
   * Get low health entities (below specified threshold)
   * @param {number} threshold - Health percentage threshold (0.0 to 1.0)
   * @returns {Array}
   */
  getLowHealthEntities(threshold = 0.25) {
    console.log("Calling method: getLowHealthEntities");
    return this.getEntitiesByCondition(function (entity) {
      const healthPercent = entity.currentHealth / entity.maxHealth;
      return healthPercent <= threshold && entity.currentHealth > 0;
    });
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
   * Trigger event - uses both internal listeners and external event emitter
   * @param {string} event 
   * @param {Object} data 
   */
  triggerEvent(event, data) {
    console.log("Calling method: triggerEvent");
    // Trigger internal listeners
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

    // Trigger external event emitter if available
    if (this.eventEmitter) {
      this.eventEmitter.emit(`health:${event}`, data);
    }
  }

  /**
   * Update system (called each frame)
   * @param {number} deltaTime 
   */
  update(deltaTime) {
    console.log("Calling method: update");
    // Process any queued damage or healing
    this.processDamageQueue();
    this.processHealingQueue();

    // Update status effects that might have duration
    this.updateStatusEffects(deltaTime);
  }

  /**
   * Update status effects with duration
   * @param {number} deltaTime 
   */
  updateStatusEffects(deltaTime) {
    console.log("Calling method: updateStatusEffects");
  } // This is a hook for future status effect duration management
  // Individual status effects would be handled by a separate StatusEffectSystem
  // that could work with this HealthSystem

  /**
   * Process queued damage
   */
  processDamageQueue() {
    console.log("Calling method: processDamageQueue");
    while (this.damageQueue.length > 0) {
      const {
        entityId,
        damage,
        damageInfo
      } = this.damageQueue.shift();
      this.dealDamage(entityId, damage, damageInfo);
    }
  }

  /**
   * Process queued healing
   */
  processHealingQueue() {
    console.log("Calling method: processHealingQueue");
    while (this.healingQueue.length > 0) {
      const {
        entityId,
        healAmount,
        healInfo
      } = this.healingQueue.shift();
      this.heal(entityId, healAmount, healInfo);
    }
  }

  /**
   * Queue damage to be processed next frame
   * @param {string} entityId 
   * @param {number} damage 
   * @param {Object} damageInfo 
   */
  queueDamage(entityId, damage, damageInfo = {}) {
    console.log("Calling method: queueDamage");
    this.damageQueue.push({
      entityId,
      damage,
      damageInfo
    });
  }

  /**
   * Queue healing to be processed next frame
   * @param {string} entityId 
   * @param {number} healAmount 
   * @param {Object} healInfo 
   */
  queueHealing(entityId, healAmount, healInfo = {}) {
    console.log("Calling method: queueHealing");
    this.healingQueue.push({
      entityId,
      healAmount,
      healInfo
    });
  }

  /**
   * Reset all entities health to full
   */
  resetAllHealth() {
    console.log("Calling method: resetAllHealth");
    this.entities.forEach(function (entity, entityId) {
      entity.currentHealth = entity.maxHealth;
      entity.statusEffects.clear();
      this.triggerEvent('healthReset', {
        entityId
      });
    });
  }

  /**
   * Get system statistics
   * @returns {Object}
   */
  getSystemStats() {
    console.log("Calling method: getSystemStats");
    const totalEntities = this.entities.size;
    const aliveEntities = this.getAliveEntities().length;
    const deadEntities = this.getDeadEntities().length;

    // Get entity type breakdown
    const entityTypes = {};
    this.entities.forEach(function (entity) {
      entityTypes[entity.entityType] = (entityTypes[entity.entityType] || 0) + 1;
    });
    return {
      totalEntities,
      aliveEntities,
      deadEntities,
      entityTypes,
      activeRegenerationTimers: this.regenerationTimers.size,
      queuedDamage: this.damageQueue.length,
      queuedHealing: this.healingQueue.length
    };
  }

  /**
   * Cleanup method to be called when destroying the system
   */
  destroy() {
    console.log("Calling method: destroy");
    // Clear all regeneration timers
    this.regenerationTimers.forEach(function (timer) {
      return clearInterval(timer);
    });
    this.regenerationTimers.clear();

    // Clear all data
    this.entities.clear();
    this.damageQueue.length = 0;
    this.healingQueue.length = 0;
    this.eventListeners.clear();

    // Remove references to injected dependencies
    this.notificationManager = null;
    this.audioManager = null;
    this.eventEmitter = null;
  }
}
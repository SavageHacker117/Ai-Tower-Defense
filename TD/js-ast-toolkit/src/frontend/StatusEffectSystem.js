/**
 * StatusEffectSystem.js
 * Manages status effects, buffs, debuffs, and temporary modifications
 * for entities in the tower defense game
 */

export class StatusEffectSystem {
  constructor(healthSystem) {
    console.log("Calling method: constructor");
    this.healthSystem = healthSystem;
    this.activeEffects = new Map(); // entityId -> Map(effectId -> effectData)
    this.effectTypes = new Map(); // effectType -> effectConfig
    this.eventListeners = new Map();
    this.updateTimers = new Map(); // effectInstanceId -> timer

    this.nextEffectInstanceId = 1;
    this.initializeEffectTypes();
  }

  /**
   * Initialize available status effect types
   */
  initializeEffectTypes() {
    console.log("Calling method: initializeEffectTypes");
    const effectConfigs = {
      slow: {
        name: 'Slow',
        type: 'debuff',
        stackable: false,
        refreshable: true,
        icon: 'effect_slow',
        description: 'Reduces movement speed',
        color: '#4A90E2',
        onApply: this.applySlowEffect.bind(this),
        onUpdate: this.updateSlowEffect.bind(this),
        onRemove: this.removeSlowEffect.bind(this)
      },
      poison: {
        name: 'Poison',
        type: 'debuff',
        stackable: true,
        refreshable: false,
        icon: 'effect_poison',
        description: 'Deals damage over time',
        color: '#7ED321',
        onApply: this.applyPoisonEffect.bind(this),
        onUpdate: this.updatePoisonEffect.bind(this),
        onRemove: this.removePoisonEffect.bind(this)
      },
      freeze: {
        name: 'Freeze',
        type: 'debuff',
        stackable: false,
        refreshable: true,
        icon: 'effect_freeze',
        description: 'Completely stops movement',
        color: '#50E3C2',
        onApply: this.applyFreezeEffect.bind(this),
        onUpdate: this.updateFreezeEffect.bind(this),
        onRemove: this.removeFreezeEffect.bind(this)
      },
      burn: {
        name: 'Burn',
        type: 'debuff',
        stackable: true,
        refreshable: true,
        icon: 'effect_burn',
        description: 'Deals fire damage over time',
        color: '#D0021B',
        onApply: this.applyBurnEffect.bind(this),
        onUpdate: this.updateBurnEffect.bind(this),
        onRemove: this.removeBurnEffect.bind(this)
      },
      stun: {
        name: 'Stun',
        type: 'debuff',
        stackable: false,
        refreshable: true,
        icon: 'effect_stun',
        description: 'Prevents all actions',
        color: '#F5A623',
        onApply: this.applyStunEffect.bind(this),
        onUpdate: this.updateStunEffect.bind(this),
        onRemove: this.removeStunEffect.bind(this)
      },
      armor_reduction: {
        name: 'Armor Break',
        type: 'debuff',
        stackable: true,
        refreshable: true,
        icon: 'effect_armor_break',
        description: 'Reduces armor',
        color: '#9013FE',
        onApply: this.applyArmorReductionEffect.bind(this),
        onUpdate: this.updateArmorReductionEffect.bind(this),
        onRemove: this.removeArmorReductionEffect.bind(this)
      },
      damage_boost: {
        name: 'Damage Boost',
        type: 'buff',
        stackable: true,
        refreshable: true,
        icon: 'effect_damage_boost',
        description: 'Increases damage dealt',
        color: '#FF6B35',
        onApply: this.applyDamageBoostEffect.bind(this),
        onUpdate: this.updateDamageBoostEffect.bind(this),
        onRemove: this.removeDamageBoostEffect.bind(this)
      },
      speed_boost: {
        name: 'Speed Boost',
        type: 'buff',
        stackable: false,
        refreshable: true,
        icon: 'effect_speed_boost',
        description: 'Increases movement speed',
        color: '#FFEB3B',
        onApply: this.applySpeedBoostEffect.bind(this),
        onUpdate: this.updateSpeedBoostEffect.bind(this),
        onRemove: this.removeSpeedBoostEffect.bind(this)
      },
      regeneration: {
        name: 'Regeneration',
        type: 'buff',
        stackable: true,
        refreshable: true,
        icon: 'effect_regeneration',
        description: 'Restores health over time',
        color: '#4CAF50',
        onApply: this.applyRegenerationEffect.bind(this),
        onUpdate: this.updateRegenerationEffect.bind(this),
        onRemove: this.removeRegenerationEffect.bind(this)
      },
      shield: {
        name: 'Shield',
        type: 'buff',
        stackable: true,
        refreshable: false,
        icon: 'effect_shield',
        description: 'Absorbs incoming damage',
        color: '#2196F3',
        onApply: this.applyShieldEffect.bind(this),
        onUpdate: this.updateShieldEffect.bind(this),
        onRemove: this.removeShieldEffect.bind(this)
      }
    };
    Object.entries(effectConfigs).forEach(function ([type, config]) {
      this.effectTypes.set(type, config);
    });
  }

  /**
   * Apply a status effect to an entity
   * @param {string} entityId 
   * @param {string} effectType 
   * @param {Object} effectData 
   * @returns {string|null} Effect instance ID
   */
  applyEffect(entityId, effectType, effectData = {}) {
    console.log("Calling method: applyEffect");
    const effectConfig = this.effectTypes.get(effectType);
    if (!effectConfig) {
      console.warn(`Unknown effect type: ${effectType}`);
      return null;
    }

    // Check if entity exists
    if (!this.activeEffects.has(entityId)) {
      this.activeEffects.set(entityId, new Map());
    }
    const entityEffects = this.activeEffects.get(entityId);
    const effectInstanceId = `${effectType}_${this.nextEffectInstanceId++}`;

    // Handle stacking and refreshing
    if (!effectConfig.stackable) {
      // Remove existing effect of same type
      const existingEffect = this.findEffectByType(entityId, effectType);
      if (existingEffect) {
        if (effectConfig.refreshable) {
          this.removeEffect(entityId, existingEffect.instanceId);
        } else {
          return null; // Effect already exists and not refreshable
        }
      }
    }

    // Create effect instance
    const effectInstance = {
      instanceId: effectInstanceId,
      type: effectType,
      entityId,
      startTime: Date.now(),
      duration: effectData.duration || 5000,
      // Default 5 seconds
      remainingTime: effectData.duration || 5000,
      // Effect-specific data
      ...effectData,
      // Metadata
      source: effectData.source || null,
      level: effectData.level || 1,
      isActive: true,
      // Configuration
      config: effectConfig
    };

    // Store effect
    entityEffects.set(effectInstanceId, effectInstance);

    // Apply initial effect
    if (effectConfig.onApply) {
      effectConfig.onApply(effectInstance);
    }

    // Set up update timer if needed
    if (effectConfig.onUpdate) {
      this.setupUpdateTimer(effectInstance);
    }

    // Set up removal timer
    setTimeout(function () {
      this.removeEffect(entityId, effectInstanceId);
    }, effectInstance.duration);
    this.triggerEvent('effectApplied', {
      entityId,
      effectType,
      effectInstance
    });
    return effectInstanceId;
  }

  /**
   * Remove a status effect from an entity
   * @param {string} entityId 
   * @param {string} effectInstanceId 
   * @returns {boolean} Success
   */
  removeEffect(entityId, effectInstanceId) {
    console.log("Calling method: removeEffect");
    const entityEffects = this.activeEffects.get(entityId);
    if (!entityEffects || !entityEffects.has(effectInstanceId)) {
      return false;
    }
    const effectInstance = entityEffects.get(effectInstanceId);

    // Call removal handler
    if (effectInstance.config.onRemove) {
      effectInstance.config.onRemove(effectInstance);
    }

    // Clear update timer
    const timer = this.updateTimers.get(effectInstanceId);
    if (timer) {
      clearInterval(timer);
      this.updateTimers.delete(effectInstanceId);
    }

    // Remove from active effects
    entityEffects.delete(effectInstanceId);

    // Clean up empty entity map
    if (entityEffects.size === 0) {
      this.activeEffects.delete(entityId);
    }
    this.triggerEvent('effectRemoved', {
      entityId,
      effectType: effectInstance.type,
      effectInstance
    });
    return true;
  }

  /**
   * Setup update timer for an effect
   * @param {Object} effectInstance 
   */
  setupUpdateTimer(effectInstance) {
    console.log("Calling method: setupUpdateTimer");
    const updateInterval = effectInstance.updateInterval || 1000; // Default 1 second

    const timer = setInterval(function () {
      if (!this.activeEffects.get(effectInstance.entityId)?.has(effectInstance.instanceId)) {
        clearInterval(timer);
        this.updateTimers.delete(effectInstance.instanceId);
        return;
      }
      effectInstance.config.onUpdate(effectInstance);
      effectInstance.remainingTime -= updateInterval;
      if (effectInstance.remainingTime <= 0) {
        this.removeEffect(effectInstance.entityId, effectInstance.instanceId);
      }
    }, updateInterval);
    this.updateTimers.set(effectInstance.instanceId, timer);
  }

  /**
   * Find effect by type for an entity
   * @param {string} entityId 
   * @param {string} effectType 
   * @returns {Object|null}
   */
  findEffectByType(entityId, effectType) {
    console.log("Calling method: findEffectByType");
    const entityEffects = this.activeEffects.get(entityId);
    if (!entityEffects) return null;
    for (const effect of entityEffects.values()) {
      if (effect.type === effectType) {
        return effect;
      }
    }
    return null;
  }

  // Effect Implementation Methods

  /**
   * Apply slow effect
   * @param {Object} effectInstance 
   */
  applySlowEffect(effectInstance) {
    console.log("Calling method: applySlowEffect");
    const entity = this.getEntity(effectInstance.entityId);
    if (entity) {
      const slowAmount = effectInstance.slowAmount || 0.5;
      entity.speedMultiplier = (entity.speedMultiplier || 1) * (1 - slowAmount);
      entity.statusEffects = entity.statusEffects || new Set();
      entity.statusEffects.add('slow');
    }
  }

  /**
   * Update slow effect
   * @param {Object} effectInstance 
   */
  updateSlowEffect(effectInstance) {
    console.log("Calling method: updateSlowEffect");
  } // Slow effect is passive, no periodic updates needed

  /**
   * Remove slow effect
   * @param {Object} effectInstance 
   */
  removeSlowEffect(effectInstance) {
    console.log("Calling method: removeSlowEffect");
    const entity = this.getEntity(effectInstance.entityId);
    if (entity) {
      const slowAmount = effectInstance.slowAmount || 0.5;
      entity.speedMultiplier = (entity.speedMultiplier || 1) / (1 - slowAmount);
      if (entity.statusEffects) {
        entity.statusEffects.delete('slow');
      }
    }
  }

  /**
   * Apply poison effect
   * @param {Object} effectInstance 
   */
  applyPoisonEffect(effectInstance) {
    console.log("Calling method: applyPoisonEffect");
    const entity = this.getEntity(effectInstance.entityId);
    if (entity) {
      entity.statusEffects = entity.statusEffects || new Set();
      entity.statusEffects.add('poison');
    }
  }

  /**
   * Update poison effect (deals damage over time)
   * @param {Object} effectInstance 
   */
  updatePoisonEffect(effectInstance) {
    console.log("Calling method: updatePoisonEffect");
    const damagePerSecond = effectInstance.damagePerSecond || 10;
    const updateInterval = effectInstance.updateInterval || 1000;
    const damage = damagePerSecond * updateInterval / 1000;
    if (this.healthSystem) {
      this.healthSystem.dealDamage(effectInstance.entityId, damage, {
        damageType: 'poison',
        source: effectInstance.source
      });
    }
    this.triggerEvent('poisonDamage', {
      entityId: effectInstance.entityId,
      damage,
      source: effectInstance.source
    });
  }

  /**
   * Remove poison effect
   * @param {Object} effectInstance 
   */
  removePoisonEffect(effectInstance) {
    console.log("Calling method: removePoisonEffect");
    const entity = this.getEntity(effectInstance.entityId);
    if (entity && entity.statusEffects) {
      entity.statusEffects.delete('poison');
    }
  }

  /**
   * Apply freeze effect
   * @param {Object} effectInstance 
   */
  applyFreezeEffect(effectInstance) {
    console.log("Calling method: applyFreezeEffect");
    const entity = this.getEntity(effectInstance.entityId);
    if (entity) {
      entity.originalSpeed = entity.speed || entity.moveSpeed || 0;
      entity.speed = 0;
      entity.moveSpeed = 0;
      entity.statusEffects = entity.statusEffects || new Set();
      entity.statusEffects.add('freeze');
    }
  }

  /**
   * Update freeze effect
   * @param {Object} effectInstance 
   */
  updateFreezeEffect(effectInstance) {
    console.log("Calling method: updateFreezeEffect");
    // Ensure entity remains frozen
    const entity = this.getEntity(effectInstance.entityId);
    if (entity) {
      entity.speed = 0;
      entity.moveSpeed = 0;
    }
  }

  /**
   * Remove freeze effect
   * @param {Object} effectInstance 
   */
  removeFreezeEffect(effectInstance) {
    console.log("Calling method: removeFreezeEffect");
    const entity = this.getEntity(effectInstance.entityId);
    if (entity) {
      entity.speed = entity.originalSpeed || 50;
      entity.moveSpeed = entity.originalSpeed || 50;
      if (entity.statusEffects) {
        entity.statusEffects.delete('freeze');
      }
    }
  }

  /**
   * Apply burn effect
   * @param {Object} effectInstance 
   */
  applyBurnEffect(effectInstance) {
    console.log("Calling method: applyBurnEffect");
    const entity = this.getEntity(effectInstance.entityId);
    if (entity) {
      entity.statusEffects = entity.statusEffects || new Set();
      entity.statusEffects.add('burn');
    }
  }

  /**
   * Update burn effect
   * @param {Object} effectInstance 
   */
  updateBurnEffect(effectInstance) {
    console.log("Calling method: updateBurnEffect");
    const damagePerSecond = effectInstance.damagePerSecond || 15;
    const updateInterval = effectInstance.updateInterval || 1000;
    const damage = damagePerSecond * updateInterval / 1000;
    if (this.healthSystem) {
      this.healthSystem.dealDamage(effectInstance.entityId, damage, {
        damageType: 'fire',
        source: effectInstance.source
      });
    }
  }

  /**
   * Remove burn effect
   * @param {Object} effectInstance 
   */
  removeBurnEffect(effectInstance) {
    console.log("Calling method: removeBurnEffect");
    const entity = this.getEntity(effectInstance.entityId);
    if (entity && entity.statusEffects) {
      entity.statusEffects.delete('burn');
    }
  }

  /**
   * Apply stun effect
   * @param {Object} effectInstance 
   */
  applyStunEffect(effectInstance) {
    console.log("Calling method: applyStunEffect");
    const entity = this.getEntity(effectInstance.entityId);
    if (entity) {
      entity.originalSpeed = entity.speed || entity.moveSpeed || 0;
      entity.speed = 0;
      entity.moveSpeed = 0;
      entity.canAttack = false;
      entity.statusEffects = entity.statusEffects || new Set();
      entity.statusEffects.add('stun');
    }
  }

  /**
   * Update stun effect
   * @param {Object} effectInstance 
   */
  updateStunEffect(effectInstance) {
    console.log("Calling method: updateStunEffect");
    // Ensure entity remains stunned
    const entity = this.getEntity(effectInstance.entityId);
    if (entity) {
      entity.speed = 0;
      entity.moveSpeed = 0;
      entity.canAttack = false;
    }
  }

  /**
   * Remove stun effect
   * @param {Object} effectInstance 
   */
  removeStunEffect(effectInstance) {
    console.log("Calling method: removeStunEffect");
    const entity = this.getEntity(effectInstance.entityId);
    if (entity) {
      entity.speed = entity.originalSpeed || 50;
      entity.moveSpeed = entity.originalSpeed || 50;
      entity.canAttack = true;
      if (entity.statusEffects) {
        entity.statusEffects.delete('stun');
      }
    }
  }

  /**
   * Apply armor reduction effect
   * @param {Object} effectInstance 
   */
  applyArmorReductionEffect(effectInstance) {
    console.log("Calling method: applyArmorReductionEffect");
    const entity = this.getEntity(effectInstance.entityId);
    if (entity) {
      const reduction = effectInstance.armorReduction || 10;
      entity.armor = Math.max(0, (entity.armor || 0) - reduction);
      entity.statusEffects = entity.statusEffects || new Set();
      entity.statusEffects.add('armor_reduction');
    }
  }

  /**
   * Update armor reduction effect
   * @param {Object} effectInstance 
   */
  updateArmorReductionEffect(effectInstance) {
    console.log("Calling method: updateArmorReductionEffect");
  } // Passive effect, no updates needed

  /**
   * Remove armor reduction effect
   * @param {Object} effectInstance 
   */
  removeArmorReductionEffect(effectInstance) {
    console.log("Calling method: removeArmorReductionEffect");
    const entity = this.getEntity(effectInstance.entityId);
    if (entity) {
      const reduction = effectInstance.armorReduction || 10;
      entity.armor = (entity.armor || 0) + reduction;
      if (entity.statusEffects) {
        entity.statusEffects.delete('armor_reduction');
      }
    }
  }

  /**
   * Apply damage boost effect
   * @param {Object} effectInstance 
   */
  applyDamageBoostEffect(effectInstance) {
    console.log("Calling method: applyDamageBoostEffect");
    const entity = this.getEntity(effectInstance.entityId);
    if (entity) {
      const boost = effectInstance.damageBoost || 1.5;
      entity.damageMultiplier = (entity.damageMultiplier || 1) * boost;
      entity.statusEffects = entity.statusEffects || new Set();
      entity.statusEffects.add('damage_boost');
    }
  }

  /**
   * Update damage boost effect
   * @param {Object} effectInstance 
   */
  updateDamageBoostEffect(effectInstance) {
    console.log("Calling method: updateDamageBoostEffect");
  } // Passive effect, no updates needed

  /**
   * Remove damage boost effect
   * @param {Object} effectInstance 
   */
  removeDamageBoostEffect(effectInstance) {
    console.log("Calling method: removeDamageBoostEffect");
    const entity = this.getEntity(effectInstance.entityId);
    if (entity) {
      const boost = effectInstance.damageBoost || 1.5;
      entity.damageMultiplier = (entity.damageMultiplier || 1) / boost;
      if (entity.statusEffects) {
        entity.statusEffects.delete('damage_boost');
      }
    }
  }

  /**
   * Apply speed boost effect
   * @param {Object} effectInstance 
   */
  applySpeedBoostEffect(effectInstance) {
    console.log("Calling method: applySpeedBoostEffect");
    const entity = this.getEntity(effectInstance.entityId);
    if (entity) {
      const boost = effectInstance.speedBoost || 1.5;
      entity.speedMultiplier = (entity.speedMultiplier || 1) * boost;
      entity.statusEffects = entity.statusEffects || new Set();
      entity.statusEffects.add('speed_boost');
    }
  }

  /**
   * Update speed boost effect
   * @param {Object} effectInstance 
   */
  updateSpeedBoostEffect(effectInstance) {
    console.log("Calling method: updateSpeedBoostEffect");
  } // Passive effect, no updates needed

  /**
   * Remove speed boost effect
   * @param {Object} effectInstance 
   */
  removeSpeedBoostEffect(effectInstance) {
    console.log("Calling method: removeSpeedBoostEffect");
    const entity = this.getEntity(effectInstance.entityId);
    if (entity) {
      const boost = effectInstance.speedBoost || 1.5;
      entity.speedMultiplier = (entity.speedMultiplier || 1) / boost;
      if (entity.statusEffects) {
        entity.statusEffects.delete('speed_boost');
      }
    }
  }

  /**
   * Apply regeneration effect
   * @param {Object} effectInstance 
   */
  applyRegenerationEffect(effectInstance) {
    console.log("Calling method: applyRegenerationEffect");
    const entity = this.getEntity(effectInstance.entityId);
    if (entity) {
      entity.statusEffects = entity.statusEffects || new Set();
      entity.statusEffects.add('regeneration');
    }
  }

  /**
   * Update regeneration effect
   * @param {Object} effectInstance 
   */
  updateRegenerationEffect(effectInstance) {
    console.log("Calling method: updateRegenerationEffect");
    const healPerSecond = effectInstance.healPerSecond || 5;
    const updateInterval = effectInstance.updateInterval || 1000;
    const healing = healPerSecond * updateInterval / 1000;
    if (this.healthSystem) {
      this.healthSystem.heal(effectInstance.entityId, healing, {
        healType: 'regeneration',
        source: effectInstance.source
      });
    }
  }

  /**
   * Remove regeneration effect
   * @param {Object} effectInstance 
   */
  removeRegenerationEffect(effectInstance) {
    console.log("Calling method: removeRegenerationEffect");
    const entity = this.getEntity(effectInstance.entityId);
    if (entity && entity.statusEffects) {
      entity.statusEffects.delete('regeneration');
    }
  }

  /**
   * Apply shield effect
   * @param {Object} effectInstance 
   */
  applyShieldEffect(effectInstance) {
    console.log("Calling method: applyShieldEffect");
    const entity = this.getEntity(effectInstance.entityId);
    if (entity) {
      const shieldAmount = effectInstance.shieldAmount || 50;
      entity.shield = (entity.shield || 0) + shieldAmount;
      entity.statusEffects = entity.statusEffects || new Set();
      entity.statusEffects.add('shield');
    }
  }

  /**
   * Update shield effect
   * @param {Object} effectInstance 
   */
  updateShieldEffect(effectInstance) {
    console.log("Calling method: updateShieldEffect");
    // Check if shield is depleted
    const entity = this.getEntity(effectInstance.entityId);
    if (entity && (entity.shield || 0) <= 0) {
      this.removeEffect(effectInstance.entityId, effectInstance.instanceId);
    }
  }

  /**
   * Remove shield effect
   * @param {Object} effectInstance 
   */
  removeShieldEffect(effectInstance) {
    console.log("Calling method: removeShieldEffect");
    const entity = this.getEntity(effectInstance.entityId);
    if (entity && entity.statusEffects) {
      entity.statusEffects.delete('shield');
    }
  }

  /**
   * Get entity reference (placeholder - would integrate with game's entity system)
   * @param {string} entityId 
   * @returns {Object|null}
   */
  getEntity(entityId) {
    console.log("Calling method: getEntity");
    // This would integrate with the game's entity management system
    // For now, return a placeholder
    return {
      id: entityId
    };
  }

  /**
   * Get all active effects for an entity
   * @param {string} entityId 
   * @returns {Array}
   */
  getActiveEffects(entityId) {
    console.log("Calling method: getActiveEffects");
    const entityEffects = this.activeEffects.get(entityId);
    return entityEffects ? Array.from(entityEffects.values()) : [];
  }

  /**
   * Check if entity has specific effect type
   * @param {string} entityId 
   * @param {string} effectType 
   * @returns {boolean}
   */
  hasEffect(entityId, effectType) {
    console.log("Calling method: hasEffect");
    return this.findEffectByType(entityId, effectType) !== null;
  }

  /**
   * Remove all effects from an entity
   * @param {string} entityId 
   */
  removeAllEffects(entityId) {
    console.log("Calling method: removeAllEffects");
    const entityEffects = this.activeEffects.get(entityId);
    if (entityEffects) {
      const effectIds = Array.from(entityEffects.keys());
      effectIds.forEach(function (effectId) {
        this.removeEffect(entityId, effectId);
      });
    }
  }

  /**
   * Remove all effects of a specific type
   * @param {string} effectType 
   */
  removeAllEffectsOfType(effectType) {
    console.log("Calling method: removeAllEffectsOfType");
    this.activeEffects.forEach(function (entityEffects, entityId) {
      const effectsToRemove = [];
      entityEffects.forEach(function (effect, effectId) {
        if (effect.type === effectType) {
          effectsToRemove.push(effectId);
        }
      });
      effectsToRemove.forEach(function (effectId) {
        this.removeEffect(entityId, effectId);
      });
    });
  }

  /**
   * Get effect types
   * @returns {Array}
   */
  getEffectTypes() {
    console.log("Calling method: getEffectTypes");
    return Array.from(this.effectTypes.entries()).map(function ([type, config]) {
      return {
        type,
        name: config.name,
        description: config.description,
        icon: config.icon,
        color: config.color,
        effectType: config.type
      };
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
    let totalEffects = 0;
    let effectsByType = {};
    let entitiesWithEffects = 0;
    this.activeEffects.forEach(function (entityEffects, entityId) {
      if (entityEffects.size > 0) {
        entitiesWithEffects++;
        entityEffects.forEach(function (effect) {
          totalEffects++;
          effectsByType[effect.type] = (effectsByType[effect.type] || 0) + 1;
        });
      }
    });
    return {
      totalEffects,
      entitiesWithEffects,
      effectsByType,
      activeTimers: this.updateTimers.size,
      availableEffectTypes: this.effectTypes.size
    };
  }

  /**
   * Clear all effects
   */
  clearAllEffects() {
    console.log("Calling method: clearAllEffects");
    this.activeEffects.forEach(function (entityEffects, entityId) {
      this.removeAllEffects(entityId);
    });

    // Clear any remaining timers
    this.updateTimers.forEach(function (timer) {
      return clearInterval(timer);
    });
    this.updateTimers.clear();
    this.triggerEvent('allEffectsCleared', {});
  }
}
# Class `HealthSystem`

## `constructor()`

## `registerEntity(entityId, healthConfig)`

*
   * Register an entity with the health system
   * @param {string} entityId - Unique identifier for the entity
   * @param {Object} healthConfig - Health configuration

## `unregisterEntity(entityId)`

*
   * Remove entity from health system
   * @param {string} entityId

## `dealDamage(entityId, damage, )`

*
   * Deal damage to an entity
   * @param {string} entityId 
   * @param {number} damage 
   * @param {Object} damageInfo - Additional damage information
   * @returns {Object} Damage result

## `heal(entityId, healAmount, )`

*
   * Heal an entity
   * @param {string} entityId 
   * @param {number} healAmount 
   * @param {Object} healInfo 
   * @returns {Object} Healing result

## `setHealth(entityId, health)`

*
   * Set entity health directly
   * @param {string} entityId 
   * @param {number} health

## `getHealthInfo(entityId)`

*
   * Get entity health information
   * @param {string} entityId 
   * @returns {Object|null}

## `modifyStats(entityId, statChanges)`

*
   * Modify entity stats
   * @param {string} entityId 
   * @param {Object} statChanges

## `startRegeneration(entityId)`

*
   * Start health regeneration for an entity
   * @param {string} entityId

## `stopRegeneration(entityId)`

*
   * Stop health regeneration for an entity
   * @param {string} entityId

## `handleDeath(entityId, )`

*
   * Handle entity death
   * @param {string} entityId 
   * @param {string} source

## `addDeathCallback(entityId, callback)`

*
   * Add death callback for an entity
   * @param {string} entityId 
   * @param {Function} callback

## `applyStatusEffect(entityId, effectId, effectData)`

*
   * Apply status effect to entity
   * @param {string} entityId 
   * @param {string} effectId 
   * @param {Object} effectData

## `removeStatusEffect(entityId, effectId)`

*
   * Remove status effect from entity
   * @param {string} entityId 
   * @param {string} effectId

## `getEntitiesByCondition(condition)`

*
   * Get all entities with specific health conditions
   * @param {Function} condition 
   * @returns {Array}

## `getAliveEntities()`

*
   * Get all alive entities
   * @returns {Array}

## `getDeadEntities()`

*
   * Get all dead entities
   * @returns {Array}

## `getEntitiesByType(entityType)`

*
   * Get entities by type
   * @param {string} entityType 
   * @returns {Array}

## `getLowHealthEntities()`

*
   * Get low health entities (below specified threshold)
   * @param {number} threshold - Health percentage threshold (0.0 to 1.0)
   * @returns {Array}

## `addEventListener(event, callback)`

*
   * Add event listener
   * @param {string} event 
   * @param {Function} callback

## `removeEventListener(event, callback)`

*
   * Remove event listener
   * @param {string} event 
   * @param {Function} callback

## `triggerEvent(event, data)`

*
   * Trigger event - uses both internal listeners and external event emitter
   * @param {string} event 
   * @param {Object} data

## `update(deltaTime)`

*
   * Update system (called each frame)
   * @param {number} deltaTime

## `updateStatusEffects(deltaTime)`

*
   * Update status effects with duration
   * @param {number} deltaTime

## `processDamageQueue()`

*
   * Process queued damage

## `processHealingQueue()`

*
   * Process queued healing

## `queueDamage(entityId, damage, )`

*
   * Queue damage to be processed next frame
   * @param {string} entityId 
   * @param {number} damage 
   * @param {Object} damageInfo

## `queueHealing(entityId, healAmount, )`

*
   * Queue healing to be processed next frame
   * @param {string} entityId 
   * @param {number} healAmount 
   * @param {Object} healInfo

## `resetAllHealth()`

*
   * Reset all entities health to full

## `getSystemStats()`

*
   * Get system statistics
   * @returns {Object}

## `destroy()`

*
   * Cleanup method to be called when destroying the system
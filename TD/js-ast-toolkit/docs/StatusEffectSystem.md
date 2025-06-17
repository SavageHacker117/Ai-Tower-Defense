# Class `StatusEffectSystem`

## `constructor(healthSystem)`

## `initializeEffectTypes()`

*
   * Initialize available status effect types

## `applyEffect(entityId, effectType, )`

*
   * Apply a status effect to an entity
   * @param {string} entityId 
   * @param {string} effectType 
   * @param {Object} effectData 
   * @returns {string|null} Effect instance ID

## `removeEffect(entityId, effectInstanceId)`

*
   * Remove a status effect from an entity
   * @param {string} entityId 
   * @param {string} effectInstanceId 
   * @returns {boolean} Success

## `setupUpdateTimer(effectInstance)`

*
   * Setup update timer for an effect
   * @param {Object} effectInstance

## `findEffectByType(entityId, effectType)`

*
   * Find effect by type for an entity
   * @param {string} entityId 
   * @param {string} effectType 
   * @returns {Object|null}

## `applySlowEffect(effectInstance)`

Effect Implementation Methods

## `updateSlowEffect(effectInstance)`

*
   * Update slow effect
   * @param {Object} effectInstance

## `removeSlowEffect(effectInstance)`

*
   * Remove slow effect
   * @param {Object} effectInstance

## `applyPoisonEffect(effectInstance)`

*
   * Apply poison effect
   * @param {Object} effectInstance

## `updatePoisonEffect(effectInstance)`

*
   * Update poison effect (deals damage over time)
   * @param {Object} effectInstance

## `removePoisonEffect(effectInstance)`

*
   * Remove poison effect
   * @param {Object} effectInstance

## `applyFreezeEffect(effectInstance)`

*
   * Apply freeze effect
   * @param {Object} effectInstance

## `updateFreezeEffect(effectInstance)`

*
   * Update freeze effect
   * @param {Object} effectInstance

## `removeFreezeEffect(effectInstance)`

*
   * Remove freeze effect
   * @param {Object} effectInstance

## `applyBurnEffect(effectInstance)`

*
   * Apply burn effect
   * @param {Object} effectInstance

## `updateBurnEffect(effectInstance)`

*
   * Update burn effect
   * @param {Object} effectInstance

## `removeBurnEffect(effectInstance)`

*
   * Remove burn effect
   * @param {Object} effectInstance

## `applyStunEffect(effectInstance)`

*
   * Apply stun effect
   * @param {Object} effectInstance

## `updateStunEffect(effectInstance)`

*
   * Update stun effect
   * @param {Object} effectInstance

## `removeStunEffect(effectInstance)`

*
   * Remove stun effect
   * @param {Object} effectInstance

## `applyArmorReductionEffect(effectInstance)`

*
   * Apply armor reduction effect
   * @param {Object} effectInstance

## `updateArmorReductionEffect(effectInstance)`

*
   * Update armor reduction effect
   * @param {Object} effectInstance

## `removeArmorReductionEffect(effectInstance)`

*
   * Remove armor reduction effect
   * @param {Object} effectInstance

## `applyDamageBoostEffect(effectInstance)`

*
   * Apply damage boost effect
   * @param {Object} effectInstance

## `updateDamageBoostEffect(effectInstance)`

*
   * Update damage boost effect
   * @param {Object} effectInstance

## `removeDamageBoostEffect(effectInstance)`

*
   * Remove damage boost effect
   * @param {Object} effectInstance

## `applySpeedBoostEffect(effectInstance)`

*
   * Apply speed boost effect
   * @param {Object} effectInstance

## `updateSpeedBoostEffect(effectInstance)`

*
   * Update speed boost effect
   * @param {Object} effectInstance

## `removeSpeedBoostEffect(effectInstance)`

*
   * Remove speed boost effect
   * @param {Object} effectInstance

## `applyRegenerationEffect(effectInstance)`

*
   * Apply regeneration effect
   * @param {Object} effectInstance

## `updateRegenerationEffect(effectInstance)`

*
   * Update regeneration effect
   * @param {Object} effectInstance

## `removeRegenerationEffect(effectInstance)`

*
   * Remove regeneration effect
   * @param {Object} effectInstance

## `applyShieldEffect(effectInstance)`

*
   * Apply shield effect
   * @param {Object} effectInstance

## `updateShieldEffect(effectInstance)`

*
   * Update shield effect
   * @param {Object} effectInstance

## `removeShieldEffect(effectInstance)`

*
   * Remove shield effect
   * @param {Object} effectInstance

## `getEntity(entityId)`

*
   * Get entity reference (placeholder - would integrate with game's entity system)
   * @param {string} entityId 
   * @returns {Object|null}

## `getActiveEffects(entityId)`

*
   * Get all active effects for an entity
   * @param {string} entityId 
   * @returns {Array}

## `hasEffect(entityId, effectType)`

*
   * Check if entity has specific effect type
   * @param {string} entityId 
   * @param {string} effectType 
   * @returns {boolean}

## `removeAllEffects(entityId)`

*
   * Remove all effects from an entity
   * @param {string} entityId

## `removeAllEffectsOfType(effectType)`

*
   * Remove all effects of a specific type
   * @param {string} effectType

## `getEffectTypes()`

*
   * Get effect types
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
   * Trigger event
   * @param {string} event 
   * @param {Object} data

## `getSystemStats()`

*
   * Get system statistics
   * @returns {Object}

## `clearAllEffects()`

*
   * Clear all effects
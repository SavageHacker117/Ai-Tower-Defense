# Class `VisualFeedbackSystem`

## `constructor(canvas, context, )`

## `initializeEffectTypes()`

*
   * Initialize visual effect types

## `showDamageNumber(x, y, damage, )`

*
   * Show damage number at position
   * @param {number} x 
   * @param {number} y 
   * @param {number} damage 
   * @param {Object} options

## `showHealingNumber(x, y, healing, )`

*
   * Show healing number at position
   * @param {number} x 
   * @param {number} y 
   * @param {number} healing 
   * @param {Object} options

## `showFloatingText(x, y, text, )`

*
   * Show floating text
   * @param {number} x 
   * @param {number} y 
   * @param {string} text 
   * @param {Object} options

## `createScreenShake(, , )`

*
   * Create screen shake effect
   * @param {number} intensity 
   * @param {number} duration 
   * @param {Object} options

## `highlightEntity(entityId, x, y, radius, )`

*
   * Highlight entity with visual effect
   * @param {string} entityId 
   * @param {number} x 
   * @param {number} y 
   * @param {number} radius 
   * @param {Object} options

## `removeHighlight(entityId)`

*
   * Remove highlight from entity
   * @param {string} entityId

## `showRangeIndicator(x, y, range, )`

*
   * Show range indicator for tower
   * @param {number} x 
   * @param {number} y 
   * @param {number} range 
   * @param {Object} options

## `removeRangeIndicator(indicatorId)`

*
   * Remove range indicator
   * @param {string} indicatorId

## `createExplosion(x, y, radius, )`

*
   * Create explosion effect
   * @param {number} x 
   * @param {number} y 
   * @param {number} radius 
   * @param {Object} options

## `createImpactEffect(x, y, )`

*
   * Create impact effect
   * @param {number} x 
   * @param {number} y 
   * @param {Object} options

## `createMuzzleFlash(x, y, angle, )`

*
   * Create muzzle flash effect
   * @param {number} x 
   * @param {number} y 
   * @param {number} angle 
   * @param {Object} options

## `createTrailEffect(trailPoints, )`

*
   * Create trail effect for projectiles
   * @param {Array} trailPoints 
   * @param {Object} options

## `update(deltaTime)`

*
   * Update all visual effects
   * @param {number} deltaTime

## `updateDamageNumbers(currentTime, deltaTime)`

*
   * Update damage numbers
   * @param {number} currentTime 
   * @param {number} deltaTime

## `updateFloatingTexts(currentTime, deltaTime)`

*
   * Update floating texts
   * @param {number} currentTime 
   * @param {number} deltaTime

## `updateScreenShakes(currentTime, deltaTime)`

*
   * Update screen shakes
   * @param {number} currentTime 
   * @param {number} deltaTime

## `updateHighlights(currentTime, deltaTime)`

*
   * Update highlights
   * @param {number} currentTime 
   * @param {number} deltaTime

## `updateEffects(currentTime, deltaTime)`

*
   * Update effects
   * @param {number} currentTime 
   * @param {number} deltaTime

## `updateEffect(effect, progress, deltaTime)`

*
   * Update individual effect
   * @param {Object} effect 
   * @param {number} progress 
   * @param {number} deltaTime

## `updateExplosion(explosion, progress, deltaTime)`

*
   * Update explosion effect
   * @param {Object} explosion 
   * @param {number} progress 
   * @param {number} deltaTime

## `updateImpact(impact, progress, deltaTime)`

*
   * Update impact effect
   * @param {Object} impact 
   * @param {number} progress 
   * @param {number} deltaTime

## `updateMuzzleFlash(flash, progress, deltaTime)`

*
   * Update muzzle flash
   * @param {Object} flash 
   * @param {number} progress 
   * @param {number} deltaTime

## `updateTrail(trail, progress, deltaTime)`

*
   * Update trail effect
   * @param {Object} trail 
   * @param {number} progress 
   * @param {number} deltaTime

## `updateRangeIndicator(indicator, progress, deltaTime)`

*
   * Update range indicator
   * @param {Object} indicator 
   * @param {number} progress 
   * @param {number} deltaTime

## `render()`

*
   * Render all visual effects

## `applyScreenShake()`

*
   * Apply screen shake offset

## `renderRangeIndicators()`

*
   * Render range indicators

## `renderHighlights()`

*
   * Render highlights

## `renderEffects()`

*
   * Render all effects

## `renderExplosion(explosion)`

*
   * Render explosion effect
   * @param {Object} explosion

## `renderImpact(impact)`

*
   * Render impact effect
   * @param {Object} impact

## `renderMuzzleFlash(flash)`

*
   * Render muzzle flash
   * @param {Object} flash

## `renderTrail(trail)`

*
   * Render trail effect
   * @param {Object} trail

## `renderDamageNumbers()`

*
   * Render damage numbers

## `renderFloatingTexts()`

*
   * Render floating texts

## `randomizeColor(baseColor)`

*
   * Randomize color for particles
   * @param {string} baseColor 
   * @returns {string}

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

## `clearAllEffects()`

*
   * Clear all effects

## `getSystemStats()`

*
   * Get system statistics
   * @returns {Object}
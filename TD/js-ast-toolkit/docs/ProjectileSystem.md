# Class `ProjectileSystem`

## `constructor()`

## `initializeProjectileTypes()`

*
   * Initialize projectile type configurations

## `createProjectile(projectileData)`

*
   * Create a new projectile
   * @param {Object} projectileData 
   * @returns {string} Projectile ID

## `handleInstantHit(projectile)`

*
   * Handle instant hit projectiles (laser, lightning)
   * @param {Object} projectile

## `update(deltaTime, )`

*
   * Update projectile system
   * @param {number} deltaTime - Time since last update in seconds
   * @param {Array} enemies - Array of enemy objects

## `updateHoming(projectile, deltaTime)`

*
   * Update homing behavior for projectile
   * @param {Object} projectile 
   * @param {number} deltaTime

## `updateTrail(projectile)`

*
   * Update projectile trail effect
   * @param {Object} projectile

## `checkCollisions(projectile, enemies)`

*
   * Check collisions with enemies
   * @param {Object} projectile 
   * @param {Array} enemies

## `handleProjectileHit(projectile, target)`

*
   * Handle projectile hitting a target
   * @param {Object} projectile 
   * @param {Object} target

## `applyStatusEffects(projectile, target)`

*
   * Apply status effects from projectile
   * @param {Object} projectile 
   * @param {Object} target

## `handleSplashDamage(projectile, epicenter)`

*
   * Handle splash damage
   * @param {Object} projectile 
   * @param {Object} epicenter

## `handleChainLightning(projectile, initialTarget)`

*
   * Handle chain lightning effect
   * @param {Object} projectile 
   * @param {Object} initialTarget

## `handleBounce(projectile, target)`

*
   * Handle projectile bouncing
   * @param {Object} projectile 
   * @param {Object} target

## `isOutOfBounds(projectile)`

*
   * Check if projectile is out of bounds
   * @param {Object} projectile 
   * @returns {boolean}

## `removeProjectile(projectileId)`

*
   * Remove projectile from system
   * @param {string} projectileId

## `getDistance(x1, y1, x2, y2)`

*
   * Get distance between two points
   * @param {number} x1 
   * @param {number} y1 
   * @param {number} x2 
   * @param {number} y2 
   * @returns {number}

## `getAllProjectiles()`

*
   * Get all projectiles
   * @returns {Array}

## `getProjectilesByTower(towerId)`

*
   * Get projectiles by tower
   * @param {string} towerId 
   * @returns {Array}

## `getProjectile(projectileId)`

*
   * Get projectile by ID
   * @param {string} projectileId 
   * @returns {Object|null}

## `clearAllProjectiles()`

*
   * Clear all projectiles

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
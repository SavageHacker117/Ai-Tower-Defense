# Class `ParticleSystem`

## `constructor(canvas, context, )`

## `initializeParticleTypes()`

*
   * Initialize particle type configurations

## `createBurst(x, y, , )`

*
   * Create particle burst at position
   * @param {number} x 
   * @param {number} y 
   * @param {string} type 
   * @param {Object} options

## `createParticle(x, y, config, )`

*
   * Create individual particle
   * @param {number} x 
   * @param {number} y 
   * @param {Object} config 
   * @param {Object} options 
   * @returns {Object}

## `createEmitter(x, y, , )`

*
   * Create continuous particle emitter
   * @param {number} x 
   * @param {number} y 
   * @param {string} type 
   * @param {Object} options 
   * @returns {string} Emitter ID

## `stopEmitter(emitterId)`

*
   * Stop particle emitter
   * @param {string} emitterId

## `removeEmitter(emitterId)`

*
   * Remove particle emitter
   * @param {string} emitterId

## `update(deltaTime)`

*
   * Update particle system
   * @param {number} deltaTime

## `updateParticles(deltaTime)`

*
   * Update all particles
   * @param {number} deltaTime

## `updateParticleVisuals(particle, deltaTime)`

*
   * Update particle visual properties
   * @param {Object} particle 
   * @param {number} deltaTime

## `handleParticleBounce(particle)`

*
   * Handle particle bouncing off boundaries
   * @param {Object} particle

## `updateEmitters(deltaTime)`

*
   * Update all emitters
   * @param {number} deltaTime

## `emitParticle(emitter)`

*
   * Emit single particle from emitter
   * @param {Object} emitter

## `render()`

*
   * Render all particles

## `renderParticle(particle)`

*
   * Render individual particle
   * @param {Object} particle

## `createExplosion(x, y, , )`

*
   * Create explosion effect
   * @param {number} x 
   * @param {number} y 
   * @param {number} intensity 
   * @param {Object} options

## `createImpact(x, y, , )`

*
   * Create impact effect
   * @param {number} x 
   * @param {number} y 
   * @param {string} materialType 
   * @param {Object} options

## `createTrail(x, y, , )`

*
   * Create trail effect
   * @param {number} x 
   * @param {number} y 
   * @param {string} trailType 
   * @param {Object} options

## `randomBetween(min, max)`

*
   * Get random value between min and max
   * @param {number} min 
   * @param {number} max 
   * @returns {number}

## `clearAllParticles()`

*
   * Clear all particles

## `setMaxParticles(maxCount)`

*
   * Set maximum particle count
   * @param {number} maxCount

## `getParticleCount()`

*
   * Get particle count
   * @returns {number}

## `getEmitterCount()`

*
   * Get active emitter count
   * @returns {number}

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
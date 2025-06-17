/**
 * ProjectileSystem.js
 * Manages projectile physics, movement, collision detection, and effects
 * for the tower defense game
 * 
 * Refactored to use ES6 modules and dependency injection
 */

export class ProjectileSystem {
  constructor({
    healthSystem,
    statusEffectSystem,
    gameCanvas
  }) {
    console.log("Calling method: constructor");
    // Injected dependencies - only what we need
    this.healthSystem = healthSystem;
    this.statusEffectSystem = statusEffectSystem;
    this.gameCanvas = gameCanvas; // For bounds checking

    this.projectiles = new Map(); // projectileId -> projectileData
    this.eventListeners = new Map();
    this.nextProjectileId = 1;
    this.projectileTypes = new Map();
    this.initializeProjectileTypes();
  }

  /**
   * Initialize projectile type configurations
   */
  initializeProjectileTypes() {
    console.log("Calling method: initializeProjectileTypes");
    const projectileConfigs = {
      bullet: {
        sprite: 'projectile_bullet',
        size: 4,
        trailEffect: false,
        rotateToDirection: true,
        gravity: 0,
        bounces: 0,
        piercing: false,
        homingStrength: 0,
        lifeTime: 5000,
        // ms
        hitEffect: 'impact_small'
      },
      cannonball: {
        sprite: 'projectile_cannonball',
        size: 8,
        trailEffect: true,
        rotateToDirection: false,
        gravity: 200,
        // pixels/s²
        bounces: 1,
        piercing: false,
        homingStrength: 0,
        lifeTime: 10000,
        hitEffect: 'explosion_medium'
      },
      laser: {
        sprite: 'projectile_laser',
        size: 2,
        trailEffect: true,
        rotateToDirection: true,
        gravity: 0,
        bounces: 0,
        piercing: true,
        homingStrength: 0,
        lifeTime: 3000,
        hitEffect: 'laser_impact',
        instantHit: true // Travels at light speed
      },
      ice: {
        sprite: 'projectile_ice',
        size: 6,
        trailEffect: true,
        rotateToDirection: true,
        gravity: 0,
        bounces: 0,
        piercing: false,
        homingStrength: 0.1,
        lifeTime: 4000,
        hitEffect: 'ice_shatter'
      },
      poison: {
        sprite: 'projectile_poison',
        size: 5,
        trailEffect: true,
        rotateToDirection: true,
        gravity: 0,
        bounces: 0,
        piercing: false,
        homingStrength: 0.2,
        lifeTime: 6000,
        hitEffect: 'poison_cloud'
      },
      lightning: {
        sprite: 'projectile_lightning',
        size: 3,
        trailEffect: false,
        rotateToDirection: true,
        gravity: 0,
        bounces: 0,
        piercing: true,
        homingStrength: 0.5,
        lifeTime: 2000,
        hitEffect: 'lightning_strike',
        instantHit: true
      },
      missile: {
        sprite: 'projectile_missile',
        size: 10,
        trailEffect: true,
        rotateToDirection: true,
        gravity: 0,
        bounces: 0,
        piercing: false,
        homingStrength: 0.8,
        lifeTime: 8000,
        hitEffect: 'explosion_large'
      }
    };
    Object.entries(projectileConfigs).forEach(function ([type, config]) {
      this.projectileTypes.set(type, config);
    });
  }

  /**
   * Create a new projectile
   * @param {Object} projectileData 
   * @returns {string} Projectile ID
   */
  createProjectile(projectileData) {
    console.log("Calling method: createProjectile");
    const {
      towerId,
      startX,
      startY,
      targetX,
      targetY,
      target = null,
      damage,
      speed,
      type = 'bullet',
      armorPiercing = false,
      splashRadius = 0,
      splashDamage = 0,
      slowEffect = null,
      poisonEffect = null,
      chainLightning = null
    } = projectileData;
    const projectileId = `projectile_${this.nextProjectileId++}`;
    const config = this.projectileTypes.get(type) || this.projectileTypes.get('bullet');

    // Calculate initial direction
    const dx = targetX - startX;
    const dy = targetY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const directionX = dx / distance;
    const directionY = dy / distance;
    const projectile = {
      id: projectileId,
      towerId,
      // Position and movement
      x: startX,
      y: startY,
      velocityX: directionX * speed,
      velocityY: directionY * speed,
      speed,
      // Target information
      targetX,
      targetY,
      target,
      originalTarget: target,
      // Combat properties
      damage,
      armorPiercing,
      splashRadius,
      splashDamage,
      slowEffect,
      poisonEffect,
      chainLightning,
      // Projectile type properties
      type,
      sprite: config.sprite,
      size: config.size,
      trailEffect: config.trailEffect,
      rotateToDirection: config.rotateToDirection,
      gravity: config.gravity,
      bounces: config.bounces,
      bouncesRemaining: config.bounces,
      piercing: config.piercing,
      homingStrength: config.homingStrength,
      lifeTime: config.lifeTime,
      hitEffect: config.hitEffect,
      instantHit: config.instantHit,
      // State
      createdTime: Date.now(),
      hasHit: false,
      hitTargets: new Set(),
      trail: [],
      rotation: Math.atan2(dy, dx),
      // Physics
      gravityVelocityY: 0
    };
    this.projectiles.set(projectileId, projectile);
    this.triggerEvent('projectileCreated', {
      projectile
    });

    // Handle instant hit projectiles
    if (config.instantHit) {
      this.handleInstantHit(projectile);
    }
    return projectileId;
  }

  /**
   * Handle instant hit projectiles (laser, lightning)
   * @param {Object} projectile 
   */
  handleInstantHit(projectile) {
    console.log("Calling method: handleInstantHit");
    // Immediately move to target and hit
    projectile.x = projectile.targetX;
    projectile.y = projectile.targetY;
    if (projectile.target) {
      this.handleProjectileHit(projectile, projectile.target);
    }

    // Remove after brief visual effect
    setTimeout(function () {
      this.removeProjectile(projectile.id);
    }, 100);
  }

  /**
   * Update projectile system
   * @param {number} deltaTime - Time since last update in seconds
   * @param {Array} enemies - Array of enemy objects
   */
  update(deltaTime, enemies = []) {
    console.log("Calling method: update");
    const currentTime = Date.now();
    const projectilesToRemove = [];
    this.projectiles.forEach(function (projectile) {
      // Check lifetime
      if (currentTime - projectile.createdTime > projectile.lifeTime) {
        projectilesToRemove.push(projectile.id);
        return;
      }

      // Skip instant hit projectiles
      if (projectile.instantHit) return;

      // Update homing behavior
      if (projectile.homingStrength > 0 && projectile.target && projectile.target.isAlive) {
        this.updateHoming(projectile, deltaTime);
      }

      // Apply gravity
      if (projectile.gravity > 0) {
        projectile.gravityVelocityY += projectile.gravity * deltaTime;
        projectile.velocityY += projectile.gravityVelocityY * deltaTime;
      }

      // Update position
      projectile.x += projectile.velocityX * deltaTime;
      projectile.y += projectile.velocityY * deltaTime;

      // Update rotation if needed
      if (projectile.rotateToDirection) {
        projectile.rotation = Math.atan2(projectile.velocityY, projectile.velocityX);
      }

      // Update trail
      if (projectile.trailEffect) {
        this.updateTrail(projectile);
      }

      // Check collisions
      this.checkCollisions(projectile, enemies);

      // Check bounds (remove if too far off screen)
      if (this.isOutOfBounds(projectile)) {
        projectilesToRemove.push(projectile.id);
      }
    });

    // Remove expired projectiles
    projectilesToRemove.forEach(function (id) {
      return this.removeProjectile(id);
    });
  }

  /**
   * Update homing behavior for projectile
   * @param {Object} projectile 
   * @param {number} deltaTime 
   */
  updateHoming(projectile, deltaTime) {
    console.log("Calling method: updateHoming");
    const target = projectile.target;
    if (!target || !target.isAlive) return;

    // Calculate direction to target
    const dx = target.x - projectile.x;
    const dy = target.y - projectile.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > 0) {
      const targetDirectionX = dx / distance;
      const targetDirectionY = dy / distance;

      // Current direction
      const currentSpeed = Math.sqrt(projectile.velocityX * projectile.velocityX + projectile.velocityY * projectile.velocityY);
      const currentDirectionX = projectile.velocityX / currentSpeed;
      const currentDirectionY = projectile.velocityY / currentSpeed;

      // Interpolate towards target direction
      const homingFactor = projectile.homingStrength * deltaTime * 5; // Adjust multiplier for responsiveness
      const newDirectionX = currentDirectionX + (targetDirectionX - currentDirectionX) * homingFactor;
      const newDirectionY = currentDirectionY + (targetDirectionY - currentDirectionY) * homingFactor;

      // Normalize and apply speed
      const newLength = Math.sqrt(newDirectionX * newDirectionX + newDirectionY * newDirectionY);
      projectile.velocityX = newDirectionX / newLength * projectile.speed;
      projectile.velocityY = newDirectionY / newLength * projectile.speed;
    }
  }

  /**
   * Update projectile trail effect
   * @param {Object} projectile 
   */
  updateTrail(projectile) {
    console.log("Calling method: updateTrail");
    projectile.trail.push({
      x: projectile.x,
      y: projectile.y,
      time: Date.now()
    });

    // Remove old trail points
    const maxTrailAge = 500; // ms
    const currentTime = Date.now();
    projectile.trail = projectile.trail.filter(function (point) {
      return currentTime - point.time < maxTrailAge;
    });
  }

  /**
   * Check collisions with enemies
   * @param {Object} projectile 
   * @param {Array} enemies 
   */
  checkCollisions(projectile, enemies) {
    console.log("Calling method: checkCollisions");
    enemies.forEach(function (enemy) {
      if (!enemy.isAlive || projectile.hitTargets.has(enemy.id)) return;
      const distance = this.getDistance(projectile.x, projectile.y, enemy.x, enemy.y);
      const hitRadius = (projectile.size + enemy.size) / 2;
      if (distance <= hitRadius) {
        this.handleProjectileHit(projectile, enemy);

        // Remove projectile if not piercing
        if (!projectile.piercing) {
          projectile.hasHit = true;
        }
      }
    });
  }

  /**
   * Handle projectile hitting a target
   * @param {Object} projectile 
   * @param {Object} target 
   */
  handleProjectileHit(projectile, target) {
    console.log("Calling method: handleProjectileHit");
    // Mark target as hit to prevent multiple hits from same projectile
    projectile.hitTargets.add(target.id);

    // Calculate damage
    let finalDamage = projectile.damage;
    const damageInfo = {
      damageType: projectile.armorPiercing ? 'true' : 'physical',
      source: projectile.towerId,
      critical: false,
      piercing: projectile.armorPiercing
    };

    // Apply damage using injected health system
    if (this.healthSystem) {
      const result = this.healthSystem.dealDamage(target.id, finalDamage, damageInfo);
      if (result.killed) {
        // Update tower kill count
        this.triggerEvent('enemyKilled', {
          enemyId: target.id,
          towerId: projectile.towerId,
          projectileId: projectile.id
        });
      }
    }

    // Apply status effects using injected status effect system
    this.applyStatusEffects(projectile, target);

    // Handle splash damage
    if (projectile.splashRadius > 0) {
      this.handleSplashDamage(projectile, target);
    }

    // Handle chain lightning
    if (projectile.chainLightning) {
      this.handleChainLightning(projectile, target);
    }

    // Trigger hit event
    this.triggerEvent('projectileHit', {
      projectile,
      target,
      damage: finalDamage,
      hitEffect: projectile.hitEffect
    });

    // Handle bouncing
    if (projectile.bouncesRemaining > 0 && !projectile.piercing) {
      this.handleBounce(projectile, target);
    }
  }

  /**
   * Apply status effects from projectile
   * @param {Object} projectile 
   * @param {Object} target 
   */
  applyStatusEffects(projectile, target) {
    console.log("Calling method: applyStatusEffects");
    if (!this.statusEffectSystem) return;
    if (projectile.slowEffect) {
      this.statusEffectSystem.applyEffect(target.id, 'slow', {
        duration: projectile.slowEffect.duration,
        slowAmount: projectile.slowEffect.slowAmount
      });
    }
    if (projectile.poisonEffect) {
      this.statusEffectSystem.applyEffect(target.id, 'poison', {
        duration: projectile.poisonEffect.duration,
        damagePerSecond: projectile.poisonEffect.damagePerSecond
      });
    }
  }

  /**
   * Handle splash damage
   * @param {Object} projectile 
   * @param {Object} epicenter 
   */
  handleSplashDamage(projectile, epicenter) {
    console.log("Calling method: handleSplashDamage");
    // This would need access to all enemies to find targets in splash radius
    this.triggerEvent('splashDamage', {
      projectile,
      epicenter,
      x: projectile.x,
      y: projectile.y,
      radius: projectile.splashRadius,
      damage: projectile.damage * projectile.splashDamage
    });
  }

  /**
   * Handle chain lightning effect
   * @param {Object} projectile 
   * @param {Object} initialTarget 
   */
  handleChainLightning(projectile, initialTarget) {
    console.log("Calling method: handleChainLightning");
    this.triggerEvent('chainLightning', {
      projectile,
      initialTarget,
      maxTargets: projectile.chainLightning.maxTargets,
      damageReduction: projectile.chainLightning.damageReduction,
      range: projectile.splashRadius || 100
    });
  }

  /**
   * Handle projectile bouncing
   * @param {Object} projectile 
   * @param {Object} target 
   */
  handleBounce(projectile, target) {
    console.log("Calling method: handleBounce");
    projectile.bouncesRemaining--;

    // Simple bounce logic - reverse velocity with some randomness
    projectile.velocityX *= -0.8 + Math.random() * 0.4;
    projectile.velocityY *= -0.8 + Math.random() * 0.4;

    // Add some random direction
    const randomAngle = (Math.random() - 0.5) * Math.PI / 2;
    const cos = Math.cos(randomAngle);
    const sin = Math.sin(randomAngle);
    const newVelX = projectile.velocityX * cos - projectile.velocityY * sin;
    const newVelY = projectile.velocityX * sin + projectile.velocityY * cos;
    projectile.velocityX = newVelX;
    projectile.velocityY = newVelY;
    this.triggerEvent('projectileBounce', {
      projectile,
      target,
      bouncesRemaining: projectile.bouncesRemaining
    });
  }

  /**
   * Check if projectile is out of bounds
   * @param {Object} projectile 
   * @returns {boolean}
   */
  isOutOfBounds(projectile) {
    console.log("Calling method: isOutOfBounds");
    const margin = 200; // Allow projectiles to go off screen a bit

    // Use injected canvas dimensions if available, otherwise fallback to window
    const canvasWidth = this.gameCanvas?.width || window.innerWidth;
    const canvasHeight = this.gameCanvas?.height || window.innerHeight;
    return projectile.x < -margin || projectile.x > canvasWidth + margin || projectile.y < -margin || projectile.y > canvasHeight + margin;
  }

  /**
   * Remove projectile from system
   * @param {string} projectileId 
   */
  removeProjectile(projectileId) {
    console.log("Calling method: removeProjectile");
    const projectile = this.projectiles.get(projectileId);
    if (projectile) {
      this.triggerEvent('projectileRemoved', {
        projectile
      });
      this.projectiles.delete(projectileId);
    }
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
   * Get all projectiles
   * @returns {Array}
   */
  getAllProjectiles() {
    console.log("Calling method: getAllProjectiles");
    return Array.from(this.projectiles.values());
  }

  /**
   * Get projectiles by tower
   * @param {string} towerId 
   * @returns {Array}
   */
  getProjectilesByTower(towerId) {
    console.log("Calling method: getProjectilesByTower");
    return this.getAllProjectiles().filter(function (p) {
      return p.towerId === towerId;
    });
  }

  /**
   * Get projectile by ID
   * @param {string} projectileId 
   * @returns {Object|null}
   */
  getProjectile(projectileId) {
    console.log("Calling method: getProjectile");
    return this.projectiles.get(projectileId) || null;
  }

  /**
   * Clear all projectiles
   */
  clearAllProjectiles() {
    console.log("Calling method: clearAllProjectiles");
    this.projectiles.forEach(function (projectile) {
      this.triggerEvent('projectileRemoved', {
        projectile
      });
    });
    this.projectiles.clear();
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
    const projectiles = this.getAllProjectiles();
    const totalProjectiles = projectiles.length;
    const projectilesByType = {};
    projectiles.forEach(function (p) {
      projectilesByType[p.type] = (projectilesByType[p.type] || 0) + 1;
    });
    return {
      totalProjectiles,
      projectilesByType,
      averageSpeed: projectiles.length > 0 ? projectiles.reduce(function (sum, p) {
        return sum + p.speed;
      }, 0) / projectiles.length : 0
    };
  }
}

// No longer exporting to window - clean ES6 module approach
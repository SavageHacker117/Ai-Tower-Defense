/**
 * ParticleSystem.js
 * Manages particle effects for explosions, impacts, trails, and environmental effects
 * in the tower defense game
 * 
 * Refactored to use ES6 modules and dependency injection
 */

export class ParticleSystem {
  constructor(canvas, context, options = {}) {
    console.log("Calling method: constructor");
    this.canvas = canvas;
    this.ctx = context;
    this.particles = [];
    this.emitters = new Map(); // emitterId -> emitterData
    this.eventListeners = new Map();
    this.nextEmitterId = 1;
    this.maxParticles = options.maxParticles || 1000;
    this.initializeParticleTypes();
  }

  /**
   * Initialize particle type configurations
   */
  initializeParticleTypes() {
    console.log("Calling method: initializeParticleTypes");
    this.particleTypes = {
      explosion: {
        count: 20,
        speed: {
          min: 50,
          max: 150
        },
        size: {
          min: 2,
          max: 6
        },
        life: {
          min: 500,
          max: 1500
        },
        colors: ['#FF6600', '#FF8800', '#FFAA00', '#FF4400'],
        gravity: 0,
        friction: 0.98,
        fadeOut: true,
        shrink: true
      },
      smoke: {
        count: 15,
        speed: {
          min: 10,
          max: 30
        },
        size: {
          min: 8,
          max: 15
        },
        life: {
          min: 2000,
          max: 4000
        },
        colors: ['#666666', '#888888', '#AAAAAA', '#999999'],
        gravity: -20,
        // Float upward
        friction: 0.99,
        fadeOut: true,
        grow: true
      },
      sparks: {
        count: 30,
        speed: {
          min: 80,
          max: 200
        },
        size: {
          min: 1,
          max: 3
        },
        life: {
          min: 300,
          max: 800
        },
        colors: ['#FFFF00', '#FFAA00', '#FF8800', '#FFFFFF'],
        gravity: 100,
        friction: 0.95,
        fadeOut: true,
        shrink: false
      },
      ice_shards: {
        count: 12,
        speed: {
          min: 40,
          max: 100
        },
        size: {
          min: 3,
          max: 8
        },
        life: {
          min: 800,
          max: 1500
        },
        colors: ['#AAEEFF', '#CCFFFF', '#88DDFF', '#FFFFFF'],
        gravity: 80,
        friction: 0.96,
        fadeOut: true,
        shrink: false
      },
      poison_cloud: {
        count: 25,
        speed: {
          min: 5,
          max: 20
        },
        size: {
          min: 6,
          max: 12
        },
        life: {
          min: 3000,
          max: 5000
        },
        colors: ['#66FF66', '#88FF88', '#AAFF88', '#77DD77'],
        gravity: -10,
        friction: 0.99,
        fadeOut: true,
        grow: true
      },
      lightning_sparks: {
        count: 15,
        speed: {
          min: 60,
          max: 120
        },
        size: {
          min: 2,
          max: 4
        },
        life: {
          min: 200,
          max: 600
        },
        colors: ['#AAAAFF', '#CCCCFF', '#FFFFFF', '#DDDDFF'],
        gravity: 0,
        friction: 0.92,
        fadeOut: true,
        shrink: true
      },
      blood: {
        count: 10,
        speed: {
          min: 30,
          max: 80
        },
        size: {
          min: 2,
          max: 5
        },
        life: {
          min: 1000,
          max: 2000
        },
        colors: ['#CC0000', '#AA0000', '#880000', '#DD2222'],
        gravity: 150,
        friction: 0.94,
        fadeOut: true,
        shrink: false
      },
      magic_sparkles: {
        count: 20,
        speed: {
          min: 20,
          max: 60
        },
        size: {
          min: 2,
          max: 4
        },
        life: {
          min: 1500,
          max: 3000
        },
        colors: ['#FF00FF', '#AA00AA', '#FFAAFF', '#CCAACC'],
        gravity: -30,
        friction: 0.98,
        fadeOut: true,
        twinkle: true
      },
      debris: {
        count: 8,
        speed: {
          min: 40,
          max: 120
        },
        size: {
          min: 4,
          max: 10
        },
        life: {
          min: 1500,
          max: 3000
        },
        colors: ['#8B4513', '#A0522D', '#CD853F', '#DEB887'],
        gravity: 200,
        friction: 0.85,
        fadeOut: true,
        rotation: true
      }
    };
  }

  /**
   * Create particle burst at position
   * @param {number} x 
   * @param {number} y 
   * @param {string} type 
   * @param {Object} options 
   */
  createBurst(x, y, type = 'explosion', options = {}) {
    console.log("Calling method: createBurst");
    const config = this.particleTypes[type];
    if (!config) {
      console.warn(`Unknown particle type: ${type}`);
      return;
    }
    const particleCount = options.count || config.count;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      const particle = this.createParticle(x, y, config, options);
      particles.push(particle);
      this.particles.push(particle);
    }

    // Limit total particles
    if (this.particles.length > this.maxParticles) {
      this.particles.splice(0, this.particles.length - this.maxParticles);
    }
    this.triggerEvent('burstCreated', {
      x,
      y,
      type,
      particleCount,
      particles
    });
    return particles;
  }

  /**
   * Create individual particle
   * @param {number} x 
   * @param {number} y 
   * @param {Object} config 
   * @param {Object} options 
   * @returns {Object}
   */
  createParticle(x, y, config, options = {}) {
    console.log("Calling method: createParticle");
    const angle = options.angle !== undefined ? options.angle : Math.random() * Math.PI * 2;
    const speed = this.randomBetween(config.speed.min, config.speed.max);
    const size = this.randomBetween(config.size.min, config.size.max);
    const life = this.randomBetween(config.life.min, config.life.max);
    const color = config.colors[Math.floor(Math.random() * config.colors.length)];
    return {
      x,
      y,
      startX: x,
      startY: y,
      velocityX: Math.cos(angle) * speed,
      velocityY: Math.sin(angle) * speed,
      size,
      originalSize: size,
      life,
      maxLife: life,
      color,
      alpha: 1.0,
      gravity: config.gravity || 0,
      friction: config.friction || 1.0,
      rotation: options.rotation || (config.rotation ? Math.random() * Math.PI * 2 : 0),
      rotationSpeed: config.rotation ? (Math.random() - 0.5) * 0.2 : 0,
      fadeOut: config.fadeOut,
      shrink: config.shrink,
      grow: config.grow,
      twinkle: config.twinkle,
      twinklePhase: Math.random() * Math.PI * 2,
      bounces: options.bounces || 0,
      bounceDamping: options.bounceDamping || 0.7,
      type: options.type || 'default'
    };
  }

  /**
   * Create continuous particle emitter
   * @param {number} x 
   * @param {number} y 
   * @param {string} type 
   * @param {Object} options 
   * @returns {string} Emitter ID
   */
  createEmitter(x, y, type = 'smoke', options = {}) {
    console.log("Calling method: createEmitter");
    const emitterId = `emitter_${this.nextEmitterId++}`;
    const config = this.particleTypes[type];
    if (!config) {
      console.warn(`Unknown particle type: ${type}`);
      return null;
    }
    const emitter = {
      id: emitterId,
      x,
      y,
      type,
      config,
      options,
      active: true,
      emissionRate: options.emissionRate || 10,
      // particles per second
      lastEmission: Date.now(),
      duration: options.duration || -1,
      // -1 for infinite
      startTime: Date.now(),
      particleCount: 0,
      maxParticles: options.maxParticles || 100
    };
    this.emitters.set(emitterId, emitter);
    this.triggerEvent('emitterCreated', {
      emitterId,
      x,
      y,
      type,
      options
    });
    return emitterId;
  }

  /**
   * Stop particle emitter
   * @param {string} emitterId 
   */
  stopEmitter(emitterId) {
    console.log("Calling method: stopEmitter");
    const emitter = this.emitters.get(emitterId);
    if (emitter) {
      emitter.active = false;
      this.triggerEvent('emitterStopped', {
        emitterId
      });
    }
  }

  /**
   * Remove particle emitter
   * @param {string} emitterId 
   */
  removeEmitter(emitterId) {
    console.log("Calling method: removeEmitter");
    if (this.emitters.delete(emitterId)) {
      this.triggerEvent('emitterRemoved', {
        emitterId
      });
    }
  }

  /**
   * Update particle system
   * @param {number} deltaTime 
   */
  update(deltaTime) {
    console.log("Calling method: update");
    this.updateParticles(deltaTime);
    this.updateEmitters(deltaTime);
  }

  /**
   * Update all particles
   * @param {number} deltaTime 
   */
  updateParticles(deltaTime) {
    console.log("Calling method: updateParticles");
    this.particles = this.particles.filter(function (particle) {
      // Update lifetime
      particle.life -= deltaTime * 1000;
      if (particle.life <= 0) return false;

      // Update position
      particle.x += particle.velocityX * deltaTime;
      particle.y += particle.velocityY * deltaTime;

      // Apply gravity
      if (particle.gravity !== 0) {
        particle.velocityY += particle.gravity * deltaTime;
      }

      // Apply friction
      particle.velocityX *= particle.friction;
      particle.velocityY *= particle.friction;

      // Update rotation
      if (particle.rotationSpeed !== 0) {
        particle.rotation += particle.rotationSpeed * deltaTime;
      }

      // Update visual properties
      this.updateParticleVisuals(particle, deltaTime);

      // Handle bouncing
      if (particle.bounces > 0) {
        this.handleParticleBounce(particle);
      }
      return true;
    });
  }

  /**
   * Update particle visual properties
   * @param {Object} particle 
   * @param {number} deltaTime 
   */
  updateParticleVisuals(particle, deltaTime) {
    console.log("Calling method: updateParticleVisuals");
    const lifeProgress = 1 - particle.life / particle.maxLife;

    // Update alpha (fade out)
    if (particle.fadeOut) {
      particle.alpha = 1 - lifeProgress;
    }

    // Update size
    if (particle.shrink) {
      particle.size = particle.originalSize * (1 - lifeProgress);
    } else if (particle.grow) {
      particle.size = particle.originalSize * (1 + lifeProgress * 0.5);
    }

    // Update twinkle effect
    if (particle.twinkle) {
      particle.twinklePhase += deltaTime * 10;
      particle.alpha *= 0.5 + 0.5 * Math.sin(particle.twinklePhase);
    }
  }

  /**
   * Handle particle bouncing off boundaries
   * @param {Object} particle 
   */
  handleParticleBounce(particle) {
    console.log("Calling method: handleParticleBounce");
    const margin = 10;
    let bounced = false;

    // Bounce off bottom
    if (particle.y > this.canvas.height - margin && particle.velocityY > 0) {
      particle.y = this.canvas.height - margin;
      particle.velocityY *= -particle.bounceDamping;
      bounced = true;
    }

    // Bounce off top
    if (particle.y < margin && particle.velocityY < 0) {
      particle.y = margin;
      particle.velocityY *= -particle.bounceDamping;
      bounced = true;
    }

    // Bounce off right
    if (particle.x > this.canvas.width - margin && particle.velocityX > 0) {
      particle.x = this.canvas.width - margin;
      particle.velocityX *= -particle.bounceDamping;
      bounced = true;
    }

    // Bounce off left
    if (particle.x < margin && particle.velocityX < 0) {
      particle.x = margin;
      particle.velocityX *= -particle.bounceDamping;
      bounced = true;
    }
    if (bounced) {
      particle.bounces--;
    }
  }

  /**
   * Update all emitters
   * @param {number} deltaTime 
   */
  updateEmitters(deltaTime) {
    console.log("Calling method: updateEmitters");
    const currentTime = Date.now();
    const emittersToRemove = [];
    this.emitters.forEach(function (emitter, emitterId) {
      // Check if emitter should be removed
      if (emitter.duration > 0 && currentTime - emitter.startTime > emitter.duration) {
        emittersToRemove.push(emitterId);
        return;
      }

      // Emit particles if active
      if (emitter.active) {
        const timeSinceLastEmission = currentTime - emitter.lastEmission;
        const emissionInterval = 1000 / emitter.emissionRate;
        if (timeSinceLastEmission >= emissionInterval) {
          this.emitParticle(emitter);
          emitter.lastEmission = currentTime;
        }
      }
    });

    // Remove expired emitters
    emittersToRemove.forEach(function (id) {
      return this.removeEmitter(id);
    });
  }

  /**
   * Emit single particle from emitter
   * @param {Object} emitter 
   */
  emitParticle(emitter) {
    console.log("Calling method: emitParticle");
    if (emitter.particleCount >= emitter.maxParticles) return;
    const particle = this.createParticle(emitter.x, emitter.y, emitter.config, emitter.options);
    this.particles.push(particle);
    emitter.particleCount++;

    // Limit total particles
    if (this.particles.length > this.maxParticles) {
      this.particles.shift();
    }
  }

  /**
   * Render all particles
   */
  render() {
    console.log("Calling method: render");
    if (!this.ctx) return;
    this.ctx.save();
    this.particles.forEach(function (particle) {
      this.renderParticle(particle);
    });
    this.ctx.restore();
  }

  /**
   * Render individual particle
   * @param {Object} particle 
   */
  renderParticle(particle) {
    console.log("Calling method: renderParticle");
    this.ctx.save();

    // Set alpha
    this.ctx.globalAlpha = particle.alpha;

    // Move to particle position
    this.ctx.translate(particle.x, particle.y);

    // Apply rotation if needed
    if (particle.rotation !== 0) {
      this.ctx.rotate(particle.rotation);
    }

    // Set color
    this.ctx.fillStyle = particle.color;

    // Draw particle based on type
    if (particle.type === 'square') {
      this.ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
    } else {
      // Default: circle
      this.ctx.beginPath();
      this.ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  /**
   * Create explosion effect
   * @param {number} x 
   * @param {number} y 
   * @param {number} intensity 
   * @param {Object} options 
   */
  createExplosion(x, y, intensity = 1, options = {}) {
    console.log("Calling method: createExplosion");
    const explosionOptions = {
      count: Math.floor(20 * intensity),
      ...options
    };

    // Main explosion particles
    this.createBurst(x, y, 'explosion', explosionOptions);

    // Add sparks
    this.createBurst(x, y, 'sparks', {
      count: Math.floor(15 * intensity),
      ...options
    });

    // Add smoke
    setTimeout(function () {
      this.createBurst(x, y, 'smoke', {
        count: Math.floor(10 * intensity),
        ...options
      });
    }, 100);
  }

  /**
   * Create impact effect
   * @param {number} x 
   * @param {number} y 
   * @param {string} materialType 
   * @param {Object} options 
   */
  createImpact(x, y, materialType = 'default', options = {}) {
    console.log("Calling method: createImpact");
    const impactTypes = {
      ice: 'ice_shards',
      poison: 'poison_cloud',
      lightning: 'lightning_sparks',
      blood: 'blood',
      magic: 'magic_sparkles',
      default: 'sparks'
    };
    const particleType = impactTypes[materialType] || impactTypes.default;
    this.createBurst(x, y, particleType, {
      count: 8,
      ...options
    });
  }

  /**
   * Create trail effect
   * @param {number} x 
   * @param {number} y 
   * @param {string} trailType 
   * @param {Object} options 
   */
  createTrail(x, y, trailType = 'magic', options = {}) {
    console.log("Calling method: createTrail");
    const trailOptions = {
      count: 3,
      angle: options.angle,
      speed: {
        min: 10,
        max: 30
      },
      ...options
    };
    this.createBurst(x, y, trailType === 'magic' ? 'magic_sparkles' : 'sparks', trailOptions);
  }

  /**
   * Get random value between min and max
   * @param {number} min 
   * @param {number} max 
   * @returns {number}
   */
  randomBetween(min, max) {
    console.log("Calling method: randomBetween");
    return min + Math.random() * (max - min);
  }

  /**
   * Clear all particles
   */
  clearAllParticles() {
    console.log("Calling method: clearAllParticles");
    this.particles.length = 0;
    this.emitters.clear();
    this.triggerEvent('allParticlesCleared', {});
  }

  /**
   * Set maximum particle count
   * @param {number} maxCount 
   */
  setMaxParticles(maxCount) {
    console.log("Calling method: setMaxParticles");
    this.maxParticles = maxCount;

    // Remove excess particles if needed
    if (this.particles.length > maxCount) {
      this.particles.splice(0, this.particles.length - maxCount);
    }
  }

  /**
   * Get particle count
   * @returns {number}
   */
  getParticleCount() {
    console.log("Calling method: getParticleCount");
    return this.particles.length;
  }

  /**
   * Get active emitter count
   * @returns {number}
   */
  getEmitterCount() {
    console.log("Calling method: getEmitterCount");
    return this.emitters.size;
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
    const particlesByType = {};
    this.particles.forEach(function (particle) {
      const type = particle.type || 'default';
      particlesByType[type] = (particlesByType[type] || 0) + 1;
    });
    return {
      totalParticles: this.particles.length,
      maxParticles: this.maxParticles,
      activeEmitters: this.emitters.size,
      particlesByType
    };
  }
}
/**
 * VisualFeedbackSystem.js
 * Manages visual effects, animations, and feedback for the tower defense game
 * Provides damage numbers, hit effects, UI animations, and visual indicators
 */

export class VisualFeedbackSystem {
  constructor(canvas, context, dependencies = {}) {
    console.log("Calling method: constructor");
    this.canvas = canvas;
    this.ctx = context;

    // Dependency injection - accept specific dependencies instead of full game object
    this.audioManager = dependencies.audioManager;
    this.notificationManager = dependencies.notificationManager;
    this.effects = new Map(); // effectId -> effectData
    this.animations = new Map(); // animationId -> animationData
    this.eventListeners = new Map();
    this.nextEffectId = 1;
    this.nextAnimationId = 1;
    this.damageNumbers = [];
    this.floatingTexts = [];
    this.screenShakes = [];
    this.highlights = [];
    this.initializeEffectTypes();
  }

  /**
   * Initialize visual effect types
   */
  initializeEffectTypes() {
    console.log("Calling method: initializeEffectTypes");
    this.effectTypes = {
      damage_number: {
        duration: 2000,
        fadeOut: true,
        movement: 'float_up',
        scale: 1.0
      },
      healing_number: {
        duration: 2000,
        fadeOut: true,
        movement: 'float_up',
        scale: 1.0,
        color: '#4CAF50'
      },
      critical_damage: {
        duration: 2500,
        fadeOut: true,
        movement: 'float_up',
        scale: 1.5,
        color: '#FF4444',
        bold: true
      },
      tower_placement: {
        duration: 1000,
        fadeIn: true,
        scale: 'grow',
        color: '#4CAF50'
      },
      tower_upgrade: {
        duration: 1500,
        fadeOut: true,
        scale: 'pulse',
        color: '#FFD700'
      },
      enemy_death: {
        duration: 800,
        fadeOut: true,
        scale: 'shrink',
        rotation: true
      },
      projectile_hit: {
        duration: 300,
        fadeOut: true,
        scale: 'burst'
      },
      range_indicator: {
        duration: -1,
        // Persistent until removed
        fadeIn: true,
        color: '#FFFFFF',
        alpha: 0.3
      },
      selection_highlight: {
        duration: -1,
        pulse: true,
        color: '#00FFFF',
        alpha: 0.5
      }
    };
  }

  /**
   * Show damage number at position
   * @param {number} x 
   * @param {number} y 
   * @param {number} damage 
   * @param {Object} options 
   */
  showDamageNumber(x, y, damage, options = {}) {
    console.log("Calling method: showDamageNumber");
    const {
      color = '#FF4444',
      critical = false,
      fontSize = 16,
      duration = 2000,
      playSound = true
    } = options;
    const damageNumber = {
      id: `damage_${this.nextEffectId++}`,
      x,
      y: y - 10,
      startX: x,
      startY: y - 10,
      text: Math.round(damage).toString(),
      color: critical ? '#FFD700' : color,
      fontSize: critical ? fontSize * 1.5 : fontSize,
      alpha: 1.0,
      scale: critical ? 1.2 : 1.0,
      startTime: Date.now(),
      duration,
      velocityY: -30,
      // Float upward
      critical
    };
    this.damageNumbers.push(damageNumber);

    // Play sound effect if available and requested
    if (playSound && this.audioManager) {
      const soundType = critical ? 'criticalHit' : 'hit';
      this.audioManager.playSound(soundType).catch(function (err) {
        console.warn('Could not play hit sound:', err);
      });
    }
    this.triggerEvent('damageNumberShown', {
      x,
      y,
      damage,
      critical
    });
  }

  /**
   * Show healing number at position
   * @param {number} x 
   * @param {number} y 
   * @param {number} healing 
   * @param {Object} options 
   */
  showHealingNumber(x, y, healing, options = {}) {
    console.log("Calling method: showHealingNumber");
    this.showDamageNumber(x, y, healing, {
      color: '#4CAF50',
      playSound: false,
      // Healing is usually silent
      ...options
    });
  }

  /**
   * Show floating text
   * @param {number} x 
   * @param {number} y 
   * @param {string} text 
   * @param {Object} options 
   */
  showFloatingText(x, y, text, options = {}) {
    console.log("Calling method: showFloatingText");
    const {
      color = '#FFFFFF',
      fontSize = 14,
      duration = 3000,
      movement = 'float_up',
      showNotification = false
    } = options;
    const floatingText = {
      id: `text_${this.nextEffectId++}`,
      x,
      y,
      startX: x,
      startY: y,
      text,
      color,
      fontSize,
      alpha: 1.0,
      scale: 1.0,
      startTime: Date.now(),
      duration,
      movement,
      velocityY: movement === 'float_up' ? -20 : 0,
      velocityX: movement === 'float_right' ? 20 : 0
    };
    this.floatingTexts.push(floatingText);

    // Optionally show as notification as well
    if (showNotification && this.notificationManager) {
      this.notificationManager.showMessage(text, 'info');
    }
  }

  /**
   * Create screen shake effect
   * @param {number} intensity 
   * @param {number} duration 
   * @param {Object} options
   */
  createScreenShake(intensity = 5, duration = 300, options = {}) {
    console.log("Calling method: createScreenShake");
    const {
      playSound = true
    } = options;
    const shake = {
      id: `shake_${this.nextEffectId++}`,
      intensity,
      duration,
      startTime: Date.now(),
      offsetX: 0,
      offsetY: 0
    };
    this.screenShakes.push(shake);

    // Play explosion/impact sound if available
    if (playSound && this.audioManager) {
      this.audioManager.playSound('explosion').catch(function (err) {
        console.warn('Could not play explosion sound:', err);
      });
    }
  }

  /**
   * Highlight entity with visual effect
   * @param {string} entityId 
   * @param {number} x 
   * @param {number} y 
   * @param {number} radius 
   * @param {Object} options 
   */
  highlightEntity(entityId, x, y, radius, options = {}) {
    console.log("Calling method: highlightEntity");
    const {
      color = '#00FFFF',
      alpha = 0.5,
      pulse = true,
      duration = -1 // Persistent
    } = options;

    // Remove existing highlight for this entity
    this.removeHighlight(entityId);
    const highlight = {
      id: `highlight_${entityId}`,
      entityId,
      x,
      y,
      radius,
      color,
      alpha,
      maxAlpha: alpha,
      pulse,
      duration,
      startTime: Date.now(),
      pulsePhase: 0
    };
    this.highlights.push(highlight);
  }

  /**
   * Remove highlight from entity
   * @param {string} entityId 
   */
  removeHighlight(entityId) {
    console.log("Calling method: removeHighlight");
    this.highlights = this.highlights.filter(function (h) {
      return h.entityId !== entityId;
    });
  }

  /**
   * Show range indicator for tower
   * @param {number} x 
   * @param {number} y 
   * @param {number} range 
   * @param {Object} options 
   */
  showRangeIndicator(x, y, range, options = {}) {
    console.log("Calling method: showRangeIndicator");
    const {
      color = '#FFFFFF',
      alpha = 0.3,
      lineWidth = 2
    } = options;
    const indicator = {
      id: `range_${this.nextEffectId++}`,
      x,
      y,
      range,
      color,
      alpha,
      lineWidth,
      startTime: Date.now(),
      fadeIn: true,
      currentAlpha: 0
    };
    this.effects.set(indicator.id, indicator);
    return indicator.id;
  }

  /**
   * Remove range indicator
   * @param {string} indicatorId 
   */
  removeRangeIndicator(indicatorId) {
    console.log("Calling method: removeRangeIndicator");
    this.effects.delete(indicatorId);
  }

  /**
   * Create explosion effect
   * @param {number} x 
   * @param {number} y 
   * @param {number} radius 
   * @param {Object} options 
   */
  createExplosion(x, y, radius, options = {}) {
    console.log("Calling method: createExplosion");
    const {
      color = '#FF6600',
      duration = 500,
      particles = 20,
      playSound = true,
      shakeScreen = true
    } = options;
    const explosion = {
      id: `explosion_${this.nextEffectId++}`,
      x,
      y,
      radius,
      maxRadius: radius,
      color,
      duration,
      startTime: Date.now(),
      alpha: 1.0,
      particles: []
    };

    // Create explosion particles
    for (let i = 0; i < particles; i++) {
      const angle = Math.PI * 2 * i / particles;
      const speed = 50 + Math.random() * 100;
      explosion.particles.push({
        x,
        y,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        size: 2 + Math.random() * 4,
        alpha: 1.0,
        color: this.randomizeColor(color)
      });
    }
    this.effects.set(explosion.id, explosion);

    // Create screen shake effect
    if (shakeScreen) {
      const shakeIntensity = Math.min(radius * 0.3, 15);
      this.createScreenShake(shakeIntensity, duration * 0.6, {
        playSound
      });
    } else if (playSound && this.audioManager) {
      this.audioManager.playSound('explosion').catch(function (err) {
        console.warn('Could not play explosion sound:', err);
      });
    }
  }

  /**
   * Create impact effect
   * @param {number} x 
   * @param {number} y 
   * @param {Object} options 
   */
  createImpactEffect(x, y, options = {}) {
    console.log("Calling method: createImpactEffect");
    const {
      size = 20,
      color = '#FFFFFF',
      duration = 200
    } = options;
    const impact = {
      id: `impact_${this.nextEffectId++}`,
      x,
      y,
      size,
      maxSize: size,
      color,
      duration,
      startTime: Date.now(),
      alpha: 1.0,
      scale: 0.1
    };
    this.effects.set(impact.id, impact);
  }

  /**
   * Create muzzle flash effect
   * @param {number} x 
   * @param {number} y 
   * @param {number} angle 
   * @param {Object} options 
   */
  createMuzzleFlash(x, y, angle, options = {}) {
    console.log("Calling method: createMuzzleFlash");
    const {
      size = 15,
      color = '#FFFF00',
      duration = 100
    } = options;
    const flash = {
      id: `muzzle_${this.nextEffectId++}`,
      x,
      y,
      angle,
      size,
      color,
      duration,
      startTime: Date.now(),
      alpha: 1.0
    };
    this.effects.set(flash.id, flash);
  }

  /**
   * Create trail effect for projectiles
   * @param {Array} trailPoints 
   * @param {Object} options 
   */
  createTrailEffect(trailPoints, options = {}) {
    console.log("Calling method: createTrailEffect");
    const {
      color = '#FFFFFF',
      width = 3,
      fadeTime = 500
    } = options;
    const trail = {
      id: `trail_${this.nextEffectId++}`,
      points: [...trailPoints],
      color,
      width,
      fadeTime,
      startTime: Date.now(),
      alpha: 1.0
    };
    this.effects.set(trail.id, trail);
  }

  /**
   * Update all visual effects
   * @param {number} deltaTime 
   */
  update(deltaTime) {
    console.log("Calling method: update");
    const currentTime = Date.now();
    this.updateDamageNumbers(currentTime, deltaTime);
    this.updateFloatingTexts(currentTime, deltaTime);
    this.updateScreenShakes(currentTime, deltaTime);
    this.updateHighlights(currentTime, deltaTime);
    this.updateEffects(currentTime, deltaTime);
  }

  /**
   * Update damage numbers
   * @param {number} currentTime 
   * @param {number} deltaTime 
   */
  updateDamageNumbers(currentTime, deltaTime) {
    console.log("Calling method: updateDamageNumbers");
    this.damageNumbers = this.damageNumbers.filter(function (number) {
      const elapsed = currentTime - number.startTime;
      const progress = elapsed / number.duration;
      if (progress >= 1) return false;

      // Update position
      number.y += number.velocityY * deltaTime * 0.001;

      // Update alpha (fade out)
      number.alpha = 1 - progress;

      // Update scale for critical hits
      if (number.critical) {
        number.scale = 1.2 + Math.sin(elapsed * 0.01) * 0.1;
      }
      return true;
    });
  }

  /**
   * Update floating texts
   * @param {number} currentTime 
   * @param {number} deltaTime 
   */
  updateFloatingTexts(currentTime, deltaTime) {
    console.log("Calling method: updateFloatingTexts");
    this.floatingTexts = this.floatingTexts.filter(function (text) {
      const elapsed = currentTime - text.startTime;
      const progress = elapsed / text.duration;
      if (progress >= 1) return false;

      // Update position
      text.x += text.velocityX * deltaTime * 0.001;
      text.y += text.velocityY * deltaTime * 0.001;

      // Update alpha
      text.alpha = 1 - progress;
      return true;
    });
  }

  /**
   * Update screen shakes
   * @param {number} currentTime 
   * @param {number} deltaTime 
   */
  updateScreenShakes(currentTime, deltaTime) {
    console.log("Calling method: updateScreenShakes");
    this.screenShakes = this.screenShakes.filter(function (shake) {
      const elapsed = currentTime - shake.startTime;
      const progress = elapsed / shake.duration;
      if (progress >= 1) {
        shake.offsetX = 0;
        shake.offsetY = 0;
        return false;
      }

      // Calculate shake intensity (decreases over time)
      const intensity = shake.intensity * (1 - progress);

      // Random shake offset
      shake.offsetX = (Math.random() - 0.5) * intensity * 2;
      shake.offsetY = (Math.random() - 0.5) * intensity * 2;
      return true;
    });
  }

  /**
   * Update highlights
   * @param {number} currentTime 
   * @param {number} deltaTime 
   */
  updateHighlights(currentTime, deltaTime) {
    console.log("Calling method: updateHighlights");
    this.highlights = this.highlights.filter(function (highlight) {
      const elapsed = currentTime - highlight.startTime;

      // Check duration
      if (highlight.duration > 0 && elapsed >= highlight.duration) {
        return false;
      }

      // Update pulse effect
      if (highlight.pulse) {
        highlight.pulsePhase += deltaTime * 0.003;
        highlight.alpha = highlight.maxAlpha * (0.5 + 0.5 * Math.sin(highlight.pulsePhase));
      }
      return true;
    });
  }

  /**
   * Update effects
   * @param {number} currentTime 
   * @param {number} deltaTime 
   */
  updateEffects(currentTime, deltaTime) {
    console.log("Calling method: updateEffects");
    const effectsToRemove = [];
    this.effects.forEach(function (effect, effectId) {
      const elapsed = currentTime - effect.startTime;
      const progress = effect.duration > 0 ? elapsed / effect.duration : 0;

      // Check if effect should be removed
      if (effect.duration > 0 && progress >= 1) {
        effectsToRemove.push(effectId);
        return;
      }

      // Update effect based on type
      this.updateEffect(effect, progress, deltaTime);
    });

    // Remove expired effects
    effectsToRemove.forEach(function (id) {
      return this.effects.delete(id);
    });
  }

  /**
   * Update individual effect
   * @param {Object} effect 
   * @param {number} progress 
   * @param {number} deltaTime 
   */
  updateEffect(effect, progress, deltaTime) {
    console.log("Calling method: updateEffect");
    switch (effect.id.split('_')[0]) {
      case 'explosion':
        this.updateExplosion(effect, progress, deltaTime);
        break;
      case 'impact':
        this.updateImpact(effect, progress, deltaTime);
        break;
      case 'muzzle':
        this.updateMuzzleFlash(effect, progress, deltaTime);
        break;
      case 'trail':
        this.updateTrail(effect, progress, deltaTime);
        break;
      case 'range':
        this.updateRangeIndicator(effect, progress, deltaTime);
        break;
    }
  }

  /**
   * Update explosion effect
   * @param {Object} explosion 
   * @param {number} progress 
   * @param {number} deltaTime 
   */
  updateExplosion(explosion, progress, deltaTime) {
    console.log("Calling method: updateExplosion");
    explosion.radius = explosion.maxRadius * progress;
    explosion.alpha = 1 - progress;

    // Update particles
    explosion.particles.forEach(function (particle) {
      particle.x += particle.velocityX * deltaTime * 0.001;
      particle.y += particle.velocityY * deltaTime * 0.001;
      particle.alpha = 1 - progress;
      particle.size *= 0.999; // Shrink over time
    });
  }

  /**
   * Update impact effect
   * @param {Object} impact 
   * @param {number} progress 
   * @param {number} deltaTime 
   */
  updateImpact(impact, progress, deltaTime) {
    console.log("Calling method: updateImpact");
    impact.scale = Math.min(1, progress * 3); // Quick scale up
    impact.alpha = 1 - progress;
  }

  /**
   * Update muzzle flash
   * @param {Object} flash 
   * @param {number} progress 
   * @param {number} deltaTime 
   */
  updateMuzzleFlash(flash, progress, deltaTime) {
    console.log("Calling method: updateMuzzleFlash");
    flash.alpha = 1 - progress;
    flash.size *= 0.95; // Shrink quickly
  }

  /**
   * Update trail effect
   * @param {Object} trail 
   * @param {number} progress 
   * @param {number} deltaTime 
   */
  updateTrail(trail, progress, deltaTime) {
    console.log("Calling method: updateTrail");
    trail.alpha = 1 - progress;

    // Remove old trail points
    const currentTime = Date.now();
    trail.points = trail.points.filter(function (point) {
      return currentTime - point.time < trail.fadeTime;
    });
  }

  /**
   * Update range indicator
   * @param {Object} indicator 
   * @param {number} progress 
   * @param {number} deltaTime 
   */
  updateRangeIndicator(indicator, progress, deltaTime) {
    console.log("Calling method: updateRangeIndicator");
    if (indicator.fadeIn && indicator.currentAlpha < indicator.alpha) {
      indicator.currentAlpha = Math.min(indicator.alpha, indicator.currentAlpha + deltaTime * 0.002);
    }
  }

  /**
   * Render all visual effects
   */
  render() {
    console.log("Calling method: render");
    if (!this.ctx) return;
    this.ctx.save();

    // Apply screen shake
    this.applyScreenShake();

    // Render effects in order
    this.renderRangeIndicators();
    this.renderHighlights();
    this.renderEffects();
    this.renderDamageNumbers();
    this.renderFloatingTexts();
    this.ctx.restore();
  }

  /**
   * Apply screen shake offset
   */
  applyScreenShake() {
    console.log("Calling method: applyScreenShake");
    let totalOffsetX = 0;
    let totalOffsetY = 0;
    this.screenShakes.forEach(function (shake) {
      totalOffsetX += shake.offsetX;
      totalOffsetY += shake.offsetY;
    });
    if (totalOffsetX !== 0 || totalOffsetY !== 0) {
      this.ctx.translate(totalOffsetX, totalOffsetY);
    }
  }

  /**
   * Render range indicators
   */
  renderRangeIndicators() {
    console.log("Calling method: renderRangeIndicators");
    this.effects.forEach(function (effect) {
      if (effect.id.startsWith('range_')) {
        this.ctx.save();
        this.ctx.globalAlpha = effect.currentAlpha || effect.alpha;
        this.ctx.strokeStyle = effect.color;
        this.ctx.lineWidth = effect.lineWidth;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.arc(effect.x, effect.y, effect.range, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.restore();
      }
    });
  }

  /**
   * Render highlights
   */
  renderHighlights() {
    console.log("Calling method: renderHighlights");
    this.highlights.forEach(function (highlight) {
      this.ctx.save();
      this.ctx.globalAlpha = highlight.alpha;
      this.ctx.strokeStyle = highlight.color;
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(highlight.x, highlight.y, highlight.radius, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();
    });
  }

  /**
   * Render all effects
   */
  renderEffects() {
    console.log("Calling method: renderEffects");
    this.effects.forEach(function (effect) {
      this.ctx.save();
      this.ctx.globalAlpha = effect.alpha;
      switch (effect.id.split('_')[0]) {
        case 'explosion':
          this.renderExplosion(effect);
          break;
        case 'impact':
          this.renderImpact(effect);
          break;
        case 'muzzle':
          this.renderMuzzleFlash(effect);
          break;
        case 'trail':
          this.renderTrail(effect);
          break;
      }
      this.ctx.restore();
    });
  }

  /**
   * Render explosion effect
   * @param {Object} explosion 
   */
  renderExplosion(explosion) {
    console.log("Calling method: renderExplosion");
    // Render main explosion circle
    this.ctx.fillStyle = explosion.color;
    this.ctx.beginPath();
    this.ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
    this.ctx.fill();

    // Render particles
    explosion.particles.forEach(function (particle) {
      this.ctx.save();
      this.ctx.globalAlpha = particle.alpha;
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
  }

  /**
   * Render impact effect
   * @param {Object} impact 
   */
  renderImpact(impact) {
    console.log("Calling method: renderImpact");
    this.ctx.save();
    this.ctx.translate(impact.x, impact.y);
    this.ctx.scale(impact.scale, impact.scale);
    this.ctx.strokeStyle = impact.color;
    this.ctx.lineWidth = 3;

    // Draw impact burst lines
    for (let i = 0; i < 8; i++) {
      const angle = Math.PI * 2 * i / 8;
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(Math.cos(angle) * impact.size, Math.sin(angle) * impact.size);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  /**
   * Render muzzle flash
   * @param {Object} flash 
   */
  renderMuzzleFlash(flash) {
    console.log("Calling method: renderMuzzleFlash");
    this.ctx.save();
    this.ctx.translate(flash.x, flash.y);
    this.ctx.rotate(flash.angle);
    this.ctx.fillStyle = flash.color;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, flash.size, flash.size * 0.3, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  /**
   * Render trail effect
   * @param {Object} trail 
   */
  renderTrail(trail) {
    console.log("Calling method: renderTrail");
    if (trail.points.length < 2) return;
    this.ctx.strokeStyle = trail.color;
    this.ctx.lineWidth = trail.width;
    this.ctx.lineCap = 'round';
    this.ctx.beginPath();
    this.ctx.moveTo(trail.points[0].x, trail.points[0].y);
    for (let i = 1; i < trail.points.length; i++) {
      this.ctx.lineTo(trail.points[i].x, trail.points[i].y);
    }
    this.ctx.stroke();
  }

  /**
   * Render damage numbers
   */
  renderDamageNumbers() {
    console.log("Calling method: renderDamageNumbers");
    this.damageNumbers.forEach(function (number) {
      this.ctx.save();
      this.ctx.globalAlpha = number.alpha;
      this.ctx.fillStyle = number.color;
      this.ctx.font = `${number.critical ? 'bold ' : ''}${number.fontSize}px Arial`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      if (number.critical) {
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2;
        this.ctx.strokeText(number.text, number.x, number.y);
      }
      this.ctx.fillText(number.text, number.x, number.y);
      this.ctx.restore();
    });
  }

  /**
   * Render floating texts
   */
  renderFloatingTexts() {
    console.log("Calling method: renderFloatingTexts");
    this.floatingTexts.forEach(function (text) {
      this.ctx.save();
      this.ctx.globalAlpha = text.alpha;
      this.ctx.fillStyle = text.color;
      this.ctx.font = `${text.fontSize}px Arial`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(text.text, text.x, text.y);
      this.ctx.restore();
    });
  }

  /**
   * Randomize color for particles
   * @param {string} baseColor 
   * @returns {string}
   */
  randomizeColor(baseColor) {
    console.log("Calling method: randomizeColor");
    // Simple color randomization
    const colors = [baseColor, '#FF8800', '#FFAA00', '#FF6600'];
    return colors[Math.floor(Math.random() * colors.length)];
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
   * Clear all effects
   */
  clearAllEffects() {
    console.log("Calling method: clearAllEffects");
    this.effects.clear();
    this.damageNumbers.length = 0;
    this.floatingTexts.length = 0;
    this.screenShakes.length = 0;
    this.highlights.length = 0;
  }

  /**
   * Get system statistics
   * @returns {Object}
   */
  getSystemStats() {
    console.log("Calling method: getSystemStats");
    return {
      totalEffects: this.effects.size,
      damageNumbers: this.damageNumbers.length,
      floatingTexts: this.floatingTexts.length,
      screenShakes: this.screenShakes.length,
      highlights: this.highlights.length
    };
  }
}
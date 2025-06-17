// EnemyUIManager.js - Refactored for ES6 Modules and Dependency Injection

export class EnemyUIManager {
  constructor({
    camera,
    renderer,
    gameContainer
  } = {}) {
    console.log("Calling method: constructor");
    // Dependencies injected via constructor instead of global window access
    this.camera = camera;
    this.renderer = renderer;
    this.gameContainer = gameContainer;
    this.healthBars = new Map();
    this.statusIndicators = new Map();
    this.damageNumbers = [];

    // UI settings
    this.healthBarWidth = 40;
    this.healthBarHeight = 6;
    this.healthBarOffset = 2.5; // Height above enemy
    this.showHealthBars = true;
    this.showDamageNumbers = true;
    this.showStatusEffects = true;

    // Damage number settings
    this.damageNumberDuration = 1500;
    this.damageNumberSpeed = 50; // pixels per second upward

    // Performance settings
    this.maxHealthBars = 50;
    this.maxDamageNumbers = 20;

    // Container for UI elements
    this.uiContainer = null;
    this.initContainer();
    console.log('EnemyUIManager initialized');
  }

  // Method to update dependencies if they become available later
  updateDependencies({
    camera,
    renderer,
    gameContainer
  }) {
    console.log("Calling method: updateDependencies");
    if (camera) this.camera = camera;
    if (renderer) this.renderer = renderer;
    if (gameContainer) this.gameContainer = gameContainer;
  }
  initContainer() {
    console.log("Calling method: initContainer");
    // Create or find UI container - prefer injected container over global DOM access
    if (this.gameContainer) {
      this.uiContainer = this.gameContainer.querySelector('#enemyUI');
    } else {
      this.uiContainer = document.getElementById('enemyUI');
    }
    if (!this.uiContainer) {
      this.uiContainer = document.createElement('div');
      this.uiContainer.id = 'enemyUI';
      this.uiContainer.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 50;
            `;
      const targetContainer = this.gameContainer || document.body;
      targetContainer.appendChild(this.uiContainer);
    }
  }

  // Main update method
  update(enemies) {
    console.log("Calling method: update");
    if (!this.showHealthBars && !this.showDamageNumbers && !this.showStatusEffects) {
      return;
    }

    // Update health bars
    if (this.showHealthBars) {
      this.updateHealthBars(enemies);
    }

    // Update status indicators
    if (this.showStatusEffects) {
      this.updateStatusIndicators(enemies);
    }

    // Update damage numbers
    if (this.showDamageNumbers) {
      this.updateDamageNumbers();
    }

    // Clean up unused elements
    this.cleanupUnusedElements(enemies);
  }

  // Health bar management
  updateHealthBars(enemies) {
    console.log("Calling method: updateHealthBars");
    enemies.forEach(function (enemy) {
      if (!enemy.mesh || enemy.isDead) return;
      let healthBar = this.healthBars.get(enemy.id);
      if (!healthBar) {
        healthBar = this.createHealthBar(enemy);
        this.healthBars.set(enemy.id, healthBar);
      }
      this.updateHealthBarPosition(enemy, healthBar);
      this.updateHealthBarValue(enemy, healthBar);
      this.updateHealthBarVisibility(enemy, healthBar);
    });
  }
  createHealthBar(enemy) {
    console.log("Calling method: createHealthBar");
    const healthBar = document.createElement('div');
    healthBar.className = 'enemy-health-bar';
    healthBar.style.cssText = `
            position: absolute;
            width: ${this.healthBarWidth}px;
            height: ${this.healthBarHeight}px;
            background: rgba(255, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.8);
            border-radius: 3px;
            overflow: hidden;
            z-index: 51;
            transform-origin: center;
        `;

    // Create health fill
    const healthFill = document.createElement('div');
    healthFill.className = 'enemy-health-fill';
    healthFill.style.cssText = `
            height: 100%;
            background: linear-gradient(90deg, #ff4444, #ff6666);
            border-radius: 2px;
            transition: width 0.3s ease;
            width: 100%;
        `;
    healthBar.appendChild(healthFill);

    // Add enemy type indicator
    const typeIndicator = document.createElement('div');
    typeIndicator.style.cssText = `
            position: absolute;
            top: -15px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 10px;
            color: white;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
            white-space: nowrap;
        `;
    typeIndicator.textContent = this.getEnemyTypeIcon(enemy.type);
    healthBar.appendChild(typeIndicator);
    this.uiContainer.appendChild(healthBar);
    return {
      element: healthBar,
      fill: healthFill,
      typeIndicator: typeIndicator,
      lastHealth: enemy.health,
      lastMaxHealth: enemy.maxHealth
    };
  }
  updateHealthBarPosition(enemy, healthBar) {
    console.log("Calling method: updateHealthBarPosition");
    // Use injected dependencies instead of global window access
    if (!enemy.mesh || !this.camera || !this.renderer) return;

    // Get enemy world position
    const enemyPosition = enemy.mesh.position.clone();
    enemyPosition.y += this.healthBarOffset;

    // Project to screen coordinates
    const screenPosition = enemyPosition.clone().project(this.camera);

    // Convert to pixel coordinates
    const canvas = this.renderer.domElement;
    const rect = canvas.getBoundingClientRect();
    const x = (screenPosition.x * 0.5 + 0.5) * rect.width + rect.left;
    const y = (-screenPosition.y * 0.5 + 0.5) * rect.height + rect.top;

    // Position health bar
    healthBar.element.style.left = x - this.healthBarWidth / 2 + 'px';
    healthBar.element.style.top = y - this.healthBarHeight / 2 + 'px';

    // Scale based on distance
    const distance = this.camera.position.distanceTo(enemy.mesh.position);
    const scale = Math.max(0.5, Math.min(1.5, 20 / distance));
    healthBar.element.style.transform = `scale(${scale})`;
  }
  updateHealthBarValue(enemy, healthBar) {
    console.log("Calling method: updateHealthBarValue");
    const healthPercent = enemy.maxHealth > 0 ? enemy.health / enemy.maxHealth * 100 : 0;

    // Update fill width
    healthBar.fill.style.width = healthPercent + '%';

    // Update color based on health percentage
    if (healthPercent > 60) {
      healthBar.fill.style.background = 'linear-gradient(90deg, #44ff44, #66ff66)';
    } else if (healthPercent > 30) {
      healthBar.fill.style.background = 'linear-gradient(90deg, #ffaa44, #ffcc66)';
    } else {
      healthBar.fill.style.background = 'linear-gradient(90deg, #ff4444, #ff6666)';
    }

    // Trigger damage animation if health decreased
    if (enemy.health < healthBar.lastHealth) {
      this.triggerHealthBarDamageEffect(healthBar);

      // Show damage number
      if (this.showDamageNumbers) {
        const damage = healthBar.lastHealth - enemy.health;
        this.showDamageNumber(enemy, damage);
      }
    }

    // Update stored values
    healthBar.lastHealth = enemy.health;
    healthBar.lastMaxHealth = enemy.maxHealth;
  }
  updateHealthBarVisibility(enemy, healthBar) {
    console.log("Calling method: updateHealthBarVisibility");
    // Hide health bar if enemy is at full health (optional)
    const isFullHealth = enemy.health >= enemy.maxHealth;
    const shouldHide = isFullHealth && this.hideFullHealthBars;
    healthBar.element.style.display = shouldHide ? 'none' : 'block';

    // Fade out if enemy is dying
    if (enemy.isDead || enemy.health <= 0) {
      healthBar.element.style.opacity = '0';
      healthBar.element.style.transition = 'opacity 0.5s ease-out';
    } else {
      healthBar.element.style.opacity = '1';
    }
  }
  triggerHealthBarDamageEffect(healthBar) {
    console.log("Calling method: triggerHealthBarDamageEffect");
    // Flash effect
    healthBar.element.style.boxShadow = '0 0 10px #ff4444';
    healthBar.element.style.transform += ' scale(1.1)';
    setTimeout(function () {
      healthBar.element.style.boxShadow = '';
      healthBar.element.style.transform = healthBar.element.style.transform.replace(' scale(1.1)', '');
    }, 200);
  }

  // Status indicator management
  updateStatusIndicators(enemies) {
    console.log("Calling method: updateStatusIndicators");
    enemies.forEach(function (enemy) {
      if (!enemy.mesh || enemy.isDead) return;
      let statusIndicator = this.statusIndicators.get(enemy.id);
      if (enemy.statusEffects && enemy.statusEffects.length > 0) {
        if (!statusIndicator) {
          statusIndicator = this.createStatusIndicator(enemy);
          this.statusIndicators.set(enemy.id, statusIndicator);
        }
        this.updateStatusIndicatorPosition(enemy, statusIndicator);
        this.updateStatusIndicatorEffects(enemy, statusIndicator);
      } else if (statusIndicator) {
        // Remove status indicator if no effects
        this.removeStatusIndicator(enemy.id);
      }
    });
  }
  createStatusIndicator(enemy) {
    console.log("Calling method: createStatusIndicator");
    const indicator = document.createElement('div');
    indicator.className = 'enemy-status-indicator';
    indicator.style.cssText = `
            position: absolute;
            display: flex;
            gap: 2px;
            z-index: 52;
            transform-origin: center;
        `;
    this.uiContainer.appendChild(indicator);
    return {
      element: indicator,
      effects: new Map()
    };
  }
  updateStatusIndicatorPosition(enemy, statusIndicator) {
    console.log("Calling method: updateStatusIndicatorPosition");
    // Use injected dependencies instead of global window access
    if (!enemy.mesh || !this.camera || !this.renderer) return;

    // Position above health bar
    const enemyPosition = enemy.mesh.position.clone();
    enemyPosition.y += this.healthBarOffset + 0.8;
    const screenPosition = enemyPosition.clone().project(this.camera);
    const canvas = this.renderer.domElement;
    const rect = canvas.getBoundingClientRect();
    const x = (screenPosition.x * 0.5 + 0.5) * rect.width + rect.left;
    const y = (-screenPosition.y * 0.5 + 0.5) * rect.height + rect.top;
    statusIndicator.element.style.left = x - 20 + 'px'; // Center roughly
    statusIndicator.element.style.top = y + 'px';

    // Scale based on distance
    const distance = this.camera.position.distanceTo(enemy.mesh.position);
    const scale = Math.max(0.5, Math.min(1.2, 15 / distance));
    statusIndicator.element.style.transform = `scale(${scale})`;
  }
  updateStatusIndicatorEffects(enemy, statusIndicator) {
    console.log("Calling method: updateStatusIndicatorEffects");
    const currentEffects = new Set();

    // Add current status effects
    if (enemy.statusEffects) {
      enemy.statusEffects.forEach(function (effect) {
        currentEffects.add(effect.type);
        if (!statusIndicator.effects.has(effect.type)) {
          const effectElement = this.createStatusEffectElement(effect);
          statusIndicator.effects.set(effect.type, effectElement);
          statusIndicator.element.appendChild(effectElement);
        }
      });
    }

    // Remove expired effects
    for (const [effectType, effectElement] of statusIndicator.effects) {
      if (!currentEffects.has(effectType)) {
        statusIndicator.element.removeChild(effectElement);
        statusIndicator.effects.delete(effectType);
      }
    }
  }
  createStatusEffectElement(effect) {
    console.log("Calling method: createStatusEffectElement");
    const element = document.createElement('div');
    element.style.cssText = `
            width: 12px;
            height: 12px;
            border-radius: 50%;
            font-size: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.8);
            animation: statusPulse 1s ease-in-out infinite;
        `;

    // Set effect-specific styling
    switch (effect.type) {
      case 'slow':
        element.style.background = '#4FC3F7';
        element.textContent = '❄️';
        break;
      case 'poison':
        element.style.background = '#8BC34A';
        element.textContent = '☠️';
        break;
      case 'burn':
        element.style.background = '#FF5722';
        element.textContent = '🔥';
        break;
      case 'stun':
        element.style.background = '#FFC107';
        element.textContent = '⚡';
        break;
      default:
        element.style.background = '#9E9E9E';
        element.textContent = '?';
    }
    return element;
  }

  // Damage number management
  showDamageNumber(enemy, damage, type = 'normal') {
    console.log("Calling method: showDamageNumber");
    // Use injected dependencies instead of global window access
    if (!enemy.mesh || !this.camera || !this.renderer) return;

    // Limit number of damage numbers
    if (this.damageNumbers.length >= this.maxDamageNumbers) {
      const oldest = this.damageNumbers.shift();
      if (oldest.element.parentNode) {
        oldest.element.parentNode.removeChild(oldest.element);
      }
    }
    const damageNumber = this.createDamageNumber(enemy, damage, type);
    this.damageNumbers.push(damageNumber);
  }
  createDamageNumber(enemy, damage, type) {
    console.log("Calling method: createDamageNumber");
    const element = document.createElement('div');
    element.className = 'damage-number';

    // Base styling
    element.style.cssText = `
            position: absolute;
            font-size: 14px;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
            pointer-events: none;
            z-index: 60;
            animation: damageNumberFloat ${this.damageNumberDuration}ms ease-out forwards;
        `;

    // Type-specific styling
    switch (type) {
      case 'critical':
        element.style.color = '#FFD700';
        element.style.fontSize = '18px';
        element.textContent = damage + '!';
        break;
      case 'heal':
        element.style.color = '#4CAF50';
        element.textContent = '+' + damage;
        break;
      default:
        element.style.color = '#FF4444';
        element.textContent = damage;
    }

    // Position at enemy location
    this.positionDamageNumber(enemy, element);
    this.uiContainer.appendChild(element);

    // Create damage number object
    const damageNumberObj = {
      element: element,
      startTime: Date.now(),
      duration: this.damageNumberDuration,
      enemy: enemy,
      startY: parseFloat(element.style.top)
    };

    // Remove after duration
    setTimeout(function () {
      this.removeDamageNumber(damageNumberObj);
    }, this.damageNumberDuration);
    return damageNumberObj;
  }
  positionDamageNumber(enemy, element) {
    console.log("Calling method: positionDamageNumber");
    // Use injected dependencies instead of global window access
    if (!enemy.mesh || !this.camera || !this.renderer) return;
    const enemyPosition = enemy.mesh.position.clone();
    enemyPosition.y += 1.5; // Above enemy

    const screenPosition = enemyPosition.clone().project(this.camera);
    const canvas = this.renderer.domElement;
    const rect = canvas.getBoundingClientRect();
    const x = (screenPosition.x * 0.5 + 0.5) * rect.width + rect.left;
    const y = (-screenPosition.y * 0.5 + 0.5) * rect.height + rect.top;

    // Add some randomness to avoid overlap
    const offsetX = (Math.random() - 0.5) * 40;
    const offsetY = (Math.random() - 0.5) * 20;
    element.style.left = x + offsetX + 'px';
    element.style.top = y + offsetY + 'px';
  }
  updateDamageNumbers() {
    console.log("Calling method: updateDamageNumbers");
    const now = Date.now();
    this.damageNumbers.forEach(function (damageNumber) {
      const elapsed = now - damageNumber.startTime;
      const progress = elapsed / damageNumber.duration;
      if (progress >= 1) {
        this.removeDamageNumber(damageNumber);
        return;
      }

      // Update position (float upward)
      const currentY = damageNumber.startY - this.damageNumberSpeed * elapsed / 1000;
      damageNumber.element.style.top = currentY + 'px';

      // Update opacity (fade out)
      const opacity = 1 - progress;
      damageNumber.element.style.opacity = opacity;
    });

    // Remove finished damage numbers
    this.damageNumbers = this.damageNumbers.filter(function (dn) {
      const elapsed = now - dn.startTime;
      return elapsed < dn.duration;
    });
  }
  removeDamageNumber(damageNumber) {
    console.log("Calling method: removeDamageNumber");
    if (damageNumber.element && damageNumber.element.parentNode) {
      damageNumber.element.parentNode.removeChild(damageNumber.element);
    }
    const index = this.damageNumbers.indexOf(damageNumber);
    if (index > -1) {
      this.damageNumbers.splice(index, 1);
    }
  }

  // Cleanup methods
  cleanupUnusedElements(enemies) {
    console.log("Calling method: cleanupUnusedElements");
    const activeEnemyIds = new Set(enemies.map(function (enemy) {
      return enemy.id;
    }));

    // Clean up health bars
    for (const [enemyId, healthBar] of this.healthBars) {
      if (!activeEnemyIds.has(enemyId)) {
        this.removeHealthBar(enemyId);
      }
    }

    // Clean up status indicators
    for (const [enemyId, statusIndicator] of this.statusIndicators) {
      if (!activeEnemyIds.has(enemyId)) {
        this.removeStatusIndicator(enemyId);
      }
    }
  }
  removeHealthBar(enemyId) {
    console.log("Calling method: removeHealthBar");
    const healthBar = this.healthBars.get(enemyId);
    if (healthBar && healthBar.element.parentNode) {
      healthBar.element.parentNode.removeChild(healthBar.element);
    }
    this.healthBars.delete(enemyId);
  }
  removeStatusIndicator(enemyId) {
    console.log("Calling method: removeStatusIndicator");
    const statusIndicator = this.statusIndicators.get(enemyId);
    if (statusIndicator && statusIndicator.element.parentNode) {
      statusIndicator.element.parentNode.removeChild(statusIndicator.element);
    }
    this.statusIndicators.delete(enemyId);
  }

  // Utility methods
  getEnemyTypeIcon(enemyType) {
    console.log("Calling method: getEnemyTypeIcon");
    const icons = {
      basic: '👾',
      fast: '💨',
      heavy: '🛡️',
      flying: '🦅',
      boss: '👹'
    };
    return icons[enemyType] || '👾';
  }

  // Settings
  setHealthBarVisibility(visible) {
    console.log("Calling method: setHealthBarVisibility");
    this.showHealthBars = visible;
    if (!visible) {
      this.healthBars.forEach(function (healthBar, enemyId) {
        this.removeHealthBar(enemyId);
      });
    }
  }
  setDamageNumberVisibility(visible) {
    console.log("Calling method: setDamageNumberVisibility");
    this.showDamageNumbers = visible;
    if (!visible) {
      this.damageNumbers.forEach(function (damageNumber) {
        this.removeDamageNumber(damageNumber);
      });
    }
  }
  setStatusEffectVisibility(visible) {
    console.log("Calling method: setStatusEffectVisibility");
    this.showStatusEffects = visible;
    if (!visible) {
      this.statusIndicators.forEach(function (indicator, enemyId) {
        this.removeStatusIndicator(enemyId);
      });
    }
  }

  // Cleanup
  dispose() {
    console.log("Calling method: dispose");
    // Remove all health bars
    this.healthBars.forEach(function (healthBar, enemyId) {
      this.removeHealthBar(enemyId);
    });

    // Remove all status indicators
    this.statusIndicators.forEach(function (indicator, enemyId) {
      this.removeStatusIndicator(enemyId);
    });

    // Remove all damage numbers
    this.damageNumbers.forEach(function (damageNumber) {
      this.removeDamageNumber(damageNumber);
    });

    // Remove container
    if (this.uiContainer && this.uiContainer.parentNode) {
      this.uiContainer.parentNode.removeChild(this.uiContainer);
    }
  }
}

// CSS styles function - can be called once during app initialization
export function initEnemyUIStyles() {
  console.log("Entered function: initEnemyUIStyles");
  console.log("Entered function: initEnemyUIStyles");
  // Check if styles already exist
  if (document.getElementById('enemy-ui-styles')) {
    return;
  }
  const enemyUIStyles = document.createElement('style');
  enemyUIStyles.id = 'enemy-ui-styles';
  enemyUIStyles.textContent = `
        @keyframes damageNumberFloat {
            0% {
                transform: translateY(0) scale(1);
                opacity: 1;
            }
            100% {
                transform: translateY(-50px) scale(0.8);
                opacity: 0;
            }
        }
        
        @keyframes statusPulse {
            0%, 100% {
                transform: scale(1);
                opacity: 0.8;
            }
            50% {
                transform: scale(1.2);
                opacity: 1;
            }
        }
    `;
  document.head.appendChild(enemyUIStyles);
}
// Notification Manager System - Refactored for ES6 Modules
export class NotificationManager {
  constructor() {
    console.log("Calling method: constructor");
    this.notifications = [];
    this.maxNotifications = 5;
    this.defaultDuration = 3000;
    this.notificationContainer = null;

    // Notification types
    this.types = {
      INFO: 'info',
      SUCCESS: 'success',
      WARNING: 'warning',
      ERROR: 'error',
      ACHIEVEMENT: 'achievement'
    };

    // Animation settings
    this.animationDuration = 300;

    // Initialize container
    this.initContainer();
    console.log('NotificationManager initialized');
  }
  initContainer() {
    console.log("Calling method: initContainer");
    // Find or create notification container
    this.notificationContainer = document.getElementById('notifications');
    if (!this.notificationContainer) {
      this.notificationContainer = document.createElement('div');
      this.notificationContainer.id = 'notifications';
      this.notificationContainer.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 1000;
                pointer-events: none;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
            `;
      document.body.appendChild(this.notificationContainer);
    }
  }

  // Main notification method
  show(message, duration = this.defaultDuration, type = this.types.INFO, options = {}) {
    console.log("Calling method: show");
    const notification = this.createNotification(message, duration, type, options);
    this.addNotification(notification);
    return notification.id;
  }

  // Convenience methods for different types
  showInfo(message, duration) {
    console.log("Calling method: showInfo");
    return this.show(message, duration, this.types.INFO);
  }
  showSuccess(message, duration) {
    console.log("Calling method: showSuccess");
    return this.show(message, duration, this.types.SUCCESS);
  }
  showWarning(message, duration) {
    console.log("Calling method: showWarning");
    return this.show(message, duration, this.types.WARNING);
  }
  showError(message, duration) {
    console.log("Calling method: showError");
    return this.show(message, duration, this.types.ERROR);
  }
  showAchievement(message, duration) {
    console.log("Calling method: showAchievement");
    return this.show(message, duration, this.types.ACHIEVEMENT, {
      icon: '🏆',
      sound: 'achievement'
    });
  }

  // Game-specific notification methods
  showWaveStart(waveNumber) {
    console.log("Calling method: showWaveStart");
    return this.show(`Wave ${waveNumber} Incoming!`, 2000, this.types.WARNING, {
      icon: '⚔️',
      sound: 'waveStart',
      pulse: true
    });
  }
  showWaveComplete(waveNumber) {
    console.log("Calling method: showWaveComplete");
    return this.show(`Wave ${waveNumber} Complete!`, 2500, this.types.SUCCESS, {
      icon: '✅',
      sound: 'waveComplete'
    });
  }
  showBossAppearing(bossName) {
    console.log("Calling method: showBossAppearing");
    return this.show(`${bossName} Appears!`, 3000, this.types.ERROR, {
      icon: '👹',
      sound: 'bossAppear',
      shake: true,
      large: true
    });
  }
  showResourceGained(resourceType, amount) {
    console.log("Calling method: showResourceGained");
    const icons = {
      gold: '💰',
      energy: '⚡',
      score: '🎯'
    };
    return this.show(`+${amount} ${resourceType}`, 1500, this.types.SUCCESS, {
      icon: icons[resourceType] || '📦',
      small: true,
      fadeOnly: true
    });
  }
  showTowerBuilt(towerType) {
    console.log("Calling method: showTowerBuilt");
    return this.show(`${towerType} Tower Built!`, 1500, this.types.INFO, {
      icon: '🔧',
      sound: 'towerPlace'
    });
  }
  showTowerUpgraded(towerType) {
    console.log("Calling method: showTowerUpgraded");
    return this.show(`${towerType} Tower Upgraded!`, 2000, this.types.SUCCESS, {
      icon: '⬆️',
      sound: 'towerUpgrade'
    });
  }
  showEnemyDefeated(enemyType, bounty) {
    console.log("Calling method: showEnemyDefeated");
    return this.show(`${enemyType} Defeated! +${bounty} Gold`, 1200, this.types.SUCCESS, {
      icon: '💀',
      small: true,
      fadeOnly: true
    });
  }
  showBaseDamage(damage) {
    console.log("Calling method: showBaseDamage");
    return this.show(`Base Damaged! -${damage} Life`, 2000, this.types.ERROR, {
      icon: '💥',
      sound: 'baseDamage',
      shake: true
    });
  }
  showInsufficientResources(resourceType) {
    console.log("Calling method: showInsufficientResources");
    return this.show(`Not enough ${resourceType}!`, 2000, this.types.WARNING, {
      icon: '❌',
      sound: 'error'
    });
  }
  showGamePaused() {
    console.log("Calling method: showGamePaused");
    return this.show('Game Paused', 1000, this.types.INFO, {
      icon: '⏸️',
      persistent: true
    });
  }
  showGameResumed() {
    console.log("Calling method: showGameResumed");
    return this.show('Game Resumed', 1000, this.types.INFO, {
      icon: '▶️'
    });
  }
  showLevelComplete() {
    console.log("Calling method: showLevelComplete");
    return this.show('Level Complete!', 4000, this.types.ACHIEVEMENT, {
      icon: '🎉',
      sound: 'levelComplete',
      large: true,
      celebration: true
    });
  }
  showGameOver() {
    console.log("Calling method: showGameOver");
    return this.show('Game Over', 5000, this.types.ERROR, {
      icon: '💀',
      sound: 'gameOver',
      large: true,
      persistent: true
    });
  }

  // Core notification creation
  createNotification(message, duration, type, options = {}) {
    console.log("Calling method: createNotification");
    const id = Date.now() + Math.random();
    const notification = {
      id: id,
      message: message,
      duration: duration,
      type: type,
      options: options,
      element: null,
      timer: null,
      createdAt: Date.now()
    };

    // Create DOM element
    notification.element = this.createNotificationElement(notification);
    return notification;
  }
  createNotificationElement(notification) {
    console.log("Calling method: createNotificationElement");
    const element = document.createElement('div');
    element.className = `notification notification-${notification.type}`;

    // Base styles
    let styles = `
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid;
            border-radius: 10px;
            padding: 15px 25px;
            color: white;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            min-width: 200px;
            max-width: 400px;
            word-wrap: break-word;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            transform: scale(0);
            opacity: 0;
            transition: all ${this.animationDuration}ms ease-out;
            pointer-events: auto;
            cursor: pointer;
        `;

    // Type-specific styling
    switch (notification.type) {
      case this.types.INFO:
        styles += 'border-color: #00aaff; box-shadow: 0 0 20px rgba(0, 170, 255, 0.3);';
        break;
      case this.types.SUCCESS:
        styles += 'border-color: #00ff88; box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);';
        break;
      case this.types.WARNING:
        styles += 'border-color: #ffaa00; box-shadow: 0 0 20px rgba(255, 170, 0, 0.3);';
        break;
      case this.types.ERROR:
        styles += 'border-color: #ff4444; box-shadow: 0 0 20px rgba(255, 68, 68, 0.3);';
        break;
      case this.types.ACHIEVEMENT:
        styles += 'border-color: #ffd700; box-shadow: 0 0 20px rgba(255, 215, 0, 0.5); background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(0, 0, 0, 0.9));';
        break;
    }

    // Size modifications
    if (notification.options.large) {
      styles += 'font-size: 28px; padding: 25px 40px;';
    } else if (notification.options.small) {
      styles += 'font-size: 14px; padding: 10px 15px; min-width: 150px;';
    }
    element.style.cssText = styles;

    // Create content
    let content = '';
    if (notification.options.icon) {
      content += `<span style="font-size: 1.2em; margin-right: 10px;">${notification.options.icon}</span>`;
    }
    content += notification.message;
    element.innerHTML = content;

    // Add special effects
    if (notification.options.pulse) {
      this.addPulseEffect(element);
    }
    if (notification.options.shake) {
      this.addShakeEffect(element);
    }
    if (notification.options.celebration) {
      this.addCelebrationEffect(element);
    }

    // Click to dismiss
    element.addEventListener('click', function () {
      this.dismiss(notification.id);
    });
    return element;
  }
  addNotification(notification) {
    console.log("Calling method: addNotification");
    // Remove oldest notifications if at limit
    while (this.notifications.length >= this.maxNotifications) {
      const oldest = this.notifications.shift();
      this.removeNotificationElement(oldest);
    }

    // Add to array
    this.notifications.push(notification);

    // Add to DOM
    this.notificationContainer.appendChild(notification.element);

    // Trigger entrance animation
    requestAnimationFrame(function () {
      notification.element.style.transform = 'scale(1)';
      notification.element.style.opacity = '1';
    });

    // Set auto-dismiss timer (unless persistent)
    if (!notification.options.persistent && notification.duration > 0) {
      notification.timer = setTimeout(function () {
        this.dismiss(notification.id);
      }, notification.duration);
    }

    // Play sound if specified and audioManager is available
    if (notification.options.sound && this.audioManager) {
      this.audioManager.playSound(notification.options.sound);
    }
  }

  // Method to set audio manager dependency (for dependency injection)
  setAudioManager(audioManager) {
    console.log("Calling method: setAudioManager");
    this.audioManager = audioManager;
  }
  dismiss(notificationId) {
    console.log("Calling method: dismiss");
    const index = this.notifications.findIndex(function (n) {
      return n.id === notificationId;
    });
    if (index === -1) return;
    const notification = this.notifications[index];

    // Clear timer
    if (notification.timer) {
      clearTimeout(notification.timer);
    }

    // Remove from array
    this.notifications.splice(index, 1);

    // Animate out and remove
    this.removeNotificationElement(notification);
  }
  removeNotificationElement(notification) {
    console.log("Calling method: removeNotificationElement");
    if (!notification.element || !notification.element.parentNode) return;

    // Exit animation
    if (notification.options.fadeOnly) {
      notification.element.style.opacity = '0';
    } else {
      notification.element.style.transform = 'scale(0)';
      notification.element.style.opacity = '0';
    }

    // Remove after animation
    setTimeout(function () {
      if (notification.element && notification.element.parentNode) {
        notification.element.parentNode.removeChild(notification.element);
      }
    }, this.animationDuration);
  }

  // Special effects
  addPulseEffect(element) {
    console.log("Calling method: addPulseEffect");
    const pulseKeyframes = `
            @keyframes notificationPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
        `;
    this.addKeyframes('notificationPulse', pulseKeyframes);
    element.style.animation = 'notificationPulse 1s ease-in-out infinite';
  }
  addShakeEffect(element) {
    console.log("Calling method: addShakeEffect");
    const shakeKeyframes = `
            @keyframes notificationShake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
        `;
    this.addKeyframes('notificationShake', shakeKeyframes);
    element.style.animation = 'notificationShake 0.5s ease-in-out';
  }
  addCelebrationEffect(element) {
    console.log("Calling method: addCelebrationEffect");
    const celebrationKeyframes = `
            @keyframes notificationCelebration {
                0% { transform: scale(0) rotate(0deg); }
                50% { transform: scale(1.2) rotate(180deg); }
                100% { transform: scale(1) rotate(360deg); }
            }
        `;
    this.addKeyframes('notificationCelebration', celebrationKeyframes);
    element.style.animation = 'notificationCelebration 1s ease-out';

    // Add confetti effect
    this.createConfetti(element);
  }
  addKeyframes(name, keyframes) {
    console.log("Calling method: addKeyframes");
    // Check if keyframes already exist
    const existingStyle = document.getElementById(`keyframes-${name}`);
    if (existingStyle) return;
    const style = document.createElement('style');
    style.id = `keyframes-${name}`;
    style.textContent = keyframes;
    document.head.appendChild(style);
  }
  createConfetti(element) {
    console.log("Calling method: createConfetti");
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'];
    const confettiCount = 20;
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
                position: absolute;
                width: 6px;
                height: 6px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1001;
            `;
      const rect = element.getBoundingClientRect();
      confetti.style.left = rect.left + rect.width / 2 + 'px';
      confetti.style.top = rect.top + rect.height / 2 + 'px';
      document.body.appendChild(confetti);

      // Animate confetti
      const angle = Math.PI * 2 * i / confettiCount;
      const velocity = 100 + Math.random() * 100;
      const gravity = 300;
      const lifetime = 2000;
      let startTime = Date.now();
      const animateConfetti = function () {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / lifetime;
        if (progress >= 1) {
          confetti.remove();
          return;
        }
        const x = Math.cos(angle) * velocity * (elapsed / 1000);
        const y = Math.sin(angle) * velocity * (elapsed / 1000) + 0.5 * gravity * Math.pow(elapsed / 1000, 2);
        confetti.style.transform = `translate(${x}px, ${y}px)`;
        confetti.style.opacity = 1 - progress;
        requestAnimationFrame(animateConfetti);
      };
      requestAnimationFrame(animateConfetti);
    }
  }

  // Utility methods
  dismissAll() {
    console.log("Calling method: dismissAll");
    const notificationIds = this.notifications.map(function (n) {
      return n.id;
    });
    notificationIds.forEach(function (id) {
      return this.dismiss(id);
    });
  }
  dismissByType(type) {
    console.log("Calling method: dismissByType");
    const notificationIds = this.notifications.filter(function (n) {
      return n.type === type;
    }).map(function (n) {
      return n.id;
    });
    notificationIds.forEach(function (id) {
      return this.dismiss(id);
    });
  }
  getActiveNotifications() {
    console.log("Calling method: getActiveNotifications");
    return [...this.notifications];
  }
  hasNotificationType(type) {
    console.log("Calling method: hasNotificationType");
    return this.notifications.some(function (n) {
      return n.type === type;
    });
  }

  // Settings
  setMaxNotifications(max) {
    console.log("Calling method: setMaxNotifications");
    this.maxNotifications = Math.max(1, max);
  }
  setDefaultDuration(duration) {
    console.log("Calling method: setDefaultDuration");
    this.defaultDuration = Math.max(500, duration);
  }
  setAnimationDuration(duration) {
    console.log("Calling method: setAnimationDuration");
    this.animationDuration = Math.max(100, duration);
  }

  // Cleanup
  dispose() {
    console.log("Calling method: dispose");
    this.dismissAll();
    if (this.notificationContainer && this.notificationContainer.parentNode) {
      this.notificationContainer.parentNode.removeChild(this.notificationContainer);
    }

    // Remove keyframe styles
    const keyframeStyles = document.querySelectorAll('[id^="keyframes-"]');
    keyframeStyles.forEach(function (style) {
      return style.remove();
    });
  }
}
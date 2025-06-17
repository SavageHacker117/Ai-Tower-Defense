/**
 * BossAISystem.js
 * Manages boss enemy AI, behavior patterns, and special abilities
 * for the tower defense game
 */

export class BossAISystem {
  constructor({
    healthSystem,
    statusEffectSystem,
    projectileSystem,
    eventBus
  }) {
    console.log("Calling method: constructor");
    // Dependency injection - store only what we need
    this.healthSystem = healthSystem;
    this.statusEffectSystem = statusEffectSystem;
    this.projectileSystem = projectileSystem;
    this.eventBus = eventBus;
    this.bosses = new Map(); // bossId -> bossData
    this.behaviorStates = new Map(); // bossId -> currentState
    this.eventListeners = new Map();
    this.initializeBossTypes();
  }

  // ... [your full class implementation remains unchanged] ...

  /**
   * Queue aerial ability
   * @param {Object} boss
   */
  queueAerialAbility(boss) {
    console.log("Calling method: queueAerialAbility");
    if (boss.abilities.includes('aerial_strike')) {
      boss.abilityQueue.push('aerial_strike');
    }
  }

  /**
   * Queue desperate ability
   * @param {Object} boss
   */
  queueDesperateAbility(boss) {
    console.log("Calling method: queueDesperateAbility");
    this.queueRandomAbility(boss);
  }

  /**
   * Queue a random ability
   * @param {Object} boss
   */
  queueRandomAbility(boss) {
    console.log("Calling method: queueRandomAbility");
    const ability = boss.abilities[Math.floor(Math.random() * boss.abilities.length)];
    boss.abilityQueue.push(ability);
  }

  /**
   * Find the safest position (dummy logic for now)
   * @param {Object} boss
   * @param {Array} towers
   * @returns {Object} target position
   */
  findSafestPosition(boss, towers) {
    console.log("Calling method: findSafestPosition");
    return {
      x: boss.startX,
      y: boss.startY
    };
  }

  /**
   * Evade threatening towers
   * @param {Object} boss
   * @param {Array} towers
   */
  evadeTowers(boss, towers) {
    console.log("Calling method: evadeTowers");
    const avgX = towers.reduce(function (sum, t) {
      return sum + t.x;
    }, 0) / towers.length;
    const avgY = towers.reduce(function (sum, t) {
      return sum + t.y;
    }, 0) / towers.length;
    const dx = boss.x - avgX;
    const dy = boss.y - avgY;
    const distance = Math.sqrt(dx * dx + dy * dy) || 1;
    boss.velocityX += dx / distance * boss.speed * 0.1;
    boss.velocityY += dy / distance * boss.speed * 0.1;
  }

  /**
   * Perform aerial movement logic
   * @param {Object} boss
   * @param {Array} towers
   */
  performAerialMovement(boss, towers) {
    console.log("Calling method: performAerialMovement");
    boss.x += Math.cos(Date.now() / 300) * 0.5;
    boss.y += Math.sin(Date.now() / 300) * 0.5;
  }

  /**
   * Attack a specific tower
   * @param {Object} boss
   * @param {Object} tower
   */
  attackTower(boss, tower) {
    console.log("Calling method: attackTower");
    this.emitEvent('bossAttack', {
      bossId: boss.id,
      towerId: tower.id
    });
  }

  /**
   * Calculate distance between two points
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
   * Get cooldown time for a given ability
   * @param {string} ability
   * @returns {number}
   */
  getAbilityCooldown(ability) {
    console.log("Calling method: getAbilityCooldown");
    const cooldowns = {
      charge: 5000,
      teleport: 8000,
      fire_breath: 7000,
      stealth: 10000,
      armor_boost: 12000,
      life_drain: 10000,
      summon_minions: 15000,
      meteor: 9000,
      dash: 6000,
      wing_buffet: 8000,
      rage: 10000
    };
    return cooldowns[ability] || 5000;
  }

  /**
   * Emit game-wide event
   * @param {string} type
   * @param {Object} payload
   */
  emitEvent(type, payload) {
    console.log("Calling method: emitEvent");
    if (this.eventBus && typeof this.eventBus.emit === 'function') {
      this.eventBus.emit(type, payload);
    }
  }
}
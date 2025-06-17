# Class `BossAISystem`

## `constructor()`

## `queueAerialAbility(boss)`

... [your full class implementation remains unchanged] ...

## `queueDesperateAbility(boss)`

*
   * Queue desperate ability
   * @param {Object} boss

## `queueRandomAbility(boss)`

*
   * Queue a random ability
   * @param {Object} boss

## `findSafestPosition(boss, towers)`

*
   * Find the safest position (dummy logic for now)
   * @param {Object} boss
   * @param {Array} towers
   * @returns {Object} target position

## `evadeTowers(boss, towers)`

*
   * Evade threatening towers
   * @param {Object} boss
   * @param {Array} towers

## `performAerialMovement(boss, towers)`

*
   * Perform aerial movement logic
   * @param {Object} boss
   * @param {Array} towers

## `attackTower(boss, tower)`

*
   * Attack a specific tower
   * @param {Object} boss
   * @param {Object} tower

## `getDistance(x1, y1, x2, y2)`

*
   * Calculate distance between two points
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @returns {number}

## `getAbilityCooldown(ability)`

*
   * Get cooldown time for a given ability
   * @param {string} ability
   * @returns {number}

## `emitEvent(type, payload)`

*
   * Emit game-wide event
   * @param {string} type
   * @param {Object} payload
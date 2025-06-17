# Class `TargetingSystem`

## `constructor()`

## `initializeTargetingModes()`

*
   * Initialize available targeting modes

## `setTargetingMode(towerId, mode)`

*
   * Set targeting mode for a tower
   * @param {string} towerId 
   * @param {string} mode 
   * @returns {boolean} Success

## `getTargetingMode(towerId)`

*
   * Get targeting mode for a tower
   * @param {string} towerId 
   * @returns {string}

## `findTarget(tower, enemies)`

*
   * Find the best target for a tower based on its targeting mode
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object|null}

## `getEnemiesInRange(tower, enemies)`

*
   * Get enemies in tower's range
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Array}

## `getClosestTarget(tower, enemies)`

*
   * Get closest enemy to tower
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object|null}

## `getStrongestTarget(tower, enemies)`

*
   * Get enemy with most health
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object|null}

## `getWeakestTarget(tower, enemies)`

*
   * Get enemy with least health
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object|null}

## `getFirstTarget(tower, enemies)`

*
   * Get enemy closest to the exit (furthest along path)
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object|null}

## `getLastTarget(tower, enemies)`

*
   * Get enemy furthest from the exit (least progress along path)
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object|null}

## `getFastestTarget(tower, enemies)`

*
   * Get fastest moving enemy
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object|null}

## `getSlowestTarget(tower, enemies)`

*
   * Get slowest moving enemy
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object|null}

## `getHighestValueTarget(tower, enemies)`

*
   * Get enemy with highest reward value
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object|null}

## `getRandomTarget(tower, enemies)`

*
   * Get random enemy in range
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object|null}

## `getSmartTarget(tower, enemies)`

*
   * Smart targeting that considers multiple factors
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object|null}

## `calculateTargetScore(tower, enemy)`

*
   * Calculate target score for smart targeting
   * @param {Object} tower 
   * @param {Object} enemy 
   * @returns {number}

## `getEnemiesInSplashRadius(centerX, centerY, radius, enemies, )`

*
   * Get enemies that can be hit by splash damage
   * @param {number} centerX 
   * @param {number} centerY 
   * @param {number} radius 
   * @param {Array} enemies 
   * @param {Object} excludeEnemy 
   * @returns {Array}

## `getChainLightningTargets(initialTarget, enemies, maxTargets, chainRange)`

*
   * Find targets for chain lightning
   * @param {Object} initialTarget 
   * @param {Array} enemies 
   * @param {number} maxTargets 
   * @param {number} chainRange 
   * @returns {Array}

## `findNearestUnusedTarget(currentTarget, enemies, chainRange, usedTargets)`

*
   * Find nearest unused target for chain lightning
   * @param {Object} currentTarget 
   * @param {Array} enemies 
   * @param {number} chainRange 
   * @param {Set} usedTargets 
   * @returns {Object|null}

## `predictEnemyPosition(enemy, projectileSpeed)`

*
   * Predict enemy position based on movement
   * @param {Object} enemy 
   * @param {number} projectileSpeed 
   * @returns {Object} Predicted position

## `isValidTarget(tower, target)`

*
   * Check if target is still valid
   * @param {Object} tower 
   * @param {Object} target 
   * @returns {boolean}

## `getOptimalTargetingMode(towerType)`

*
   * Get optimal targeting mode for tower type
   * @param {string} towerType 
   * @returns {string}

## `getAvailableTargetingModes()`

*
   * Get all available targeting modes
   * @returns {Array}

## `calculateTargetingEfficiency(tower, enemies)`

*
   * Calculate targeting efficiency for a tower
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object}

## `getDistance(x1, y1, x2, y2)`

*
   * Get distance between two points
   * @param {number} x1 
   * @param {number} y1 
   * @param {number} x2 
   * @param {number} y2 
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

## `getMostUsedTargetingMode(modeUsage)`

*
   * Get the most used targeting mode
   * @param {Object} modeUsage 
   * @returns {string|null}

## `resetAllTargetingModes()`

*
   * Reset targeting modes for all towers

## `removeTower(towerId)`

*
   * Remove tower from targeting system
   * @param {string} towerId

## `batchUpdateTargetingModes(updates)`

*
   * Batch update targeting modes for multiple towers
   * @param {Array} updates - Array of {towerId, mode} objects
   * @returns {Object} Results of batch update

## `getTargetingRecommendations(tower, enemies, )`

*
   * Get targeting recommendations for a tower based on current game state
   * @param {Object} tower 
   * @param {Array} enemies 
   * @param {Object} gameState 
   * @returns {Array} Recommended targeting modes
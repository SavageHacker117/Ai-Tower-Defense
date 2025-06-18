/**
 * TowerSystem.js
 * Manages tower placement, upgrades, behavior, and combat mechanics
 */

export class TowerSystem {
  constructor({
    gameMap,
    healthSystem,
    targetingSystem,
    notificationManager,
    resourceManager
  }) {
    console.log("Calling method: constructor");
    this.gameMap = gameMap;
    this.healthSystem = healthSystem;
    this.targetingSystem = targetingSystem;
    this.notificationManager = notificationManager;
    this.resourceManager = resourceManager;
    this.towers = new Map();
    this.towerTypes = new Map();
    this.placementGrid = new Map();
    this.eventListeners = new Map();
    this.nextTowerId = 1;
    this.gridSize = 2;
    this.initializeTowerTypes();
  }
  initializeTowerTypes() {
    console.log("Calling method: initializeTowerTypes");
    const towerConfigs = {
      basic: {
        name: 'Basic Tower',
        cost: 100,
        damage: 25,
        range: 80,
        attackSpeed: 1.0,
        projectileSpeed: 300,
        projectileType: 'bullet',
        upgrades: ['cannon', 'rapid'],
        maxLevel: 3,
        description: 'A simple tower with balanced stats.',
        sprite: 'tower_basic',
        buildTime: 1000,
        sellValue: 0.7
      },
      cannon: {
        name: 'Cannon Tower',
        cost: 200,
        damage: 80,
        range: 100,
        attackSpeed: 0.5,
        projectileSpeed: 250,
        projectileType: 'cannonball',
        splashRadius: 40,
        splashDamage: 0.5,
        upgrades: ['artillery'],
        maxLevel: 3,
        description: 'High damage with splash effect.',
        sprite: 'tower_cannon',
        buildTime: 2000,
        sellValue: 0.7
      },
      laser: {
        name: 'Laser Tower',
        cost: 300,
        damage: 40,
        range: 120,
        attackSpeed: 2.0,
        projectileSpeed: 1000,
        projectileType: 'laser',
        armorPiercing: true,
        upgrades: ['plasma'],
        maxLevel: 3,
        description: 'Fast attacks that pierce armor.',
        sprite: 'tower_laser',
        buildTime: 2500,
        sellValue: 0.7
      },
      ice: {
        name: 'Ice Tower',
        cost: 250,
        damage: 20,
        range: 90,
        attackSpeed: 1.2,
        projectileSpeed: 200,
        projectileType: 'ice',
        slowEffect: {
          duration: 3000,
          slowAmount: 0.5
        },
        upgrades: ['freeze'],
        maxLevel: 3,
        description: 'Slows enemies with ice attacks.',
        sprite: 'tower_ice',
        buildTime: 2000,
        sellValue: 0.7
      },
      poison: {
        name: 'Poison Tower',
        cost: 350,
        damage: 15,
        range: 85,
        attackSpeed: 1.5,
        projectileSpeed: 180,
        projectileType: 'poison',
        poisonEffect: {
          duration: 5000,
          damagePerSecond: 10
        },
        upgrades: ['toxic'],
        maxLevel: 3,
        description: 'Deals damage over time with poison.',
        sprite: 'tower_poison',
        buildTime: 3000,
        sellValue: 0.7
      },
      lightning: {
        name: 'Lightning Tower',
        cost: 500,
        damage: 60,
        range: 110,
        attackSpeed: 0.8,
        projectileSpeed: 800,
        projectileType: 'lightning',
        chainLightning: {
          maxTargets: 3,
          damageReduction: 0.3
        },
        upgrades: ['storm'],
        maxLevel: 3,
        description: 'Chains lightning between enemies.',
        sprite: 'tower_lightning',
        buildTime: 4000,
        sellValue: 0.7
      }
    };
    Object.entries(towerConfigs).forEach(([type, config]) => {
      this.towerTypes.set(type, config);
    });
  }
  canPlaceTower(x, y) {
    console.log("Calling method: canPlaceTower");
    const gridX = Math.floor(x / this.gridSize);
    const gridY = Math.floor(y / this.gridSize);
    const gridKey = `${gridX},${gridY}`;
    if (this.placementGrid.has(gridKey)) return {
      valid: false,
      reason: 'Position already occupied'
    };
    if (this.gameMap && this.gameMap.isOnPath(x, y)) return {
      valid: false,
      reason: 'Cannot place on enemy path'
    };
    if (this.gameMap && !this.gameMap.isWithinBounds(x, y)) return {
      valid: false,
      reason: 'Position outside map bounds'
    };
    return {
      valid: true,
      gridX,
      gridY,
      gridKey
    };
  }
  placeTower(towerType, x, y, playerId = null) {
    console.log("Calling method: placeTower");
    const towerConfig = this.towerTypes.get(towerType);
    if (!towerConfig) return {
      success: false,
      reason: 'Invalid tower type'
    };
    if (this.resourceManager && !this.resourceManager.canAfford(towerConfig.cost)) return {
      success: false,
      reason: 'Insufficient resources'
    };
    const placement = this.canPlaceTower(x, y);
    if (!placement.valid) return {
      success: false,
      reason: placement.reason
    };
    if (this.resourceManager) this.resourceManager.spendResources(towerConfig.cost);
    const towerId = `tower_${this.nextTowerId++}`;
    const snapX = placement.gridX * this.gridSize + this.gridSize / 2;
    const snapY = placement.gridY * this.gridSize + this.gridSize / 2;
    const tower = {
      id: towerId,
      type: towerType,
      x: snapX,
      y: snapY,
      level: 1,
      playerId,
      damage: towerConfig.damage,
      range: towerConfig.range,
      attackSpeed: towerConfig.attackSpeed,
      projectileSpeed: towerConfig.projectileSpeed,
      projectileType: towerConfig.projectileType,
      splashRadius: towerConfig.splashRadius || 0,
      splashDamage: towerConfig.splashDamage || 0,
      armorPiercing: towerConfig.armorPiercing || false,
      slowEffect: towerConfig.slowEffect || null,
      poisonEffect: towerConfig.poisonEffect || null,
      chainLightning: towerConfig.chainLightning || null,
      lastAttackTime: 0,
      currentTarget: null,
      kills: 0,
      totalDamageDealt: 0,
      buildStartTime: Date.now(),
      buildTime: towerConfig.buildTime,
      isBuilding: true,
      totalCost: towerConfig.cost,
      sellValue: Math.floor(towerConfig.cost * towerConfig.sellValue),
      availableUpgrades: [...towerConfig.upgrades],
      maxLevel: towerConfig.maxLevel
    };
    this.towers.set(towerId, tower);
    this.placementGrid.set(placement.gridKey, towerId);
    if (this.healthSystem) this.healthSystem.registerEntity(towerId, {
      maxHealth: 100,
      currentHealth: 100,
      entityType: 'tower'
    });
    if (this.notificationManager) this.notificationManager.showMessage(`${towerConfig.name} placed!`, 'success');
    this.triggerEvent('towerPlaced', {
      tower,
      playerId,
      cost: towerConfig.cost
    });
    setTimeout(() => {
      if (this.towers.has(towerId)) {
        tower.isBuilding = false;
        this.triggerEvent('towerBuilt', {
          tower
        });
        if (this.notificationManager) {
          this.notificationManager.showMessage(`${towerConfig.name} construction completed!`, 'info');
        }
      }
    }, towerConfig.buildTime);
    return {
      success: true,
      tower,
      cost: towerConfig.cost
    };
  }
  upgradeTower(towerId, upgradeType = 'level') {
    console.log("Calling method: upgradeTower");
    const tower = this.towers.get(towerId);
    if (!tower) return {
      success: false,
      reason: 'Tower not found'
    };
    if (tower.isBuilding) return {
      success: false,
      reason: 'Tower is still building'
    };
    return upgradeType === 'level' ? this.upgradeTowerLevel(tower) : this.upgradeTowerType(tower, upgradeType);
  }
  upgradeTowerLevel(tower) {
    console.log("Calling method: upgradeTowerLevel");
    if (tower.level >= tower.maxLevel) return {
      success: false,
      reason: 'Tower already at maximum level'
    };
    const baseCost = this.towerTypes.get(tower.type).cost;
    const upgradeCost = Math.floor(baseCost * 0.5 * tower.level);
    if (this.resourceManager && !this.resourceManager.canAfford(upgradeCost)) return {
      success: false,
      reason: 'Insufficient resources for upgrade'
    };
    if (this.resourceManager) this.resourceManager.spendResources(upgradeCost);
    const bonusMultiplier = 1.3;
    tower.damage = Math.floor(tower.damage * bonusMultiplier);
    tower.range = Math.floor(tower.range * 1.1);
    tower.attackSpeed *= 1.1;
    tower.level++;
    tower.totalCost += upgradeCost;
    tower.sellValue = Math.floor(tower.totalCost * 0.7);
    if (this.notificationManager) this.notificationManager.showMessage(`Tower upgraded to level ${tower.level}!`, 'success');
    this.triggerEvent('towerUpgraded', {
      tower,
      upgradeType: 'level',
      cost: upgradeCost
    });
    return {
      success: true,
      tower,
      cost: upgradeCost
    };
  }
  upgradeTowerType(tower, newType) {
    console.log("Calling method: upgradeTowerType");
    if (!tower.availableUpgrades.includes(newType)) return {
      success: false,
      reason: 'Upgrade not available for this tower'
    };
    const newConfig = this.towerTypes.get(newType);
    if (!newConfig) return {
      success: false,
      reason: 'Invalid upgrade type'
    };
    const upgradeCost = newConfig.cost - this.towerTypes.get(tower.type).cost;
    if (this.resourceManager && !this.resourceManager.canAfford(upgradeCost)) return {
      success: false,
      reason: 'Insufficient resources for upgrade'
    };
    if (this.resourceManager) this.resourceManager.spendResources(upgradeCost);
    const oldType = tower.type;
    tower.type = newType;
    tower.damage = newConfig.damage;
    tower.range = newConfig.range;
    tower.attackSpeed = newConfig.attackSpeed;
    tower.projectileSpeed = newConfig.projectileSpeed;
    tower.projectileType = newConfig.projectileType;
    tower.splashRadius = newConfig.splashRadius || 0;
    tower.splashDamage = newConfig.splashDamage || 0;
    tower.armorPiercing = newConfig.armorPiercing || false;
    tower.slowEffect = newConfig.slowEffect || null;
    tower.poisonEffect = newConfig.poisonEffect || null;
    tower.chainLightning = newConfig.chainLightning || null;
    tower.availableUpgrades = [...newConfig.upgrades];
    tower.maxLevel = newConfig.maxLevel;
    tower.totalCost += upgradeCost;
    tower.sellValue = Math.floor(tower.totalCost * 0.7);
    if (this.notificationManager) this.notificationManager.showMessage(`Tower upgraded to ${newConfig.name}!`, 'success');
    this.triggerEvent('towerUpgraded', {
      tower,
      upgradeType: 'type',
      oldType,
      newType,
      cost: upgradeCost
    });
    return {
      success: true,
      tower,
      cost: upgradeCost
    };
  }
  sellTower(towerId) {
    console.log("Calling method: sellTower");
    const tower = this.towers.get(towerId);
    if (!tower) return {
      success: false,
      reason: 'Tower not found'
    };
    const sellValue = tower.sellValue;
    const gridKey = this.getGridKey(tower.x, tower.y);
    if (this.resourceManager) this.resourceManager.addResources(sellValue);
    this.towers.delete(towerId);
    this.placementGrid.delete(gridKey);
    if (this.healthSystem) this.healthSystem.unregisterEntity(towerId);
    if (this.notificationManager) this.notificationManager.showMessage(`Tower sold for ${sellValue} resources`, 'info');
    this.triggerEvent('towerSold', {
      tower,
      sellValue
    });
    return {
      success: true,
      sellValue,
      tower
    };
  }
  update(deltaTime, enemies = []) {
    console.log("Calling method: update");
    const currentTime = Date.now();
    this.towers.forEach((tower) => {
      if (tower.isBuilding) return;
      if (!tower.currentTarget || !this.isValidTarget(tower.currentTarget, tower)) {
        tower.currentTarget = this.findTarget(tower, enemies);
      }
      if (tower.currentTarget && this.canAttack(tower, currentTime)) {
        this.attackTarget(tower, tower.currentTarget);
        tower.lastAttackTime = currentTime;
      }
    });
  }
  findTarget(tower, enemies) {
    console.log("Calling method: findTarget");
    // This is the only changed method. It now delegates to the TargetingSystem.
    return this.targetingSystem.findTarget(tower, enemies);
  }
  canAttack(tower, currentTime) {
    console.log("Calling method: canAttack");
    const attackCooldown = 1000 / tower.attackSpeed;
    return currentTime - tower.lastAttackTime >= attackCooldown;
  }
  isValidTarget(target, tower) {
    console.log("Calling method: isValidTarget");
    if (!target || !target.isAlive) return false;
    const distance = this.getDistance(tower.x, tower.y, target.x, target.y);
    return distance <= tower.range;
  }
  attackTarget(tower, target) {
    console.log("Calling method: attackTarget");
    const projectileData = {
      towerId: tower.id,
      startX: tower.x,
      startY: tower.y,
      targetX: target.x,
      targetY: target.y,
      target: target,
      damage: tower.damage,
      speed: tower.projectileSpeed,
      type: tower.projectileType,
      armorPiercing: tower.armorPiercing,
      splashRadius: tower.splashRadius,
      splashDamage: tower.splashDamage,
      slowEffect: tower.slowEffect,
      poisonEffect: tower.poisonEffect,
      chainLightning: tower.chainLightning
    };
    this.triggerEvent('towerAttack', {
      tower,
      target,
      projectile: projectileData
    });
    tower.totalDamageDealt += tower.damage;
  }
  getDistance(x1, y1, x2, y2) {
    console.log("Calling method: getDistance");
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }
  getGridKey(x, y) {
    console.log("Calling method: getGridKey");
    const gridX = Math.floor(x / this.gridSize);
    const gridY = Math.floor(y / this.gridSize);
    return `${gridX},${gridY}`;
  }
  getTower(towerId) {
    console.log("Calling method: getTower");
    return this.towers.get(towerId) || null;
  }
  getAllTowers() {
    console.log("Calling method: getAllTowers");
    return Array.from(this.towers.values());
  }
  getTowersByPlayer(playerId) {
    console.log("Calling method: getTowersByPlayer");
    return this.getAllTowers().filter((tower) => tower.playerId === playerId);
  }
  getTowerTypes() {
    console.log("Calling method: getTowerTypes");
    return new Map(this.towerTypes);
  }
  getTowerTypeConfig(towerType) {
    console.log("Calling method: getTowerTypeConfig");
    return this.towerTypes.get(towerType) || null;
  }
  addEventListener(event, callback) {
    console.log("Calling method: addEventListener");
    if (!this.eventListeners.has(event)) this.eventListeners.set(event, []);
    this.eventListeners.get(event).push(callback);
  }
  removeEventListener(event, callback) {
    console.log("Calling method: removeEventListener");
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) listeners.splice(index, 1);
    }
  }
  triggerEvent(event, data) {
    console.log("Calling method: triggerEvent");
    const listeners = this.eventListeners.get(event);
    if (listeners)
      listeners.forEach((callback) => {
        try {
          callback(data);
        } catch (e) {
          console.error(e);
        }
      });
  }
  getSystemStats() {
    console.log("Calling method: getSystemStats");
    const towers = this.getAllTowers();
    const totalTowers = towers.length;
    const buildingTowers = towers.filter((t) => t.isBuilding).length;
    const totalDamage = towers.reduce((sum, t) => sum + t.totalDamageDealt, 0);
    const totalKills = towers.reduce((sum, t) => sum + t.kills, 0);
    const totalValue = towers.reduce((sum, t) => sum + t.totalCost, 0);
    return {
      totalTowers,
      buildingTowers,
      activeTowers: totalTowers - buildingTowers,
      totalDamage,
      totalKills,
      totalValue,
      occupiedGridCells: this.placementGrid.size
    };
  }
  clearAllTowers() {
    console.log("Calling method: clearAllTowers");
    this.towers.forEach((tower, towerId) => {
      if (this.healthSystem) {
        this.healthSystem.unregisterEntity(towerId);
      }
    });
    this.towers.clear();
    this.placementGrid.clear();
    this.triggerEvent('allTowersCleared', {});
  }
}
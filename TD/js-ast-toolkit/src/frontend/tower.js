import * as THREE from 'three';

// Data for different tower types
export const TOWER_DATA = {
  'basic': {
    name: 'Gatling Gun',
    cost: 100,
    damage: 15,
    range: 10,
    fireRate: 5,
    // shots per second
    projectileSpeed: 30,
    projectileType: 'bullet',
    color: 0xaaaaaa
  },
  'laser': {
    name: 'Laser Tower',
    cost: 250,
    damage: 8,
    // Damage per "tick"
    range: 12,
    fireRate: 20,
    // Represents a continuous beam
    projectileType: 'laser',
    color: 0x00aaff
  },
  'missile': {
    name: 'Missile Launcher',
    cost: 400,
    damage: 100,
    range: 20,
    fireRate: 0.5,
    projectileSpeed: 15,
    projectileType: 'missile',
    splashRadius: 3,
    color: 0xff8800
  },
  'freeze': {
    name: 'Freeze Tower',
    cost: 200,
    damage: 5,
    range: 8,
    fireRate: 1,
    projectileSpeed: 20,
    projectileType: 'ice',
    statusEffect: {
      type: 'slow',
      intensity: 0.4,
      duration: 2000
    },
    color: 0x44ddff
  }
};

// Represents a single tower in the game
export class Tower {
  constructor(type, position, dependencies = {}) {
    console.log("Calling method: constructor");
    this.scene = dependencies.scene;
    this.audioManager = dependencies.audioManager;
    this.projectileSystem = dependencies.projectileSystem; // Injected from main

    this.id = `tower_${Date.now()}_${Math.random()}`;
    this.type = type;
    this.level = 1;
    this.position = new THREE.Vector3(position.x, 0.75, position.z);
    const data = TOWER_DATA[type];
    this.damage = data.damage;
    this.range = data.range;
    this.fireRate = data.fireRate;
    this.projectileType = data.projectileType;
    this.statusEffect = data.statusEffect;
    this.splashRadius = data.splashRadius;
    this.target = null;
    this.fireCooldown = 0;
    this.turret = null;
    this.createMesh(data.color);
  }
  createMesh(color) {
    console.log("Calling method: createMesh");
    const baseGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.5, 8);
    const baseMat = new THREE.MeshLambertMaterial({
      color: 0x555555
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    const turretGeo = new THREE.CylinderGeometry(0.4, 0.5, 1.0, 8);
    const turretMat = new THREE.MeshLambertMaterial({
      color
    });
    this.turret = new THREE.Mesh(turretGeo, turretMat);
    this.turret.position.y = 0.75;
    this.mesh = new THREE.Group();
    this.mesh.add(base);
    this.mesh.add(this.turret);
    this.mesh.position.copy(this.position);
    this.mesh.userData.tower = this;
  }
  update(deltaTime, enemies) {
    console.log("Calling method: update");
    this.fireCooldown -= deltaTime;

    // Target finding logic
    if (!this.target || !this.target.isAlive() || this.position.distanceTo(this.target.position) > this.range) {
      this.target = this.findTarget(enemies);
    }
    if (this.target) {
      // Rotate turret to face the target
      const targetPosition = this.target.position.clone();
      targetPosition.y = this.turret.position.y + this.position.y;
      this.turret.lookAt(targetPosition);

      // Firing logic
      if (this.fireCooldown <= 0) {
        this.fire();
        this.fireCooldown = 1 / this.fireRate;
      }
    }
  }
  findTarget(enemies) {
    console.log("Calling method: findTarget");
    let bestTarget = null;
    let minDistance = this.range;
    for (const enemy of enemies) {
      if (enemy.isDead) continue;
      const distance = this.position.distanceTo(enemy.position);
      if (distance < minDistance) {
        minDistance = distance;
        bestTarget = enemy;
      }
    }
    return bestTarget;
  }
  fire() {
    console.log("Calling method: fire");
    if (!this.target || !this.projectileSystem) return;
    const projectileData = {
      towerId: this.id,
      startX: this.position.x,
      startY: this.position.y + 1,
      // Fire from top of tower
      startZ: this.position.z,
      target: this.target,
      damage: this.damage,
      type: this.projectileType,
      statusEffect: this.statusEffect,
      splashRadius: this.splashRadius
    };
    this.projectileSystem.createProjectile(projectileData);
    if (this.audioManager) this.audioManager.playSound('towerShoot');
  }
  upgrade() {
    console.log("Calling method: upgrade");
    if (this.level >= 5) {
      return false; // Max level
    }
    this.level++;
    this.damage = Math.floor(this.damage * 1.5);
    this.range *= 1.1;

    // Visual upgrade
    const newScale = 1 + (this.level - 1) * 0.1;
    this.mesh.scale.set(newScale, newScale, newScale);
    return true;
  }
}

// Factory for creating towers
export class TowerFactory {
  constructor(scene, resourceManager) {
    console.log("Calling method: constructor");
    this.scene = scene;
    this.resourceManager = resourceManager;
  }
  createTower(type, position, dependencies) {
    console.log("Calling method: createTower");
    const towerData = TOWER_DATA[type];
    if (!towerData) {
      console.error(`Unknown tower type: ${type}`);
      return null;
    }

    // Check resources before creating
    if (this.resourceManager.getGold() >= towerData.cost) {
      this.resourceManager.spendGold(towerData.cost);
      const tower = new Tower(type, position, dependencies);
      this.scene.add(tower.mesh);
      return tower;
    } else {
      dependencies.notificationManager.showError('Not enough gold!');
      return null;
    }
  }
}
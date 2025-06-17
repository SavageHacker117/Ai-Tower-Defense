// Enemy System - Refactored for ES6 Modules

// Enemy System
export class Enemy {
  constructor(type, template, position, path) {
    console.log("Calling method: constructor");
    // Basic properties
    this.id = Date.now() + Math.random();
    this.type = type;
    this.template = template;

    // Health and combat
    this.maxHealth = template.health;
    this.health = template.health;
    this.isDead = false;
    this.damage = template.damage;
    this.bounty = template.bounty;
    this.scoreValue = template.scoreValue || template.bounty;

    // Movement
    this.position = new THREE.Vector3(position.x, 0, position.z);
    this.velocity = new THREE.Vector3();
    this.speed = template.speed;
    this.baseSpeed = template.speed;
    this.path = path || [];
    this.pathIndex = 0;
    this.reachedEnd = false;

    // Visual properties
    this.size = template.size || 1;
    this.color = template.color || 0xff4444;
    this.mesh = null;

    // Status effects
    this.statusEffects = [];
    this.resistances = template.resistances || {};
    this.weaknesses = template.weaknesses || {};

    // Abilities
    this.abilities = template.abilities || [];
    this.abilityTimers = new Map();

    // AI state
    this.aiState = 'moving';
    this.target = null;
    this.lastDamageTime = 0;
    this.stunned = false;

    // Animation
    this.animationMixer = null;
    this.animations = new Map();

    // Special properties
    this.isFlying = this.abilities.includes('flying');
    this.canRegenerate = this.abilities.includes('regeneration');
    this.hasShield = this.abilities.includes('energy_shield');
    this.shieldHealth = this.hasShield ? this.maxHealth * 0.5 : 0;

    // Dependencies - will be injected
    this.enemyUIManager = null;

    // Create visual representation
    this.createMesh();
    console.log(`Enemy created: ${type} at (${position.x}, ${position.z})`);
  }

  // Dependency injection method
  setDependencies({
    enemyUIManager
  }) {
    console.log("Calling method: setDependencies");
    this.enemyUIManager = enemyUIManager;
  }
  createMesh() {
    console.log("Calling method: createMesh");
    // Create geometry based on enemy type
    let geometry;
    switch (this.type) {
      case 'flying':
        geometry = new THREE.ConeGeometry(this.size * 0.5, this.size * 1.5, 6);
        break;
      case 'heavy':
        geometry = new THREE.BoxGeometry(this.size, this.size * 1.2, this.size);
        break;
      case 'boss':
        geometry = new THREE.OctahedronGeometry(this.size * 1.5);
        break;
      default:
        geometry = new THREE.CapsuleGeometry(this.size * 0.4, this.size * 0.8, 4, 8);
    }

    // Create material
    const material = new THREE.MeshLambertMaterial({
      color: this.color,
      transparent: true,
      opacity: 0.9
    });

    // Create mesh
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(this.position);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    // Set height based on type
    if (this.isFlying) {
      this.mesh.position.y = 2 + Math.sin(Date.now() * 0.001) * 0.5;
    } else {
      this.mesh.position.y = this.size * 0.5;
    }

    // Add special effects
    this.addSpecialEffects();

    // Store reference to enemy in mesh
    this.mesh.userData.enemy = this;
  }
  addSpecialEffects() {
    console.log("Calling method: addSpecialEffects");
    // Shield effect
    if (this.hasShield) {
      const shieldGeometry = new THREE.SphereGeometry(this.size * 0.8, 16, 16);
      const shieldMaterial = new THREE.MeshBasicMaterial({
        color: 0x00aaff,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      });
      this.shieldMesh = new THREE.Mesh(shieldGeometry, shieldMaterial);
      this.mesh.add(this.shieldMesh);
    }

    // Regeneration effect
    if (this.canRegenerate) {
      const particles = new THREE.Group();
      for (let i = 0; i < 8; i++) {
        const particleGeometry = new THREE.SphereGeometry(0.05, 4, 4);
        const particleMaterial = new THREE.MeshBasicMaterial({
          color: 0x44ff88,
          transparent: true,
          opacity: 0.7
        });
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.set((Math.random() - 0.5) * this.size * 2, Math.random() * this.size * 2, (Math.random() - 0.5) * this.size * 2);
        particles.add(particle);
      }
      this.regenParticles = particles;
      this.mesh.add(particles);
    }
  }
  update(deltaTime, path) {
    console.log("Calling method: update");
    if (this.isDead) return;

    // Update path if provided
    if (path && path.length > 0) {
      this.path = path;
    }

    // Update status effects
    this.updateStatusEffects(deltaTime);

    // Update abilities
    this.updateAbilities(deltaTime);

    // Update AI behavior
    this.updateAI(deltaTime);

    // Update movement
    this.updateMovement(deltaTime);

    // Update visual effects
    this.updateVisualEffects(deltaTime);

    // Update mesh position
    if (this.mesh) {
      this.mesh.position.copy(this.position);

      // Flying enemies bob up and down
      if (this.isFlying) {
        this.mesh.position.y = 2 + Math.sin(Date.now() * 0.003 + this.id) * 0.3;
      }
    }

    // Check if reached end
    if (this.pathIndex >= this.path.length - 1) {
      this.reachedEnd = true;
    }
  }
  updateMovement(deltaTime) {
    console.log("Calling method: updateMovement");
    if (this.stunned || this.path.length === 0) return;

    // Get current target waypoint
    if (this.pathIndex < this.path.length) {
      const target = this.path[this.pathIndex];
      const targetPos = new THREE.Vector3(target.x, this.position.y, target.z);

      // Calculate direction to target
      const direction = targetPos.clone().sub(this.position);
      const distance = direction.length();

      // Check if reached current waypoint
      if (distance < 0.5) {
        this.pathIndex++;
        return;
      }

      // Normalize direction and apply speed
      direction.normalize();
      this.velocity = direction.multiplyScalar(this.speed);

      // Apply movement
      const movement = this.velocity.clone().multiplyScalar(deltaTime);
      this.position.add(movement);

      // Rotate mesh to face movement direction
      if (this.mesh && this.velocity.length() > 0) {
        const angle = Math.atan2(this.velocity.x, this.velocity.z);
        this.mesh.rotation.y = angle;
      }
    }
  }
  updateStatusEffects(deltaTime) {
    console.log("Calling method: updateStatusEffects");
    for (let i = this.statusEffects.length - 1; i >= 0; i--) {
      const effect = this.statusEffects[i];

      // Update effect duration
      effect.duration -= deltaTime * 1000;

      // Apply effect
      this.applyStatusEffect(effect, deltaTime);

      // Remove expired effects
      if (effect.duration <= 0) {
        this.removeStatusEffect(effect);
        this.statusEffects.splice(i, 1);
      }
    }
  }
  applyStatusEffect(effect, deltaTime) {
    console.log("Calling method: applyStatusEffect");
    switch (effect.type) {
      case 'slow':
        this.speed = this.baseSpeed * (1 - effect.intensity);
        break;
      case 'poison':
        const poisonDamage = effect.intensity * deltaTime;
        this.takeDamage(poisonDamage, 'poison');
        break;
      case 'burn':
        const burnDamage = effect.intensity * deltaTime * 2;
        this.takeDamage(burnDamage, 'fire');
        break;
      case 'freeze':
        this.speed = 0;
        this.stunned = true;
        break;
      case 'stun':
        this.stunned = true;
        break;
    }
  }
  removeStatusEffect(effect) {
    console.log("Calling method: removeStatusEffect");
    switch (effect.type) {
      case 'slow':
      case 'freeze':
        this.speed = this.baseSpeed;
        break;
      case 'stun':
      case 'freeze':
        this.stunned = false;
        break;
    }
  }
  updateAbilities(deltaTime) {
    console.log("Calling method: updateAbilities");
    // Update ability timers
    for (const [ability, timer] of this.abilityTimers) {
      this.abilityTimers.set(ability, timer - deltaTime * 1000);
    }

    // Execute abilities
    this.abilities.forEach(function (ability) {
      const timer = this.abilityTimers.get(ability) || 0;
      if (timer <= 0) {
        this.executeAbility(ability);
      }
    });

    // Regeneration
    if (this.canRegenerate && this.health < this.maxHealth) {
      const regenRate = this.maxHealth * 0.02; // 2% per second
      this.heal(regenRate * deltaTime);
    }
  }
  executeAbility(abilityName) {
    console.log("Calling method: executeAbility");
    switch (abilityName) {
      case 'speed_burst':
        this.speedBurst();
        this.abilityTimers.set(abilityName, 5000); // 5 second cooldown
        break;
      case 'self_heal':
        this.heal(this.maxHealth * 0.2);
        this.abilityTimers.set(abilityName, 8000); // 8 second cooldown
        break;
      case 'dodge':
        this.dodge();
        this.abilityTimers.set(abilityName, 3000); // 3 second cooldown
        break;
    }
  }
  speedBurst() {
    console.log("Calling method: speedBurst");
    this.addStatusEffect({
      type: 'speed_boost',
      intensity: 1.5,
      duration: 2000
    });
  }
  dodge() {
    console.log("Calling method: dodge");
    // Temporary invulnerability
    this.addStatusEffect({
      type: 'invulnerable',
      intensity: 1,
      duration: 500
    });

    // Visual effect
    if (this.mesh) {
      this.mesh.material.opacity = 0.5;
      setTimeout(function () {
        if (this.mesh) {
          this.mesh.material.opacity = 0.9;
        }
      }, 500);
    }
  }
  updateAI(deltaTime) {
    console.log("Calling method: updateAI");
    switch (this.aiState) {
      case 'moving':
        // Default behavior - follow path
        break;
      case 'attacking':
        // Attack behavior for enemies that can attack towers
        this.updateAttackBehavior(deltaTime);
        break;
      case 'fleeing':
        // Flee behavior for low health enemies
        this.updateFleeBehavior(deltaTime);
        break;
    }
  }
  updateAttackBehavior(deltaTime) {
    console.log("Calling method: updateAttackBehavior");
    // Implementation for enemies that can attack towers
    if (this.target && this.target.health > 0) {
      const distance = this.position.distanceTo(this.target.position);
      if (distance <= this.attackRange) {
        // Attack target
        this.attackTarget(this.target);
      } else {
        // Move towards target
        this.moveTowards(this.target.position, deltaTime);
      }
    } else {
      // No target, return to moving
      this.aiState = 'moving';
      this.target = null;
    }
  }
  updateFleeBehavior(deltaTime) {
    console.log("Calling method: updateFleeBehavior");
    // Move away from nearest tower
    // Implementation depends on tower system
    this.aiState = 'moving'; // Fallback to moving
  }
  updateVisualEffects(deltaTime) {
    console.log("Calling method: updateVisualEffects");
    // Update shield effect
    if (this.shieldMesh) {
      this.shieldMesh.rotation.y += deltaTime * 2;
      this.shieldMesh.visible = this.shieldHealth > 0;
      if (this.shieldHealth > 0) {
        const shieldPercent = this.shieldHealth / (this.maxHealth * 0.5);
        this.shieldMesh.material.opacity = 0.2 + shieldPercent * 0.3;
      }
    }

    // Update regeneration particles
    if (this.regenParticles && this.canRegenerate) {
      this.regenParticles.rotation.y += deltaTime;
      this.regenParticles.children.forEach(function (particle, index) {
        particle.position.y += Math.sin(Date.now() * 0.005 + index) * 0.01;
      });
    }

    // Health-based color changes
    if (this.mesh) {
      const healthPercent = this.health / this.maxHealth;
      if (healthPercent < 0.3) {
        // Flash red when low health
        const flash = Math.sin(Date.now() * 0.01) * 0.3 + 0.7;
        this.mesh.material.color.setRGB(1, flash * 0.3, flash * 0.3);
      } else {
        // Normal color
        this.mesh.material.color.setHex(this.color);
      }
    }
  }

  // Combat methods
  takeDamage(amount, damageType = 'physical') {
    console.log("Calling method: takeDamage");
    if (this.isDead) return 0;

    // Check for invulnerability
    if (this.hasStatusEffect('invulnerable')) {
      return 0;
    }

    // Apply resistances and weaknesses
    let finalDamage = amount;
    if (this.resistances[damageType]) {
      finalDamage *= this.resistances[damageType];
    }
    if (this.weaknesses[damageType]) {
      finalDamage *= this.weaknesses[damageType];
    }

    // Apply to shield first
    if (this.shieldHealth > 0) {
      const shieldDamage = Math.min(finalDamage, this.shieldHealth);
      this.shieldHealth -= shieldDamage;
      finalDamage -= shieldDamage;
      if (finalDamage <= 0) {
        this.triggerDamageEffect(amount, true);
        return amount;
      }
    }

    // Apply to health
    this.health -= finalDamage;
    this.lastDamageTime = Date.now();

    // Trigger visual effects
    this.triggerDamageEffect(amount, false);

    // Check for death
    if (this.health <= 0) {
      this.die();
    }
    return amount;
  }
  heal(amount) {
    console.log("Calling method: heal");
    if (this.isDead) return 0;
    const oldHealth = this.health;
    this.health = Math.min(this.maxHealth, this.health + amount);
    const actualHeal = this.health - oldHealth;
    if (actualHeal > 0) {
      this.triggerHealEffect(actualHeal);
    }
    return actualHeal;
  }
  die() {
    console.log("Calling method: die");
    this.isDead = true;
    this.health = 0;
    this.aiState = 'dead';

    // Trigger death effects
    this.triggerDeathEffect();
    console.log(`Enemy ${this.type} died`);
  }

  // Status effect management
  addStatusEffect(effect) {
    console.log("Calling method: addStatusEffect");
    // Check if effect already exists
    const existingIndex = this.statusEffects.findIndex(function (e) {
      return e.type === effect.type;
    });
    if (existingIndex >= 0) {
      // Update existing effect
      this.statusEffects[existingIndex] = {
        ...effect
      };
    } else {
      // Add new effect
      this.statusEffects.push({
        ...effect
      });
    }
  }
  removeStatusEffectByType(type) {
    console.log("Calling method: removeStatusEffectByType");
    const index = this.statusEffects.findIndex(function (e) {
      return e.type === type;
    });
    if (index >= 0) {
      this.removeStatusEffect(this.statusEffects[index]);
      this.statusEffects.splice(index, 1);
    }
  }
  hasStatusEffect(type) {
    console.log("Calling method: hasStatusEffect");
    return this.statusEffects.some(function (e) {
      return e.type === type;
    });
  }

  // Visual effect methods
  triggerDamageEffect(damage, isShield) {
    console.log("Calling method: triggerDamageEffect");
    // Create damage number using injected dependency
    if (this.enemyUIManager) {
      const damageType = isShield ? 'shield' : 'normal';
      this.enemyUIManager.showDamageNumber(this, Math.floor(damage), damageType);
    }

    // Flash effect
    if (this.mesh) {
      const originalColor = this.mesh.material.color.getHex();
      this.mesh.material.color.setHex(isShield ? 0x00aaff : 0xff4444);
      setTimeout(function () {
        if (this.mesh) {
          this.mesh.material.color.setHex(originalColor);
        }
      }, 100);
    }
  }
  triggerHealEffect(amount) {
    console.log("Calling method: triggerHealEffect");
    // Create heal number using injected dependency
    if (this.enemyUIManager) {
      this.enemyUIManager.showDamageNumber(this, Math.floor(amount), 'heal');
    }

    // Green flash effect
    if (this.mesh) {
      const originalColor = this.mesh.material.color.getHex();
      this.mesh.material.color.setHex(0x44ff44);
      setTimeout(function () {
        if (this.mesh) {
          this.mesh.material.color.setHex(originalColor);
        }
      }, 200);
    }
  }
  triggerDeathEffect() {
    console.log("Calling method: triggerDeathEffect");
    // Death animation
    if (this.mesh) {
      // Fade out
      const fadeOut = function () {
        this.mesh.material.opacity -= 0.05;
        if (this.mesh.material.opacity > 0) {
          requestAnimationFrame(fadeOut);
        }
      };
      fadeOut();

      // Scale down
      const scaleDown = function () {
        this.mesh.scale.multiplyScalar(0.95);
        if (this.mesh.scale.x > 0.1) {
          requestAnimationFrame(scaleDown);
        }
      };
      scaleDown();
    }
  }

  // Utility methods
  getHealthPercentage() {
    console.log("Calling method: getHealthPercentage");
    return this.maxHealth > 0 ? this.health / this.maxHealth * 100 : 0;
  }
  getDistanceToEnd() {
    console.log("Calling method: getDistanceToEnd");
    if (this.path.length === 0) return Infinity;
    const endPoint = this.path[this.path.length - 1];
    return this.position.distanceTo(new THREE.Vector3(endPoint.x, 0, endPoint.z));
  }
  getProgressAlongPath() {
    console.log("Calling method: getProgressAlongPath");
    if (this.path.length === 0) return 0;
    return this.pathIndex / (this.path.length - 1);
  }

  // Cleanup
  dispose() {
    console.log("Calling method: dispose");
    if (this.mesh && this.mesh.parent) {
      this.mesh.parent.remove(this.mesh);
    }
    if (this.mesh) {
      if (this.mesh.geometry) this.mesh.geometry.dispose();
      if (this.mesh.material) this.mesh.material.dispose();
    }
    this.statusEffects = [];
    this.abilityTimers.clear();
  }
}

// Enemy Factory
export class EnemyFactory {
  constructor({
    levelData
  }) {
    console.log("Calling method: constructor");
    this.levelData = levelData;
  }
  createEnemy(type, levelNumber, position, path) {
    console.log("Calling method: createEnemy");
    // Get enemy template from level data
    if (!this.levelData) {
      console.error('Level data not available for enemy creation');
      return null;
    }
    const template = this.levelData.getScaledEnemyTemplate(type, levelNumber);
    if (!template) {
      console.error(`Enemy template '${type}' not found`);
      return null;
    }
    return new Enemy(type, template, position, path);
  }
  createBoss(bossType, levelNumber, position, path) {
    console.log("Calling method: createBoss");
    const template = this.getBossTemplate(bossType, levelNumber);
    return new Enemy('boss', template, position, path);
  }
  getBossTemplate(bossType, levelNumber) {
    console.log("Calling method: getBossTemplate");
    // Boss templates with level scaling
    const baseTemplates = {
      tank: {
        health: 2000,
        speed: 0.8,
        damage: 5,
        bounty: 200,
        scoreValue: 500,
        size: 3,
        color: 0xff0000,
        abilities: ['massive_armor', 'ground_slam'],
        resistances: {
          physical: 0.3,
          energy: 0.5
        }
      },
      flyer: {
        health: 1500,
        speed: 1.5,
        damage: 3,
        bounty: 250,
        scoreValue: 600,
        size: 2.5,
        color: 0x8800ff,
        abilities: ['flying', 'air_strike'],
        resistances: {
          ground: 0,
          air: 0.4
        }
      }
    };
    const template = baseTemplates[bossType];
    if (!template) return baseTemplates.tank;

    // Scale for level
    const scaledTemplate = {
      ...template
    };
    const levelMultiplier = 1.5 ** (levelNumber - 1);
    scaledTemplate.health = Math.floor(template.health * levelMultiplier);
    scaledTemplate.damage = Math.floor(template.damage * levelMultiplier);
    scaledTemplate.bounty = Math.floor(template.bounty * levelMultiplier);
    scaledTemplate.scoreValue = Math.floor(template.scoreValue * levelMultiplier);
    return scaledTemplate;
  }
}
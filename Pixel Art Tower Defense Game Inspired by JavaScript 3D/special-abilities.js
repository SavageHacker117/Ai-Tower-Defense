// Enhanced Tower Special Abilities System
// This file adds unique special abilities for each tower type

class TowerSpecialAbilities {
    constructor(game) {
        this.game = game;
        this.statusEffects = new Map(); // Track status effects on enemies
    }
    
    // Apply special ability when tower fires
    applySpecialAbility(tower, target, projectile) {
        const special = tower.userData.data.special;
        
        switch(special) {
            case 'piercing':
                this.applyPiercing(projectile);
                break;
            case 'splash':
                this.applySplash(projectile);
                break;
            case 'chain':
                this.applyChain(tower, target);
                break;
            case 'slow':
                this.applySlow(target);
                break;
            case 'burn':
                this.applyBurn(target);
                break;
            case 'stun':
                this.applyStun(target);
                break;
            case 'knockback':
                this.applyKnockback(target, projectile);
                break;
            case 'poison':
                this.applyPoison(target);
                break;
            case 'precision':
                this.applyPrecision(projectile);
                break;
            case 'fire':
                this.applyFire(target);
                break;
            case 'pull':
                this.applyGravityPull(tower, target);
                break;
            case 'shield':
                this.applyShield(tower);
                break;
            case 'teleport':
                this.applyQuantumTeleport(projectile, target);
                break;
            case 'nuclear':
                this.applyNuclear(projectile);
                break;
        }
    }
    
    applyPiercing(projectile) {
        projectile.userData.piercing = true;
        projectile.userData.piercingCount = 3;
    }
    
    applySplash(projectile) {
        projectile.userData.splash = true;
        projectile.userData.splashRadius = 80;
        projectile.userData.splashDamage = projectile.userData.damage * 0.6;
    }
    
    applyChain(tower, target) {
        const chainTargets = this.findNearbyEnemies(target.position, 100, 3);
        for (let chainTarget of chainTargets) {
            if (chainTarget !== target) {
                this.createChainLightning(target.position, chainTarget.position);
                this.game.damageEnemy(chainTarget, tower.userData.data.damage * 0.5);
            }
        }
    }
    
    applySlow(target) {
        this.addStatusEffect(target, 'slow', 3000, { speedMultiplier: 0.5 });
        this.createSlowEffect(target);
    }
    
    applyBurn(target) {
        this.addStatusEffect(target, 'burn', 5000, { 
            damage: 10, 
            interval: 500,
            lastTick: Date.now()
        });
        this.createBurnEffect(target);
    }
    
    applyStun(target) {
        this.addStatusEffect(target, 'stun', 2000, { speedMultiplier: 0 });
        this.createStunEffect(target);
    }
    
    applyKnockback(target, projectile) {
        const direction = projectile.userData.direction.clone();
        target.userData.knockback = {
            force: direction.multiplyScalar(50),
            duration: 500,
            startTime: Date.now()
        };
    }
    
    applyPoison(target) {
        this.addStatusEffect(target, 'poison', 8000, {
            damage: 5,
            interval: 1000,
            lastTick: Date.now()
        });
        this.createPoisonEffect(target);
    }
    
    applyPrecision(projectile) {
        projectile.userData.precision = true;
        projectile.userData.damage *= 1.5; // Bonus damage
        projectile.userData.speed *= 2; // Faster projectile
    }
    
    applyFire(target) {
        this.addStatusEffect(target, 'fire', 4000, {
            damage: 15,
            interval: 300,
            lastTick: Date.now(),
            spread: true
        });
        this.createFireEffect(target);
    }
    
    applyGravityPull(tower, target) {
        const direction = tower.position.clone().sub(target.position).normalize();
        target.userData.gravityPull = {
            force: direction.multiplyScalar(30),
            duration: 2000,
            startTime: Date.now()
        };
    }
    
    applyShield(tower) {
        // Create protective barrier around nearby towers
        const nearbyTowers = this.findNearbyTowers(tower.position, 150);
        for (let nearbyTower of nearbyTowers) {
            this.addTowerShield(nearbyTower);
        }
    }
    
    applyQuantumTeleport(projectile, target) {
        // Teleport projectile directly to target
        projectile.position.copy(target.position);
        projectile.userData.teleported = true;
        this.createTeleportEffect(projectile.position);
    }
    
    applyNuclear(projectile) {
        projectile.userData.nuclear = true;
        projectile.userData.nuclearRadius = 200;
        projectile.userData.nuclearDamage = projectile.userData.damage * 2;
    }
    
    // Status effect management
    addStatusEffect(enemy, type, duration, data) {
        const enemyId = enemy.uuid;
        if (!this.statusEffects.has(enemyId)) {
            this.statusEffects.set(enemyId, new Map());
        }
        
        this.statusEffects.get(enemyId).set(type, {
            ...data,
            endTime: Date.now() + duration,
            enemy: enemy
        });
    }
    
    updateStatusEffects() {
        const currentTime = Date.now();
        
        for (let [enemyId, effects] of this.statusEffects) {
            for (let [effectType, effectData] of effects) {
                if (currentTime > effectData.endTime) {
                    effects.delete(effectType);
                    continue;
                }
                
                // Apply effect
                switch(effectType) {
                    case 'burn':
                    case 'poison':
                    case 'fire':
                        if (currentTime - effectData.lastTick > effectData.interval) {
                            this.game.damageEnemy(effectData.enemy, effectData.damage);
                            effectData.lastTick = currentTime;
                            
                            if (effectType === 'fire' && effectData.spread) {
                                this.spreadFire(effectData.enemy);
                            }
                        }
                        break;
                }
            }
            
            if (effects.size === 0) {
                this.statusEffects.delete(enemyId);
            }
        }
    }
    
    getEnemySpeedMultiplier(enemy) {
        const enemyId = enemy.uuid;
        let multiplier = 1;
        
        if (this.statusEffects.has(enemyId)) {
            const effects = this.statusEffects.get(enemyId);
            for (let [effectType, effectData] of effects) {
                if (effectData.speedMultiplier !== undefined) {
                    multiplier *= effectData.speedMultiplier;
                }
            }
        }
        
        return multiplier;
    }
    
    // Helper methods
    findNearbyEnemies(position, radius, maxCount = 10) {
        const nearby = [];
        for (let enemy of this.game.enemies) {
            const distance = position.distanceTo(enemy.position);
            if (distance <= radius) {
                nearby.push({ enemy, distance });
            }
        }
        
        nearby.sort((a, b) => a.distance - b.distance);
        return nearby.slice(0, maxCount).map(item => item.enemy);
    }
    
    findNearbyTowers(position, radius) {
        const nearby = [];
        for (let tower of this.game.towers) {
            const distance = position.distanceTo(tower.position);
            if (distance <= radius) {
                nearby.push(tower);
            }
        }
        return nearby;
    }
    
    // Visual effects
    createChainLightning(from, to) {
        const points = [from, to];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ 
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.8
        });
        const lightning = new THREE.Line(geometry, material);
        this.game.scene.add(lightning);
        
        setTimeout(() => {
            this.game.scene.remove(lightning);
        }, 200);
    }
    
    createSlowEffect(target) {
        const effect = new THREE.Mesh(
            new THREE.RingGeometry(5, 15, 16),
            new THREE.MeshBasicMaterial({ 
                color: 0x87CEEB,
                transparent: true,
                opacity: 0.6
            })
        );
        effect.position.copy(target.position);
        effect.rotation.x = -Math.PI / 2;
        this.game.scene.add(effect);
        
        setTimeout(() => {
            this.game.scene.remove(effect);
        }, 3000);
    }
    
    createBurnEffect(target) {
        const effect = new THREE.Mesh(
            new THREE.SphereGeometry(8),
            new THREE.MeshBasicMaterial({ 
                color: 0xFF4500,
                transparent: true,
                opacity: 0.7
            })
        );
        effect.position.copy(target.position);
        this.game.scene.add(effect);
        
        const animate = () => {
            effect.scale.setScalar(1 + Math.sin(Date.now() * 0.01) * 0.2);
            if (effect.parent) {
                requestAnimationFrame(animate);
            }
        };
        animate();
        
        setTimeout(() => {
            this.game.scene.remove(effect);
        }, 5000);
    }
    
    createStunEffect(target) {
        const effect = new THREE.Mesh(
            new THREE.OctahedronGeometry(10),
            new THREE.MeshBasicMaterial({ 
                color: 0xFFFF00,
                transparent: true,
                opacity: 0.8
            })
        );
        effect.position.copy(target.position);
        effect.position.y += 15;
        this.game.scene.add(effect);
        
        const animate = () => {
            effect.rotation.y += 0.1;
            if (effect.parent) {
                requestAnimationFrame(animate);
            }
        };
        animate();
        
        setTimeout(() => {
            this.game.scene.remove(effect);
        }, 2000);
    }
    
    createPoisonEffect(target) {
        const effect = new THREE.Mesh(
            new THREE.SphereGeometry(6),
            new THREE.MeshBasicMaterial({ 
                color: 0x9ACD32,
                transparent: true,
                opacity: 0.5
            })
        );
        effect.position.copy(target.position);
        this.game.scene.add(effect);
        
        setTimeout(() => {
            this.game.scene.remove(effect);
        }, 8000);
    }
    
    createFireEffect(target) {
        for (let i = 0; i < 5; i++) {
            const flame = new THREE.Mesh(
                new THREE.SphereGeometry(2),
                new THREE.MeshBasicMaterial({ 
                    color: 0xFF4500,
                    transparent: true,
                    opacity: 0.8
                })
            );
            flame.position.copy(target.position);
            flame.position.add(new THREE.Vector3(
                (Math.random() - 0.5) * 10,
                Math.random() * 10,
                (Math.random() - 0.5) * 10
            ));
            this.game.scene.add(flame);
            
            const animate = () => {
                flame.position.y += 0.5;
                flame.material.opacity -= 0.02;
                if (flame.material.opacity > 0 && flame.parent) {
                    requestAnimationFrame(animate);
                } else {
                    this.game.scene.remove(flame);
                }
            };
            animate();
        }
    }
    
    createTeleportEffect(position) {
        const effect = new THREE.Mesh(
            new THREE.RingGeometry(10, 20, 32),
            new THREE.MeshBasicMaterial({ 
                color: 0x00FF00,
                transparent: true,
                opacity: 0.8
            })
        );
        effect.position.copy(position);
        effect.rotation.x = -Math.PI / 2;
        this.game.scene.add(effect);
        
        const animate = () => {
            effect.rotation.z += 0.2;
            effect.material.opacity -= 0.05;
            if (effect.material.opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                this.game.scene.remove(effect);
            }
        };
        animate();
    }
    
    spreadFire(sourceEnemy) {
        const nearbyEnemies = this.findNearbyEnemies(sourceEnemy.position, 50, 3);
        for (let enemy of nearbyEnemies) {
            if (enemy !== sourceEnemy) {
                this.applyFire(enemy);
            }
        }
    }
    
    addTowerShield(tower) {
        if (tower.userData.shield) return; // Already has shield
        
        const shield = new THREE.Mesh(
            new THREE.SphereGeometry(25),
            new THREE.MeshBasicMaterial({ 
                color: 0xFFD700,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            })
        );
        shield.position.copy(tower.position);
        shield.position.y += 25;
        this.game.scene.add(shield);
        
        tower.userData.shield = {
            mesh: shield,
            endTime: Date.now() + 10000 // 10 seconds
        };
        
        const animate = () => {
            if (Date.now() > tower.userData.shield.endTime) {
                this.game.scene.remove(shield);
                delete tower.userData.shield;
                return;
            }
            
            shield.rotation.y += 0.02;
            shield.material.opacity = 0.3 + Math.sin(Date.now() * 0.005) * 0.1;
            requestAnimationFrame(animate);
        };
        animate();
    }
}

// Extend the main game class with special abilities
if (typeof TowerDefenseGame !== 'undefined') {
    const originalInit = TowerDefenseGame.prototype.init;
    TowerDefenseGame.prototype.init = function() {
        originalInit.call(this);
        this.specialAbilities = new TowerSpecialAbilities(this);
    };
    
    const originalFireTower = TowerDefenseGame.prototype.fireTower;
    TowerDefenseGame.prototype.fireTower = function(tower, target) {
        const projectile = this.createProjectile(tower, target);
        this.projectiles.push(projectile);
        this.scene.add(projectile);
        
        // Apply special ability
        this.specialAbilities.applySpecialAbility(tower, target, projectile);
        
        // Create muzzle flash effect
        this.createMuzzleFlash(tower);
    };
    
    const originalUpdateEnemies = TowerDefenseGame.prototype.updateEnemies;
    TowerDefenseGame.prototype.updateEnemies = function(deltaTime) {
        // Update status effects
        if (this.specialAbilities) {
            this.specialAbilities.updateStatusEffects();
        }
        
        // Apply speed modifications and other effects
        for (let enemy of this.enemies) {
            const speedMultiplier = this.specialAbilities ? 
                this.specialAbilities.getEnemySpeedMultiplier(enemy) : 1;
            
            // Apply knockback
            if (enemy.userData.knockback) {
                const knockback = enemy.userData.knockback;
                const elapsed = Date.now() - knockback.startTime;
                if (elapsed < knockback.duration) {
                    enemy.position.add(knockback.force.clone().multiplyScalar(deltaTime));
                } else {
                    delete enemy.userData.knockback;
                }
            }
            
            // Apply gravity pull
            if (enemy.userData.gravityPull) {
                const pull = enemy.userData.gravityPull;
                const elapsed = Date.now() - pull.startTime;
                if (elapsed < pull.duration) {
                    enemy.position.add(pull.force.clone().multiplyScalar(deltaTime));
                } else {
                    delete enemy.userData.gravityPull;
                }
            }
            
            // Store original speed multiplier
            const originalSpeed = enemy.userData.speed;
            enemy.userData.speed = enemy.userData.data.speed * speedMultiplier;
        }
        
        originalUpdateEnemies.call(this, deltaTime);
        
        // Restore original speeds
        for (let enemy of this.enemies) {
            enemy.userData.speed = enemy.userData.data.speed;
        }
    };
    
    const originalUpdateProjectiles = TowerDefenseGame.prototype.updateProjectiles;
    TowerDefenseGame.prototype.updateProjectiles = function(deltaTime) {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            const userData = projectile.userData;
            
            // Handle special projectile types
            if (userData.teleported) {
                // Quantum projectile hits immediately
                if (userData.target && userData.target.userData.health > 0) {
                    this.handleSpecialProjectileHit(projectile, userData.target);
                    this.removeProjectile(i);
                    continue;
                }
            }
            
            // Move projectile
            const movement = userData.direction.clone().multiplyScalar(userData.speed * deltaTime);
            projectile.position.add(movement);
            
            // Check collision with target
            if (userData.target && userData.target.userData.health > 0) {
                const distance = projectile.position.distanceTo(userData.target.position);
                if (distance < 10) {
                    this.handleSpecialProjectileHit(projectile, userData.target);
                    this.removeProjectile(i);
                    continue;
                }
            }
            
            // Remove if too far
            if (projectile.position.length() > 1000) {
                this.removeProjectile(i);
            }
        }
    };
    
    TowerDefenseGame.prototype.handleSpecialProjectileHit = function(projectile, target) {
        const userData = projectile.userData;
        
        // Handle splash damage
        if (userData.splash) {
            const nearbyEnemies = this.specialAbilities.findNearbyEnemies(
                target.position, userData.splashRadius
            );
            for (let enemy of nearbyEnemies) {
                const damage = enemy === target ? userData.damage : userData.splashDamage;
                this.damageEnemy(enemy, damage);
            }
            this.createSplashExplosion(target.position, userData.splashRadius);
        } else if (userData.nuclear) {
            // Nuclear explosion
            const nearbyEnemies = this.specialAbilities.findNearbyEnemies(
                target.position, userData.nuclearRadius
            );
            for (let enemy of nearbyEnemies) {
                this.damageEnemy(enemy, userData.nuclearDamage);
            }
            this.createNuclearExplosion(target.position);
        } else if (userData.piercing) {
            // Piercing shot
            this.damageEnemy(target, userData.damage);
            userData.piercingCount--;
            if (userData.piercingCount > 0) {
                // Find next target in line
                const nextTarget = this.findNextPiercingTarget(projectile, target);
                if (nextTarget) {
                    userData.target = nextTarget;
                    return; // Don't remove projectile yet
                }
            }
        } else {
            // Normal hit
            this.damageEnemy(target, userData.damage);
        }
        
        this.createExplosion(projectile.position);
    };
    
    TowerDefenseGame.prototype.createSplashExplosion = function(position, radius) {
        const explosion = new THREE.Mesh(
            new THREE.SphereGeometry(radius),
            new THREE.MeshBasicMaterial({ 
                color: 0xFF8C00,
                transparent: true,
                opacity: 0.6
            })
        );
        explosion.position.copy(position);
        this.scene.add(explosion);
        
        const animate = () => {
            explosion.material.opacity -= 0.05;
            explosion.scale.multiplyScalar(1.05);
            if (explosion.material.opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                this.scene.remove(explosion);
            }
        };
        animate();
    };
    
    TowerDefenseGame.prototype.createNuclearExplosion = function(position) {
        // Create multiple explosion rings
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const explosion = new THREE.Mesh(
                    new THREE.SphereGeometry(50 + i * 50),
                    new THREE.MeshBasicMaterial({ 
                        color: i === 0 ? 0xFFFFFF : (i === 1 ? 0xFF4500 : 0xFF6347),
                        transparent: true,
                        opacity: 0.8
                    })
                );
                explosion.position.copy(position);
                this.scene.add(explosion);
                
                const animate = () => {
                    explosion.material.opacity -= 0.02;
                    explosion.scale.multiplyScalar(1.02);
                    if (explosion.material.opacity > 0) {
                        requestAnimationFrame(animate);
                    } else {
                        this.scene.remove(explosion);
                    }
                };
                animate();
            }, i * 200);
        }
    };
    
    TowerDefenseGame.prototype.findNextPiercingTarget = function(projectile, currentTarget) {
        const direction = projectile.userData.direction;
        const currentPos = currentTarget.position;
        
        let bestTarget = null;
        let bestScore = -1;
        
        for (let enemy of this.enemies) {
            if (enemy === currentTarget) continue;
            
            const toEnemy = enemy.position.clone().sub(currentPos);
            const dot = direction.dot(toEnemy.normalize());
            
            if (dot > 0.7) { // Enemy is roughly in the same direction
                const distance = currentPos.distanceTo(enemy.position);
                const score = dot / distance; // Prefer closer enemies in the same direction
                
                if (score > bestScore) {
                    bestScore = score;
                    bestTarget = enemy;
                }
            }
        }
        
        return bestTarget;
    };
}


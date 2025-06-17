// 3D Tower Defense Game - Lightning Strike
// Based on Three.js and modern JavaScript game development practices

class TowerDefenseGame {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.canvas = null;
        
        // Game state
        this.gameState = 'loading'; // loading, menu, playing, paused, gameOver
        this.currentLevel = 1;
        this.currentWave = 1;
        this.currentSeason = 0; // 0: Spring, 1: Summer, 2: Autumn, 3: Winter
        this.seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
        this.seasonEmojis = ['🌸', '☀️', '🍂', '❄️'];
        
        // Resources
        this.gold = 500;
        this.lives = 20;
        this.energy = 100;
        
        // Game objects
        this.towers = [];
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        
        // Input handling
        this.keys = {};
        this.mouse = { x: 0, y: 0, isDown: false };
        this.selectedTowerType = null;
        this.towerPreview = null;
        this.previewTimeout = null;
        
        // Camera controls
        this.cameraSpeed = 5;
        this.mouseSensitivity = 0.002;
        this.cameraTarget = new THREE.Vector3(0, 0, 0);
        
        // Game grid
        this.gridSize = 50;
        this.gridWidth = 24;
        this.gridHeight = 24;
        this.grid = [];
        
        // Path for enemies
        this.enemyPath = [];
        
        // Wave management
        this.waveActive = false;
        this.enemiesInWave = 0;
        this.enemiesSpawned = 0;
        this.waveStartTime = 0;
        this.spawnInterval = 1000; // milliseconds
        
        // Tower types - Enhanced with 15 total towers
        this.towerTypes = {
            1: { name: 'Basic Tower', cost: 50, damage: 25, range: 150, fireRate: 1000, color: 0x8B4513, special: 'none' },
            2: { name: 'Laser Tower', cost: 100, damage: 40, range: 200, fireRate: 800, color: 0xFF0000, special: 'piercing' },
            3: { name: 'Missile Tower', cost: 150, damage: 80, range: 250, fireRate: 1500, color: 0x4169E1, special: 'splash' },
            4: { name: 'Lightning Tower', cost: 200, damage: 60, range: 180, fireRate: 600, color: 0xFFD700, special: 'chain' },
            5: { name: 'Ice Tower', cost: 120, damage: 30, range: 160, fireRate: 1200, color: 0x87CEEB, special: 'slow' },
            6: { name: 'Plasma Tower', cost: 300, damage: 100, range: 220, fireRate: 1000, color: 0xFF00FF, special: 'burn' },
            7: { name: 'Tesla Tower', cost: 250, damage: 75, range: 200, fireRate: 700, color: 0x00FFFF, special: 'stun' },
            8: { name: 'Cannon Tower', cost: 180, damage: 120, range: 180, fireRate: 2000, color: 0x696969, special: 'knockback' },
            9: { name: 'Poison Tower', cost: 160, damage: 35, range: 170, fireRate: 900, color: 0x9ACD32, special: 'poison' },
            10: { name: 'Sniper Tower', cost: 400, damage: 200, range: 400, fireRate: 3000, color: 0x2F4F4F, special: 'precision' },
            11: { name: 'Flame Tower', cost: 220, damage: 50, range: 140, fireRate: 500, color: 0xFF4500, special: 'fire' },
            12: { name: 'Gravity Tower', cost: 350, damage: 40, range: 200, fireRate: 1500, color: 0x800080, special: 'pull' },
            13: { name: 'Shield Tower', cost: 280, damage: 20, range: 120, fireRate: 800, color: 0xFFD700, special: 'shield' },
            14: { name: 'Quantum Tower', cost: 500, damage: 150, range: 250, fireRate: 2500, color: 0x00FF00, special: 'teleport' },
            15: { name: 'Nuclear Tower', cost: 800, damage: 300, range: 300, fireRate: 5000, color: 0xFF6347, special: 'nuclear' }
        };
        
        // Enemy types - Increased speed for more challenge
        this.enemyTypes = {
            basic: { health: 100, speed: 4, reward: 10, color: 0xFF4444 },
            fast: { health: 60, speed: 7, reward: 15, color: 0x44FF44 },
            heavy: { health: 200, speed: 2, reward: 25, color: 0x4444FF },
            flying: { health: 80, speed: 6, reward: 20, color: 0xFF44FF },
            armored: { health: 300, speed: 3, reward: 35, color: 0x888888 },
            stealth: { health: 120, speed: 5, reward: 30, color: 0x444444 }
        };
        
        this.init();
    }
    
    async init() {
        this.canvas = document.getElementById('gameCanvas');
        this.setupThreeJS();
        this.setupLighting();
        this.setupEventListeners();
        this.createTerrain();
        this.generateEnemyPath();
        this.setupGrid();
        
        // Start loading sequence
        await this.loadAssets();
        this.startGame();
    }
    
    setupThreeJS() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
        
        // Camera - Initialize advanced camera system
        this.cameraSystem = new Advanced3DCameraSystem(this.scene, this.renderer, this.canvas);
        
        // Set up camera bounds for tower defense
        this.cameraSystem.setBounds(
            { x: -600, y: 50, z: -600 },
            { x: 600, y: 500, z: 600 }
        );
        
        // Initialize visual cursor system for tower placement
        this.cursorManager = new TowerPlacementCursorManager(this);
        
        // Initialize input manager to handle all input properly
        this.inputManager = new InputManager(this);
        
        // Initialize camera UI integration
        this.cameraUI = new CameraUIIntegration(this.cameraSystem, this);
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas,
            antialias: true 
        });
        this.renderer.setSize(1200, 1200);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Raycaster for mouse picking
        this.raycaster = new THREE.Raycaster();
        this.mouseVector = new THREE.Vector2();
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        // Directional light (sun)
        this.sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
        this.sunLight.position.set(100, 200, 100);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        this.sunLight.shadow.camera.near = 0.5;
        this.sunLight.shadow.camera.far = 500;
        this.sunLight.shadow.camera.left = -200;
        this.sunLight.shadow.camera.right = 200;
        this.sunLight.shadow.camera.top = 200;
        this.sunLight.shadow.camera.bottom = -200;
        this.scene.add(this.sunLight);
    }
    
    setupEventListeners() {
        // Event listeners are now handled by InputManager
        // This prevents conflicts between tower placement and camera controls
        console.log('Event listeners delegated to InputManager');
    }
    
    createTerrain() {
        // Create ground plane
        const groundGeometry = new THREE.PlaneGeometry(this.gridWidth * this.gridSize, this.gridHeight * this.gridSize);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 }); // Light green
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.receiveShadow = true;
        this.scene.add(this.ground);
        
        // Add some decorative elements
        this.addTrees();
        this.addRocks();
    }
    
    addTrees() {
        const treeCount = 20;
        for (let i = 0; i < treeCount; i++) {
            const tree = this.createTree();
            const x = (Math.random() - 0.5) * this.gridWidth * this.gridSize * 0.8;
            const z = (Math.random() - 0.5) * this.gridHeight * this.gridSize * 0.8;
            tree.position.set(x, 0, z);
            this.scene.add(tree);
        }
    }
    
    createTree() {
        const group = new THREE.Group();
        
        // Trunk
        const trunkGeometry = new THREE.CylinderGeometry(2, 3, 15);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 7.5;
        trunk.castShadow = true;
        group.add(trunk);
        
        // Leaves
        const leavesGeometry = new THREE.SphereGeometry(8);
        const leavesColor = this.getSeasonalColor();
        const leavesMaterial = new THREE.MeshLambertMaterial({ color: leavesColor });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = 20;
        leaves.castShadow = true;
        group.add(leaves);
        
        return group;
    }
    
    addRocks() {
        const rockCount = 15;
        for (let i = 0; i < rockCount; i++) {
            const rock = this.createRock();
            const x = (Math.random() - 0.5) * this.gridWidth * this.gridSize * 0.9;
            const z = (Math.random() - 0.5) * this.gridHeight * this.gridSize * 0.9;
            rock.position.set(x, 0, z);
            this.scene.add(rock);
        }
    }
    
    createRock() {
        const geometry = new THREE.DodecahedronGeometry(Math.random() * 3 + 2);
        const material = new THREE.MeshLambertMaterial({ color: 0x696969 });
        const rock = new THREE.Mesh(geometry, material);
        rock.castShadow = true;
        rock.receiveShadow = true;
        return rock;
    }
    
    getSeasonalColor() {
        const colors = [
            0x90EE90, // Spring - Light green
            0x228B22, // Summer - Forest green
            0xFF8C00, // Autumn - Dark orange
            0xF0F8FF  // Winter - Alice blue
        ];
        return colors[this.currentSeason];
    }
    
    generateEnemyPath() {
        // Simple path from left to right with some curves
        this.enemyPath = [];
        const startX = -this.gridWidth * this.gridSize / 2 + 50;
        const endX = this.gridWidth * this.gridSize / 2 - 50;
        const pathLength = endX - startX;
        const segments = 20;
        
        for (let i = 0; i <= segments; i++) {
            const progress = i / segments;
            const x = startX + pathLength * progress;
            const z = Math.sin(progress * Math.PI * 2) * 100; // Wavy path
            this.enemyPath.push(new THREE.Vector3(x, 0, z));
        }
        
        // Visualize path
        this.createPathVisualization();
    }
    
    createPathVisualization() {
        const pathGeometry = new THREE.BufferGeometry().setFromPoints(this.enemyPath);
        const pathMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF, linewidth: 3 });
        const pathLine = new THREE.Line(pathGeometry, pathMaterial);
        pathLine.position.y = 1;
        this.scene.add(pathLine);
    }
    
    setupGrid() {
        // Initialize grid for tower placement
        this.grid = [];
        for (let x = 0; x < this.gridWidth; x++) {
            this.grid[x] = [];
            for (let z = 0; z < this.gridHeight; z++) {
                this.grid[x][z] = { occupied: false, tower: null };
            }
        }
    }
    
    async loadAssets() {
        // Simulate loading with progress
        const loadingSteps = [
            'Loading 3D models...',
            'Loading textures...',
            'Loading audio files...',
            'Initializing game systems...',
            'Preparing battlefield...',
            'Ready for combat!'
        ];
        
        for (let i = 0; i < loadingSteps.length; i++) {
            await this.updateLoadingProgress((i + 1) / loadingSteps.length * 100, loadingSteps[i]);
            await this.delay(500); // Simulate loading time
        }
    }
    
    updateLoadingProgress(percentage, text) {
        return new Promise(resolve => {
            const lightningFill = document.getElementById('lightningFill');
            const loadingProgress = document.getElementById('loadingProgress');
            
            lightningFill.style.height = percentage + '%';
            loadingProgress.textContent = text || `Loading... ${Math.round(percentage)}%`;
            
            // Add particles during loading
            this.addLoadingParticles();
            
            setTimeout(resolve, 100);
        });
    }
    
    addLoadingParticles() {
        const container = document.querySelector('.lightning-container');
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 2000);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    startGame() {
        // Hide loading screen
        const loadingScreen = document.getElementById('loadingScreen');
        const gameUI = document.getElementById('gameUI');
        
        loadingScreen.classList.add('hidden');
        gameUI.style.display = 'block';
        
        this.gameState = 'playing';
        this.updateUI();
        this.animate();
    }
    
    selectTowerType(type) {
        if (this.towerTypes[type] && this.gold >= this.towerTypes[type].cost) {
            this.selectedTowerType = type;
            
            // Update UI
            document.querySelectorAll('.tower-button').forEach(btn => {
                btn.classList.remove('selected');
            });
            document.querySelector(`[data-tower=\"${type}\"]`).classList.add('selected');
            
            // Show preview
            this.showTowerPreview(type);
            
            // Clear previous timeout
            if (this.previewTimeout) {
                clearTimeout(this.previewTimeout);
            }
            
            // Set 10-second timeout
            this.previewTimeout = setTimeout(() => {
                this.clearTowerSelection();
            }, 10000);
        }
    }
    
    showTowerPreview(type) {
        this.clearTowerPreview();
        
        // Show visual cursor instead of old preview system
        if (this.cursorManager) {
            this.cursorManager.showCursorForTower(type);
        }
        
        // Keep the old range indicator for compatibility
        const towerData = this.towerTypes[type];
        const rangeGeometry = new THREE.RingGeometry(towerData.range - 5, towerData.range, 32);
        const rangeMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        this.rangeIndicator = new THREE.Mesh(rangeGeometry, rangeMaterial);
        this.rangeIndicator.rotation.x = -Math.PI / 2;
        this.rangeIndicator.position.y = 1;
        this.scene.add(this.rangeIndicator);
    }
    
    clearTowerPreview() {
        // Hide visual cursor
        if (this.cursorManager) {
            this.cursorManager.hideCursor();
        }
        
        // Remove old preview objects
        if (this.towerPreview) {
            this.scene.remove(this.towerPreview);
            this.towerPreview = null;
        }
        if (this.rangeIndicator) {
            this.scene.remove(this.rangeIndicator);
            this.rangeIndicator = null;
        }
    }
    
    clearTowerSelection() {
        this.selectedTowerType = null;
        this.clearTowerPreview();
        document.querySelectorAll('.tower-button').forEach(btn => {
            btn.classList.remove('selected');
        });
        if (this.previewTimeout) {
            clearTimeout(this.previewTimeout);
            this.previewTimeout = null;
        }
    }
    
    placeTower() {
        if (!this.selectedTowerType) return;
        
        // Get mouse position in world coordinates
        this.raycaster.setFromCamera(this.mouseVector, this.camera);
        const intersects = this.raycaster.intersectObject(this.ground);
        
        if (intersects.length > 0) {
            const point = intersects[0].point;
            const gridX = Math.floor((point.x + this.gridWidth * this.gridSize / 2) / this.gridSize);
            const gridZ = Math.floor((point.z + this.gridHeight * this.gridSize / 2) / this.gridSize);
            
            if (this.isValidTowerPlacement(gridX, gridZ)) {
                const towerData = this.towerTypes[this.selectedTowerType];
                
                if (this.gold >= towerData.cost) {
                    const tower = this.createTower(this.selectedTowerType, gridX, gridZ);
                    this.towers.push(tower);
                    this.scene.add(tower);
                    
                    this.gold -= towerData.cost;
                    this.grid[gridX][gridZ].occupied = true;
                    this.grid[gridX][gridZ].tower = tower;
                    
                    this.updateUI();
                    this.clearTowerSelection();
                }
            }
        }
    }
    
    isValidTowerPlacement(gridX, gridZ) {
        if (gridX < 0 || gridX >= this.gridWidth || gridZ < 0 || gridZ >= this.gridHeight) {
            return false;
        }
        
        if (this.grid[gridX][gridZ].occupied) {
            return false;
        }
        
        // Check if placement would block the path
        // For simplicity, we'll allow placement anywhere except on the direct path
        const worldX = (gridX - this.gridWidth / 2) * this.gridSize;
        const worldZ = (gridZ - this.gridHeight / 2) * this.gridSize;
        
        // Check distance from path
        for (let pathPoint of this.enemyPath) {
            const distance = Math.sqrt(
                Math.pow(worldX - pathPoint.x, 2) + 
                Math.pow(worldZ - pathPoint.z, 2)
            );
            if (distance < 30) { // Too close to path
                return false;
            }
        }
        
        return true;
    }
    
    createTower(type, gridX, gridZ) {
        const towerData = this.towerTypes[type];
        const group = new THREE.Group();
        
        // Base
        const baseGeometry = new THREE.CylinderGeometry(15, 18, 10);
        const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 5;
        base.castShadow = true;
        group.add(base);
        
        // Tower body
        const bodyGeometry = new THREE.BoxGeometry(20, 30, 20);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: towerData.color });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 25;
        body.castShadow = true;
        group.add(body);
        
        // Weapon
        const weaponGeometry = new THREE.CylinderGeometry(2, 2, 15);
        const weaponMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const weapon = new THREE.Mesh(weaponGeometry, weaponMaterial);
        weapon.position.set(0, 35, 10);
        weapon.rotation.x = Math.PI / 2;
        weapon.castShadow = true;
        group.add(weapon);
        
        // Position in world
        const worldX = (gridX - this.gridWidth / 2) * this.gridSize;
        const worldZ = (gridZ - this.gridHeight / 2) * this.gridSize;
        group.position.set(worldX, 0, worldZ);
        
        // Tower properties
        group.userData = {
            type: type,
            data: towerData,
            gridX: gridX,
            gridZ: gridZ,
            lastFired: 0,
            target: null,
            weapon: weapon
        };
        
        return group;
    }
    
    toggleWave() {
        if (!this.waveActive) {
            this.startWave();
        }
    }
    
    startWave() {
        if (this.waveActive) return;
        
        this.waveActive = true;
        this.enemiesInWave = this.currentWave * 5 + this.currentLevel * 2; // Scaling difficulty
        this.enemiesSpawned = 0;
        this.waveStartTime = Date.now();
        
        document.getElementById('startWaveBtn').textContent = 'Wave Active';
        document.getElementById('startWaveBtn').disabled = true;
        
        this.updateUI();
    }
    
    spawnEnemy() {
        if (this.enemiesSpawned >= this.enemiesInWave) return;
        
        const enemyTypes = Object.keys(this.enemyTypes);
        const randomType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        const enemy = this.createEnemy(randomType);
        
        this.enemies.push(enemy);
        this.scene.add(enemy);
        this.enemiesSpawned++;
        
        this.updateUI();
    }
    
    createEnemy(type) {
        const enemyData = this.enemyTypes[type];
        const geometry = new THREE.SphereGeometry(8);
        const material = new THREE.MeshLambertMaterial({ color: enemyData.color });
        const enemy = new THREE.Mesh(geometry, material);
        
        enemy.position.copy(this.enemyPath[0]);
        enemy.position.y = 8;
        enemy.castShadow = true;
        
        enemy.userData = {
            type: type,
            data: enemyData,
            health: enemyData.health,
            maxHealth: enemyData.health,
            speed: enemyData.speed,
            pathIndex: 0,
            pathProgress: 0
        };
        
        return enemy;
    }
    
    updateEnemies(deltaTime) {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            const userData = enemy.userData;
            
            // Move along path
            userData.pathProgress += userData.speed * deltaTime * 0.01;
            
            if (userData.pathIndex < this.enemyPath.length - 1) {
                const currentPoint = this.enemyPath[userData.pathIndex];
                const nextPoint = this.enemyPath[userData.pathIndex + 1];
                
                if (userData.pathProgress >= 1) {
                    userData.pathIndex++;
                    userData.pathProgress = 0;
                }
                
                if (userData.pathIndex < this.enemyPath.length - 1) {
                    const lerpedPosition = currentPoint.clone().lerp(nextPoint, userData.pathProgress);
                    enemy.position.copy(lerpedPosition);
                    enemy.position.y = 8;
                }
            } else {
                // Enemy reached the end
                this.lives--;
                this.removeEnemy(i);
                this.updateUI();
                
                if (this.lives <= 0) {
                    this.gameOver();
                }
            }
        }
    }
    
    updateTowers(deltaTime) {
        const currentTime = Date.now();
        
        for (let tower of this.towers) {
            const userData = tower.userData;
            
            // Find target
            if (!userData.target || userData.target.userData.health <= 0) {
                userData.target = this.findNearestEnemy(tower.position, userData.data.range);
            }
            
            // Aim at target
            if (userData.target) {
                const direction = userData.target.position.clone().sub(tower.position);
                const angle = Math.atan2(direction.x, direction.z);
                tower.rotation.y = angle;
                
                // Fire at target
                if (currentTime - userData.lastFired > userData.data.fireRate) {
                    this.fireTower(tower, userData.target);
                    userData.lastFired = currentTime;
                }
            }
        }
    }
    
    findNearestEnemy(position, range) {
        let nearest = null;
        let nearestDistance = range;
        
        for (let enemy of this.enemies) {
            const distance = position.distanceTo(enemy.position);
            if (distance < nearestDistance) {
                nearest = enemy;
                nearestDistance = distance;
            }
        }
        
        return nearest;
    }
    
    fireTower(tower, target) {
        const projectile = this.createProjectile(tower, target);
        this.projectiles.push(projectile);
        this.scene.add(projectile);
        
        // Create muzzle flash effect
        this.createMuzzleFlash(tower);
    }
    
    createProjectile(tower, target) {
        const geometry = new THREE.SphereGeometry(2);
        const material = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
        const projectile = new THREE.Mesh(geometry, material);
        
        projectile.position.copy(tower.position);
        projectile.position.y += 35;
        
        const direction = target.position.clone().sub(projectile.position).normalize();
        
        projectile.userData = {
            direction: direction,
            speed: 200,
            damage: tower.userData.data.damage,
            target: target,
            tower: tower
        };
        
        return projectile;
    }
    
    createMuzzleFlash(tower) {
        const geometry = new THREE.SphereGeometry(5);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.8
        });
        const flash = new THREE.Mesh(geometry, material);
        
        flash.position.copy(tower.position);
        flash.position.y += 35;
        this.scene.add(flash);
        
        // Animate flash
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / 200; // 200ms flash
            
            if (progress < 1) {
                flash.material.opacity = 0.8 * (1 - progress);
                flash.scale.setScalar(1 + progress * 2);
                requestAnimationFrame(animate);
            } else {
                this.scene.remove(flash);
            }
        };
        animate();
    }
    
    updateProjectiles(deltaTime) {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            const userData = projectile.userData;
            
            // Move projectile
            const movement = userData.direction.clone().multiplyScalar(userData.speed * deltaTime);
            projectile.position.add(movement);
            
            // Check collision with target
            if (userData.target && userData.target.userData.health > 0) {
                const distance = projectile.position.distanceTo(userData.target.position);
                if (distance < 10) {
                    // Hit target
                    this.damageEnemy(userData.target, userData.damage);
                    this.createExplosion(projectile.position);
                    this.removeProjectile(i);
                    continue;
                }
            }
            
            // Remove if too far
            if (projectile.position.length() > 1000) {
                this.removeProjectile(i);
            }
        }
    }
    
    damageEnemy(enemy, damage) {
        enemy.userData.health -= damage;
        
        if (enemy.userData.health <= 0) {
            // Enemy destroyed
            this.gold += enemy.userData.data.reward;
            this.createDeathEffect(enemy.position);
            
            const index = this.enemies.indexOf(enemy);
            if (index > -1) {
                this.removeEnemy(index);
            }
            
            this.updateUI();
        } else {
            // Show damage effect
            this.createDamageEffect(enemy.position);
        }
    }
    
    createExplosion(position) {
        const geometry = new THREE.SphereGeometry(15);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xFF4444,
            transparent: true,
            opacity: 0.7
        });
        const explosion = new THREE.Mesh(geometry, material);
        explosion.position.copy(position);
        this.scene.add(explosion);
        
        // Animate explosion
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / 300;
            
            if (progress < 1) {
                explosion.material.opacity = 0.7 * (1 - progress);
                explosion.scale.setScalar(1 + progress * 2);
                requestAnimationFrame(animate);
            } else {
                this.scene.remove(explosion);
            }
        };
        animate();
    }
    
    createDeathEffect(position) {
        // Create particle burst
        for (let i = 0; i < 10; i++) {
            const geometry = new THREE.SphereGeometry(1);
            const material = new THREE.MeshBasicMaterial({ color: 0xFFD700 });
            const particle = new THREE.Mesh(geometry, material);
            
            particle.position.copy(position);
            const direction = new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                Math.random(),
                (Math.random() - 0.5) * 2
            ).normalize();
            
            particle.userData = {
                velocity: direction.multiplyScalar(50),
                life: 1000
            };
            
            this.particles.push(particle);
            this.scene.add(particle);
        }
    }
    
    createDamageEffect(position) {
        const geometry = new THREE.SphereGeometry(3);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xFF0000,
            transparent: true,
            opacity: 0.8
        });
        const effect = new THREE.Mesh(geometry, material);
        effect.position.copy(position);
        effect.position.y += 10;
        this.scene.add(effect);
        
        // Animate damage effect
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / 500;
            
            if (progress < 1) {
                effect.material.opacity = 0.8 * (1 - progress);
                effect.position.y += 20 * progress;
                requestAnimationFrame(animate);
            } else {
                this.scene.remove(effect);
            }
        };
        animate();
    }
    
    updateParticles(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            const userData = particle.userData;
            
            // Update position
            particle.position.add(userData.velocity.clone().multiplyScalar(deltaTime));
            
            // Apply gravity
            userData.velocity.y -= 100 * deltaTime;
            
            // Update life
            userData.life -= deltaTime * 1000;
            
            if (userData.life <= 0 || particle.position.y < 0) {
                this.scene.remove(particle);
                this.particles.splice(i, 1);
            }
        }
    }
    
    removeEnemy(index) {
        const enemy = this.enemies[index];
        this.scene.remove(enemy);
        this.enemies.splice(index, 1);
        
        // Check if wave is complete
        if (this.waveActive && this.enemies.length === 0 && this.enemiesSpawned >= this.enemiesInWave) {
            this.completeWave();
        }
    }
    
    removeProjectile(index) {
        const projectile = this.projectiles[index];
        this.scene.remove(projectile);
        this.projectiles.splice(index, 1);
    }
    
    completeWave() {
        this.waveActive = false;
        this.currentWave++;
        
        // Bonus for completing wave
        this.gold += 50;
        this.energy = Math.min(100, this.energy + 10);
        
        if (this.currentWave > 10) {
            this.completeLevel();
        } else {
            document.getElementById('startWaveBtn').textContent = 'Start Wave';
            document.getElementById('startWaveBtn').disabled = false;
        }
        
        this.updateUI();
    }
    
    completeLevel() {
        this.currentLevel++;
        this.currentWave = 1;
        
        if (this.currentLevel > 10) {
            this.gameWin();
        } else {
            // Advance season every 2-3 levels
            if (this.currentLevel % 3 === 1) {
                this.advanceSeason();
            }
            
            // Level completion bonus
            this.gold += 100;
            this.lives = Math.min(20, this.lives + 5);
            
            document.getElementById('startWaveBtn').textContent = 'Start Wave';
            document.getElementById('startWaveBtn').disabled = false;
        }
        
        this.updateUI();
    }
    
    advanceSeason() {
        this.currentSeason = (this.currentSeason + 1) % 4;
        this.updateSeasonalEffects();
        this.updateUI();
    }
    
    updateSeasonalEffects() {
        // Update lighting based on season
        const seasonColors = [
            { bg: 0x87CEEB, sun: 0xFFFFE0 }, // Spring
            { bg: 0x87CEFA, sun: 0xFFFACD }, // Summer
            { bg: 0xDEB887, sun: 0xFFE4B5 }, // Autumn
            { bg: 0xB0C4DE, sun: 0xF0F8FF }  // Winter
        ];
        
        const colors = seasonColors[this.currentSeason];
        this.scene.background = new THREE.Color(colors.bg);
        this.sunLight.color = new THREE.Color(colors.sun);
        
        // Update ground color
        const groundColors = [0x90EE90, 0x228B22, 0xDEB887, 0xF0F8FF];
        this.ground.material.color = new THREE.Color(groundColors[this.currentSeason]);
    }
    
    handleCameraMovement(deltaTime) {
        const speed = this.cameraSpeed * deltaTime;
        const direction = new THREE.Vector3();
        
        if (this.keys['KeyW']) direction.z -= 1;
        if (this.keys['KeyS']) direction.z += 1;
        if (this.keys['KeyA']) direction.x -= 1;
        if (this.keys['KeyD']) direction.x += 1;
        
        if (direction.length() > 0) {
            direction.normalize();
            
            // Apply camera rotation to movement direction
            const cameraDirection = new THREE.Vector3();
            this.camera.getWorldDirection(cameraDirection);
            
            const right = new THREE.Vector3();
            right.crossVectors(cameraDirection, this.camera.up).normalize();
            
            const forward = new THREE.Vector3();
            forward.crossVectors(this.camera.up, right).normalize();
            
            const movement = new THREE.Vector3();
            movement.addScaledVector(right, direction.x * speed);
            movement.addScaledVector(forward, direction.z * speed);
            
            this.camera.position.add(movement);
        }
    }
    
    handleCameraRotation(deltaX, deltaY) {
        if (this.gameState !== 'playing') return;
        
        // Horizontal rotation (Y-axis)
        this.camera.rotateY(-deltaX * this.mouseSensitivity);
        
        // Vertical rotation (X-axis) - limit to prevent flipping
        const currentRotation = this.camera.rotation.x;
        const newRotation = currentRotation - deltaY * this.mouseSensitivity;
        const maxRotation = Math.PI / 2 - 0.1; // Slightly less than 90 degrees
        
        this.camera.rotation.x = Math.max(-maxRotation, Math.min(maxRotation, newRotation));
    }
    
    updateUI() {
        document.getElementById('goldAmount').textContent = this.gold;
        document.getElementById('livesAmount').textContent = this.lives;
        document.getElementById('energyAmount').textContent = this.energy;
        document.getElementById('currentWave').textContent = this.currentWave;
        document.getElementById('currentLevel').textContent = this.currentLevel;
        document.getElementById('enemiesLeft').textContent = this.enemies.length;
        
        // Update season display
        const seasonDisplay = document.getElementById('seasonDisplay');
        seasonDisplay.innerHTML = `${this.seasonEmojis[this.currentSeason]}<br>${this.seasons[this.currentSeason]}`;
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        alert('Game Over! The enemies have breached your defenses.');
        // Could implement a proper game over screen here
    }
    
    gameWin() {
        this.gameState = 'won';
        alert('Congratulations! You have successfully defended against all waves across all seasons!');
        // Could implement a proper victory screen here
    }
    
    animate() {
        if (this.gameState === 'loading') return;
        
        requestAnimationFrame(() => this.animate());
        
        const currentTime = Date.now();
        const deltaTime = (currentTime - (this.lastTime || currentTime)) / 1000;
        this.lastTime = currentTime;
        
        // Handle input via InputManager
        if (this.inputManager) {
            this.inputManager.update(deltaTime);
        }
        
        // Update cursor manager
        if (this.cursorManager) {
            this.cursorManager.update(deltaTime);
        }
        
        // Update camera system
        if (this.cameraSystem) {
            this.cameraSystem.update(deltaTime);
            this.camera = this.cameraSystem.getActiveCamera(); // Update camera reference
        }
        
        // Update mouse position for raycasting (handled by InputManager)
        if (this.inputManager) {
            this.mouseVector.set(this.inputManager.mouse.x, this.inputManager.mouse.y);
        }
        
        // Update tower preview (range indicator follows cursor)
        this.updateTowerPreview();
        
        // Game logic updates
        if (this.gameState === 'playing') {
            // Spawn enemies during active wave
            if (this.waveActive && this.enemiesSpawned < this.enemiesInWave) {
                if (currentTime - this.waveStartTime > this.enemiesSpawned * this.spawnInterval) {
                    this.spawnEnemy();
                }
            }
            
            this.updateEnemies(deltaTime);
            this.updateTowers(deltaTime);
            this.updateProjectiles(deltaTime);
            this.updateParticles(deltaTime);
        }
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }
    
    updateTowerPreview() {
        // Tower preview updates are now handled by the visual cursor system
        // The cursor manager automatically updates position and validity
        if (this.cursorManager && this.rangeIndicator) {
            const placement = this.cursorManager.getCurrentPlacement();
            if (placement && placement.worldPosition) {
                this.rangeIndicator.position.copy(placement.worldPosition);
                this.rangeIndicator.position.y = 1;
            }
        }
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    new TowerDefenseGame();
});


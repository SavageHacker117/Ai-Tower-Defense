// Enhanced Tower Defense Game with High-Performance Animation System
// Integrating Supercharged JavaScript Graphics techniques

class EnhancedTowerDefenseGame extends TowerDefenseGame {
    constructor() {
        super();
        
        // Initialize high-performance animation engine
        this.animationEngine = new HighPerformanceAnimationEngine('gameCanvas', 1200, 1200);
        
        // Enhanced graphics systems
        this.particleSystem = new ParticleSystem(2000);
        this.explosionSystem = new ExplosionSystem();
        this.trailSystem = new TrailSystem();
        
        // Performance monitoring
        this.performanceStats = {
            drawCalls: 0,
            particleCount: 0,
            spriteCount: 0
        };
        
        // Enhanced visual effects
        this.lightingSystem = new LightingSystem();
        this.weatherSystem = new WeatherSystem();
        
        this.initializeEnhancedGraphics();
    }
    
    initializeEnhancedGraphics() {
        // Load sprite sheets for enhanced animations
        this.loadSpriteSheets();
        
        // Initialize enhanced tower animations
        this.initializeTowerAnimations();
        
        // Initialize enhanced enemy animations
        this.initializeEnemyAnimations();
        
        // Initialize enhanced projectile animations
        this.initializeProjectileAnimations();
        
        // Initialize enhanced effects
        this.initializeEffectAnimations();
        
        // Start the enhanced animation engine
        this.animationEngine.start();
    }
    
    async loadSpriteSheets() {
        try {
            // Load tower sprite sheets
            const towerSheet = await this.animationEngine.loadImage('/assets/towers-spritesheet.png', 'towers');
            this.animationEngine.createSpriteSheet(towerSheet, 64, 64, 'towers');
            
            // Load enemy sprite sheets
            const enemySheet = await this.animationEngine.loadImage('/assets/enemies-spritesheet.png', 'enemies');
            this.animationEngine.createSpriteSheet(enemySheet, 32, 32, 'enemies');
            
            // Load projectile sprite sheets
            const projectileSheet = await this.animationEngine.loadImage('/assets/projectiles-spritesheet.png', 'projectiles');
            this.animationEngine.createSpriteSheet(projectileSheet, 16, 16, 'projectiles');
            
            // Load effect sprite sheets
            const effectSheet = await this.animationEngine.loadImage('/assets/effects-spritesheet.png', 'effects');
            this.animationEngine.createSpriteSheet(effectSheet, 64, 64, 'effects');
            
        } catch (error) {
            console.log('Sprite sheets not found, using procedural graphics');
            this.createProceduralSpriteSheets();
        }
    }
    
    createProceduralSpriteSheets() {
        // Create procedural sprite sheets when assets aren't available
        this.createTowerSpriteSheet();
        this.createEnemySpriteSheet();
        this.createProjectileSpriteSheet();
        this.createEffectSpriteSheet();
    }
    
    createTowerSpriteSheet() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Draw different tower types
        const towerTypes = [
            { color: '#8B4513', name: 'Basic' },
            { color: '#FF0000', name: 'Laser' },
            { color: '#FFA500', name: 'Missile' },
            { color: '#FFFF00', name: 'Lightning' },
            { color: '#00FFFF', name: 'Ice' },
            { color: '#FF00FF', name: 'Plasma' },
            { color: '#0000FF', name: 'Tesla' },
            { color: '#800080', name: 'Cannon' }
        ];
        
        towerTypes.forEach((tower, index) => {
            const x = (index % 8) * 64 + 32;
            const y = Math.floor(index / 8) * 64 + 32;
            
            // Draw tower base
            ctx.fillStyle = tower.color;
            ctx.fillRect(x - 24, y - 24, 48, 48);
            
            // Draw tower barrel
            ctx.fillStyle = '#333333';
            ctx.fillRect(x - 4, y - 32, 8, 16);
            
            // Add glow effect
            ctx.shadowColor = tower.color;
            ctx.shadowBlur = 10;
            ctx.fillRect(x - 20, y - 20, 40, 40);
            ctx.shadowBlur = 0;
        });
        
        this.animationEngine.imageCache.set('towers', canvas);
        this.animationEngine.createSpriteSheet(canvas, 64, 64, 'towers');
    }
    
    createEnemySpriteSheet() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Draw different enemy types with animation frames
        const enemyTypes = [
            { color: '#FF0000', size: 12 },
            { color: '#00FF00', size: 16 },
            { color: '#0000FF', size: 20 },
            { color: '#FFFF00', size: 24 },
            { color: '#FF00FF', size: 28 },
            { color: '#00FFFF', size: 32 }
        ];
        
        enemyTypes.forEach((enemy, index) => {
            for (let frame = 0; frame < 4; frame++) {
                const x = (frame * 32) + 16;
                const y = (index * 32) + 16;
                
                // Animate size for walking effect
                const animSize = enemy.size + Math.sin(frame * Math.PI / 2) * 2;
                
                ctx.fillStyle = enemy.color;
                ctx.beginPath();
                ctx.arc(x, y, animSize / 2, 0, Math.PI * 2);
                ctx.fill();
                
                // Add eyes
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.arc(x - 4, y - 2, 2, 0, Math.PI * 2);
                ctx.arc(x + 4, y - 2, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        
        this.animationEngine.imageCache.set('enemies', canvas);
        this.animationEngine.createSpriteSheet(canvas, 32, 32, 'enemies');
    }
    
    createProjectileSpriteSheet() {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        const projectileTypes = [
            { color: '#FFFF00', trail: true },
            { color: '#FF0000', trail: false },
            { color: '#00FF00', trail: true },
            { color: '#0000FF', trail: false }
        ];
        
        projectileTypes.forEach((proj, index) => {
            const x = (index % 4) * 16 + 8;
            const y = Math.floor(index / 4) * 16 + 8;
            
            if (proj.trail) {
                // Draw trail effect
                ctx.fillStyle = proj.color + '40';
                ctx.fillRect(x - 6, y - 6, 12, 12);
            }
            
            ctx.fillStyle = proj.color;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
        
        this.animationEngine.imageCache.set('projectiles', canvas);
        this.animationEngine.createSpriteSheet(canvas, 16, 16, 'projectiles');
    }
    
    createEffectSpriteSheet() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Create explosion animation frames
        for (let frame = 0; frame < 8; frame++) {
            const x = (frame % 8) * 64 + 32;
            const y = 32;
            const size = (frame + 1) * 6;
            const alpha = 1 - (frame / 8);
            
            ctx.save();
            ctx.globalAlpha = alpha;
            
            // Explosion core
            ctx.fillStyle = '#FFFF00';
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
            
            // Explosion outer ring
            ctx.fillStyle = '#FF4500';
            ctx.beginPath();
            ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
        
        this.animationEngine.imageCache.set('effects', canvas);
        this.animationEngine.createSpriteSheet(canvas, 64, 64, 'effects');
    }
    
    initializeTowerAnimations() {
        // Enhanced tower animations with sprite sheets
        this.towerAnimations = new Map();
        
        Object.keys(this.towerTypes).forEach((towerType, index) => {
            const animation = {
                idle: [index],
                firing: [index, index, index, index], // Could be different frames
                upgrading: [index, index + 8, index, index + 8] // Flashing effect
            };
            this.towerAnimations.set(towerType, animation);
        });
    }
    
    initializeEnemyAnimations() {
        // Enhanced enemy animations
        this.enemyAnimations = new Map();
        
        const enemyTypes = ['basic', 'fast', 'heavy', 'armored', 'stealth', 'boss'];
        enemyTypes.forEach((enemyType, index) => {
            const animation = {
                walking: [index * 4, index * 4 + 1, index * 4 + 2, index * 4 + 3],
                dying: [index * 4 + 3, index * 4 + 2, index * 4 + 1, index * 4]
            };
            this.enemyAnimations.set(enemyType, animation);
        });
    }
    
    initializeProjectileAnimations() {
        // Enhanced projectile animations
        this.projectileAnimations = new Map();
        
        Object.keys(this.towerTypes).forEach((towerType, index) => {
            const animation = {
                flying: [index],
                impact: [index, index, index, index]
            };
            this.projectileAnimations.set(towerType, animation);
        });
    }
    
    initializeEffectAnimations() {
        // Enhanced effect animations
        this.effectAnimations = new Map();
        
        this.effectAnimations.set('explosion', {
            frames: [0, 1, 2, 3, 4, 5, 6, 7],
            duration: 0.5
        });
        
        this.effectAnimations.set('muzzleFlash', {
            frames: [8, 9, 10],
            duration: 0.1
        });
    }
    
    // Override tower creation to use enhanced sprites
    createTower(x, y, type) {
        const tower = super.createTower(x, y, type);
        
        // Create enhanced sprite for tower
        const sprite = new Sprite(x, y, 64, 64);
        sprite.setSpriteSheet('towers', this.towerAnimations.get(type).idle);
        sprite.play(0.2); // Slow idle animation
        
        // Add to animation engine
        this.animationEngine.addSprite(`tower_${tower.id}`, sprite);
        
        // Enhanced tower properties
        tower.sprite = sprite;
        tower.animationState = 'idle';
        tower.lastFireTime = 0;
        
        return tower;
    }
    
    // Override enemy creation to use enhanced sprites
    createEnemy(type, path) {
        const enemy = super.createEnemy(type, path);
        
        // Create enhanced sprite for enemy
        const sprite = new Sprite(enemy.x, enemy.y, 32, 32);
        const enemyType = this.getEnemyTypeByStats(enemy);
        sprite.setSpriteSheet('enemies', this.enemyAnimations.get(enemyType).walking);
        sprite.play(0.15); // Walking animation
        
        // Add to animation engine
        this.animationEngine.addSprite(`enemy_${enemy.id}`, sprite);
        
        // Enhanced enemy properties
        enemy.sprite = sprite;
        enemy.animationState = 'walking';
        enemy.trailEffect = new TrailEffect(enemy.x, enemy.y);
        
        return enemy;
    }
    
    // Override projectile creation to use enhanced sprites
    createProjectile(tower, target) {
        const projectile = super.createProjectile(tower, target);
        
        // Create enhanced sprite for projectile
        const sprite = new Sprite(projectile.x, projectile.y, 16, 16);
        sprite.setSpriteSheet('projectiles', this.projectileAnimations.get(tower.type).flying);
        sprite.compositeOperation = 'lighter'; // Additive blending for glow
        
        // Add to animation engine
        this.animationEngine.addSprite(`projectile_${projectile.id}`, sprite);
        
        // Enhanced projectile properties
        projectile.sprite = sprite;
        projectile.trailEffect = new TrailEffect(projectile.x, projectile.y);
        
        return projectile;
    }
    
    // Enhanced update method with performance optimizations
    update(deltaTime) {
        // Update performance stats
        this.performanceStats.drawCalls = 0;
        this.performanceStats.particleCount = this.particleSystem.particles.length;
        this.performanceStats.spriteCount = this.animationEngine.sprites.size;
        
        // Update base game logic
        super.update(deltaTime);
        
        // Update enhanced systems
        this.particleSystem.update(deltaTime);
        this.explosionSystem.update(deltaTime);
        this.trailSystem.update(deltaTime);
        this.lightingSystem.update(deltaTime);
        this.weatherSystem.update(deltaTime);
        
        // Update sprite positions to match game objects
        this.updateSpritePositions();
        
        // Update visual effects
        this.updateVisualEffects(deltaTime);
    }
    
    updateSpritePositions() {
        // Update tower sprites
        this.towers.forEach(tower => {
            if (tower.sprite) {
                tower.sprite.x = tower.x;
                tower.sprite.y = tower.y;
                
                // Update animation state based on tower activity
                if (performance.now() - tower.lastFireTime < 200) {
                    if (tower.animationState !== 'firing') {
                        tower.animationState = 'firing';
                        tower.sprite.setSpriteSheet('towers', this.towerAnimations.get(tower.type).firing);
                        tower.sprite.play(0.05);
                    }
                } else {
                    if (tower.animationState !== 'idle') {
                        tower.animationState = 'idle';
                        tower.sprite.setSpriteSheet('towers', this.towerAnimations.get(tower.type).idle);
                        tower.sprite.play(0.2);
                    }
                }
            }
        });
        
        // Update enemy sprites
        this.enemies.forEach(enemy => {
            if (enemy.sprite) {
                enemy.sprite.x = enemy.x;
                enemy.sprite.y = enemy.y;
                
                // Update trail effect
                if (enemy.trailEffect) {
                    enemy.trailEffect.update(enemy.x, enemy.y, deltaTime);
                }
            }
        });
        
        // Update projectile sprites
        this.projectiles.forEach(projectile => {
            if (projectile.sprite) {
                projectile.sprite.x = projectile.x;
                projectile.sprite.y = projectile.y;
                
                // Calculate rotation based on velocity
                projectile.sprite.rotation = Math.atan2(projectile.vy, projectile.vx);
                
                // Update trail effect
                if (projectile.trailEffect) {
                    projectile.trailEffect.update(projectile.x, projectile.y, deltaTime);
                }
            }
        });
    }
    
    updateVisualEffects(deltaTime) {
        // Update particle effects for towers
        this.towers.forEach(tower => {
            if (tower.animationState === 'firing') {
                // Create muzzle flash particles
                this.particleSystem.emit(tower.x, tower.y - 20, 5, {
                    speed: 50,
                    life: 0.2,
                    size: 3,
                    color: '#FFFF00'
                });
            }
        });
        
        // Update hit effects
        this.projectiles.forEach(projectile => {
            if (projectile.hit) {
                // Create explosion effect
                this.createExplosionEffect(projectile.x, projectile.y, projectile.type);
                
                // Remove projectile sprite
                this.animationEngine.removeSprite(`projectile_${projectile.id}`);
            }
        });
    }
    
    createExplosionEffect(x, y, type) {
        // Create explosion sprite
        const explosion = new Sprite(x, y, 64, 64);
        explosion.setSpriteSheet('effects', this.effectAnimations.get('explosion').frames);
        explosion.play(this.effectAnimations.get('explosion').duration / 8);
        explosion.loop = false;
        explosion.compositeOperation = 'lighter';
        
        // Add to animation engine
        const explosionId = `explosion_${Date.now()}_${Math.random()}`;
        this.animationEngine.addSprite(explosionId, explosion);
        
        // Remove after animation completes
        setTimeout(() => {
            this.animationEngine.removeSprite(explosionId);
        }, this.effectAnimations.get('explosion').duration * 1000);
        
        // Create particle explosion
        this.particleSystem.emit(x, y, 20, {
            speed: 150,
            life: 0.8,
            size: 4,
            color: this.getExplosionColor(type),
            gravity: 100
        });
        
        // Screen shake effect
        this.createScreenShake(5, 0.2);
    }
    
    getExplosionColor(towerType) {
        const colors = {
            'basic': '#FFA500',
            'laser': '#FF0000',
            'missile': '#FFFF00',
            'lightning': '#00FFFF',
            'ice': '#87CEEB',
            'plasma': '#FF00FF',
            'tesla': '#0000FF',
            'cannon': '#FF4500'
        };
        return colors[towerType] || '#FFA500';
    }
    
    getEnemyTypeByStats(enemy) {
        // Determine enemy type based on stats
        if (enemy.health > 200) return 'boss';
        if (enemy.health > 100) return 'heavy';
        if (enemy.speed > 80) return 'fast';
        if (enemy.armor > 0) return 'armored';
        return 'basic';
    }
    
    createScreenShake(intensity, duration) {
        // Implement screen shake effect
        const originalTransform = this.animationEngine.canvas.style.transform;
        const startTime = performance.now();
        
        const shake = () => {
            const elapsed = (performance.now() - startTime) / 1000;
            if (elapsed < duration) {
                const x = (Math.random() - 0.5) * intensity;
                const y = (Math.random() - 0.5) * intensity;
                this.animationEngine.canvas.style.transform = `translate(${x}px, ${y}px)`;
                requestAnimationFrame(shake);
            } else {
                this.animationEngine.canvas.style.transform = originalTransform;
            }
        };
        
        shake();
    }
    
    // Enhanced render method
    render() {
        // The animation engine handles most rendering
        // We just need to render additional effects
        
        const ctx = this.animationEngine.offscreenCtx;
        
        // Render particle systems
        this.particleSystem.render(ctx);
        this.explosionSystem.render(ctx);
        this.trailSystem.render(ctx);
        
        // Render lighting effects
        this.lightingSystem.render(ctx);
        
        // Render weather effects
        this.weatherSystem.render(ctx);
        
        // Render performance stats
        this.renderPerformanceStats(ctx);
    }
    
    renderPerformanceStats(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, 10, 200, 80);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px monospace';
        ctx.fillText(`Sprites: ${this.performanceStats.spriteCount}`, 15, 25);
        ctx.fillText(`Particles: ${this.performanceStats.particleCount}`, 15, 40);
        ctx.fillText(`Draw Calls: ${this.performanceStats.drawCalls}`, 15, 55);
        ctx.fillText(`Memory: ${this.getMemoryUsage()}MB`, 15, 70);
        
        ctx.restore();
    }
    
    getMemoryUsage() {
        if (performance.memory) {
            return Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
        }
        return 'N/A';
    }
}

// Trail Effect System
class TrailEffect {
    constructor(x, y, maxPoints = 10) {
        this.points = [];
        this.maxPoints = maxPoints;
        this.lastX = x;
        this.lastY = y;
    }
    
    update(x, y, deltaTime) {
        // Add new point if moved enough
        const distance = Math.sqrt((x - this.lastX) ** 2 + (y - this.lastY) ** 2);
        if (distance > 5) {
            this.points.push({ x, y, life: 1.0 });
            this.lastX = x;
            this.lastY = y;
            
            // Remove old points
            if (this.points.length > this.maxPoints) {
                this.points.shift();
            }
        }
        
        // Update point life
        for (let i = this.points.length - 1; i >= 0; i--) {
            this.points[i].life -= deltaTime * 2;
            if (this.points[i].life <= 0) {
                this.points.splice(i, 1);
            }
        }
    }
    
    render(ctx) {
        if (this.points.length < 2) return;
        
        ctx.save();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        
        for (let i = 1; i < this.points.length; i++) {
            const point = this.points[i];
            const prevPoint = this.points[i - 1];
            
            ctx.globalAlpha = point.life * 0.5;
            ctx.beginPath();
            ctx.moveTo(prevPoint.x, prevPoint.y);
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
        }
        
        ctx.restore();
    }
}

// Explosion System
class ExplosionSystem {
    constructor() {
        this.explosions = [];
    }
    
    update(deltaTime) {
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            this.explosions[i].update(deltaTime);
            if (this.explosions[i].finished) {
                this.explosions.splice(i, 1);
            }
        }
    }
    
    render(ctx) {
        this.explosions.forEach(explosion => explosion.render(ctx));
    }
    
    addExplosion(x, y, type = 'default') {
        this.explosions.push(new Explosion(x, y, type));
    }
}

class Explosion {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.life = 1.0;
        this.maxLife = 1.0;
        this.size = 0;
        this.maxSize = 50;
        this.finished = false;
    }
    
    update(deltaTime) {
        this.life -= deltaTime * 2;
        this.size = (1 - this.life) * this.maxSize;
        
        if (this.life <= 0) {
            this.finished = true;
        }
    }
    
    render(ctx) {
        const alpha = this.life;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.globalCompositeOperation = 'lighter';
        
        // Inner explosion
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Outer explosion
        ctx.fillStyle = '#FF4500';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// Trail System
class TrailSystem {
    constructor() {
        this.trails = [];
    }
    
    update(deltaTime) {
        this.trails.forEach(trail => trail.update(deltaTime));
        this.trails = this.trails.filter(trail => trail.points.length > 0);
    }
    
    render(ctx) {
        this.trails.forEach(trail => trail.render(ctx));
    }
    
    addTrail(x, y, config = {}) {
        this.trails.push(new TrailEffect(x, y, config.maxPoints || 10));
    }
}

// Lighting System
class LightingSystem {
    constructor() {
        this.lights = [];
    }
    
    update(deltaTime) {
        this.lights.forEach(light => light.update(deltaTime));
        this.lights = this.lights.filter(light => !light.finished);
    }
    
    render(ctx) {
        if (this.lights.length === 0) return;
        
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        
        this.lights.forEach(light => {
            const gradient = ctx.createRadialGradient(
                light.x, light.y, 0,
                light.x, light.y, light.radius
            );
            gradient.addColorStop(0, `rgba(${light.r}, ${light.g}, ${light.b}, ${light.intensity})`);
            gradient.addColorStop(1, `rgba(${light.r}, ${light.g}, ${light.b}, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(light.x, light.y, light.radius, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.restore();
    }
    
    addLight(x, y, radius, r, g, b, intensity = 0.3, duration = null) {
        this.lights.push({
            x, y, radius, r, g, b, intensity,
            life: duration || Infinity,
            maxLife: duration || Infinity,
            finished: false,
            update(deltaTime) {
                if (this.life !== Infinity) {
                    this.life -= deltaTime;
                    this.intensity = (this.life / this.maxLife) * 0.3;
                    if (this.life <= 0) {
                        this.finished = true;
                    }
                }
            }
        });
    }
}

// Weather System
class WeatherSystem {
    constructor() {
        this.weatherType = 'clear';
        this.particles = [];
        this.intensity = 0;
    }
    
    setWeather(type, intensity = 0.5) {
        this.weatherType = type;
        this.intensity = intensity;
        this.particles = [];
        
        // Initialize weather particles
        if (type === 'rain') {
            this.initializeRain();
        } else if (type === 'snow') {
            this.initializeSnow();
        }
    }
    
    initializeRain() {
        for (let i = 0; i < 100 * this.intensity; i++) {
            this.particles.push({
                x: Math.random() * 1200,
                y: Math.random() * 1200,
                vx: -50,
                vy: 300,
                life: 1
            });
        }
    }
    
    initializeSnow() {
        for (let i = 0; i < 50 * this.intensity; i++) {
            this.particles.push({
                x: Math.random() * 1200,
                y: Math.random() * 1200,
                vx: Math.random() * 20 - 10,
                vy: 50 + Math.random() * 50,
                life: 1,
                size: Math.random() * 3 + 1
            });
        }
    }
    
    update(deltaTime) {
        this.particles.forEach(particle => {
            particle.x += particle.vx * deltaTime;
            particle.y += particle.vy * deltaTime;
            
            // Reset particles that go off screen
            if (particle.y > 1200) {
                particle.y = -10;
                particle.x = Math.random() * 1200;
            }
            if (particle.x < -10) {
                particle.x = 1210;
            }
        });
    }
    
    render(ctx) {
        if (this.weatherType === 'clear') return;
        
        ctx.save();
        ctx.globalAlpha = this.intensity;
        
        if (this.weatherType === 'rain') {
            ctx.strokeStyle = '#87CEEB';
            ctx.lineWidth = 1;
            this.particles.forEach(particle => {
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(particle.x + particle.vx * 0.1, particle.y + particle.vy * 0.1);
                ctx.stroke();
            });
        } else if (this.weatherType === 'snow') {
            ctx.fillStyle = '#FFFFFF';
            this.particles.forEach(particle => {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            });
        }
        
        ctx.restore();
    }
}

// Initialize enhanced game when page loads
window.addEventListener('load', () => {
    // Replace the original game with enhanced version
    if (window.game) {
        window.game.stop();
    }
    window.game = new EnhancedTowerDefenseGame();
});


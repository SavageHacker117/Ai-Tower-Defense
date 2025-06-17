// High-Performance Canvas Animation System
// Based on "Supercharged JavaScript Graphics" by Raffaele Cecco
// Implements: Sprite Animation, Offscreen Buffering, Dirty Rectangles, 
// Memory-Efficient Buffers, and Composition Techniques

class HighPerformanceAnimationEngine {
    constructor(canvasId, width = 1200, height = 1200) {
        // Main canvas setup
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = width;
        this.canvas.height = height;
        
        // Offscreen canvas for buffering
        this.offscreenCanvas = document.createElement('canvas');
        this.offscreenCtx = this.offscreenCanvas.getContext('2d');
        this.offscreenCanvas.width = width;
        this.offscreenCanvas.height = height;
        
        // Performance optimization properties
        this.lastTime = 0;
        this.deltaTime = 0;
        this.fps = 0;
        this.frameCount = 0;
        this.fpsUpdateTime = 0;
        
        // Dirty rectangle system
        this.dirtyRects = [];
        this.clearDirtyRects = true;
        
        // Animation system
        this.sprites = new Map();
        this.animations = new Map();
        this.isRunning = false;
        
        // Memory pools for efficiency
        this.vectorPool = [];
        this.rectPool = [];
        
        // Asset management
        this.imageCache = new Map();
        this.spriteSheets = new Map();
        
        this.init();
    }
    
    init() {
        // Initialize performance monitoring
        this.setupPerformanceMonitoring();
        
        // Setup resize handling
        this.setupResizeHandling();
        
        // Initialize pools
        this.initializePools();
    }
    
    setupPerformanceMonitoring() {
        // FPS counter
        this.fpsElement = document.createElement('div');
        this.fpsElement.style.cssText = `
            position: fixed; top: 10px; right: 10px; 
            background: rgba(0,0,0,0.7); color: white; 
            padding: 5px 10px; font-family: monospace; 
            border-radius: 3px; z-index: 1000;
        `;
        document.body.appendChild(this.fpsElement);
    }
    
    setupResizeHandling() {
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    initializePools() {
        // Pre-allocate vector objects
        for (let i = 0; i < 100; i++) {
            this.vectorPool.push({ x: 0, y: 0 });
            this.rectPool.push({ x: 0, y: 0, width: 0, height: 0 });
        }
    }
    
    // Vector pool management
    getVector(x = 0, y = 0) {
        const vector = this.vectorPool.pop() || { x: 0, y: 0 };
        vector.x = x;
        vector.y = y;
        return vector;
    }
    
    releaseVector(vector) {
        this.vectorPool.push(vector);
    }
    
    // Rectangle pool management
    getRect(x = 0, y = 0, width = 0, height = 0) {
        const rect = this.rectPool.pop() || { x: 0, y: 0, width: 0, height: 0 };
        rect.x = x;
        rect.y = y;
        rect.width = width;
        rect.height = height;
        return rect;
    }
    
    releaseRect(rect) {
        this.rectPool.push(rect);
    }
    
    // Asset loading with caching
    async loadImage(src, key) {
        if (this.imageCache.has(key)) {
            return this.imageCache.get(key);
        }
        
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.imageCache.set(key, img);
                resolve(img);
            };
            img.onerror = reject;
            img.src = src;
        });
    }
    
    // Sprite sheet management
    createSpriteSheet(image, frameWidth, frameHeight, key) {
        const spriteSheet = {
            image,
            frameWidth,
            frameHeight,
            framesPerRow: Math.floor(image.width / frameWidth),
            totalFrames: Math.floor((image.width / frameWidth) * (image.height / frameHeight))
        };
        
        this.spriteSheets.set(key, spriteSheet);
        return spriteSheet;
    }
    
    // Dirty rectangle system
    addDirtyRect(x, y, width, height) {
        const rect = this.getRect(x, y, width, height);
        this.dirtyRects.push(rect);
    }
    
    clearDirtyRegions() {
        if (!this.clearDirtyRects || this.dirtyRects.length === 0) {
            // Clear entire canvas if no dirty rects or disabled
            this.offscreenCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            return;
        }
        
        // Clear only dirty regions
        for (const rect of this.dirtyRects) {
            this.offscreenCtx.clearRect(rect.x, rect.y, rect.width, rect.height);
            this.releaseRect(rect);
        }
        this.dirtyRects.length = 0;
    }
    
    // Main game loop with high-resolution timing
    start() {
        this.isRunning = true;
        this.lastTime = performance.now();
        this.gameLoop();
    }
    
    stop() {
        this.isRunning = false;
    }
    
    gameLoop() {
        if (!this.isRunning) return;
        
        const currentTime = performance.now();
        this.deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = currentTime;
        
        // Update FPS counter
        this.updateFPS(currentTime);
        
        // Update all sprites and animations
        this.update(this.deltaTime);
        
        // Render to offscreen canvas
        this.render();
        
        // Copy offscreen canvas to main canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.offscreenCanvas, 0, 0);
        
        // Continue loop
        requestAnimationFrame(() => this.gameLoop());
    }
    
    updateFPS(currentTime) {
        this.frameCount++;
        if (currentTime - this.fpsUpdateTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.fpsUpdateTime = currentTime;
            this.fpsElement.textContent = `FPS: ${this.fps} | Sprites: ${this.sprites.size}`;
        }
    }
    
    update(deltaTime) {
        // Update all sprites
        for (const [id, sprite] of this.sprites) {
            sprite.update(deltaTime);
        }
        
        // Update all animations
        for (const [id, animation] of this.animations) {
            animation.update(deltaTime);
        }
    }
    
    render() {
        // Clear dirty regions
        this.clearDirtyRegions();
        
        // Render all sprites to offscreen canvas
        for (const [id, sprite] of this.sprites) {
            if (sprite.visible) {
                sprite.render(this.offscreenCtx);
                
                // Add sprite bounds to dirty rects for next frame
                this.addDirtyRect(
                    sprite.x - sprite.width/2, 
                    sprite.y - sprite.height/2, 
                    sprite.width, 
                    sprite.height
                );
            }
        }
    }
    
    // Sprite management
    addSprite(id, sprite) {
        this.sprites.set(id, sprite);
        sprite.engine = this;
    }
    
    removeSprite(id) {
        const sprite = this.sprites.get(id);
        if (sprite) {
            sprite.destroy();
            this.sprites.delete(id);
        }
    }
    
    getSprite(id) {
        return this.sprites.get(id);
    }
    
    // Animation management
    addAnimation(id, animation) {
        this.animations.set(id, animation);
        animation.engine = this;
    }
    
    removeAnimation(id) {
        this.animations.delete(id);
    }
    
    handleResize() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.offscreenCanvas.width = rect.width;
        this.offscreenCanvas.height = rect.height;
    }
}

// High-Performance Sprite Class
class Sprite {
    constructor(x = 0, y = 0, width = 32, height = 32) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotation = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.alpha = 1;
        this.visible = true;
        
        // Animation properties
        this.currentFrame = 0;
        this.frameTime = 0;
        this.frameDuration = 1/12; // 12 FPS default
        this.isAnimating = false;
        this.loop = true;
        
        // Sprite sheet reference
        this.spriteSheet = null;
        this.frameSequence = [];
        
        // Physics properties
        this.velocityX = 0;
        this.velocityY = 0;
        this.accelerationX = 0;
        this.accelerationY = 0;
        this.friction = 0.98;
        
        // Composition mode
        this.compositeOperation = 'source-over';
        
        // Cached transform matrix
        this.transformDirty = true;
        this.transform = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
    }
    
    // Set sprite sheet and animation
    setSpriteSheet(spriteSheetKey, frameSequence = null) {
        if (this.engine && this.engine.spriteSheets.has(spriteSheetKey)) {
            this.spriteSheet = this.engine.spriteSheets.get(spriteSheetKey);
            this.frameSequence = frameSequence || 
                Array.from({ length: this.spriteSheet.totalFrames }, (_, i) => i);
            this.width = this.spriteSheet.frameWidth;
            this.height = this.spriteSheet.frameHeight;
        }
    }
    
    // Animation control
    play(frameDuration = null) {
        this.isAnimating = true;
        if (frameDuration !== null) {
            this.frameDuration = frameDuration;
        }
    }
    
    pause() {
        this.isAnimating = false;
    }
    
    stop() {
        this.isAnimating = false;
        this.currentFrame = 0;
        this.frameTime = 0;
    }
    
    setFrame(frameIndex) {
        this.currentFrame = Math.max(0, Math.min(frameIndex, this.frameSequence.length - 1));
    }
    
    // Update sprite
    update(deltaTime) {
        // Update physics
        this.velocityX += this.accelerationX * deltaTime;
        this.velocityY += this.accelerationY * deltaTime;
        
        this.velocityX *= this.friction;
        this.velocityY *= this.friction;
        
        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;
        
        // Update animation
        if (this.isAnimating && this.frameSequence.length > 1) {
            this.frameTime += deltaTime;
            
            if (this.frameTime >= this.frameDuration) {
                this.frameTime = 0;
                this.currentFrame++;
                
                if (this.currentFrame >= this.frameSequence.length) {
                    if (this.loop) {
                        this.currentFrame = 0;
                    } else {
                        this.currentFrame = this.frameSequence.length - 1;
                        this.isAnimating = false;
                    }
                }
            }
        }
        
        this.transformDirty = true;
    }
    
    // Render sprite with optimizations
    render(ctx) {
        if (!this.visible || this.alpha <= 0) return;
        
        ctx.save();
        
        // Set composite operation
        ctx.globalCompositeOperation = this.compositeOperation;
        ctx.globalAlpha = this.alpha;
        
        // Apply transform
        ctx.translate(this.x, this.y);
        if (this.rotation !== 0) {
            ctx.rotate(this.rotation);
        }
        if (this.scaleX !== 1 || this.scaleY !== 1) {
            ctx.scale(this.scaleX, this.scaleY);
        }
        
        // Draw sprite
        if (this.spriteSheet) {
            this.drawSpriteFrame(ctx);
        } else {
            this.drawRect(ctx);
        }
        
        ctx.restore();
    }
    
    drawSpriteFrame(ctx) {
        const frameIndex = this.frameSequence[this.currentFrame] || 0;
        const sheet = this.spriteSheet;
        
        const frameX = (frameIndex % sheet.framesPerRow) * sheet.frameWidth;
        const frameY = Math.floor(frameIndex / sheet.framesPerRow) * sheet.frameHeight;
        
        ctx.drawImage(
            sheet.image,
            frameX, frameY, sheet.frameWidth, sheet.frameHeight,
            -this.width/2, -this.height/2, this.width, this.height
        );
    }
    
    drawRect(ctx) {
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
    }
    
    // Collision detection
    getBounds() {
        return {
            left: this.x - this.width/2,
            right: this.x + this.width/2,
            top: this.y - this.height/2,
            bottom: this.y + this.height/2
        };
    }
    
    intersects(other) {
        const a = this.getBounds();
        const b = other.getBounds();
        
        return !(a.right < b.left || a.left > b.right || 
                a.bottom < b.top || a.top > b.bottom);
    }
    
    destroy() {
        this.spriteSheet = null;
        this.frameSequence = null;
        this.engine = null;
    }
}

// Particle System for Effects
class ParticleSystem {
    constructor(maxParticles = 1000) {
        this.particles = [];
        this.maxParticles = maxParticles;
        this.particlePool = [];
        
        // Pre-allocate particles
        for (let i = 0; i < maxParticles; i++) {
            this.particlePool.push(new Particle());
        }
    }
    
    emit(x, y, count = 10, config = {}) {
        for (let i = 0; i < count && this.particles.length < this.maxParticles; i++) {
            const particle = this.particlePool.pop();
            if (particle) {
                particle.reset(x, y, config);
                this.particles.push(particle);
            }
        }
    }
    
    update(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update(deltaTime);
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
                this.particlePool.push(particle);
            }
        }
    }
    
    render(ctx) {
        for (const particle of this.particles) {
            particle.render(ctx);
        }
    }
}

class Particle {
    constructor() {
        this.reset(0, 0);
    }
    
    reset(x, y, config = {}) {
        this.x = x;
        this.y = y;
        this.velocityX = (Math.random() - 0.5) * (config.speed || 100);
        this.velocityY = (Math.random() - 0.5) * (config.speed || 100);
        this.life = config.life || 1;
        this.maxLife = this.life;
        this.size = config.size || 2;
        this.color = config.color || '#ffffff';
        this.gravity = config.gravity || 0;
    }
    
    update(deltaTime) {
        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;
        this.velocityY += this.gravity * deltaTime;
        this.life -= deltaTime;
    }
    
    render(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
        ctx.restore();
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HighPerformanceAnimationEngine, Sprite, ParticleSystem };
}


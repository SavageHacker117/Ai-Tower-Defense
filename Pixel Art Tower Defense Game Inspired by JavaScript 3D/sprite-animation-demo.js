// Demo: High-Performance Sprite Animation System
// Showcasing techniques from "Supercharged JavaScript Graphics"

class SpriteAnimationDemo {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.canvas.style.border = '2px solid #333';
        
        // Create demo container
        this.container = document.createElement('div');
        this.container.style.cssText = `
            position: fixed; top: 50%; left: 50%; 
            transform: translate(-50%, -50%);
            background: #222; padding: 20px; border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
        `;
        
        // Add title
        const title = document.createElement('h2');
        title.textContent = 'High-Performance Sprite Animation Demo';
        title.style.cssText = 'color: white; text-align: center; margin: 0 0 10px 0;';
        
        // Add controls
        this.controls = this.createControls();
        
        this.container.appendChild(title);
        this.container.appendChild(this.canvas);
        this.container.appendChild(this.controls);
        document.body.appendChild(this.container);
        
        // Initialize animation system
        this.animationEngine = new HighPerformanceAnimationEngine();
        this.animationEngine.canvas = this.canvas;
        this.animationEngine.ctx = this.ctx;
        this.animationEngine.offscreenCanvas = document.createElement('canvas');
        this.animationEngine.offscreenCtx = this.animationEngine.offscreenCanvas.getContext('2d');
        this.animationEngine.offscreenCanvas.width = 800;
        this.animationEngine.offscreenCanvas.height = 600;
        
        this.init();
    }
    
    createControls() {
        const controls = document.createElement('div');
        controls.style.cssText = 'margin-top: 10px; text-align: center;';
        
        // Play/Pause button
        this.playButton = document.createElement('button');
        this.playButton.textContent = 'Pause';
        this.playButton.onclick = () => this.toggleAnimation();
        
        // Speed control
        const speedLabel = document.createElement('label');
        speedLabel.textContent = 'Speed: ';
        speedLabel.style.color = 'white';
        speedLabel.style.marginLeft = '10px';
        
        this.speedSlider = document.createElement('input');
        this.speedSlider.type = 'range';
        this.speedSlider.min = '0.1';
        this.speedSlider.max = '3';
        this.speedSlider.step = '0.1';
        this.speedSlider.value = '1';
        this.speedSlider.onchange = () => this.updateSpeed();
        
        // Add sprite button
        const addSpriteButton = document.createElement('button');
        addSpriteButton.textContent = 'Add Walking Character';
        addSpriteButton.style.marginLeft = '10px';
        addSpriteButton.onclick = () => this.addWalkingCharacter();
        
        // Clear button
        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear All';
        clearButton.style.marginLeft = '10px';
        clearButton.onclick = () => this.clearAllSprites();
        
        // Close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close Demo';
        closeButton.style.marginLeft = '10px';
        closeButton.onclick = () => this.close();
        
        controls.appendChild(this.playButton);
        controls.appendChild(speedLabel);
        controls.appendChild(this.speedSlider);
        controls.appendChild(addSpriteButton);
        controls.appendChild(clearButton);
        controls.appendChild(closeButton);
        
        return controls;
    }
    
    async init() {
        // Create procedural sprite sheet for walking character
        this.createWalkingSpriteSheet();
        
        // Add initial walking characters
        for (let i = 0; i < 5; i++) {
            this.addWalkingCharacter();
        }
        
        // Start animation
        this.animationEngine.start();
    }
    
    createWalkingSpriteSheet() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Create 4 frames of walking animation
        for (let frame = 0; frame < 4; frame++) {
            const x = frame * 64 + 32;
            const y = 32;
            
            // Body
            ctx.fillStyle = '#4A90E2';
            ctx.fillRect(x - 12, y - 20, 24, 30);
            
            // Head
            ctx.fillStyle = '#F5A623';
            ctx.beginPath();
            ctx.arc(x, y - 25, 8, 0, Math.PI * 2);
            ctx.fill();
            
            // Legs (animated)
            ctx.fillStyle = '#4A90E2';
            const legOffset = Math.sin(frame * Math.PI / 2) * 8;
            
            // Left leg
            ctx.fillRect(x - 8, y + 10, 6, 15 + legOffset);
            // Right leg  
            ctx.fillRect(x + 2, y + 10, 6, 15 - legOffset);
            
            // Arms (animated)
            const armOffset = Math.sin(frame * Math.PI / 2) * 6;
            
            // Left arm
            ctx.fillRect(x - 18, y - 10 + armOffset, 6, 20);
            // Right arm
            ctx.fillRect(x + 12, y - 10 - armOffset, 6, 20);
        }
        
        this.animationEngine.imageCache.set('walking', canvas);
        this.animationEngine.createSpriteSheet(canvas, 64, 64, 'walking');
    }
    
    addWalkingCharacter() {
        const x = Math.random() * (this.canvas.width - 64) + 32;
        const y = Math.random() * (this.canvas.height - 64) + 32;
        
        const sprite = new Sprite(x, y, 64, 64);
        sprite.setSpriteSheet('walking', [0, 1, 2, 3]);
        sprite.play(0.2); // 5 FPS animation
        
        // Add random movement
        sprite.velocityX = (Math.random() - 0.5) * 100;
        sprite.velocityY = (Math.random() - 0.5) * 100;
        
        // Bounce off edges
        sprite.update = function(deltaTime) {
            // Call parent update
            Sprite.prototype.update.call(this, deltaTime);
            
            // Bounce off edges
            if (this.x < 32 || this.x > 768) {
                this.velocityX *= -1;
            }
            if (this.y < 32 || this.y > 568) {
                this.velocityY *= -1;
            }
            
            // Keep in bounds
            this.x = Math.max(32, Math.min(768, this.x));
            this.y = Math.max(32, Math.min(568, this.y));
        };
        
        const id = `character_${Date.now()}_${Math.random()}`;
        this.animationEngine.addSprite(id, sprite);
    }
    
    toggleAnimation() {
        if (this.animationEngine.isRunning) {
            this.animationEngine.stop();
            this.playButton.textContent = 'Play';
        } else {
            this.animationEngine.start();
            this.playButton.textContent = 'Pause';
        }
    }
    
    updateSpeed() {
        const speed = parseFloat(this.speedSlider.value);
        for (const [id, sprite] of this.animationEngine.sprites) {
            sprite.frameDuration = 0.2 / speed;
        }
    }
    
    clearAllSprites() {
        this.animationEngine.sprites.clear();
    }
    
    close() {
        this.animationEngine.stop();
        document.body.removeChild(this.container);
    }
}

// Add demo button to the game
function addDemoButton() {
    const demoButton = document.createElement('button');
    demoButton.textContent = '🎬 Animation Demo';
    demoButton.style.cssText = `
        position: fixed; top: 10px; left: 10px; 
        background: #4A90E2; color: white; border: none; 
        padding: 10px 15px; border-radius: 5px; 
        cursor: pointer; z-index: 1000;
        font-size: 14px; font-weight: bold;
    `;
    demoButton.onclick = () => new SpriteAnimationDemo();
    document.body.appendChild(demoButton);
}

// Add demo button when page loads
window.addEventListener('load', () => {
    setTimeout(addDemoButton, 1000);
});


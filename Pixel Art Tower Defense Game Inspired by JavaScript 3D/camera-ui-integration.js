// Camera Mode Indicator UI Component
// Displays current camera mode and provides visual feedback

class CameraModeIndicator {
    constructor(cameraSystem) {
        this.cameraSystem = cameraSystem;
        this.element = null;
        this.modeIcons = {
            strategic: '🎯',
            orbit: '🌍',
            free: '🚁',
            follow: '👁️',
            cinematic: '🎬'
        };
        this.modeNames = {
            strategic: 'Strategic',
            orbit: 'Orbit',
            free: 'Free Fly',
            follow: 'Follow',
            cinematic: 'Cinematic'
        };
        
        this.init();
    }
    
    init() {
        this.createElement();
        this.update();
        
        // Update indicator when camera mode changes
        setInterval(() => {
            this.update();
        }, 100);
    }
    
    createElement() {
        this.element = document.createElement('div');
        this.element.id = 'camera-mode-indicator';
        this.element.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            font-weight: bold;
            z-index: 1000;
            border: 2px solid #ffd700;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
            text-align: center;
            min-width: 120px;
        `;
        
        document.body.appendChild(this.element);
    }
    
    update() {
        if (!this.cameraSystem) return;
        
        const currentMode = this.cameraSystem.getCurrentMode();
        const icon = this.modeIcons[currentMode] || '📷';
        const name = this.modeNames[currentMode] || 'Unknown';
        
        this.element.innerHTML = `${icon} ${name}`;
        
        // Add transition effect when mode changes
        if (this.lastMode !== currentMode) {
            this.element.style.transform = 'translateX(-50%) scale(1.2)';
            setTimeout(() => {
                this.element.style.transform = 'translateX(-50%) scale(1)';
            }, 200);
            this.lastMode = currentMode;
        }
    }
    
    show() {
        this.element.style.opacity = '1';
        this.element.style.visibility = 'visible';
    }
    
    hide() {
        this.element.style.opacity = '0';
        this.element.style.visibility = 'hidden';
    }
    
    dispose() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

// Enhanced UI Integration for 3D Camera System
class CameraUIIntegration {
    constructor(cameraSystem, gameInstance) {
        this.cameraSystem = cameraSystem;
        this.game = gameInstance;
        this.modeIndicator = null;
        this.crosshair = null;
        this.minimap = null;
        
        this.init();
    }
    
    init() {
        this.createModeIndicator();
        this.createCrosshair();
        this.createMinimap();
        this.setupKeyboardShortcuts();
    }
    
    createModeIndicator() {
        this.modeIndicator = new CameraModeIndicator(this.cameraSystem);
    }
    
    createCrosshair() {
        this.crosshair = document.createElement('div');
        this.crosshair.id = 'camera-crosshair';
        this.crosshair.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 999;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        // Add crosshair lines
        const horizontal = document.createElement('div');
        horizontal.style.cssText = `
            position: absolute;
            top: 50%;
            left: 10%;
            right: 10%;
            height: 2px;
            background: rgba(255, 255, 255, 0.8);
            transform: translateY(-50%);
        `;
        
        const vertical = document.createElement('div');
        vertical.style.cssText = `
            position: absolute;
            left: 50%;
            top: 10%;
            bottom: 10%;
            width: 2px;
            background: rgba(255, 255, 255, 0.8);
            transform: translateX(-50%);
        `;
        
        this.crosshair.appendChild(horizontal);
        this.crosshair.appendChild(vertical);
        document.body.appendChild(this.crosshair);
        
        // Show crosshair only in free camera mode
        setInterval(() => {
            const mode = this.cameraSystem.getCurrentMode();
            this.crosshair.style.opacity = mode === 'free' ? '1' : '0';
        }, 100);
    }
    
    createMinimap() {
        this.minimap = document.createElement('div');
        this.minimap.id = 'camera-minimap';
        this.minimap.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 150px;
            height: 150px;
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #ffd700;
            border-radius: 10px;
            z-index: 1000;
            overflow: hidden;
        `;
        
        // Create minimap canvas
        const canvas = document.createElement('canvas');
        canvas.width = 146;
        canvas.height = 146;
        canvas.style.cssText = `
            width: 100%;
            height: 100%;
        `;
        
        this.minimap.appendChild(canvas);
        document.body.appendChild(this.minimap);
        
        this.minimapCanvas = canvas;
        this.minimapCtx = canvas.getContext('2d');
        
        // Update minimap
        setInterval(() => {
            this.updateMinimap();
        }, 200);
    }
    
    updateMinimap() {
        const ctx = this.minimapCtx;
        const canvas = this.minimapCanvas;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background
        ctx.fillStyle = 'rgba(50, 150, 50, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 10; i++) {
            const x = (i / 10) * canvas.width;
            const y = (i / 10) * canvas.height;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        // Draw camera position
        const camera = this.cameraSystem.getActiveCamera();
        if (camera) {
            const x = ((camera.position.x + 600) / 1200) * canvas.width;
            const z = ((camera.position.z + 600) / 1200) * canvas.height;
            
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(x, z, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw camera direction
            const direction = new THREE.Vector3();
            camera.getWorldDirection(direction);
            
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, z);
            ctx.lineTo(x + direction.x * 20, z + direction.z * 20);
            ctx.stroke();
        }
        
        // Draw towers
        if (this.game && this.game.towers) {
            ctx.fillStyle = '#0000ff';
            this.game.towers.forEach(tower => {
                const x = ((tower.position.x + 600) / 1200) * canvas.width;
                const z = ((tower.position.z + 600) / 1200) * canvas.height;
                ctx.beginPath();
                ctx.arc(x, z, 2, 0, Math.PI * 2);
                ctx.fill();
            });
        }
        
        // Draw enemies
        if (this.game && this.game.enemies) {
            ctx.fillStyle = '#ff8800';
            this.game.enemies.forEach(enemy => {
                const x = ((enemy.position.x + 600) / 1200) * canvas.width;
                const z = ((enemy.position.z + 600) / 1200) * canvas.height;
                ctx.beginPath();
                ctx.arc(x, z, 1.5, 0, Math.PI * 2);
                ctx.fill();
            });
        }
    }
    
    setupKeyboardShortcuts() {
        // Add visual feedback for camera mode changes
        document.addEventListener('keydown', (event) => {
            if (event.code === 'KeyC' || event.code === 'KeyV') {
                this.showModeChangeEffect();
            }
        });
    }
    
    showModeChangeEffect() {
        // Create a brief flash effect
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 215, 0, 0.1);
            pointer-events: none;
            z-index: 9999;
            animation: cameraFlash 0.3s ease-out;
        `;
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes cameraFlash {
                0% { opacity: 1; }
                100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(flash);
        
        setTimeout(() => {
            document.body.removeChild(flash);
            document.head.removeChild(style);
        }, 300);
    }
    
    // Public methods for game integration
    showUI() {
        this.modeIndicator.show();
        this.minimap.style.display = 'block';
    }
    
    hideUI() {
        this.modeIndicator.hide();
        this.minimap.style.display = 'none';
    }
    
    dispose() {
        if (this.modeIndicator) {
            this.modeIndicator.dispose();
        }
        
        if (this.crosshair && this.crosshair.parentNode) {
            this.crosshair.parentNode.removeChild(this.crosshair);
        }
        
        if (this.minimap && this.minimap.parentNode) {
            this.minimap.parentNode.removeChild(this.minimap);
        }
    }
}


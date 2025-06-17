// Fixed Input Manager for Tower Defense Game
// Separates tower interactions from camera controls to prevent conflicts

class InputManager {
    constructor(game) {
        this.game = game;
        this.canvas = game.canvas;
        this.camera = game.camera;
        this.scene = game.scene;
        
        // Input state
        this.mouse = {
            x: 0,
            y: 0,
            worldX: 0,
            worldY: 0,
            isDown: false,
            button: -1,
            lastClickTime: 0
        };
        
        this.keys = {};
        
        // Raycasting
        this.raycaster = new THREE.Raycaster();
        this.mouseVector = new THREE.Vector2();
        
        // Input modes
        this.inputMode = 'camera'; // 'camera', 'tower_placement', 'ui'
        this.isPointerLocked = false;
        
        // Event handling flags
        this.preventCameraMovement = false;
        this.preventTowerPlacement = false;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Mouse events with proper event handling
        this.canvas.addEventListener('mousemove', (event) => {
            this.handleMouseMove(event);
        }, { passive: false });
        
        this.canvas.addEventListener('mousedown', (event) => {
            this.handleMouseDown(event);
        }, { passive: false });
        
        this.canvas.addEventListener('mouseup', (event) => {
            this.handleMouseUp(event);
        }, { passive: false });
        
        this.canvas.addEventListener('wheel', (event) => {
            this.handleMouseWheel(event);
        }, { passive: false });
        
        this.canvas.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });
        
        // Keyboard events
        document.addEventListener('keydown', (event) => {
            this.handleKeyDown(event);
        });
        
        document.addEventListener('keyup', (event) => {
            this.handleKeyUp(event);
        });
        
        // Pointer lock events
        document.addEventListener('pointerlockchange', () => {
            this.isPointerLocked = document.pointerLockElement === this.canvas;
        });
        
        // UI button events (isolated from game input)
        this.setupUIEvents();
    }
    
    setupUIEvents() {
        // Tower selection buttons
        document.querySelectorAll('.tower-button').forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                const towerType = parseInt(button.dataset.tower);
                this.selectTowerType(towerType);
            });
        });
        
        // Start wave button
        const startWaveBtn = document.getElementById('startWaveBtn');
        if (startWaveBtn) {
            startWaveBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                this.game.toggleWave();
            });
        }
    }
    
    handleMouseMove(event) {
        event.preventDefault();
        
        // Update mouse position
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Update mouse vector for raycasting
        this.mouseVector.set(this.mouse.x, this.mouse.y);
        
        // Handle camera rotation only if appropriate
        if (this.shouldHandleCameraMovement() && this.mouse.isDown && this.mouse.button === 2) {
            // Right mouse button for camera rotation
            this.handleCameraRotation(event.movementX, event.movementY);
        }
        
        // Update tower preview position
        this.updateTowerPreview();
    }
    
    handleMouseDown(event) {
        event.preventDefault();
        event.stopPropagation();
        
        this.mouse.isDown = true;
        this.mouse.button = event.button;
        this.mouse.lastClickTime = Date.now();
        
        // Determine input mode based on context
        this.determineInputMode(event);
        
        // Handle different mouse buttons
        switch (event.button) {
            case 0: // Left click
                this.handleLeftClick(event);
                break;
            case 1: // Middle click
                this.handleMiddleClick(event);
                break;
            case 2: // Right click
                this.handleRightClick(event);
                break;
        }
    }
    
    handleMouseUp(event) {
        event.preventDefault();
        
        this.mouse.isDown = false;
        this.mouse.button = -1;
        
        // Reset input mode
        this.inputMode = 'camera';
        this.preventCameraMovement = false;
    }
    
    handleMouseWheel(event) {
        event.preventDefault();
        
        // Only handle zoom if not over UI elements
        if (!this.isOverUI(event)) {
            this.handleCameraZoom(event.deltaY);
        }
    }
    
    handleLeftClick(event) {
        // Check if clicking on UI elements
        if (this.isOverUI(event)) {
            return; // Let UI handle it
        }
        
        // Check if tower is selected for placement
        if (this.game.selectedTowerType && this.inputMode === 'tower_placement') {
            this.placeTower();
            return;
        }
        
        // Check if clicking on existing tower for selection/upgrade
        const clickedTower = this.getTowerAtMousePosition();
        if (clickedTower) {
            this.selectTower(clickedTower);
            return;
        }
        
        // Default: camera interaction
        this.inputMode = 'camera';
    }
    
    handleRightClick(event) {
        // Right click for camera rotation
        if (!this.isOverUI(event)) {
            this.inputMode = 'camera';
            // Camera rotation will be handled in mousemove
        }
    }
    
    handleMiddleClick(event) {
        // Middle click for camera panning
        if (!this.isOverUI(event)) {
            this.inputMode = 'camera';
        }
    }
    
    handleKeyDown(event) {
        this.keys[event.code] = true;
        
        // Tower selection hotkeys
        const num = parseInt(event.key);
        if (num >= 1 && num <= 9) {
            event.preventDefault();
            this.selectTowerType(num);
            return;
        }
        
        // Special tower hotkeys
        const specialKeys = {
            '0': 10, 'q': 11, 'Q': 11, 'e': 12, 'E': 12,
            'r': 13, 'R': 13, 't': 14, 'T': 14, 'y': 15, 'Y': 15
        };
        
        if (specialKeys[event.key]) {
            event.preventDefault();
            this.selectTowerType(specialKeys[event.key]);
            return;
        }
        
        // Game controls
        if (event.code === 'Space') {
            event.preventDefault();
            this.game.toggleWave();
            return;
        }
        
        // Escape to cancel tower selection
        if (event.code === 'Escape') {
            event.preventDefault();
            this.cancelTowerSelection();
            return;
        }
    }
    
    handleKeyUp(event) {
        this.keys[event.code] = false;
    }
    
    // Helper methods
    determineInputMode(event) {
        if (this.isOverUI(event)) {
            this.inputMode = 'ui';
            this.preventCameraMovement = true;
            return;
        }
        
        if (this.game.selectedTowerType) {
            this.inputMode = 'tower_placement';
            this.preventCameraMovement = true;
            return;
        }
        
        this.inputMode = 'camera';
        this.preventCameraMovement = false;
    }
    
    isOverUI(event) {
        const element = document.elementFromPoint(event.clientX, event.clientY);
        return element && (
            element.classList.contains('tower-button') ||
            element.closest('#gameUI') ||
            element.closest('#instructions') ||
            element.id === 'startWaveBtn'
        );
    }
    
    shouldHandleCameraMovement() {
        return !this.preventCameraMovement && 
               this.inputMode === 'camera' && 
               this.game.gameState === 'playing';
    }
    
    getTowerAtMousePosition() {
        this.raycaster.setFromCamera(this.mouseVector, this.game.camera);
        
        // Check intersection with towers
        const towerMeshes = this.game.towers.map(tower => tower.children).flat();
        const intersects = this.raycaster.intersectObjects(towerMeshes);
        
        if (intersects.length > 0) {
            // Find the parent tower object
            let object = intersects[0].object;
            while (object.parent && !object.userData.type) {
                object = object.parent;
            }
            return object.userData.type ? object : null;
        }
        
        return null;
    }
    
    selectTowerType(type) {
        if (this.game.towerTypes[type] && this.game.gold >= this.game.towerTypes[type].cost) {
            this.game.selectedTowerType = type;
            this.inputMode = 'tower_placement';
            
            // Update UI
            document.querySelectorAll('.tower-button').forEach(btn => {
                btn.classList.remove('selected');
            });
            const button = document.querySelector(`[data-tower=\"${type}\"]`);
            if (button) {
                button.classList.add('selected');
            }
            
            // Show preview
            this.game.showTowerPreview(type);
            
            // Set timeout for auto-cancel
            if (this.game.previewTimeout) {
                clearTimeout(this.game.previewTimeout);
            }
            
            this.game.previewTimeout = setTimeout(() => {
                this.cancelTowerSelection();
            }, 10000);
        }
    }
    
    cancelTowerSelection() {
        this.game.selectedTowerType = null;
        this.inputMode = 'camera';
        this.preventCameraMovement = false;
        
        this.game.clearTowerPreview();
        document.querySelectorAll('.tower-button').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        if (this.game.previewTimeout) {
            clearTimeout(this.game.previewTimeout);
            this.game.previewTimeout = null;
        }
    }
    
    placeTower() {
        if (!this.game.selectedTowerType) return;
        
        this.raycaster.setFromCamera(this.mouseVector, this.game.camera);
        const intersects = this.raycaster.intersectObject(this.game.ground);
        
        if (intersects.length > 0) {
            const point = intersects[0].point;
            const gridX = Math.floor((point.x + this.game.gridWidth * this.game.gridSize / 2) / this.game.gridSize);
            const gridZ = Math.floor((point.z + this.game.gridHeight * this.game.gridSize / 2) / this.game.gridSize);
            
            if (this.game.isValidTowerPlacement(gridX, gridZ)) {
                const towerData = this.game.towerTypes[this.game.selectedTowerType];
                
                if (this.game.gold >= towerData.cost) {
                    const tower = this.game.createTower(this.game.selectedTowerType, gridX, gridZ);
                    this.game.towers.push(tower);
                    this.game.scene.add(tower);
                    
                    this.game.gold -= towerData.cost;
                    this.game.grid[gridX][gridZ].occupied = true;
                    this.game.grid[gridX][gridZ].tower = tower;
                    
                    this.game.updateUI();
                    this.cancelTowerSelection();
                    
                    // Ensure camera controls are restored
                    this.inputMode = 'camera';
                    this.preventCameraMovement = false;
                }
            }
        }
    }
    
    selectTower(tower) {
        // Handle tower selection for upgrades/info
        console.log('Tower selected:', tower.userData);
        // Add tower selection logic here
    }
    
    updateTowerPreview() {
        if (this.game.towerPreview && this.inputMode === 'tower_placement') {
            this.raycaster.setFromCamera(this.mouseVector, this.game.camera);
            const intersects = this.raycaster.intersectObject(this.game.ground);
            
            if (intersects.length > 0) {
                this.game.towerPreview.position.copy(intersects[0].point);
                this.game.towerPreview.position.y = 15;
                
                if (this.game.rangeIndicator) {
                    this.game.rangeIndicator.position.copy(intersects[0].point);
                    this.game.rangeIndicator.position.y = 1;
                }
            }
        }
    }
    
    handleCameraRotation(deltaX, deltaY) {
        if (!this.shouldHandleCameraMovement()) return;
        
        // Use the game's camera system if available
        if (this.game.cameraSystem) {
            // Let the advanced camera system handle rotation
            return;
        }
        
        // Fallback to basic camera rotation
        this.game.camera.rotateY(-deltaX * this.game.mouseSensitivity);
        
        const currentRotation = this.game.camera.rotation.x;
        const newRotation = currentRotation - deltaY * this.game.mouseSensitivity;
        const maxRotation = Math.PI / 2 - 0.1;
        
        this.game.camera.rotation.x = Math.max(-maxRotation, Math.min(maxRotation, newRotation));
    }
    
    handleCameraZoom(delta) {
        if (!this.shouldHandleCameraMovement()) return;
        
        // Use the camera system's zoom if available
        if (this.game.cameraSystem) {
            // Let the advanced camera system handle zoom
            return;
        }
        
        // Fallback zoom
        const zoomSpeed = 10;
        const direction = new THREE.Vector3();
        this.game.camera.getWorldDirection(direction);
        direction.multiplyScalar(delta > 0 ? zoomSpeed : -zoomSpeed);
        this.game.camera.position.add(direction);
    }
    
    // Public methods for game integration
    update(deltaTime) {
        // Handle camera movement
        if (this.shouldHandleCameraMovement()) {
            this.handleCameraMovement(deltaTime);
        }
    }
    
    handleCameraMovement(deltaTime) {
        if (this.game.cameraSystem) {
            // Let the advanced camera system handle movement
            return;
        }
        
        // Fallback camera movement
        const speed = this.game.cameraSpeed * deltaTime;
        const direction = new THREE.Vector3();
        
        if (this.keys['KeyW']) direction.z -= 1;
        if (this.keys['KeyS']) direction.z += 1;
        if (this.keys['KeyA']) direction.x -= 1;
        if (this.keys['KeyD']) direction.x += 1;
        
        if (direction.length() > 0) {
            direction.normalize();
            
            const cameraDirection = new THREE.Vector3();
            this.game.camera.getWorldDirection(cameraDirection);
            
            const right = new THREE.Vector3();
            right.crossVectors(cameraDirection, this.game.camera.up).normalize();
            
            const forward = new THREE.Vector3();
            forward.crossVectors(this.game.camera.up, right).normalize();
            
            const movement = new THREE.Vector3();
            movement.addScaledVector(right, direction.x * speed);
            movement.addScaledVector(forward, direction.z * speed);
            
            this.game.camera.position.add(movement);
        }
    }
    
    dispose() {
        // Clean up event listeners
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.canvas.removeEventListener('mousedown', this.handleMouseDown);
        this.canvas.removeEventListener('mouseup', this.handleMouseUp);
        this.canvas.removeEventListener('wheel', this.handleMouseWheel);
        
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
    }
}


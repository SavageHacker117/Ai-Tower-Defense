// Advanced Visual Cursor Indicator System for Tower Defense
// Provides real-time visual feedback for tower placement

class VisualCursorIndicator {
    constructor(scene, camera, ground, game) {
        this.scene = scene;
        this.camera = camera;
        this.ground = ground;
        this.game = game;
        
        // Cursor components
        this.cursorGroup = null;
        this.placementRing = null;
        this.gridMarker = null;
        this.validityIndicator = null;
        this.pulseRing = null;
        
        // State
        this.isVisible = false;
        this.isValidPlacement = false;
        this.currentGridX = -1;
        this.currentGridZ = -1;
        this.lastUpdateTime = 0;
        
        // Animation properties
        this.pulseTime = 0;
        this.rotationSpeed = 0.5;
        this.pulseSpeed = 2.0;
        this.snapSpeed = 8.0;
        
        // Colors
        this.colors = {
            valid: 0x00ff00,      // Green for valid placement
            invalid: 0xff0000,    // Red for invalid placement
            neutral: 0xffffff,    // White for neutral state
            grid: 0x888888,       // Gray for grid lines
            pulse: 0x00ffff       // Cyan for pulse effect
        };
        
        // Raycasting
        this.raycaster = new THREE.Raycaster();
        this.mouseVector = new THREE.Vector2();
        
        this.createCursorComponents();
    }
    
    createCursorComponents() {
        // Create main cursor group
        this.cursorGroup = new THREE.Group();
        this.cursorGroup.visible = false;
        this.scene.add(this.cursorGroup);
        
        // Create placement ring (main indicator)
        this.createPlacementRing();
        
        // Create grid marker (shows grid alignment)
        this.createGridMarker();
        
        // Create validity indicator (color-coded feedback)
        this.createValidityIndicator();
        
        // Create pulse ring (animated feedback)
        this.createPulseRing();
    }
    
    createPlacementRing() {
        const ringGeometry = new THREE.RingGeometry(20, 25, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.neutral,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        
        this.placementRing = new THREE.Mesh(ringGeometry, ringMaterial);
        this.placementRing.rotation.x = -Math.PI / 2;
        this.placementRing.position.y = 0.5;
        this.cursorGroup.add(this.placementRing);
    }
    
    createGridMarker() {
        const gridSize = this.game.gridSize;
        const gridGeometry = new THREE.PlaneGeometry(gridSize, gridSize);
        
        // Create grid lines using LineSegments
        const gridPoints = [];
        const halfSize = gridSize / 2;
        
        // Horizontal lines
        for (let i = -2; i <= 2; i++) {
            const y = (i * gridSize) / 4;
            gridPoints.push(-halfSize, y, 0.1);
            gridPoints.push(halfSize, y, 0.1);
        }
        
        // Vertical lines
        for (let i = -2; i <= 2; i++) {
            const x = (i * gridSize) / 4;
            gridPoints.push(x, -halfSize, 0.1);
            gridPoints.push(x, halfSize, 0.1);
        }
        
        const gridLinesGeometry = new THREE.BufferGeometry();
        gridLinesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(gridPoints, 3));
        
        const gridLinesMaterial = new THREE.LineBasicMaterial({
            color: this.colors.grid,
            transparent: true,
            opacity: 0.4
        });
        
        this.gridMarker = new THREE.LineSegments(gridLinesGeometry, gridLinesMaterial);
        this.gridMarker.rotation.x = -Math.PI / 2;
        this.gridMarker.position.y = 0.2;
        this.cursorGroup.add(this.gridMarker);
    }
    
    createValidityIndicator() {
        // Create a subtle glow effect for validity
        const glowGeometry = new THREE.RingGeometry(25, 30, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.valid,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        
        this.validityIndicator = new THREE.Mesh(glowGeometry, glowMaterial);
        this.validityIndicator.rotation.x = -Math.PI / 2;
        this.validityIndicator.position.y = 0.3;
        this.cursorGroup.add(this.validityIndicator);
    }
    
    createPulseRing() {
        const pulseGeometry = new THREE.RingGeometry(15, 18, 32);
        const pulseMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.pulse,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide
        });
        
        this.pulseRing = new THREE.Mesh(pulseGeometry, pulseMaterial);
        this.pulseRing.rotation.x = -Math.PI / 2;
        this.pulseRing.position.y = 0.4;
        this.cursorGroup.add(this.pulseRing);
    }
    
    show() {
        this.isVisible = true;
        this.cursorGroup.visible = true;
    }
    
    hide() {
        this.isVisible = false;
        this.cursorGroup.visible = false;
    }
    
    updatePosition(mouseX, mouseY) {
        if (!this.isVisible) return;
        
        // Update mouse vector
        this.mouseVector.set(mouseX, mouseY);
        
        // Raycast to find ground intersection
        this.raycaster.setFromCamera(this.mouseVector, this.camera);
        const intersects = this.raycaster.intersectObject(this.ground);
        
        if (intersects.length > 0) {
            const intersectionPoint = intersects[0].point;
            
            // Convert world position to grid coordinates
            const gridX = Math.floor((intersectionPoint.x + this.game.gridWidth * this.game.gridSize / 2) / this.game.gridSize);
            const gridZ = Math.floor((intersectionPoint.z + this.game.gridHeight * this.game.gridSize / 2) / this.game.gridSize);
            
            // Snap to grid center
            const worldX = (gridX - this.game.gridWidth / 2) * this.game.gridSize;
            const worldZ = (gridZ - this.game.gridHeight / 2) * this.game.gridSize;
            
            // Smooth movement to target position
            const targetPosition = new THREE.Vector3(worldX, 0, worldZ);
            this.cursorGroup.position.lerp(targetPosition, this.snapSpeed * 0.016); // Assuming 60fps
            
            // Update grid coordinates
            this.currentGridX = gridX;
            this.currentGridZ = gridZ;
            
            // Check placement validity
            this.updateValidityState();
        }
    }
    
    updateValidityState() {
        // Check if current position is valid for tower placement
        const isValid = this.game.isValidTowerPlacement(this.currentGridX, this.currentGridZ);
        
        if (isValid !== this.isValidPlacement) {
            this.isValidPlacement = isValid;
            this.updateVisualState();
        }
    }
    
    updateVisualState() {
        const color = this.isValidPlacement ? this.colors.valid : this.colors.invalid;
        
        // Update placement ring color
        this.placementRing.material.color.setHex(color);
        
        // Update validity indicator
        this.validityIndicator.material.color.setHex(color);
        this.validityIndicator.material.opacity = this.isValidPlacement ? 0.3 : 0.5;
        
        // Update grid marker opacity
        this.gridMarker.material.opacity = this.isValidPlacement ? 0.4 : 0.6;
        
        // Show/hide pulse ring based on validity
        this.pulseRing.visible = this.isValidPlacement;
    }
    
    update(deltaTime) {
        if (!this.isVisible) return;
        
        this.pulseTime += deltaTime * this.pulseSpeed;
        
        // Animate placement ring rotation
        this.placementRing.rotation.z += this.rotationSpeed * deltaTime;
        
        // Animate pulse ring
        if (this.pulseRing.visible) {
            const pulseScale = 1 + Math.sin(this.pulseTime) * 0.1;
            this.pulseRing.scale.set(pulseScale, pulseScale, 1);
            
            const pulseOpacity = 0.6 + Math.sin(this.pulseTime * 2) * 0.2;
            this.pulseRing.material.opacity = pulseOpacity;
        }
        
        // Animate validity indicator glow
        if (this.isValidPlacement) {
            const glowIntensity = 0.3 + Math.sin(this.pulseTime * 1.5) * 0.1;
            this.validityIndicator.material.opacity = glowIntensity;
        }
    }
    
    // Get current placement information
    getPlacementInfo() {
        return {
            gridX: this.currentGridX,
            gridZ: this.currentGridZ,
            worldPosition: this.cursorGroup.position.clone(),
            isValid: this.isValidPlacement,
            isVisible: this.isVisible
        };
    }
    
    // Set custom colors
    setColors(colorConfig) {
        Object.assign(this.colors, colorConfig);
        this.updateVisualState();
    }
    
    // Dispose of resources
    dispose() {
        if (this.cursorGroup) {
            this.scene.remove(this.cursorGroup);
            
            // Dispose geometries and materials
            this.cursorGroup.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(material => material.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
        }
    }
}

// Enhanced Cursor Manager for Tower Defense Game
class TowerPlacementCursorManager {
    constructor(game) {
        this.game = game;
        this.scene = game.scene;
        this.camera = game.camera;
        this.ground = game.ground;
        
        // Cursor indicators for different tower types
        this.cursors = new Map();
        this.activeCursor = null;
        this.currentTowerType = null;
        
        // Performance optimization
        this.updateThrottle = 16; // ~60fps
        this.lastUpdateTime = 0;
        
        // Mouse tracking
        this.mousePosition = { x: 0, y: 0 };
        this.isMouseOverGame = false;
        
        this.init();
    }
    
    init() {
        // Create default cursor
        this.createDefaultCursor();
        
        // Setup mouse tracking
        this.setupMouseTracking();
    }
    
    createDefaultCursor() {
        const defaultCursor = new VisualCursorIndicator(
            this.scene, 
            this.camera, 
            this.ground, 
            this.game
        );
        
        this.cursors.set('default', defaultCursor);
    }
    
    createTowerTypeCursor(towerType) {
        const cursor = new VisualCursorIndicator(
            this.scene, 
            this.camera, 
            this.ground, 
            this.game
        );
        
        // Customize cursor based on tower type
        const towerData = this.game.towerTypes[towerType];
        if (towerData) {
            // Set cursor colors based on tower
            const customColors = {
                valid: this.getTowerValidColor(towerData),
                invalid: 0xff4444,
                neutral: towerData.color,
                pulse: this.getTowerPulseColor(towerData)
            };
            cursor.setColors(customColors);
        }
        
        this.cursors.set(towerType, cursor);
        return cursor;
    }
    
    getTowerValidColor(towerData) {
        // Return different valid colors based on tower type
        const colorMap = {
            'Basic Tower': 0x44ff44,
            'Laser Tower': 0xff4444,
            'Missile Tower': 0x4444ff,
            'Lightning Tower': 0xffff44,
            'Ice Tower': 0x44ffff
        };
        return colorMap[towerData.name] || 0x44ff44;
    }
    
    getTowerPulseColor(towerData) {
        // Return pulse colors that match tower theme
        const pulseMap = {
            'Basic Tower': 0x88ff88,
            'Laser Tower': 0xff8888,
            'Missile Tower': 0x8888ff,
            'Lightning Tower': 0xffff88,
            'Ice Tower': 0x88ffff
        };
        return pulseMap[towerData.name] || 0x88ffff;
    }
    
    setupMouseTracking() {
        // Track mouse position for cursor updates
        this.game.canvas.addEventListener('mousemove', (event) => {
            const rect = this.game.canvas.getBoundingClientRect();
            this.mousePosition.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mousePosition.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            this.isMouseOverGame = true;
        });
        
        this.game.canvas.addEventListener('mouseleave', () => {
            this.isMouseOverGame = false;
            this.hideAllCursors();
        });
        
        this.game.canvas.addEventListener('mouseenter', () => {
            this.isMouseOverGame = true;
            if (this.currentTowerType) {
                this.showCursorForTower(this.currentTowerType);
            }
        });
    }
    
    showCursorForTower(towerType) {
        this.currentTowerType = towerType;
        
        // Hide current cursor
        if (this.activeCursor) {
            this.activeCursor.hide();
        }
        
        // Get or create cursor for tower type
        let cursor = this.cursors.get(towerType);
        if (!cursor) {
            cursor = this.createTowerTypeCursor(towerType);
        }
        
        // Show new cursor
        this.activeCursor = cursor;
        if (this.isMouseOverGame) {
            this.activeCursor.show();
        }
    }
    
    hideCursor() {
        if (this.activeCursor) {
            this.activeCursor.hide();
        }
        this.activeCursor = null;
        this.currentTowerType = null;
    }
    
    hideAllCursors() {
        this.cursors.forEach(cursor => cursor.hide());
    }
    
    update(deltaTime) {
        const currentTime = Date.now();
        
        // Throttle updates for performance
        if (currentTime - this.lastUpdateTime < this.updateThrottle) {
            return;
        }
        this.lastUpdateTime = currentTime;
        
        // Update active cursor
        if (this.activeCursor && this.activeCursor.isVisible && this.isMouseOverGame) {
            this.activeCursor.updatePosition(this.mousePosition.x, this.mousePosition.y);
            this.activeCursor.update(deltaTime);
        }
    }
    
    // Get current placement information
    getCurrentPlacement() {
        if (this.activeCursor) {
            return this.activeCursor.getPlacementInfo();
        }
        return null;
    }
    
    // Check if cursor is showing valid placement
    isValidPlacement() {
        const placement = this.getCurrentPlacement();
        return placement && placement.isValid;
    }
    
    // Get grid coordinates for placement
    getPlacementCoordinates() {
        const placement = this.getCurrentPlacement();
        if (placement && placement.isValid) {
            return {
                gridX: placement.gridX,
                gridZ: placement.gridZ,
                worldPosition: placement.worldPosition
            };
        }
        return null;
    }
    
    // Dispose of all resources
    dispose() {
        this.cursors.forEach(cursor => cursor.dispose());
        this.cursors.clear();
    }
}


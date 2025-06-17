// Advanced 3D Camera System for Tower Defense Game
// Implements multiple camera modes, smooth controls, and UI integration

class Advanced3DCameraSystem {
    constructor(scene, renderer, canvas) {
        this.scene = scene;
        this.renderer = renderer;
        this.canvas = canvas;
        
        // Camera modes
        this.CAMERA_MODES = {
            STRATEGIC: 'strategic',    // Top-down strategic view
            ORBIT: 'orbit',           // Orbit around battlefield
            FREE: 'free',             // Free-flying camera
            FOLLOW: 'follow',         // Follow specific units
            CINEMATIC: 'cinematic'    // Scripted camera movements
        };
        
        this.currentMode = this.CAMERA_MODES.STRATEGIC;
        this.previousMode = null;
        
        // Camera instances
        this.cameras = {};
        this.activeCamera = null;
        
        // Control systems
        this.controls = {};
        this.inputManager = null;
        
        // Animation and transitions
        this.isTransitioning = false;
        this.transitionDuration = 1000; // ms
        this.transitionStartTime = 0;
        this.transitionFromCamera = null;
        this.transitionToCamera = null;
        
        // Performance optimization
        this.frustumCulling = true;
        this.lodSystem = true;
        this.lastUpdateTime = 0;
        this.updateInterval = 16; // ~60fps
        
        // UI integration
        this.uiElements = new Map();
        this.worldToScreenCache = new Map();
        this.screenToWorldCache = new Map();
        
        // Bounds and constraints
        this.bounds = {
            min: { x: -600, y: 50, z: -600 },
            max: { x: 600, y: 500, z: 600 }
        };
        
        this.init();
    }
    
    init() {
        this.setupCameras();
        this.setupControls();
        this.setupInputManager();
        this.setupUIIntegration();
        this.setupPerformanceOptimizations();
        
        // Set initial camera
        this.setMode(this.CAMERA_MODES.STRATEGIC);
        
        console.log('Advanced 3D Camera System initialized');
    }
    
    setupCameras() {
        const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        
        // Strategic Camera - Top-down view for tower defense
        this.cameras.strategic = new THREE.PerspectiveCamera(60, aspect, 1, 2000);
        this.cameras.strategic.position.set(0, 400, 300);
        this.cameras.strategic.lookAt(0, 0, 0);
        this.cameras.strategic.userData = {
            type: 'strategic',
            defaultPosition: { x: 0, y: 400, z: 300 },
            defaultTarget: { x: 0, y: 0, z: 0 },
            minDistance: 200,
            maxDistance: 800,
            minPolarAngle: Math.PI * 0.1,
            maxPolarAngle: Math.PI * 0.4
        };
        
        // Orbit Camera - 360° view around battlefield
        this.cameras.orbit = new THREE.PerspectiveCamera(75, aspect, 1, 2000);
        this.cameras.orbit.position.set(300, 200, 300);
        this.cameras.orbit.lookAt(0, 0, 0);
        this.cameras.orbit.userData = {
            type: 'orbit',
            target: new THREE.Vector3(0, 0, 0),
            distance: 400,
            minDistance: 100,
            maxDistance: 1000,
            minPolarAngle: 0,
            maxPolarAngle: Math.PI
        };
        
        // Free Camera - First-person style movement
        this.cameras.free = new THREE.PerspectiveCamera(90, aspect, 1, 2000);
        this.cameras.free.position.set(0, 100, 200);
        this.cameras.free.userData = {
            type: 'free',
            speed: 200,
            sensitivity: 0.002,
            acceleration: 0.1,
            friction: 0.9
        };
        
        // Follow Camera - Tracks specific objects
        this.cameras.follow = new THREE.PerspectiveCamera(70, aspect, 1, 2000);
        this.cameras.follow.position.set(0, 150, 200);
        this.cameras.follow.userData = {
            type: 'follow',
            target: null,
            offset: new THREE.Vector3(0, 50, 100),
            smoothing: 0.1,
            lookAhead: 0.2
        };
        
        // Cinematic Camera - For scripted sequences
        this.cameras.cinematic = new THREE.PerspectiveCamera(50, aspect, 1, 2000);
        this.cameras.cinematic.position.set(200, 300, 400);
        this.cameras.cinematic.userData = {
            type: 'cinematic',
            keyframes: [],
            currentKeyframe: 0,
            isPlaying: false,
            duration: 5000
        };
        
        // Set initial active camera
        this.activeCamera = this.cameras.strategic;
    }
    
    setupControls() {
        // Strategic Camera Controls (Modified OrbitControls)
        this.controls.strategic = {
            enabled: true,
            target: new THREE.Vector3(0, 0, 0),
            minDistance: 200,
            maxDistance: 800,
            minPolarAngle: Math.PI * 0.1,
            maxPolarAngle: Math.PI * 0.4,
            enableDamping: true,
            dampingFactor: 0.05,
            panSpeed: 1.0,
            rotateSpeed: 0.5,
            zoomSpeed: 1.0,
            
            update: (deltaTime) => {
                if (!this.controls.strategic.enabled) return;
                
                const camera = this.cameras.strategic;
                const spherical = new THREE.Spherical();
                spherical.setFromVector3(camera.position.clone().sub(this.controls.strategic.target));
                
                // Apply damping
                if (this.controls.strategic.enableDamping) {
                    spherical.theta *= (1 - this.controls.strategic.dampingFactor);
                    spherical.phi *= (1 - this.controls.strategic.dampingFactor);
                }
                
                // Constrain angles and distance
                spherical.phi = Math.max(this.controls.strategic.minPolarAngle, 
                                       Math.min(this.controls.strategic.maxPolarAngle, spherical.phi));
                spherical.radius = Math.max(this.controls.strategic.minDistance,
                                          Math.min(this.controls.strategic.maxDistance, spherical.radius));
                
                camera.position.setFromSpherical(spherical).add(this.controls.strategic.target);
                camera.lookAt(this.controls.strategic.target);
            }
        };
        
        // Orbit Camera Controls
        this.controls.orbit = {
            enabled: true,
            target: new THREE.Vector3(0, 0, 0),
            autoRotate: false,
            autoRotateSpeed: 2.0,
            enableDamping: true,
            dampingFactor: 0.05,
            
            update: (deltaTime) => {
                if (!this.controls.orbit.enabled) return;
                
                const camera = this.cameras.orbit;
                
                if (this.controls.orbit.autoRotate) {
                    const angle = this.controls.orbit.autoRotateSpeed * deltaTime * 0.001;
                    const spherical = new THREE.Spherical();
                    spherical.setFromVector3(camera.position.clone().sub(this.controls.orbit.target));
                    spherical.theta += angle;
                    camera.position.setFromSpherical(spherical).add(this.controls.orbit.target);
                }
                
                camera.lookAt(this.controls.orbit.target);
            }
        };
        
        // Free Camera Controls (First-person style)
        this.controls.free = {
            enabled: true,
            velocity: new THREE.Vector3(),
            acceleration: new THREE.Vector3(),
            euler: new THREE.Euler(0, 0, 0, 'YXZ'),
            
            update: (deltaTime) => {
                if (!this.controls.free.enabled) return;
                
                const camera = this.cameras.free;
                const userData = camera.userData;
                
                // Apply friction
                this.controls.free.velocity.multiplyScalar(userData.friction);
                
                // Apply acceleration
                this.controls.free.velocity.add(
                    this.controls.free.acceleration.clone().multiplyScalar(deltaTime)
                );
                
                // Apply velocity
                camera.position.add(
                    this.controls.free.velocity.clone().multiplyScalar(deltaTime)
                );
                
                // Apply rotation
                camera.rotation.copy(this.controls.free.euler);
                
                // Reset acceleration
                this.controls.free.acceleration.set(0, 0, 0);
                
                // Constrain to bounds
                this.constrainToBounds(camera);
            }
        };
        
        // Follow Camera Controls
        this.controls.follow = {
            enabled: true,
            target: null,
            
            update: (deltaTime) => {
                if (!this.controls.follow.enabled || !this.controls.follow.target) return;
                
                const camera = this.cameras.follow;
                const userData = camera.userData;
                const target = this.controls.follow.target;
                
                // Calculate desired position
                const desiredPosition = target.position.clone().add(userData.offset);
                
                // Smooth movement
                camera.position.lerp(desiredPosition, userData.smoothing);
                
                // Look at target with look-ahead
                const lookAtPosition = target.position.clone();
                if (target.userData && target.userData.velocity) {
                    lookAtPosition.add(target.userData.velocity.clone().multiplyScalar(userData.lookAhead));
                }
                
                camera.lookAt(lookAtPosition);
            }
        };
        
        // Cinematic Camera Controls
        this.controls.cinematic = {
            enabled: true,
            
            update: (deltaTime) => {
                if (!this.controls.cinematic.enabled) return;
                
                const camera = this.cameras.cinematic;
                const userData = camera.userData;
                
                if (userData.isPlaying && userData.keyframes.length > 1) {
                    this.updateCinematicCamera(deltaTime);
                }
            }
        };
    }
    
    setupInputManager() {
        this.inputManager = {
            keys: {},
            mouse: { x: 0, y: 0, deltaX: 0, deltaY: 0, buttons: 0 },
            wheel: 0,
            isPointerLocked: false,
            
            // Key mappings
            keyMap: {
                'KeyW': 'forward',
                'KeyS': 'backward',
                'KeyA': 'left',
                'KeyD': 'right',
                'KeyQ': 'up',
                'KeyE': 'down',
                'ShiftLeft': 'sprint',
                'Space': 'jump',
                'KeyC': 'camera_toggle',
                'KeyV': 'camera_reset'
            }
        };
        
        this.setupInputListeners();
    }
    
    setupInputListeners() {
        // Keyboard events
        document.addEventListener('keydown', (event) => {
            const action = this.inputManager.keyMap[event.code];
            if (action) {
                this.inputManager.keys[action] = true;
                this.handleKeyAction(action, true);
                event.preventDefault();
            }
        });
        
        document.addEventListener('keyup', (event) => {
            const action = this.inputManager.keyMap[event.code];
            if (action) {
                this.inputManager.keys[action] = false;
                this.handleKeyAction(action, false);
            }
        });
        
        // Mouse events
        this.canvas.addEventListener('mousedown', (event) => {
            this.inputManager.mouse.buttons |= (1 << event.button);
            this.handleMouseDown(event);
        });
        
        this.canvas.addEventListener('mouseup', (event) => {
            this.inputManager.mouse.buttons &= ~(1 << event.button);
            this.handleMouseUp(event);
        });
        
        this.canvas.addEventListener('mousemove', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const newX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const newY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            this.inputManager.mouse.deltaX = newX - this.inputManager.mouse.x;
            this.inputManager.mouse.deltaY = newY - this.inputManager.mouse.y;
            this.inputManager.mouse.x = newX;
            this.inputManager.mouse.y = newY;
            
            this.handleMouseMove(event);
        });
        
        // Wheel events
        this.canvas.addEventListener('wheel', (event) => {
            this.inputManager.wheel = event.deltaY;
            this.handleWheel(event);
            event.preventDefault();
        });
        
        // Pointer lock events
        document.addEventListener('pointerlockchange', () => {
            this.inputManager.isPointerLocked = document.pointerLockElement === this.canvas;
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    handleKeyAction(action, pressed) {
        switch (action) {
            case 'camera_toggle':
                if (pressed) this.toggleMode();
                break;
            case 'camera_reset':
                if (pressed) this.resetCamera();
                break;
        }
        
        // Handle movement for free camera
        if (this.currentMode === this.CAMERA_MODES.FREE) {
            this.handleFreeCameraMovement(action, pressed);
        }
    }
    
    handleFreeCameraMovement(action, pressed) {
        const camera = this.cameras.free;
        const userData = camera.userData;
        const direction = new THREE.Vector3();
        
        if (!pressed) return;
        
        switch (action) {
            case 'forward':
                camera.getWorldDirection(direction);
                this.controls.free.acceleration.add(direction.multiplyScalar(userData.speed));
                break;
            case 'backward':
                camera.getWorldDirection(direction);
                this.controls.free.acceleration.add(direction.multiplyScalar(-userData.speed));
                break;
            case 'left':
                direction.setFromMatrixColumn(camera.matrix, 0);
                this.controls.free.acceleration.add(direction.multiplyScalar(-userData.speed));
                break;
            case 'right':
                direction.setFromMatrixColumn(camera.matrix, 0);
                this.controls.free.acceleration.add(direction.multiplyScalar(userData.speed));
                break;
            case 'up':
                this.controls.free.acceleration.y += userData.speed;
                break;
            case 'down':
                this.controls.free.acceleration.y -= userData.speed;
                break;
        }
        
        // Apply sprint modifier
        if (this.inputManager.keys.sprint) {
            this.controls.free.acceleration.multiplyScalar(2);
        }
    }
    
    handleMouseDown(event) {
        if (this.currentMode === this.CAMERA_MODES.FREE && event.button === 0) {
            this.canvas.requestPointerLock();
        }
    }
    
    handleMouseUp(event) {
        // Handle mouse up events
    }
    
    handleMouseMove(event) {
        if (this.inputManager.isPointerLocked && this.currentMode === this.CAMERA_MODES.FREE) {
            const userData = this.cameras.free.userData;
            
            this.controls.free.euler.setFromQuaternion(this.cameras.free.quaternion);
            this.controls.free.euler.y -= event.movementX * userData.sensitivity;
            this.controls.free.euler.x -= event.movementY * userData.sensitivity;
            this.controls.free.euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.controls.free.euler.x));
        }
    }
    
    handleWheel(event) {
        const delta = event.deltaY * 0.001;
        
        switch (this.currentMode) {
            case this.CAMERA_MODES.STRATEGIC:
                this.zoomStrategicCamera(delta);
                break;
            case this.CAMERA_MODES.ORBIT:
                this.zoomOrbitCamera(delta);
                break;
        }
    }
    
    zoomStrategicCamera(delta) {
        const camera = this.cameras.strategic;
        const controls = this.controls.strategic;
        
        const spherical = new THREE.Spherical();
        spherical.setFromVector3(camera.position.clone().sub(controls.target));
        
        spherical.radius += delta * 50;
        spherical.radius = Math.max(controls.minDistance, 
                                  Math.min(controls.maxDistance, spherical.radius));
        
        camera.position.setFromSpherical(spherical).add(controls.target);
    }
    
    zoomOrbitCamera(delta) {
        const camera = this.cameras.orbit;
        const controls = this.controls.orbit;
        
        const spherical = new THREE.Spherical();
        spherical.setFromVector3(camera.position.clone().sub(controls.target));
        
        spherical.radius += delta * 50;
        spherical.radius = Math.max(camera.userData.minDistance,
                                  Math.min(camera.userData.maxDistance, spherical.radius));
        
        camera.position.setFromSpherical(spherical).add(controls.target);
    }
    
    handleResize() {
        const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        
        Object.values(this.cameras).forEach(camera => {
            camera.aspect = aspect;
            camera.updateProjectionMatrix();
        });
        
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.updateUIElements();
    }
    
    setupUIIntegration() {
        // Create raycaster for UI interaction
        this.raycaster = new THREE.Raycaster();
        this.mouseVector = new THREE.Vector2();
        
        // UI update system
        this.uiUpdateQueue = [];
        this.uiUpdateInterval = 100; // Update UI every 100ms
        this.lastUIUpdate = 0;
    }
    
    setupPerformanceOptimizations() {
        // Frustum culling
        this.frustum = new THREE.Frustum();
        this.cameraMatrix = new THREE.Matrix4();
        
        // LOD system
        this.lodLevels = [
            { distance: 200, detail: 'high' },
            { distance: 500, detail: 'medium' },
            { distance: 1000, detail: 'low' }
        ];
        
        // Object pooling for frequent calculations
        this.vectorPool = [];
        this.matrixPool = [];
        
        for (let i = 0; i < 100; i++) {
            this.vectorPool.push(new THREE.Vector3());
            this.matrixPool.push(new THREE.Matrix4());
        }
    }
    
    // Camera mode management
    setMode(mode) {
        if (this.isTransitioning || mode === this.currentMode) return;
        
        this.previousMode = this.currentMode;
        this.currentMode = mode;
        
        // Start transition
        this.startTransition(this.cameras[this.previousMode], this.cameras[mode]);
        
        // Update controls
        this.updateControlsForMode(mode);
        
        console.log(`Camera mode changed to: ${mode}`);
    }
    
    toggleMode() {
        const modes = Object.values(this.CAMERA_MODES);
        const currentIndex = modes.indexOf(this.currentMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        this.setMode(modes[nextIndex]);
    }
    
    resetCamera() {
        const camera = this.activeCamera;
        const userData = camera.userData;
        
        if (userData.defaultPosition) {
            camera.position.copy(userData.defaultPosition);
        }
        
        if (userData.defaultTarget) {
            camera.lookAt(userData.defaultTarget.x, userData.defaultTarget.y, userData.defaultTarget.z);
        }
    }
    
    startTransition(fromCamera, toCamera) {
        this.isTransitioning = true;
        this.transitionStartTime = Date.now();
        this.transitionFromCamera = fromCamera;
        this.transitionToCamera = toCamera;
        this.activeCamera = toCamera;
    }
    
    updateTransition() {
        if (!this.isTransitioning) return;
        
        const elapsed = Date.now() - this.transitionStartTime;
        const progress = Math.min(elapsed / this.transitionDuration, 1);
        
        // Smooth easing function
        const easeProgress = this.easeInOutCubic(progress);
        
        // Interpolate position
        this.activeCamera.position.lerpVectors(
            this.transitionFromCamera.position,
            this.transitionToCamera.position,
            easeProgress
        );
        
        // Interpolate rotation
        this.activeCamera.quaternion.slerpQuaternions(
            this.transitionFromCamera.quaternion,
            this.transitionToCamera.quaternion,
            easeProgress
        );
        
        if (progress >= 1) {
            this.isTransitioning = false;
            this.transitionFromCamera = null;
            this.transitionToCamera = null;
        }
    }
    
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
    
    updateControlsForMode(mode) {
        // Disable all controls
        Object.values(this.controls).forEach(control => {
            if (control.enabled !== undefined) control.enabled = false;
        });
        
        // Enable controls for current mode
        if (this.controls[mode]) {
            this.controls[mode].enabled = true;
        }
        
        // Special setup for specific modes
        switch (mode) {
            case this.CAMERA_MODES.ORBIT:
                this.controls.orbit.autoRotate = true;
                break;
            case this.CAMERA_MODES.FREE:
                // Request pointer lock for free camera
                break;
        }
    }
    
    // Main update loop
    update(deltaTime) {
        const currentTime = Date.now();
        
        // Throttle updates for performance
        if (currentTime - this.lastUpdateTime < this.updateInterval) {
            return;
        }
        
        this.lastUpdateTime = currentTime;
        
        // Update transition
        this.updateTransition();
        
        // Update active camera controls
        if (this.controls[this.currentMode]) {
            this.controls[this.currentMode].update(deltaTime);
        }
        
        // Update UI elements
        if (currentTime - this.lastUIUpdate > this.uiUpdateInterval) {
            this.updateUIElements();
            this.lastUIUpdate = currentTime;
        }
        
        // Update performance optimizations
        this.updatePerformanceOptimizations();
    }
    
    updatePerformanceOptimizations() {
        // Update frustum for culling
        this.cameraMatrix.multiplyMatrices(
            this.activeCamera.projectionMatrix,
            this.activeCamera.matrixWorldInverse
        );
        this.frustum.setFromProjectionMatrix(this.cameraMatrix);
        
        // Clear caches periodically
        if (this.worldToScreenCache.size > 1000) {
            this.worldToScreenCache.clear();
        }
        if (this.screenToWorldCache.size > 1000) {
            this.screenToWorldCache.clear();
        }
    }
    
    // Utility methods
    constrainToBounds(camera) {
        camera.position.x = Math.max(this.bounds.min.x, Math.min(this.bounds.max.x, camera.position.x));
        camera.position.y = Math.max(this.bounds.min.y, Math.min(this.bounds.max.y, camera.position.y));
        camera.position.z = Math.max(this.bounds.min.z, Math.min(this.bounds.max.z, camera.position.z));
    }
    
    worldToScreen(worldPosition) {
        const cacheKey = `${worldPosition.x},${worldPosition.y},${worldPosition.z}`;
        if (this.worldToScreenCache.has(cacheKey)) {
            return this.worldToScreenCache.get(cacheKey);
        }
        
        const vector = worldPosition.clone();
        vector.project(this.activeCamera);
        
        const screenPosition = {
            x: (vector.x * 0.5 + 0.5) * this.canvas.clientWidth,
            y: (vector.y * -0.5 + 0.5) * this.canvas.clientHeight
        };
        
        this.worldToScreenCache.set(cacheKey, screenPosition);
        return screenPosition;
    }
    
    screenToWorld(screenPosition, depth = 0) {
        const cacheKey = `${screenPosition.x},${screenPosition.y},${depth}`;
        if (this.screenToWorldCache.has(cacheKey)) {
            return this.screenToWorldCache.get(cacheKey);
        }
        
        const vector = new THREE.Vector3(
            (screenPosition.x / this.canvas.clientWidth) * 2 - 1,
            -(screenPosition.y / this.canvas.clientHeight) * 2 + 1,
            depth
        );
        
        vector.unproject(this.activeCamera);
        
        this.screenToWorldCache.set(cacheKey, vector);
        return vector;
    }
    
    updateUIElements() {
        // Update UI elements that need world-to-screen conversion
        this.uiElements.forEach((element, id) => {
            if (element.worldPosition) {
                const screenPos = this.worldToScreen(element.worldPosition);
                element.domElement.style.left = screenPos.x + 'px';
                element.domElement.style.top = screenPos.y + 'px';
            }
        });
    }
    
    addUIElement(id, domElement, worldPosition = null) {
        this.uiElements.set(id, {
            domElement,
            worldPosition
        });
    }
    
    removeUIElement(id) {
        this.uiElements.delete(id);
    }
    
    // Cinematic camera methods
    addCinematicKeyframe(position, target, duration = 1000) {
        const camera = this.cameras.cinematic;
        camera.userData.keyframes.push({
            position: position.clone(),
            target: target.clone(),
            duration
        });
    }
    
    playCinematicSequence() {
        const camera = this.cameras.cinematic;
        camera.userData.isPlaying = true;
        camera.userData.currentKeyframe = 0;
        this.setMode(this.CAMERA_MODES.CINEMATIC);
    }
    
    updateCinematicCamera(deltaTime) {
        const camera = this.cameras.cinematic;
        const userData = camera.userData;
        
        if (userData.currentKeyframe >= userData.keyframes.length - 1) {
            userData.isPlaying = false;
            return;
        }
        
        const currentFrame = userData.keyframes[userData.currentKeyframe];
        const nextFrame = userData.keyframes[userData.currentKeyframe + 1];
        
        // Calculate progress between keyframes
        const progress = Math.min(deltaTime / currentFrame.duration, 1);
        
        // Interpolate position and target
        camera.position.lerpVectors(currentFrame.position, nextFrame.position, progress);
        
        const lookAtTarget = new THREE.Vector3().lerpVectors(currentFrame.target, nextFrame.target, progress);
        camera.lookAt(lookAtTarget);
        
        if (progress >= 1) {
            userData.currentKeyframe++;
        }
    }
    
    // Public API
    getActiveCamera() {
        return this.activeCamera;
    }
    
    getCurrentMode() {
        return this.currentMode;
    }
    
    setFollowTarget(target) {
        this.controls.follow.target = target;
    }
    
    setBounds(min, max) {
        this.bounds.min = min;
        this.bounds.max = max;
    }
    
    enableAutoRotate(enable = true) {
        this.controls.orbit.autoRotate = enable;
    }
    
    setTransitionDuration(duration) {
        this.transitionDuration = duration;
    }
    
    // Cleanup
    dispose() {
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyAction);
        document.removeEventListener('keyup', this.handleKeyAction);
        this.canvas.removeEventListener('mousedown', this.handleMouseDown);
        this.canvas.removeEventListener('mouseup', this.handleMouseUp);
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.canvas.removeEventListener('wheel', this.handleWheel);
        window.removeEventListener('resize', this.handleResize);
        
        // Clear caches
        this.worldToScreenCache.clear();
        this.screenToWorldCache.clear();
        this.uiElements.clear();
        
        console.log('Advanced 3D Camera System disposed');
    }
}


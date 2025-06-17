// Input Manager System - Refactored to ES6 Module with Dependency Injection
export class InputManager {
  constructor({
    audioManager,
    notificationManager,
    resourceManager,
    towerSystem,
    getCamera,
    getRenderer,
    getScene,
    getTowers,
    getEnemies,
    getEnemyPath,
    togglePause
  }) {
    console.log("Calling method: constructor");
    // Store only the dependencies we need (dependency injection)
    this.audioManager = audioManager;
    this.notificationManager = notificationManager;
    this.resourceManager = resourceManager;
    this.towerSystem = towerSystem;

    // Store callback functions
    this.getCamera = getCamera;
    this.getRenderer = getRenderer;
    this.getScene = getScene;
    this.getTowers = getTowers;
    this.getEnemies = getEnemies;
    this.getEnemyPath = getEnemyPath;
    this.togglePause = togglePause;

    // Input state
    this.keys = new Map();
    this.mouse = {
      x: 0,
      y: 0,
      isDown: false,
      button: -1,
      worldPosition: new THREE.Vector3()
    };

    // Touch support
    this.touches = new Map();
    this.isTouch = false;

    // Input modes
    this.inputMode = 'normal'; // normal, towerPlacement, towerUpgrade
    this.selectedTowerType = null;
    this.hoveredObject = null;

    // Raycasting for 3D interaction
    this.raycaster = new THREE.Raycaster();
    this.mouseVector = new THREE.Vector2();

    // Input timing
    this.lastClickTime = 0;
    this.doubleClickThreshold = 300;

    // Camera controls
    this.cameraControls = {
      enabled: true,
      rotateSpeed: 0.5,
      zoomSpeed: 0.1,
      panSpeed: 0.5,
      minDistance: 5,
      maxDistance: 50,
      minPolarAngle: 0.1,
      maxPolarAngle: Math.PI / 2
    };

    // Camera state
    this.cameraState = {
      isRotating: false,
      isPanning: false,
      isZooming: false,
      lastMousePosition: {
        x: 0,
        y: 0
      },
      spherical: new THREE.Spherical(),
      target: new THREE.Vector3(0, 0, 0)
    };

    // Initialize camera position
    this.initializeCameraPosition();
    console.log('InputManager initialized');
  }
  initializeCameraPosition() {
    console.log("Calling method: initializeCameraPosition");
    const camera = this.getCamera();
    if (camera) {
      this.cameraState.spherical.setFromVector3(camera.position.clone().sub(this.cameraState.target));
      this.cameraState.spherical.makeSafe();
    }
  }

  // Keyboard input handlers
  onKeyDown(event) {
    console.log("Calling method: onKeyDown");
    const key = event.code;
    this.keys.set(key, true);

    // Handle specific key actions
    switch (key) {
      case 'Space':
        event.preventDefault();
        this.togglePause();
        break;
      case 'Escape':
        this.cancelCurrentAction();
        break;
      case 'KeyR':
        if (this.inputMode === 'towerPlacement') {
          this.rotatePlacementPreview();
        }
        break;
      case 'Digit1':
        this.selectTowerType('basic');
        break;
      case 'Digit2':
        this.selectTowerType('laser');
        break;
      case 'Digit3':
        this.selectTowerType('missile');
        break;
      case 'Digit4':
        this.selectTowerType('freeze');
        break;
      case 'KeyW':
      case 'ArrowUp':
        this.startCameraMovement('forward');
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.startCameraMovement('backward');
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.startCameraMovement('left');
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.startCameraMovement('right');
        break;
    }
  }
  onKeyUp(event) {
    console.log("Calling method: onKeyUp");
    const key = event.code;
    this.keys.set(key, false);
  }

  // Mouse input handlers
  onClick(event) {
    console.log("Calling method: onClick");
    event.preventDefault();
    this.updateMousePosition(event);
    const currentTime = Date.now();
    const isDoubleClick = currentTime - this.lastClickTime < this.doubleClickThreshold;
    this.lastClickTime = currentTime;

    // Handle different input modes
    switch (this.inputMode) {
      case 'normal':
        this.handleNormalClick(event, isDoubleClick);
        break;
      case 'towerPlacement':
        this.handleTowerPlacement(event);
        break;
      case 'towerUpgrade':
        this.handleTowerUpgrade(event);
        break;
    }

    // Play click sound
    this.audioManager.playSound('buttonClick');
  }
  onMouseMove(event) {
    console.log("Calling method: onMouseMove");
    this.updateMousePosition(event);

    // Handle camera controls
    if (event.buttons === 1 && this.cameraControls.enabled) {
      // Left mouse button
      this.handleCameraRotation(event);
    } else if (event.buttons === 2) {
      // Right mouse button
      this.handleCameraPanning(event);
    }

    // Update hover effects
    this.updateHoverEffects();

    // Update tower placement preview
    if (this.inputMode === 'towerPlacement') {
      this.updateTowerPlacementPreview();
    }
  }
  onMouseDown(event) {
    console.log("Calling method: onMouseDown");
    this.mouse.isDown = true;
    this.mouse.button = event.button;
    this.cameraState.lastMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
    if (event.button === 1) {
      // Middle mouse button
      this.cameraState.isPanning = true;
    }
  }
  onMouseUp(event) {
    console.log("Calling method: onMouseUp");
    this.mouse.isDown = false;
    this.mouse.button = -1;
    this.cameraState.isRotating = false;
    this.cameraState.isPanning = false;
  }
  onWheel(event) {
    console.log("Calling method: onWheel");
    event.preventDefault();
    if (this.cameraControls.enabled) {
      this.handleCameraZoom(event.deltaY);
    }
  }

  // Touch input handlers
  onTouchStart(event) {
    console.log("Calling method: onTouchStart");
    event.preventDefault();
    this.isTouch = true;
    for (const touch of event.changedTouches) {
      this.touches.set(touch.identifier, {
        x: touch.clientX,
        y: touch.clientY,
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: Date.now()
      });
    }
    if (event.touches.length === 1) {
      // Single touch - treat as mouse
      this.updateMousePositionFromTouch(event.touches[0]);
    }
  }
  onTouchMove(event) {
    console.log("Calling method: onTouchMove");
    event.preventDefault();
    if (event.touches.length === 1) {
      // Single touch - camera rotation
      const touch = event.touches[0];
      this.updateMousePositionFromTouch(touch);
      this.handleCameraRotationFromTouch(touch);
    } else if (event.touches.length === 2) {
      // Two finger - zoom and pan
      this.handleTouchZoomAndPan(event.touches);
    }
  }
  onTouchEnd(event) {
    console.log("Calling method: onTouchEnd");
    event.preventDefault();
    for (const touch of event.changedTouches) {
      const touchData = this.touches.get(touch.identifier);
      if (touchData) {
        const duration = Date.now() - touchData.startTime;
        const distance = Math.sqrt(Math.pow(touch.clientX - touchData.startX, 2) + Math.pow(touch.clientY - touchData.startY, 2));

        // Detect tap
        if (duration < 300 && distance < 10) {
          this.handleTouchTap(touch);
        }
        this.touches.delete(touch.identifier);
      }
    }
  }

  // Input mode management
  setInputMode(mode, data = null) {
    console.log("Calling method: setInputMode");
    this.inputMode = mode;
    switch (mode) {
      case 'towerPlacement':
        this.selectedTowerType = data;
        this.createTowerPlacementPreview();
        break;
      case 'normal':
        this.clearTowerPlacementPreview();
        this.selectedTowerType = null;
        break;
    }
  }
  cancelCurrentAction() {
    console.log("Calling method: cancelCurrentAction");
    this.setInputMode('normal');
    this.notificationManager.show('Action Cancelled', 1000);
  }

  // Tower selection and placement
  selectTowerType(towerType) {
    console.log("Calling method: selectTowerType");
    const towerData = this.towerSystem.getTowerData(towerType);
    if (!towerData) return;
    if (this.resourceManager.canAfford(towerData.cost, towerData.energyCost || 0)) {
      this.setInputMode('towerPlacement', towerType);
      this.notificationManager.show(`Selected: ${towerData.name}`, 1500);
    } else {
      this.notificationManager.show('Insufficient Resources!', 2000);
      this.audioManager.playSound('buttonClick', 0.5, 0.8);
    }
  }
  createTowerPlacementPreview() {
    console.log("Calling method: createTowerPlacementPreview");
    // Create a preview of the tower being placed
    this.clearTowerPlacementPreview();
    const towerData = this.towerSystem.getTowerData(this.selectedTowerType);
    if (!towerData) return;

    // Create preview mesh
    const geometry = new THREE.CylinderGeometry(0.5, 0.8, 1.5, 8);
    const material = new THREE.MeshLambertMaterial({
      color: towerData.color || 0x00ff00,
      transparent: true,
      opacity: 0.7
    });
    this.towerPreview = new THREE.Mesh(geometry, material);
    this.towerPreview.position.y = 0.75;

    // Add range indicator
    const rangeGeometry = new THREE.RingGeometry(towerData.range - 0.1, towerData.range, 32);
    const rangeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });
    this.rangePreview = new THREE.Mesh(rangeGeometry, rangeMaterial);
    this.rangePreview.rotation.x = -Math.PI / 2;
    this.rangePreview.position.y = 0.1;
    this.getScene().add(this.towerPreview);
    this.getScene().add(this.rangePreview);
  }
  updateTowerPlacementPreview() {
    console.log("Calling method: updateTowerPlacementPreview");
    if (!this.towerPreview || !this.rangePreview) return;
    const worldPosition = this.getWorldPosition();
    if (worldPosition) {
      this.towerPreview.position.x = worldPosition.x;
      this.towerPreview.position.z = worldPosition.z;
      this.rangePreview.position.x = worldPosition.x;
      this.rangePreview.position.z = worldPosition.z;

      // Check if position is valid
      const isValid = this.isValidTowerPosition(worldPosition);
      const color = isValid ? 0x00ff00 : 0xff0000;
      this.towerPreview.material.color.setHex(color);
      this.rangePreview.material.color.setHex(color);
    }
  }
  clearTowerPlacementPreview() {
    console.log("Calling method: clearTowerPlacementPreview");
    if (this.towerPreview) {
      this.getScene().remove(this.towerPreview);
      this.towerPreview = null;
    }
    if (this.rangePreview) {
      this.getScene().remove(this.rangePreview);
      this.rangePreview = null;
    }
  }
  rotatePlacementPreview() {
    console.log("Calling method: rotatePlacementPreview");
    if (this.towerPreview) {
      this.towerPreview.rotation.y += Math.PI / 4;
    }
  }

  // Click handlers
  handleNormalClick(event, isDoubleClick) {
    console.log("Calling method: handleNormalClick");
    const intersectedObject = this.getIntersectedObject();
    if (intersectedObject) {
      if (intersectedObject.userData.type === 'tower') {
        if (isDoubleClick) {
          this.upgradeTower(intersectedObject.userData.tower);
        } else {
          this.selectTower(intersectedObject.userData.tower);
        }
      } else if (intersectedObject.userData.type === 'enemy') {
        this.selectEnemy(intersectedObject.userData.enemy);
      }
    } else {
      this.deselectAll();
    }
  }
  handleTowerPlacement(event) {
    console.log("Calling method: handleTowerPlacement");
    const worldPosition = this.getWorldPosition();
    if (!worldPosition) return;
    if (this.isValidTowerPosition(worldPosition)) {
      const success = this.towerSystem.placeTower(this.selectedTowerType, worldPosition);
      if (success) {
        this.audioManager.playSound('towerPlace');
        // Continue placement mode for rapid building
      } else {
        this.notificationManager.show('Cannot place tower here!', 2000);
      }
    } else {
      this.notificationManager.show('Invalid position!', 1500);
    }
  }
  handleTowerUpgrade(event) {
    console.log("Calling method: handleTowerUpgrade");
    // Implementation for tower upgrade mode
    this.setInputMode('normal');
  }
  handleTouchTap(touch) {
    console.log("Calling method: handleTouchTap");
    // Convert touch to mouse-like event
    const fakeEvent = {
      clientX: touch.clientX,
      clientY: touch.clientY,
      preventDefault: function () {}
    };
    this.onClick(fakeEvent);
  }

  // Camera controls
  handleCameraRotation(event) {
    console.log("Calling method: handleCameraRotation");
    if (!this.cameraControls.enabled) return;
    const deltaX = event.clientX - this.cameraState.lastMousePosition.x;
    const deltaY = event.clientY - this.cameraState.lastMousePosition.y;
    this.cameraState.spherical.theta -= deltaX * this.cameraControls.rotateSpeed * 0.01;
    this.cameraState.spherical.phi += deltaY * this.cameraControls.rotateSpeed * 0.01;
    this.cameraState.spherical.phi = Math.max(this.cameraControls.minPolarAngle, Math.min(this.cameraControls.maxPolarAngle, this.cameraState.spherical.phi));
    this.updateCameraPosition();
    this.cameraState.lastMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
  }
  handleCameraPanning(event) {
    console.log("Calling method: handleCameraPanning");
    if (!this.cameraControls.enabled) return;
    const deltaX = event.clientX - this.cameraState.lastMousePosition.x;
    const deltaY = event.clientY - this.cameraState.lastMousePosition.y;
    const camera = this.getCamera();
    const panVector = new THREE.Vector3();
    panVector.setFromMatrixColumn(camera.matrix, 0); // Right vector
    panVector.multiplyScalar(-deltaX * this.cameraControls.panSpeed * 0.01);
    const upVector = new THREE.Vector3();
    upVector.setFromMatrixColumn(camera.matrix, 1); // Up vector
    upVector.multiplyScalar(deltaY * this.cameraControls.panSpeed * 0.01);
    this.cameraState.target.add(panVector).add(upVector);
    this.updateCameraPosition();
    this.cameraState.lastMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
  }
  handleCameraZoom(deltaY) {
    console.log("Calling method: handleCameraZoom");
    if (!this.cameraControls.enabled) return;
    const zoomDelta = deltaY * this.cameraControls.zoomSpeed;
    this.cameraState.spherical.radius += zoomDelta;
    this.cameraState.spherical.radius = Math.max(this.cameraControls.minDistance, Math.min(this.cameraControls.maxDistance, this.cameraState.spherical.radius));
    this.updateCameraPosition();
  }
  handleCameraRotationFromTouch(touch) {
    console.log("Calling method: handleCameraRotationFromTouch");
    const touchData = this.touches.get(touch.identifier);
    if (!touchData) return;
    const deltaX = touch.clientX - touchData.x;
    const deltaY = touch.clientY - touchData.y;
    this.cameraState.spherical.theta -= deltaX * this.cameraControls.rotateSpeed * 0.01;
    this.cameraState.spherical.phi += deltaY * this.cameraControls.rotateSpeed * 0.01;
    this.cameraState.spherical.phi = Math.max(this.cameraControls.minPolarAngle, Math.min(this.cameraControls.maxPolarAngle, this.cameraState.spherical.phi));
    this.updateCameraPosition();
    touchData.x = touch.clientX;
    touchData.y = touch.clientY;
  }
  handleTouchZoomAndPan(touches) {
    console.log("Calling method: handleTouchZoomAndPan");
    // Implementation for two-finger gestures
    const touch1 = touches[0];
    const touch2 = touches[1];
    const distance = Math.sqrt(Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2));

    // Store previous distance for zoom calculation
    if (!this.previousTouchDistance) {
      this.previousTouchDistance = distance;
      return;
    }
    const zoomDelta = (this.previousTouchDistance - distance) * 0.1;
    this.handleCameraZoom(zoomDelta);
    this.previousTouchDistance = distance;
  }
  updateCameraPosition() {
    console.log("Calling method: updateCameraPosition");
    const camera = this.getCamera();
    if (!camera) return;
    const position = new THREE.Vector3();
    position.setFromSpherical(this.cameraState.spherical);
    position.add(this.cameraState.target);
    camera.position.copy(position);
    camera.lookAt(this.cameraState.target);
  }
  startCameraMovement(direction) {
    console.log("Calling method: startCameraMovement");
    // Keyboard camera movement
    const moveSpeed = 0.5;
    const camera = this.getCamera();
    switch (direction) {
      case 'forward':
        this.cameraState.target.z -= moveSpeed;
        break;
      case 'backward':
        this.cameraState.target.z += moveSpeed;
        break;
      case 'left':
        this.cameraState.target.x -= moveSpeed;
        break;
      case 'right':
        this.cameraState.target.x += moveSpeed;
        break;
    }
    this.updateCameraPosition();
  }

  // Utility methods
  updateMousePosition(event) {
    console.log("Calling method: updateMousePosition");
    const rect = this.getRenderer().domElement.getBoundingClientRect();
    this.mouse.x = event.clientX - rect.left;
    this.mouse.y = event.clientY - rect.top;

    // Normalized device coordinates
    this.mouseVector.x = this.mouse.x / rect.width * 2 - 1;
    this.mouseVector.y = -(this.mouse.y / rect.height) * 2 + 1;
  }
  updateMousePositionFromTouch(touch) {
    console.log("Calling method: updateMousePositionFromTouch");
    const rect = this.getRenderer().domElement.getBoundingClientRect();
    this.mouse.x = touch.clientX - rect.left;
    this.mouse.y = touch.clientY - rect.top;
    this.mouseVector.x = this.mouse.x / rect.width * 2 - 1;
    this.mouseVector.y = -(this.mouse.y / rect.height) * 2 + 1;
  }
  getWorldPosition() {
    console.log("Calling method: getWorldPosition");
    this.raycaster.setFromCamera(this.mouseVector, this.getCamera());

    // Raycast against ground plane
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersection = new THREE.Vector3();
    if (this.raycaster.ray.intersectPlane(groundPlane, intersection)) {
      return intersection;
    }
    return null;
  }
  getIntersectedObject() {
    console.log("Calling method: getIntersectedObject");
    this.raycaster.setFromCamera(this.mouseVector, this.getCamera());

    // Get all interactable objects
    const interactableObjects = [];

    // Add towers
    this.getTowers().forEach(function (tower) {
      if (tower.mesh) {
        tower.mesh.userData = {
          type: 'tower',
          tower: tower
        };
        interactableObjects.push(tower.mesh);
      }
    });

    // Add enemies
    this.getEnemies().forEach(function (enemy) {
      if (enemy.mesh) {
        enemy.mesh.userData = {
          type: 'enemy',
          enemy: enemy
        };
        interactableObjects.push(enemy.mesh);
      }
    });
    const intersects = this.raycaster.intersectObjects(interactableObjects);
    return intersects.length > 0 ? intersects[0].object : null;
  }
  isValidTowerPosition(position) {
    console.log("Calling method: isValidTowerPosition");
    // Check if position is within bounds
    if (Math.abs(position.x) > 20 || Math.abs(position.z) > 15) {
      return false;
    }

    // Check if position is not on the enemy path
    const pathTolerance = 2.0;
    const enemyPath = this.getEnemyPath();
    for (const pathPoint of enemyPath) {
      const distance = position.distanceTo(new THREE.Vector3(pathPoint.x, 0, pathPoint.z));
      if (distance < pathTolerance) {
        return false;
      }
    }

    // Check if position is not occupied by another tower
    const towerTolerance = 2.0;
    const towers = this.getTowers();
    for (const tower of towers) {
      const distance = position.distanceTo(tower.position);
      if (distance < towerTolerance) {
        return false;
      }
    }
    return true;
  }
  updateHoverEffects() {
    console.log("Calling method: updateHoverEffects");
    const intersectedObject = this.getIntersectedObject();
    if (intersectedObject !== this.hoveredObject) {
      // Clear previous hover
      if (this.hoveredObject && this.hoveredObject.material) {
        this.hoveredObject.material.emissive.setHex(0x000000);
      }

      // Set new hover
      if (intersectedObject && intersectedObject.material) {
        intersectedObject.material.emissive.setHex(0x333333);
        document.body.style.cursor = 'pointer';
      } else {
        document.body.style.cursor = 'default';
      }
      this.hoveredObject = intersectedObject;
    }
  }
  selectTower(tower) {
    console.log("Calling method: selectTower");
    this.towerSystem.selectTower(tower);
    this.notificationManager.show(`Selected: ${tower.type}`, 1500);
  }
  upgradeTower(tower) {
    console.log("Calling method: upgradeTower");
    const success = this.towerSystem.upgradeTower(tower);
    if (success) {
      this.audioManager.playSound('towerPlace', 1.0, 1.2);
      this.notificationManager.show('Tower Upgraded!', 2000);
    } else {
      this.notificationManager.show('Cannot upgrade!', 1500);
    }
  }
  selectEnemy(enemy) {
    console.log("Calling method: selectEnemy");
    // Show enemy information
    this.notificationManager.show(`Enemy: ${enemy.type} (${enemy.health}/${enemy.maxHealth} HP)`, 2000);
  }
  deselectAll() {
    console.log("Calling method: deselectAll");
    this.towerSystem.deselectAll();
  }

  // Public methods
  isKeyPressed(key) {
    console.log("Calling method: isKeyPressed");
    return this.keys.get(key) || false;
  }
  getMousePosition() {
    console.log("Calling method: getMousePosition");
    return {
      ...this.mouse
    };
  }
  enableCameraControls() {
    console.log("Calling method: enableCameraControls");
    this.cameraControls.enabled = true;
  }
  disableCameraControls() {
    console.log("Calling method: disableCameraControls");
    this.cameraControls.enabled = false;
  }

  // Cleanup
  dispose() {
    console.log("Calling method: dispose");
    this.clearTowerPlacementPreview();
    this.keys.clear();
    this.touches.clear();
  }
}
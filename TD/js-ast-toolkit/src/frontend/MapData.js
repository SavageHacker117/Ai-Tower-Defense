// MapData.js - ES6 Module with Dependency Injection

export class MapData {
  constructor(dependencies = {}) {
    console.log("Calling method: constructor");
    // Extract dependencies with defaults
    const {
      notificationManager = null,
      audioManager = null,
      onMapGenerated = null,
      onThemeChanged = null
    } = dependencies;

    // Store dependencies
    this.notificationManager = notificationManager;
    this.audioManager = audioManager;
    this.onMapGenerated = onMapGenerated;
    this.onThemeChanged = onThemeChanged;

    // Map configuration
    this.currentLevel = 1;
    this.mapWidth = 40;
    this.mapHeight = 30;

    // Map elements
    this.spawnPoint = {
      x: -18,
      z: -12
    };
    this.endPoint = {
      x: 18,
      z: 12
    };
    this.obstacles = [];
    this.decorations = [];
    this.specialAreas = [];

    // Pathfinding data
    this.navMesh = null;
    this.pathNodes = [];
    this.pathConnections = [];

    // Terrain data
    this.terrain = {
      type: 'grass',
      elevation: 0,
      texture: null
    };

    // Environmental settings
    this.environment = {
      skyColor: 0x87CEEB,
      fogColor: 0x87CEEB,
      fogDensity: 0.01,
      ambientLightColor: 0x404040,
      ambientLightIntensity: 0.4,
      directionalLightColor: 0xffffff,
      directionalLightIntensity: 0.8
    };

    // Map themes
    this.themes = {
      grassland: {
        skyColor: 0x87CEEB,
        terrainColor: 0x228B22,
        pathColor: 0x8B4513,
        obstacleColor: 0x654321
      },
      desert: {
        skyColor: 0xFFA500,
        terrainColor: 0xF4A460,
        pathColor: 0xD2691E,
        obstacleColor: 0x8B4513
      },
      winter: {
        skyColor: 0xB0C4DE,
        terrainColor: 0xF0F8FF,
        pathColor: 0x696969,
        obstacleColor: 0x2F4F4F
      },
      volcanic: {
        skyColor: 0x8B0000,
        terrainColor: 0x2F2F2F,
        pathColor: 0xFF4500,
        obstacleColor: 0x000000
      }
    };
    console.log('MapData initialized with dependencies:', {
      hasNotificationManager: !!this.notificationManager,
      hasAudioManager: !!this.audioManager,
      hasMapGeneratedCallback: !!this.onMapGenerated,
      hasThemeChangedCallback: !!this.onThemeChanged
    });
  }

  // Load level data
  async loadLevel(levelNumber) {
    console.log("Calling method: loadLevel");
    this.currentLevel = levelNumber;
    try {
      // Notify about loading start
      this.notifyMapLoadingStart(levelNumber);

      // Generate map based on level
      await this.generateMap(levelNumber);

      // Set theme based on level
      const theme = this.getLevelTheme(levelNumber);
      this.setTheme(theme);

      // Notify about successful loading
      this.notifyMapLoadingComplete(levelNumber);
      console.log(`Map data loaded for level ${levelNumber}`);
      return true;
    } catch (error) {
      console.error('Failed to load map data:', error);
      this.notifyMapLoadingError(levelNumber, error);
      return false;
    }
  }

  // Generate map procedurally
  async generateMap(levelNumber) {
    console.log("Calling method: generateMap");
    // Clear existing data
    this.obstacles = [];
    this.decorations = [];
    this.specialAreas = [];
    this.pathNodes = [];

    // Generate based on level progression
    const difficulty = Math.min(levelNumber / 10, 1); // 0 to 1

    // Generate spawn and end points with some variation
    this.generateSpawnAndEndPoints(levelNumber);

    // Generate obstacles
    await this.generateObstacles(levelNumber, difficulty);

    // Generate decorations
    this.generateDecorations(levelNumber);

    // Generate special areas
    this.generateSpecialAreas(levelNumber);

    // Generate navigation mesh
    this.generateNavMesh();

    // Notify that map generation is complete
    this.notifyMapGenerated(levelNumber);
    console.log(`Generated map for level ${levelNumber} with ${this.obstacles.length} obstacles`);
  }
  generateSpawnAndEndPoints(levelNumber) {
    console.log("Calling method: generateSpawnAndEndPoints");
    // Use variation for spawn/end points based on level
    const variation = levelNumber * 0.1 % 1;
    const angle = variation * Math.PI * 2;

    // Spawn point (left side with variation)
    this.spawnPoint = {
      x: -18 + Math.cos(angle) * 2,
      z: -12 + Math.sin(angle) * 3
    };

    // End point (right side with variation)
    this.endPoint = {
      x: 18 + Math.cos(angle + Math.PI) * 2,
      z: 12 + Math.sin(angle + Math.PI) * 3
    };
  }
  async generateObstacles(levelNumber, difficulty) {
    console.log("Calling method: generateObstacles");
    const baseObstacleCount = 5;
    const maxObstacleCount = 20;
    const obstacleCount = Math.floor(baseObstacleCount + difficulty * (maxObstacleCount - baseObstacleCount));

    // Generate obstacles with async processing for better performance
    const obstaclePromises = [];
    for (let i = 0; i < obstacleCount; i++) {
      obstaclePromises.push(this.generateValidObstacle(levelNumber));
    }

    // Wait for all obstacles to be generated
    const generatedObstacles = await Promise.all(obstaclePromises);

    // Filter out null obstacles (invalid positions)
    this.obstacles = generatedObstacles.filter(function (obstacle) {
      return obstacle !== null;
    });
  }
  async generateValidObstacle(levelNumber, maxAttempts = 10) {
    console.log("Calling method: generateValidObstacle");
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const obstacle = this.generateRandomObstacle(levelNumber);
      if (this.isValidObstaclePosition(obstacle)) {
        return obstacle;
      }
    }

    // If we couldn't find a valid position after max attempts, return null
    return null;
  }
  generateRandomObstacle(levelNumber) {
    console.log("Calling method: generateRandomObstacle");
    const types = ['rock', 'tree', 'building', 'crystal', 'ruins'];
    const type = types[Math.floor(Math.random() * types.length)];
    return {
      id: `obstacle_${Date.now()}_${Math.random()}`,
      type: type,
      position: {
        x: (Math.random() - 0.5) * this.mapWidth * 0.8,
        z: (Math.random() - 0.5) * this.mapHeight * 0.8
      },
      size: {
        width: 1 + Math.random() * 2,
        height: 1 + Math.random() * 3,
        depth: 1 + Math.random() * 2
      },
      rotation: Math.random() * Math.PI * 2,
      blocking: true
    };
  }
  generateDecorations(levelNumber) {
    console.log("Calling method: generateDecorations");
    const decorationCount = 10 + Math.floor(Math.random() * 15);
    for (let i = 0; i < decorationCount; i++) {
      const decoration = {
        id: `decoration_${Date.now()}_${Math.random()}`,
        type: this.getRandomDecorationType(levelNumber),
        position: {
          x: (Math.random() - 0.5) * this.mapWidth,
          z: (Math.random() - 0.5) * this.mapHeight
        },
        size: {
          width: 0.5 + Math.random() * 1,
          height: 0.5 + Math.random() * 2,
          depth: 0.5 + Math.random() * 1
        },
        rotation: Math.random() * Math.PI * 2,
        blocking: false
      };
      this.decorations.push(decoration);
    }
  }
  generateSpecialAreas(levelNumber) {
    console.log("Calling method: generateSpecialAreas");
    // Generate special areas like power-up zones, danger zones, etc.
    if (levelNumber > 3) {
      // Add power-up areas
      const powerUpArea = {
        id: `powerup_${levelNumber}`,
        type: 'powerup',
        position: {
          x: (Math.random() - 0.5) * this.mapWidth * 0.6,
          z: (Math.random() - 0.5) * this.mapHeight * 0.6
        },
        radius: 3,
        effect: 'damage_boost',
        duration: 30000 // 30 seconds
      };
      this.specialAreas.push(powerUpArea);
    }
    if (levelNumber > 5) {
      // Add danger zones
      const dangerArea = {
        id: `danger_${levelNumber}`,
        type: 'danger',
        position: {
          x: (Math.random() - 0.5) * this.mapWidth * 0.4,
          z: (Math.random() - 0.5) * this.mapHeight * 0.4
        },
        radius: 4,
        effect: 'slow_towers',
        intensity: 0.5
      };
      this.specialAreas.push(dangerArea);
    }
  }
  generateNavMesh() {
    console.log("Calling method: generateNavMesh");
    // Create a simple grid-based navigation mesh
    const gridSize = 2; // 2x2 meter grid cells
    const gridWidth = Math.ceil(this.mapWidth / gridSize);
    const gridHeight = Math.ceil(this.mapHeight / gridSize);
    this.navMesh = [];
    for (let x = 0; x < gridWidth; x++) {
      this.navMesh[x] = [];
      for (let z = 0; z < gridHeight; z++) {
        const worldX = (x - gridWidth / 2) * gridSize;
        const worldZ = (z - gridHeight / 2) * gridSize;
        const isWalkable = this.isPositionWalkable(worldX, worldZ);
        this.navMesh[x][z] = {
          x: x,
          z: z,
          worldX: worldX,
          worldZ: worldZ,
          walkable: isWalkable,
          cost: isWalkable ? 1 : Infinity
        };
      }
    }

    // Generate path nodes for smoother pathfinding
    this.generatePathNodes();
  }
  generatePathNodes() {
    console.log("Calling method: generatePathNodes");
    // Create key path nodes between spawn and end points
    const nodeCount = 8 + Math.floor(Math.random() * 4);
    this.pathNodes = [];

    // Always include spawn and end points
    this.pathNodes.push({
      id: 'spawn',
      position: {
        ...this.spawnPoint
      },
      connections: []
    });

    // Generate intermediate nodes
    for (let i = 1; i < nodeCount - 1; i++) {
      const progress = i / (nodeCount - 1);

      // Base position along straight line
      const baseX = this.spawnPoint.x + (this.endPoint.x - this.spawnPoint.x) * progress;
      const baseZ = this.spawnPoint.z + (this.endPoint.z - this.spawnPoint.z) * progress;

      // Add some randomness
      const offsetX = (Math.random() - 0.5) * 8;
      const offsetZ = (Math.random() - 0.5) * 6;
      const node = {
        id: `node_${i}`,
        position: {
          x: baseX + offsetX,
          z: baseZ + offsetZ
        },
        connections: []
      };

      // Ensure node is in walkable area
      if (this.isPositionWalkable(node.position.x, node.position.z)) {
        this.pathNodes.push(node);
      }
    }
    this.pathNodes.push({
      id: 'end',
      position: {
        ...this.endPoint
      },
      connections: []
    });

    // Connect nodes
    this.connectPathNodes();
  }
  connectPathNodes() {
    console.log("Calling method: connectPathNodes");
    for (let i = 0; i < this.pathNodes.length - 1; i++) {
      const currentNode = this.pathNodes[i];
      const nextNode = this.pathNodes[i + 1];

      // Connect to next node
      currentNode.connections.push(nextNode.id);

      // Optionally connect to node after next for shortcuts
      if (i < this.pathNodes.length - 2 && Math.random() < 0.3) {
        const shortcutNode = this.pathNodes[i + 2];
        if (this.hasLineOfSight(currentNode.position, shortcutNode.position)) {
          currentNode.connections.push(shortcutNode.id);
        }
      }
    }
  }

  // Validation methods
  isValidObstaclePosition(obstacle) {
    console.log("Calling method: isValidObstaclePosition");
    // Check if obstacle is too close to spawn or end points
    const minDistance = 4;
    const distanceToSpawn = this.getDistance(obstacle.position, this.spawnPoint);
    const distanceToEnd = this.getDistance(obstacle.position, this.endPoint);
    if (distanceToSpawn < minDistance || distanceToEnd < minDistance) {
      return false;
    }

    // Check if obstacle blocks the direct path
    if (this.intersectsDirectPath(obstacle)) {
      return false;
    }

    // Check if too close to other obstacles
    for (const existingObstacle of this.obstacles) {
      const distance = this.getDistance(obstacle.position, existingObstacle.position);
      if (distance < 3) {
        return false;
      }
    }
    return true;
  }
  isPositionWalkable(x, z) {
    console.log("Calling method: isPositionWalkable");
    // Check if position is within map bounds
    if (Math.abs(x) > this.mapWidth / 2 || Math.abs(z) > this.mapHeight / 2) {
      return false;
    }

    // Check if position intersects with obstacles
    for (const obstacle of this.obstacles) {
      if (obstacle.blocking) {
        const distance = this.getDistance({
          x,
          z
        }, obstacle.position);
        const obstacleRadius = Math.max(obstacle.size.width, obstacle.size.depth) / 2;
        if (distance < obstacleRadius + 1) {
          // +1 for clearance
          return false;
        }
      }
    }
    return true;
  }
  intersectsDirectPath(obstacle) {
    console.log("Calling method: intersectsDirectPath");
    // Simple line-circle intersection test
    const lineStart = this.spawnPoint;
    const lineEnd = this.endPoint;
    const circleCenter = obstacle.position;
    const circleRadius = Math.max(obstacle.size.width, obstacle.size.depth) / 2;
    return this.lineCircleIntersection(lineStart, lineEnd, circleCenter, circleRadius);
  }
  hasLineOfSight(pos1, pos2) {
    console.log("Calling method: hasLineOfSight");
    // Check if there's a clear line of sight between two positions
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = pos1.x + (pos2.x - pos1.x) * t;
      const z = pos1.z + (pos2.z - pos1.z) * t;
      if (!this.isPositionWalkable(x, z)) {
        return false;
      }
    }
    return true;
  }

  // Notification methods (using dependency injection)
  notifyMapLoadingStart(levelNumber) {
    console.log("Calling method: notifyMapLoadingStart");
    if (this.notificationManager) {
      this.notificationManager.showMessage(`Loading level ${levelNumber}...`, 'info');
    }
  }
  notifyMapLoadingComplete(levelNumber) {
    console.log("Calling method: notifyMapLoadingComplete");
    if (this.notificationManager) {
      this.notificationManager.showMessage(`Level ${levelNumber} loaded successfully!`, 'success');
    }
    if (this.audioManager) {
      this.audioManager.playSound('map_loaded');
    }
  }
  notifyMapLoadingError(levelNumber, error) {
    console.log("Calling method: notifyMapLoadingError");
    if (this.notificationManager) {
      this.notificationManager.showMessage(`Failed to load level ${levelNumber}: ${error.message}`, 'error');
    }
  }
  notifyMapGenerated(levelNumber) {
    console.log("Calling method: notifyMapGenerated");
    if (this.onMapGenerated) {
      this.onMapGenerated({
        level: levelNumber,
        obstacleCount: this.obstacles.length,
        decorationCount: this.decorations.length,
        specialAreaCount: this.specialAreas.length,
        theme: this.getLevelTheme(levelNumber)
      });
    }
  }
  notifyThemeChanged(themeName) {
    console.log("Calling method: notifyThemeChanged");
    if (this.onThemeChanged) {
      this.onThemeChanged(themeName);
    }
  }

  // Utility methods
  getDistance(pos1, pos2) {
    console.log("Calling method: getDistance");
    const dx = pos1.x - pos2.x;
    const dz = pos1.z - pos2.z;
    return Math.sqrt(dx * dx + dz * dz);
  }
  lineCircleIntersection(lineStart, lineEnd, circleCenter, circleRadius) {
    console.log("Calling method: lineCircleIntersection");
    // Vector from line start to circle center
    const dx = circleCenter.x - lineStart.x;
    const dz = circleCenter.z - lineStart.z;

    // Line direction vector
    const lineDx = lineEnd.x - lineStart.x;
    const lineDz = lineEnd.z - lineStart.z;
    const lineLength = Math.sqrt(lineDx * lineDx + lineDz * lineDz);
    if (lineLength === 0) return false;

    // Normalize line direction
    const lineUnitX = lineDx / lineLength;
    const lineUnitZ = lineDz / lineLength;

    // Project circle center onto line
    const projection = dx * lineUnitX + dz * lineUnitZ;
    const clampedProjection = Math.max(0, Math.min(lineLength, projection));

    // Closest point on line to circle center
    const closestX = lineStart.x + lineUnitX * clampedProjection;
    const closestZ = lineStart.z + lineUnitZ * clampedProjection;

    // Distance from circle center to closest point
    const distanceX = circleCenter.x - closestX;
    const distanceZ = circleCenter.z - closestZ;
    const distance = Math.sqrt(distanceX * distanceX + distanceZ * distanceZ);
    return distance <= circleRadius;
  }
  getRandomDecorationType(levelNumber) {
    console.log("Calling method: getRandomDecorationType");
    const decorations = {
      grassland: ['flower', 'bush', 'small_rock', 'grass_patch'],
      desert: ['cactus', 'sand_dune', 'bone', 'dead_tree'],
      winter: ['snow_pile', 'ice_crystal', 'frozen_tree', 'snowman'],
      volcanic: ['lava_rock', 'steam_vent', 'ash_pile', 'crystal']
    };
    const theme = this.getLevelTheme(levelNumber);
    const themeDecorations = decorations[theme] || decorations.grassland;
    return themeDecorations[Math.floor(Math.random() * themeDecorations.length)];
  }
  getLevelTheme(levelNumber) {
    console.log("Calling method: getLevelTheme");
    if (levelNumber <= 3) return 'grassland';
    if (levelNumber <= 6) return 'desert';
    if (levelNumber <= 9) return 'winter';
    return 'volcanic';
  }
  setTheme(themeName) {
    console.log("Calling method: setTheme");
    const theme = this.themes[themeName];
    if (theme) {
      this.environment.skyColor = theme.skyColor;
      this.terrain.color = theme.terrainColor;

      // Notify about theme change
      this.notifyThemeChanged(themeName);
    }
  }

  // Public API - Getters (return defensive copies)
  getSpawnPoint() {
    console.log("Calling method: getSpawnPoint");
    return {
      ...this.spawnPoint
    };
  }
  getEndPoint() {
    console.log("Calling method: getEndPoint");
    return {
      ...this.endPoint
    };
  }
  getObstacles() {
    console.log("Calling method: getObstacles");
    return [...this.obstacles];
  }
  getDecorations() {
    console.log("Calling method: getDecorations");
    return [...this.decorations];
  }
  getSpecialAreas() {
    console.log("Calling method: getSpecialAreas");
    return [...this.specialAreas];
  }
  getNavMesh() {
    console.log("Calling method: getNavMesh");
    return this.navMesh;
  }
  getPathNodes() {
    console.log("Calling method: getPathNodes");
    return [...this.pathNodes];
  }
  getEnvironmentSettings() {
    console.log("Calling method: getEnvironmentSettings");
    return {
      ...this.environment
    };
  }
  getMapBounds() {
    console.log("Calling method: getMapBounds");
    return {
      width: this.mapWidth,
      height: this.mapHeight,
      minX: -this.mapWidth / 2,
      maxX: this.mapWidth / 2,
      minZ: -this.mapHeight / 2,
      maxZ: this.mapHeight / 2
    };
  }
  getCurrentTheme() {
    console.log("Calling method: getCurrentTheme");
    return this.getLevelTheme(this.currentLevel);
  }

  // Position queries
  isInBounds(x, z) {
    console.log("Calling method: isInBounds");
    return Math.abs(x) <= this.mapWidth / 2 && Math.abs(z) <= this.mapHeight / 2;
  }
  getTerrainHeight(x, z) {
    console.log("Calling method: getTerrainHeight");
    // Simple flat terrain for now
    return this.terrain.elevation;
  }
  getNearestWalkablePosition(x, z) {
    console.log("Calling method: getNearestWalkablePosition");
    if (this.isPositionWalkable(x, z)) {
      return {
        x,
        z
      };
    }

    // Search in expanding circles
    for (let radius = 1; radius <= 10; radius++) {
      const steps = radius * 8;
      for (let i = 0; i < steps; i++) {
        const angle = i / steps * Math.PI * 2;
        const testX = x + Math.cos(angle) * radius;
        const testZ = z + Math.sin(angle) * radius;
        if (this.isPositionWalkable(testX, testZ)) {
          return {
            x: testX,
            z: testZ
          };
        }
      }
    }

    // Fallback to spawn point
    return this.getSpawnPoint();
  }

  // Save/Load with improved error handling
  saveMapData() {
    console.log("Calling method: saveMapData");
    try {
      return {
        currentLevel: this.currentLevel,
        spawnPoint: this.spawnPoint,
        endPoint: this.endPoint,
        obstacles: this.obstacles,
        decorations: this.decorations,
        specialAreas: this.specialAreas,
        pathNodes: this.pathNodes,
        environment: this.environment,
        terrain: this.terrain,
        version: '1.0' // For future compatibility
      };
    } catch (error) {
      console.error('Failed to save map data:', error);
      return null;
    }
  }
  loadMapData(data) {
    console.log("Calling method: loadMapData");
    try {
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid map data provided');
      }

      // Validate data version for future compatibility
      if (data.version && data.version !== '1.0') {
        console.warn(`Loading map data with different version: ${data.version}`);
      }
      if (data.currentLevel !== undefined) this.currentLevel = data.currentLevel;
      if (data.spawnPoint) this.spawnPoint = {
        ...data.spawnPoint
      };
      if (data.endPoint) this.endPoint = {
        ...data.endPoint
      };
      if (data.obstacles) this.obstacles = [...data.obstacles];
      if (data.decorations) this.decorations = [...data.decorations];
      if (data.specialAreas) this.specialAreas = [...data.specialAreas];
      if (data.pathNodes) this.pathNodes = [...data.pathNodes];
      if (data.environment) this.environment = {
        ...this.environment,
        ...data.environment
      };
      if (data.terrain) this.terrain = {
        ...this.terrain,
        ...data.terrain
      };

      // Regenerate nav mesh
      this.generateNavMesh();
      return true;
    } catch (error) {
      console.error('Failed to load map data:', error);
      if (this.notificationManager) {
        this.notificationManager.showMessage('Failed to load saved map data', 'error');
      }
      return false;
    }
  }
}

// Additional utility class for map validation and analysis
export class MapAnalyzer {
  constructor(mapData) {
    console.log("Calling method: constructor");
    this.mapData = mapData;
  }
  analyzePathDifficulty() {
    console.log("Calling method: analyzePathDifficulty");
    const pathLength = this.calculatePathLength();
    const obstacleCount = this.mapData.getObstacles().length;
    const chokePoints = this.findChokePoints();
    return {
      pathLength,
      obstacleCount,
      chokePoints: chokePoints.length,
      difficulty: this.calculateDifficultyScore(pathLength, obstacleCount, chokePoints.length)
    };
  }
  calculatePathLength() {
    console.log("Calling method: calculatePathLength");
    const pathNodes = this.mapData.getPathNodes();
    let totalLength = 0;
    for (let i = 0; i < pathNodes.length - 1; i++) {
      const current = pathNodes[i];
      const next = pathNodes[i + 1];
      totalLength += this.mapData.getDistance(current.position, next.position);
    }
    return totalLength;
  }
  findChokePoints() {
    console.log("Calling method: findChokePoints");
    // Find areas where the path is constrained by obstacles
    const chokePoints = [];
    const pathNodes = this.mapData.getPathNodes();
    const obstacles = this.mapData.getObstacles();
    for (let i = 0; i < pathNodes.length - 1; i++) {
      const current = pathNodes[i];
      const next = pathNodes[i + 1];

      // Check for nearby obstacles that create a choke point
      const nearbyObstacles = obstacles.filter(function (obstacle) {
        const distToCurrent = this.mapData.getDistance(obstacle.position, current.position);
        const distToNext = this.mapData.getDistance(obstacle.position, next.position);
        return distToCurrent < 6 || distToNext < 6;
      });
      if (nearbyObstacles.length >= 2) {
        chokePoints.push({
          position: {
            x: (current.position.x + next.position.x) / 2,
            z: (current.position.z + next.position.z) / 2
          },
          severity: nearbyObstacles.length
        });
      }
    }
    return chokePoints;
  }
  calculateDifficultyScore(pathLength, obstacleCount, chokePointCount) {
    console.log("Calling method: calculateDifficultyScore");
    // Simple difficulty calculation
    const baseDifficulty = 1;
    const lengthFactor = Math.max(0, (pathLength - 30) / 20); // Longer paths are easier
    const obstacleFactor = obstacleCount / 10; // More obstacles = harder
    const chokeFactor = chokePointCount * 0.5; // Choke points increase difficulty

    return Math.max(0.1, baseDifficulty - lengthFactor + obstacleFactor + chokeFactor);
  }
}
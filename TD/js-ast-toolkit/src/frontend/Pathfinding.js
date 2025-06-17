// Pathfinding System - ES6 Module
export class Pathfinding {
  constructor() {
    console.log("Calling method: constructor");
    this.gridSize = 1; // 1 meter per grid cell
    this.grid = null;
    this.gridWidth = 0;
    this.gridHeight = 0;
    this.mapWidth = 40;
    this.mapHeight = 30;

    // Pathfinding settings
    this.allowDiagonal = true;
    this.heuristicWeight = 1.0;
    this.maxSearchNodes = 1000;

    // Path caching
    this.pathCache = new Map();
    this.maxCacheSize = 100;

    // Performance settings
    this.maxPathfindingTime = 50; // milliseconds

    console.log('Pathfinding system initialized');
  }

  // Initialize grid from map data
  initializeGrid(mapData) {
    console.log("Calling method: initializeGrid");
    this.mapWidth = mapData.mapWidth || 40;
    this.mapHeight = mapData.mapHeight || 30;
    this.gridWidth = Math.ceil(this.mapWidth / this.gridSize);
    this.gridHeight = Math.ceil(this.mapHeight / this.gridSize);

    // Create grid
    this.grid = [];
    for (let x = 0; x < this.gridWidth; x++) {
      this.grid[x] = [];
      for (let z = 0; z < this.gridHeight; z++) {
        const worldX = (x - this.gridWidth / 2) * this.gridSize;
        const worldZ = (z - this.gridHeight / 2) * this.gridSize;
        this.grid[x][z] = {
          x: x,
          z: z,
          worldX: worldX,
          worldZ: worldZ,
          walkable: this.isPositionWalkable(worldX, worldZ, mapData),
          cost: 1,
          parent: null,
          gCost: 0,
          hCost: 0,
          fCost: 0
        };
      }
    }
    console.log(`Pathfinding grid initialized: ${this.gridWidth}x${this.gridHeight}`);
  }

  // Check if a world position is walkable
  isPositionWalkable(worldX, worldZ, mapData) {
    console.log("Calling method: isPositionWalkable");
    // Check map bounds
    if (Math.abs(worldX) > this.mapWidth / 2 || Math.abs(worldZ) > this.mapHeight / 2) {
      return false;
    }

    // Check obstacles
    if (mapData && mapData.obstacles) {
      for (const obstacle of mapData.obstacles) {
        if (obstacle.blocking) {
          const distance = this.getDistance({
            x: worldX,
            z: worldZ
          }, obstacle.position);
          const obstacleRadius = Math.max(obstacle.size.width, obstacle.size.depth) / 2;
          if (distance < obstacleRadius + 0.5) {
            // +0.5 for clearance
            return false;
          }
        }
      }
    }
    return true;
  }

  // Generate path using A* algorithm
  generatePath(startPos, endPos, obstacles = []) {
    console.log("Calling method: generatePath");
    const startTime = performance.now();

    // Convert world positions to grid coordinates
    const startGrid = this.worldToGrid(startPos.x, startPos.z);
    const endGrid = this.worldToGrid(endPos.x, endPos.z);

    // Check cache first
    const cacheKey = `${startGrid.x},${startGrid.z}-${endGrid.x},${endGrid.z}`;
    if (this.pathCache.has(cacheKey)) {
      return this.pathCache.get(cacheKey);
    }

    // Validate start and end positions
    if (!this.isValidGridPosition(startGrid.x, startGrid.z) || !this.isValidGridPosition(endGrid.x, endGrid.z)) {
      console.warn('Invalid start or end position for pathfinding');
      return this.generateFallbackPath(startPos, endPos);
    }

    // A* pathfinding
    const path = this.findPathAStar(startGrid, endGrid);

    // Convert grid path to world coordinates
    const worldPath = this.gridPathToWorldPath(path);

    // Smooth the path
    const smoothedPath = this.smoothPath(worldPath);

    // Cache the result
    this.cacheResult(cacheKey, smoothedPath);
    const endTime = performance.now();
    console.log(`Pathfinding completed in ${(endTime - startTime).toFixed(2)}ms`);
    return smoothedPath;
  }

  // A* pathfinding algorithm
  findPathAStar(start, end) {
    console.log("Calling method: findPathAStar");
    // Reset grid
    this.resetGrid();
    const openSet = [];
    const closedSet = new Set();
    const startNode = this.grid[start.x][start.z];
    const endNode = this.grid[end.x][end.z];
    if (!startNode.walkable || !endNode.walkable) {
      return [];
    }
    openSet.push(startNode);
    let searchedNodes = 0;
    const maxTime = performance.now() + this.maxPathfindingTime;
    while (openSet.length > 0 && performance.now() < maxTime) {
      // Find node with lowest fCost
      let currentNode = openSet[0];
      for (let i = 1; i < openSet.length; i++) {
        if (openSet[i].fCost < currentNode.fCost || openSet[i].fCost === currentNode.fCost && openSet[i].hCost < currentNode.hCost) {
          currentNode = openSet[i];
        }
      }

      // Remove current node from open set and add to closed set
      openSet.splice(openSet.indexOf(currentNode), 1);
      closedSet.add(currentNode);

      // Check if we reached the target
      if (currentNode === endNode) {
        return this.retracePath(startNode, endNode);
      }

      // Check neighbors
      const neighbors = this.getNeighbors(currentNode);
      for (const neighbor of neighbors) {
        if (!neighbor.walkable || closedSet.has(neighbor)) {
          continue;
        }
        const newGCost = currentNode.gCost + this.getDistance(currentNode, neighbor);
        if (newGCost < neighbor.gCost || !openSet.includes(neighbor)) {
          neighbor.gCost = newGCost;
          neighbor.hCost = this.getDistance(neighbor, endNode) * this.heuristicWeight;
          neighbor.fCost = neighbor.gCost + neighbor.hCost;
          neighbor.parent = currentNode;
          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
          }
        }
      }
      searchedNodes++;
      if (searchedNodes > this.maxSearchNodes) {
        console.warn('Pathfinding exceeded maximum search nodes');
        break;
      }
    }

    // No path found
    console.warn('No path found with A*');
    return [];
  }

  // Get neighboring grid cells
  getNeighbors(node) {
    console.log("Calling method: getNeighbors");
    const neighbors = [];
    for (let x = -1; x <= 1; x++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && z === 0) continue;

        // Skip diagonal movement if not allowed
        if (!this.allowDiagonal && x !== 0 && z !== 0) continue;
        const checkX = node.x + x;
        const checkZ = node.z + z;
        if (this.isValidGridPosition(checkX, checkZ)) {
          neighbors.push(this.grid[checkX][checkZ]);
        }
      }
    }
    return neighbors;
  }

  // Retrace path from end to start
  retracePath(startNode, endNode) {
    console.log("Calling method: retracePath");
    const path = [];
    let currentNode = endNode;
    while (currentNode !== startNode) {
      path.push(currentNode);
      currentNode = currentNode.parent;
    }
    path.push(startNode);
    path.reverse();
    return path;
  }

  // Convert grid path to world coordinates
  gridPathToWorldPath(gridPath) {
    console.log("Calling method: gridPathToWorldPath");
    return gridPath.map(function (node) {
      return {
        x: node.worldX,
        z: node.worldZ
      };
    });
  }

  // Smooth path by removing unnecessary waypoints
  smoothPath(path) {
    console.log("Calling method: smoothPath");
    if (path.length <= 2) return path;
    const smoothedPath = [path[0]];
    for (let i = 1; i < path.length - 1; i++) {
      const prev = smoothedPath[smoothedPath.length - 1];
      const current = path[i];
      const next = path[i + 1];

      // Check if we can skip current waypoint
      if (!this.hasLineOfSight(prev, next)) {
        smoothedPath.push(current);
      }
    }
    smoothedPath.push(path[path.length - 1]);
    return smoothedPath;
  }

  // Check line of sight between two points
  hasLineOfSight(start, end) {
    console.log("Calling method: hasLineOfSight");
    const steps = Math.max(Math.abs(end.x - start.x), Math.abs(end.z - start.z)) / this.gridSize;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = start.x + (end.x - start.x) * t;
      const z = start.z + (end.z - start.z) * t;
      const gridPos = this.worldToGrid(x, z);
      if (!this.isValidGridPosition(gridPos.x, gridPos.z) || !this.grid[gridPos.x][gridPos.z].walkable) {
        return false;
      }
    }
    return true;
  }

  // Generate fallback path (straight line with waypoints)
  generateFallbackPath(startPos, endPos) {
    console.log("Calling method: generateFallbackPath");
    console.log('Generating fallback path');
    const path = [];
    const steps = 10;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = startPos.x + (endPos.x - startPos.x) * t;
      const z = startPos.z + (endPos.z - startPos.z) * t;
      path.push({
        x,
        z
      });
    }
    return path;
  }

  // Dynamic pathfinding for moving obstacles
  updatePath(currentPath, currentIndex, newObstacles) {
    console.log("Calling method: updatePath");
    if (!currentPath || currentIndex >= currentPath.length - 1) {
      return currentPath;
    }

    // Check if current path is still valid
    const remainingPath = currentPath.slice(currentIndex);
    for (let i = 0; i < remainingPath.length - 1; i++) {
      if (!this.hasLineOfSight(remainingPath[i], remainingPath[i + 1])) {
        // Path is blocked, recalculate from current position
        const newPath = this.generatePath(remainingPath[0], remainingPath[remainingPath.length - 1], newObstacles);

        // Merge with existing path
        return currentPath.slice(0, currentIndex).concat(newPath);
      }
    }
    return currentPath;
  }

  // Flow field pathfinding for multiple units
  generateFlowField(targetPos, obstacles = []) {
    console.log("Calling method: generateFlowField");
    const flowField = [];

    // Initialize flow field grid
    for (let x = 0; x < this.gridWidth; x++) {
      flowField[x] = [];
      for (let z = 0; z < this.gridHeight; z++) {
        flowField[x][z] = {
          direction: {
            x: 0,
            z: 0
          },
          distance: Infinity
        };
      }
    }

    // Set target
    const targetGrid = this.worldToGrid(targetPos.x, targetPos.z);
    if (this.isValidGridPosition(targetGrid.x, targetGrid.z)) {
      flowField[targetGrid.x][targetGrid.z].distance = 0;
    }

    // Dijkstra's algorithm to calculate distances
    const queue = [{
      x: targetGrid.x,
      z: targetGrid.z,
      distance: 0
    }];
    const visited = new Set();
    while (queue.length > 0) {
      // Sort by distance (simple priority queue)
      queue.sort(function (a, b) {
        return a.distance - b.distance;
      });
      const current = queue.shift();
      const key = `${current.x},${current.z}`;
      if (visited.has(key)) continue;
      visited.add(key);
      const neighbors = this.getNeighbors(this.grid[current.x][current.z]);
      for (const neighbor of neighbors) {
        if (!neighbor.walkable) continue;
        const newDistance = current.distance + this.getDistance(current, neighbor);
        if (newDistance < flowField[neighbor.x][neighbor.z].distance) {
          flowField[neighbor.x][neighbor.z].distance = newDistance;

          // Calculate direction vector
          const dx = current.x - neighbor.x;
          const dz = current.z - neighbor.z;
          const length = Math.sqrt(dx * dx + dz * dz);
          if (length > 0) {
            flowField[neighbor.x][neighbor.z].direction = {
              x: dx / length,
              z: dz / length
            };
          }
          queue.push({
            x: neighbor.x,
            z: neighbor.z,
            distance: newDistance
          });
        }
      }
    }
    return flowField;
  }

  // Get direction from flow field
  getFlowFieldDirection(flowField, worldPos) {
    console.log("Calling method: getFlowFieldDirection");
    const gridPos = this.worldToGrid(worldPos.x, worldPos.z);
    if (!this.isValidGridPosition(gridPos.x, gridPos.z)) {
      return {
        x: 0,
        z: 0
      };
    }
    return flowField[gridPos.x][gridPos.z].direction;
  }

  // Utility methods
  worldToGrid(worldX, worldZ) {
    console.log("Calling method: worldToGrid");
    return {
      x: Math.floor((worldX + this.mapWidth / 2) / this.gridSize),
      z: Math.floor((worldZ + this.mapHeight / 2) / this.gridSize)
    };
  }
  gridToWorld(gridX, gridZ) {
    console.log("Calling method: gridToWorld");
    return {
      x: (gridX - this.gridWidth / 2) * this.gridSize,
      z: (gridZ - this.gridHeight / 2) * this.gridSize
    };
  }
  isValidGridPosition(x, z) {
    console.log("Calling method: isValidGridPosition");
    return x >= 0 && x < this.gridWidth && z >= 0 && z < this.gridHeight;
  }
  getDistance(nodeA, nodeB) {
    console.log("Calling method: getDistance");
    const dx = Math.abs(nodeA.x - nodeB.x);
    const dz = Math.abs(nodeA.z - nodeB.z);
    if (this.allowDiagonal) {
      // Diagonal distance
      return Math.sqrt(dx * dx + dz * dz);
    } else {
      // Manhattan distance
      return dx + dz;
    }
  }
  resetGrid() {
    console.log("Calling method: resetGrid");
    for (let x = 0; x < this.gridWidth; x++) {
      for (let z = 0; z < this.gridHeight; z++) {
        const node = this.grid[x][z];
        node.parent = null;
        node.gCost = 0;
        node.hCost = 0;
        node.fCost = 0;
      }
    }
  }

  // Cache management
  cacheResult(key, path) {
    console.log("Calling method: cacheResult");
    if (this.pathCache.size >= this.maxCacheSize) {
      // Remove oldest entry
      const firstKey = this.pathCache.keys().next().value;
      this.pathCache.delete(firstKey);
    }
    this.pathCache.set(key, [...path]); // Store copy
  }
  clearCache() {
    console.log("Calling method: clearCache");
    this.pathCache.clear();
  }

  // Path validation and repair
  validatePath(path) {
    console.log("Calling method: validatePath");
    if (!path || path.length < 2) return false;
    for (let i = 0; i < path.length - 1; i++) {
      if (!this.hasLineOfSight(path[i], path[i + 1])) {
        return false;
      }
    }
    return true;
  }
  repairPath(path) {
    console.log("Calling method: repairPath");
    if (!path || path.length < 2) return path;
    const repairedPath = [path[0]];
    for (let i = 1; i < path.length; i++) {
      const lastValid = repairedPath[repairedPath.length - 1];
      const current = path[i];
      if (!this.hasLineOfSight(lastValid, current)) {
        // Find intermediate waypoint
        const midPoint = {
          x: (lastValid.x + current.x) / 2,
          z: (lastValid.z + current.z) / 2
        };

        // Find nearest walkable position to midpoint
        const walkablePoint = this.findNearestWalkablePosition(midPoint);
        if (walkablePoint) {
          repairedPath.push(walkablePoint);
        }
      }
      repairedPath.push(current);
    }
    return repairedPath;
  }
  findNearestWalkablePosition(position) {
    console.log("Calling method: findNearestWalkablePosition");
    const gridPos = this.worldToGrid(position.x, position.z);

    // Search in expanding circles
    for (let radius = 0; radius <= 5; radius++) {
      for (let x = -radius; x <= radius; x++) {
        for (let z = -radius; z <= radius; z++) {
          if (Math.abs(x) !== radius && Math.abs(z) !== radius) continue;
          const checkX = gridPos.x + x;
          const checkZ = gridPos.z + z;
          if (this.isValidGridPosition(checkX, checkZ) && this.grid[checkX][checkZ].walkable) {
            return this.gridToWorld(checkX, checkZ);
          }
        }
      }
    }
    return null;
  }

  // Settings
  setAllowDiagonal(allow) {
    console.log("Calling method: setAllowDiagonal");
    this.allowDiagonal = allow;
    this.clearCache(); // Clear cache as paths may change
  }
  setHeuristicWeight(weight) {
    console.log("Calling method: setHeuristicWeight");
    this.heuristicWeight = Math.max(0.1, weight);
    this.clearCache();
  }
  setGridSize(size) {
    console.log("Calling method: setGridSize");
    this.gridSize = Math.max(0.5, size);
    this.clearCache();
  }

  // Debug methods
  getDebugInfo() {
    console.log("Calling method: getDebugInfo");
    return {
      gridSize: this.gridSize,
      gridDimensions: `${this.gridWidth}x${this.gridHeight}`,
      allowDiagonal: this.allowDiagonal,
      heuristicWeight: this.heuristicWeight,
      cacheSize: this.pathCache.size,
      maxCacheSize: this.maxCacheSize
    };
  }
  visualizeGrid() {
    console.log("Calling method: visualizeGrid");
    // Return grid data for visualization
    const visualization = [];
    for (let x = 0; x < this.gridWidth; x++) {
      for (let z = 0; z < this.gridHeight; z++) {
        const node = this.grid[x][z];
        visualization.push({
          gridX: x,
          gridZ: z,
          worldX: node.worldX,
          worldZ: node.worldZ,
          walkable: node.walkable
        });
      }
    }
    return visualization;
  }
}
# Class `Pathfinding`

## `constructor()`

## `initializeGrid(mapData)`

Initialize grid from map data

## `isPositionWalkable(worldX, worldZ, mapData)`

Check if a world position is walkable

## `generatePath(startPos, endPos, )`

Generate path using A* algorithm

## `findPathAStar(start, end)`

A* pathfinding algorithm

## `getNeighbors(node)`

Get neighboring grid cells

## `retracePath(startNode, endNode)`

Retrace path from end to start

## `gridPathToWorldPath(gridPath)`

Convert grid path to world coordinates

## `smoothPath(path)`

Smooth path by removing unnecessary waypoints

## `hasLineOfSight(start, end)`

Check line of sight between two points

## `generateFallbackPath(startPos, endPos)`

Generate fallback path (straight line with waypoints)

## `updatePath(currentPath, currentIndex, newObstacles)`

Dynamic pathfinding for moving obstacles

## `generateFlowField(targetPos, )`

Flow field pathfinding for multiple units

## `getFlowFieldDirection(flowField, worldPos)`

Get direction from flow field

## `worldToGrid(worldX, worldZ)`

Utility methods

## `gridToWorld(gridX, gridZ)`

## `isValidGridPosition(x, z)`

## `getDistance(nodeA, nodeB)`

## `resetGrid()`

## `cacheResult(key, path)`

Cache management

## `clearCache()`

## `validatePath(path)`

Path validation and repair

## `repairPath(path)`

## `findNearestWalkablePosition(position)`

## `setAllowDiagonal(allow)`

Settings

## `setHeuristicWeight(weight)`

## `setGridSize(size)`

## `getDebugInfo()`

Debug methods

## `visualizeGrid()`
# Class `MapData`

## `constructor()`

## `loadLevel(levelNumber)`

Load level data

## `generateMap(levelNumber)`

Generate map procedurally

## `generateSpawnAndEndPoints(levelNumber)`

## `generateObstacles(levelNumber, difficulty)`

## `generateValidObstacle(levelNumber, )`

## `generateRandomObstacle(levelNumber)`

## `generateDecorations(levelNumber)`

## `generateSpecialAreas(levelNumber)`

## `generateNavMesh()`

## `generatePathNodes()`

## `connectPathNodes()`

## `isValidObstaclePosition(obstacle)`

Validation methods

## `isPositionWalkable(x, z)`

## `intersectsDirectPath(obstacle)`

## `hasLineOfSight(pos1, pos2)`

## `notifyMapLoadingStart(levelNumber)`

Notification methods (using dependency injection)

## `notifyMapLoadingComplete(levelNumber)`

## `notifyMapLoadingError(levelNumber, error)`

## `notifyMapGenerated(levelNumber)`

## `notifyThemeChanged(themeName)`

## `getDistance(pos1, pos2)`

Utility methods

## `lineCircleIntersection(lineStart, lineEnd, circleCenter, circleRadius)`

## `getRandomDecorationType(levelNumber)`

## `getLevelTheme(levelNumber)`

## `setTheme(themeName)`

## `getSpawnPoint()`

Public API - Getters (return defensive copies)

## `getEndPoint()`

## `getObstacles()`

## `getDecorations()`

## `getSpecialAreas()`

## `getNavMesh()`

## `getPathNodes()`

## `getEnvironmentSettings()`

## `getMapBounds()`

## `getCurrentTheme()`

## `isInBounds(x, z)`

Position queries

## `getTerrainHeight(x, z)`

## `getNearestWalkablePosition(x, z)`

## `saveMapData()`

Save/Load with improved error handling

## `loadMapData(data)`
# Class `MapAnalyzer`

## `constructor(mapData)`

## `analyzePathDifficulty()`

## `calculatePathLength()`

## `findChokePoints()`

## `calculateDifficultyScore(pathLength, obstacleCount, chokePointCount)`
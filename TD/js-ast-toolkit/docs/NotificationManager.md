# Class `NotificationManager`

## `constructor()`

## `initContainer()`

## `show(message, , , )`

Main notification method

## `showInfo(message, duration)`

Convenience methods for different types

## `showSuccess(message, duration)`

## `showWarning(message, duration)`

## `showError(message, duration)`

## `showAchievement(message, duration)`

## `showWaveStart(waveNumber)`

Game-specific notification methods

## `showWaveComplete(waveNumber)`

## `showBossAppearing(bossName)`

## `showResourceGained(resourceType, amount)`

## `showTowerBuilt(towerType)`

## `showTowerUpgraded(towerType)`

## `showEnemyDefeated(enemyType, bounty)`

## `showBaseDamage(damage)`

## `showInsufficientResources(resourceType)`

## `showGamePaused()`

## `showGameResumed()`

## `showLevelComplete()`

## `showGameOver()`

## `createNotification(message, duration, type, )`

Core notification creation

## `createNotificationElement(notification)`

## `addNotification(notification)`

## `setAudioManager(audioManager)`

Method to set audio manager dependency (for dependency injection)

## `dismiss(notificationId)`

## `removeNotificationElement(notification)`

## `addPulseEffect(element)`

Special effects

## `addShakeEffect(element)`

## `addCelebrationEffect(element)`

## `addKeyframes(name, keyframes)`

## `createConfetti(element)`

## `dismissAll()`

Utility methods

## `dismissByType(type)`

## `getActiveNotifications()`

## `hasNotificationType(type)`

## `setMaxNotifications(max)`

Settings

## `setDefaultDuration(duration)`

## `setAnimationDuration(duration)`

## `dispose()`

Cleanup
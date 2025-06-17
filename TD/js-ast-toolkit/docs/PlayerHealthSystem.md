# Class `PlayerHealthSystem`

## `constructor(, )`

## `takeDamage()`

Core health methods

## `heal()`

## `handleDeath()`

Handle death with proper dependency injection

## `isDead()`

Status checks

## `isFullHealth()`

## `isLowHealth()`

## `getCurrentLives()`

Getters

## `getMaxLives()`

## `getHealthPercentage()`

## `getTotalDamageTaken()`

## `triggerInvulnerability()`

Invulnerability system

## `update(deltaTime)`

## `enableRegeneration()`

Regeneration system

## `disableRegeneration()`

## `updateRegeneration()`

## `setRegenerationRate(livesPerMinute)`

## `triggerDamageFlash()`

Visual feedback

## `applyScreenFlash()`

## `addDamageToHistory(damage)`

Damage history

## `getDamageHistory()`

## `getRecentDamage()`

## `increaseMaxLives()`

Upgrades and modifications

## `setMaxLives(newMax)`

## `addEventListener(eventType, callback)`

Refined event system using structured callbacks

## `removeEventListener(eventType, callback)`

## `onHealthChanged(callback)`

Backward compatibility methods (deprecated - use addEventListener instead)

## `onDamage(callback)`

## `onPlayerDeath(callback)`

## `onLifeLoss(callback)`

## `onRegeneration(callback)`

## `notifyHealthChange(newLives, oldLives)`

Notification methods

## `notifyDamageTaken(damage, oldLives, newLives)`

## `notifyDeath()`

## `notifyLifeLost(livesLost)`

## `notifyHealthRegenerated(livesRegained)`

## `saveState()`

Save/Load system

## `loadState(state)`

## `reset()`

Reset system

## `getDebugInfo()`

Debug methods

## `updateDependencies(newDependencies)`

Method to update dependencies after instantiation if needed
# Class `Enemy`

## `constructor(type, template, position, path)`

## `setDependencies()`

Dependency injection method

## `createMesh()`

## `addSpecialEffects()`

## `update(deltaTime, path)`

## `updateMovement(deltaTime)`

## `updateStatusEffects(deltaTime)`

## `applyStatusEffect(effect, deltaTime)`

## `removeStatusEffect(effect)`

## `updateAbilities(deltaTime)`

## `executeAbility(abilityName)`

## `speedBurst()`

## `dodge()`

## `updateAI(deltaTime)`

## `updateAttackBehavior(deltaTime)`

## `updateFleeBehavior(deltaTime)`

## `updateVisualEffects(deltaTime)`

## `takeDamage(amount, )`

Combat methods

## `heal(amount)`

## `die()`

## `addStatusEffect(effect)`

Status effect management

## `removeStatusEffectByType(type)`

## `hasStatusEffect(type)`

## `triggerDamageEffect(damage, isShield)`

Visual effect methods

## `triggerHealEffect(amount)`

## `triggerDeathEffect()`

## `getHealthPercentage()`

Utility methods

## `getDistanceToEnd()`

## `getProgressAlongPath()`

## `dispose()`

Cleanup
# Class `EnemyFactory`

## `constructor()`

## `createEnemy(type, levelNumber, position, path)`

## `createBoss(bossType, levelNumber, position, path)`

## `getBossTemplate(bossType, levelNumber)`
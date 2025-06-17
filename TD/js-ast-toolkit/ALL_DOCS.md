# Table of Contents
- [AudioManager (src\frontend\AudioManager.js)](#audiomanager)
  - [constructor](#constructor)
  - [init](#init)
  - [initFallback](#initfallback)
  - [loadDefaultSounds](#loaddefaultsounds)
  - [generateTone](#generatetone)
  - [generateExplosion](#generateexplosion)
  - [generateShot](#generateshot)
  - [generateLaser](#generatelaser)
  - [generateFreeze](#generatefreeze)
  - [generateAlarm](#generatealarm)
  - [generateFanfare](#generatefanfare)
  - [generateGameOver](#generategameover)
  - [generateVictory](#generatevictory)
  - [generateBossIntro](#generatebossintro)
  - [createSoundPool](#createsoundpool)
  - [getAvailableSource](#getavailablesource)
  - [playSound](#playsound)
  - [playWebAudioSound](#playwebaudiosound)
  - [playHTML5Sound](#playhtml5sound)
  - [playBackgroundMusic](#playbackgroundmusic)
  - [stopBackgroundMusic](#stopbackgroundmusic)
  - [createMusicLoop](#createmusicloop)
  - [fadeInMusic](#fadeinmusic)
  - [fadeOutMusic](#fadeoutmusic)
  - [setMasterVolume](#setmastervolume)
  - [setMusicVolume](#setmusicvolume)
  - [setSFXVolume](#setsfxvolume)
  - [mute](#mute)
  - [unmute](#unmute)
  - [toggleMute](#togglemute)
  - [getMasterVolume](#getmastervolume)
  - [getMusicVolume](#getmusicvolume)
  - [getSFXVolume](#getsfxvolume)
  - [isMusicPlaying](#ismusicplaying)
  - [dispose](#dispose)
- [AuthManager (src\frontend\AuthManager.js)](#authmanager)
  - [constructor](#constructor)
  - [register](#register)
  - [login](#login)
  - [logout](#logout)
  - [getCurrentUser](#getcurrentuser)
  - [getToken](#gettoken)
  - [saveSession](#savesession)
  - [loadSession](#loadsession)
  - [validateUsername](#validateusername)
  - [validateEmail](#validateemail)
  - [validatePassword](#validatepassword)
- [BossAISystem (src\frontend\BossAISystem.js)](#bossaisystem)
  - [constructor](#constructor)
  - [queueAerialAbility](#queueaerialability)
  - [queueDesperateAbility](#queuedesperateability)
  - [queueRandomAbility](#queuerandomability)
  - [findSafestPosition](#findsafestposition)
  - [evadeTowers](#evadetowers)
  - [performAerialMovement](#performaerialmovement)
  - [attackTower](#attacktower)
  - [getDistance](#getdistance)
  - [getAbilityCooldown](#getabilitycooldown)
  - [emitEvent](#emitevent)
- [Enemy (src\frontend\enemy.js)](#enemy)
  - [constructor](#constructor)
  - [setDependencies](#setdependencies)
  - [createMesh](#createmesh)
  - [addSpecialEffects](#addspecialeffects)
  - [update](#update)
  - [updateMovement](#updatemovement)
  - [updateStatusEffects](#updatestatuseffects)
  - [applyStatusEffect](#applystatuseffect)
  - [removeStatusEffect](#removestatuseffect)
  - [updateAbilities](#updateabilities)
  - [executeAbility](#executeability)
  - [speedBurst](#speedburst)
  - [dodge](#dodge)
  - [updateAI](#updateai)
  - [updateAttackBehavior](#updateattackbehavior)
  - [updateFleeBehavior](#updatefleebehavior)
  - [updateVisualEffects](#updatevisualeffects)
  - [takeDamage](#takedamage)
  - [heal](#heal)
  - [die](#die)
  - [addStatusEffect](#addstatuseffect)
  - [removeStatusEffectByType](#removestatuseffectbytype)
  - [hasStatusEffect](#hasstatuseffect)
  - [triggerDamageEffect](#triggerdamageeffect)
  - [triggerHealEffect](#triggerhealeffect)
  - [triggerDeathEffect](#triggerdeatheffect)
  - [getHealthPercentage](#gethealthpercentage)
  - [getDistanceToEnd](#getdistancetoend)
  - [getProgressAlongPath](#getprogressalongpath)
  - [dispose](#dispose)
- [EnemyFactory (src\frontend\enemy.js)](#enemyfactory)
  - [constructor](#constructor)
  - [createEnemy](#createenemy)
  - [createBoss](#createboss)
  - [getBossTemplate](#getbosstemplate)
- [EnemyUIManager (src\frontend\EnemyUIManager.js)](#enemyuimanager)
  - [constructor](#constructor)
  - [updateDependencies](#updatedependencies)
  - [initContainer](#initcontainer)
  - [update](#update)
  - [updateHealthBars](#updatehealthbars)
  - [createHealthBar](#createhealthbar)
  - [updateHealthBarPosition](#updatehealthbarposition)
  - [updateHealthBarValue](#updatehealthbarvalue)
  - [updateHealthBarVisibility](#updatehealthbarvisibility)
  - [triggerHealthBarDamageEffect](#triggerhealthbardamageeffect)
  - [updateStatusIndicators](#updatestatusindicators)
  - [createStatusIndicator](#createstatusindicator)
  - [updateStatusIndicatorPosition](#updatestatusindicatorposition)
  - [updateStatusIndicatorEffects](#updatestatusindicatoreffects)
  - [createStatusEffectElement](#createstatuseffectelement)
  - [showDamageNumber](#showdamagenumber)
  - [createDamageNumber](#createdamagenumber)
  - [positionDamageNumber](#positiondamagenumber)
  - [updateDamageNumbers](#updatedamagenumbers)
  - [removeDamageNumber](#removedamagenumber)
  - [cleanupUnusedElements](#cleanupunusedelements)
  - [removeHealthBar](#removehealthbar)
  - [removeStatusIndicator](#removestatusindicator)
  - [getEnemyTypeIcon](#getenemytypeicon)
  - [setHealthBarVisibility](#sethealthbarvisibility)
  - [setDamageNumberVisibility](#setdamagenumbervisibility)
  - [setStatusEffectVisibility](#setstatuseffectvisibility)
  - [dispose](#dispose)
- [GameLoop (src\frontend\GameLoop.js)](#gameloop)
  - [constructor](#constructor)
  - [start](#start)
  - [stop](#stop)
  - [loop](#loop)
  - [update](#update)
  - [render](#render)
  - [updateFPS](#updatefps)
  - [handleError](#handleerror)
  - [getCurrentFPS](#getcurrentfps)
  - [getDeltaTime](#getdeltatime)
  - [isGameRunning](#isgamerunning)
  - [pause](#pause)
  - [resume](#resume)
  - [setTargetFPS](#settargetfps)
  - [getDebugInfo](#getdebuginfo)
- [HealthSystem (src\frontend\HealthSystem.js)](#healthsystem)
  - [constructor](#constructor)
  - [registerEntity](#registerentity)
  - [unregisterEntity](#unregisterentity)
  - [dealDamage](#dealdamage)
  - [heal](#heal)
  - [setHealth](#sethealth)
  - [getHealthInfo](#gethealthinfo)
  - [modifyStats](#modifystats)
  - [startRegeneration](#startregeneration)
  - [stopRegeneration](#stopregeneration)
  - [handleDeath](#handledeath)
  - [addDeathCallback](#adddeathcallback)
  - [applyStatusEffect](#applystatuseffect)
  - [removeStatusEffect](#removestatuseffect)
  - [getEntitiesByCondition](#getentitiesbycondition)
  - [getAliveEntities](#getaliveentities)
  - [getDeadEntities](#getdeadentities)
  - [getEntitiesByType](#getentitiesbytype)
  - [getLowHealthEntities](#getlowhealthentities)
  - [addEventListener](#addeventlistener)
  - [removeEventListener](#removeeventlistener)
  - [triggerEvent](#triggerevent)
  - [update](#update)
  - [updateStatusEffects](#updatestatuseffects)
  - [processDamageQueue](#processdamagequeue)
  - [processHealingQueue](#processhealingqueue)
  - [queueDamage](#queuedamage)
  - [queueHealing](#queuehealing)
  - [resetAllHealth](#resetallhealth)
  - [getSystemStats](#getsystemstats)
  - [destroy](#destroy)
- [HUDManager (src\frontend\HUDManager.js)](#hudmanager)
  - [constructor](#constructor)
  - [init](#init)
  - [initMinimap](#initminimap)
  - [setupEventListeners](#setupeventlisteners)
  - [startUpdateLoops](#startupdateloops)
  - [update](#update)
  - [updateAll](#updateall)
  - [updateResources](#updateresources)
  - [updateResource](#updateresource)
  - [updateGold](#updategold)
  - [updateEnergy](#updateenergy)
  - [updateHealth](#updatehealth)
  - [updateWaveInfo](#updatewaveinfo)
  - [updateScore](#updatescore)
  - [updateControlButtons](#updatecontrolbuttons)
  - [updateMinimap](#updateminimap)
  - [drawMinimapPath](#drawminimappath)
  - [drawMinimapTowers](#drawminimaptowers)
  - [drawMinimapEnemies](#drawminimapenemies)
  - [drawMinimapBase](#drawminimapbase)
  - [worldToMinimap](#worldtominimap)
  - [getTowerColor](#gettowercolor)
  - [getEnemyColor](#getenemycolor)
  - [triggerResourceGainEffect](#triggerresourcegaineffect)
  - [triggerScoreGainEffect](#triggerscoregaineffect)
  - [triggerHealthFlash](#triggerhealthflash)
  - [triggerWaveStartEffect](#triggerwavestarteffect)
  - [triggerWaveCompleteEffect](#triggerwavecompleteeffect)
  - [showInsufficientResourceFeedback](#showinsufficientresourcefeedback)
  - [formatNumber](#formatnumber)
  - [showElement](#showelement)
  - [hideElement](#hideelement)
  - [toggleElement](#toggleelement)
  - [showHUD](#showhud)
  - [hideHUD](#hidehud)
  - [dispose](#dispose)
- [InputManager (src\frontend\InputManager.js)](#inputmanager)
  - [constructor](#constructor)
  - [initializeCameraPosition](#initializecameraposition)
  - [onKeyDown](#onkeydown)
  - [onKeyUp](#onkeyup)
  - [onClick](#onclick)
  - [onMouseMove](#onmousemove)
  - [onMouseDown](#onmousedown)
  - [onMouseUp](#onmouseup)
  - [onWheel](#onwheel)
  - [onTouchStart](#ontouchstart)
  - [onTouchMove](#ontouchmove)
  - [onTouchEnd](#ontouchend)
  - [setInputMode](#setinputmode)
  - [cancelCurrentAction](#cancelcurrentaction)
  - [selectTowerType](#selecttowertype)
  - [createTowerPlacementPreview](#createtowerplacementpreview)
  - [updateTowerPlacementPreview](#updatetowerplacementpreview)
  - [clearTowerPlacementPreview](#cleartowerplacementpreview)
  - [rotatePlacementPreview](#rotateplacementpreview)
  - [handleNormalClick](#handlenormalclick)
  - [handleTowerPlacement](#handletowerplacement)
  - [handleTowerUpgrade](#handletowerupgrade)
  - [handleTouchTap](#handletouchtap)
  - [handleCameraRotation](#handlecamerarotation)
  - [handleCameraPanning](#handlecamerapanning)
  - [handleCameraZoom](#handlecamerazoom)
  - [handleCameraRotationFromTouch](#handlecamerarotationfromtouch)
  - [handleTouchZoomAndPan](#handletouchzoomandpan)
  - [updateCameraPosition](#updatecameraposition)
  - [startCameraMovement](#startcameramovement)
  - [updateMousePosition](#updatemouseposition)
  - [updateMousePositionFromTouch](#updatemousepositionfromtouch)
  - [getWorldPosition](#getworldposition)
  - [getIntersectedObject](#getintersectedobject)
  - [isValidTowerPosition](#isvalidtowerposition)
  - [updateHoverEffects](#updatehovereffects)
  - [selectTower](#selecttower)
  - [upgradeTower](#upgradetower)
  - [selectEnemy](#selectenemy)
  - [deselectAll](#deselectall)
  - [isKeyPressed](#iskeypressed)
  - [getMousePosition](#getmouseposition)
  - [enableCameraControls](#enablecameracontrols)
  - [disableCameraControls](#disablecameracontrols)
  - [dispose](#dispose)
- [LevelData (src\frontend\LevelData.js)](#leveldata)
  - [constructor](#constructor)
  - [initializeEnemyTemplates](#initializeenemytemplates)
  - [initializeWaveTemplates](#initializewavetemplates)
  - [loadLevel](#loadlevel)
  - [generateLevel](#generatelevel)
  - [generateWaves](#generatewaves)
  - [generateWave](#generatewave)
  - [selectWaveTemplates](#selectwavetemplates)
  - [scaleWave](#scalewave)
  - [calculateWaveCount](#calculatewavecount)
  - [calculateLevelDifficulty](#calculateleveldifficulty)
  - [calculateLevelDuration](#calculatelevelduration)
  - [calculateLevelRewards](#calculatelevelrewards)
  - [calculateWaveRewards](#calculatewaverewards)
  - [calculatePreWaveDelay](#calculateprewavedelay)
  - [getScaledEnemyTemplate](#getscaledenemytemplate)
  - [getLevelDescription](#getleveldescription)
  - [getLevelTheme](#getleveltheme)
  - [getLevelObjectives](#getlevelobjectives)
  - [getLevelSpecialRules](#getlevelspecialrules)
  - [getLevelUnlocks](#getlevelunlocks)
  - [getCurrentLevel](#getcurrentlevel)
  - [getLevelData](#getleveldata)
  - [getWaveData](#getwavedata)
  - [getEnemyTemplate](#getenemytemplate)
  - [getWaveTemplate](#getwavetemplate)
  - [getMaxLevels](#getmaxlevels)
  - [isValidLevel](#isvalidlevel)
  - [isLevelUnlocked](#islevelunlocked)
  - [saveLevelData](#saveleveldata)
  - [loadLevelData](#loadleveldata)
  - [getDebugInfo](#getdebuginfo)
- [Game (src\frontend\main.js)](#game)
  - [constructor](#constructor)
  - [init](#init)
  - [initThreeJS](#initthreejs)
  - [initGameSystems](#initgamesystems)
  - [setupEventListeners](#setupeventlisteners)
  - [prepareIntro](#prepareintro)
  - [startGame](#startgame)
  - [handleGameOver](#handlegameover)
  - [togglePause](#togglepause)
  - [addEnemy](#addenemy)
  - [addEventListener](#addeventlistener)
  - [triggerEvent](#triggerevent)
  - [update](#update)
  - [render](#render)
- [MapData (src\frontend\MapData.js)](#mapdata)
  - [constructor](#constructor)
  - [loadLevel](#loadlevel)
  - [generateMap](#generatemap)
  - [generateSpawnAndEndPoints](#generatespawnandendpoints)
  - [generateObstacles](#generateobstacles)
  - [generateValidObstacle](#generatevalidobstacle)
  - [generateRandomObstacle](#generaterandomobstacle)
  - [generateDecorations](#generatedecorations)
  - [generateSpecialAreas](#generatespecialareas)
  - [generateNavMesh](#generatenavmesh)
  - [generatePathNodes](#generatepathnodes)
  - [connectPathNodes](#connectpathnodes)
  - [isValidObstaclePosition](#isvalidobstacleposition)
  - [isPositionWalkable](#ispositionwalkable)
  - [intersectsDirectPath](#intersectsdirectpath)
  - [hasLineOfSight](#haslineofsight)
  - [notifyMapLoadingStart](#notifymaploadingstart)
  - [notifyMapLoadingComplete](#notifymaploadingcomplete)
  - [notifyMapLoadingError](#notifymaploadingerror)
  - [notifyMapGenerated](#notifymapgenerated)
  - [notifyThemeChanged](#notifythemechanged)
  - [getDistance](#getdistance)
  - [lineCircleIntersection](#linecircleintersection)
  - [getRandomDecorationType](#getrandomdecorationtype)
  - [getLevelTheme](#getleveltheme)
  - [setTheme](#settheme)
  - [getSpawnPoint](#getspawnpoint)
  - [getEndPoint](#getendpoint)
  - [getObstacles](#getobstacles)
  - [getDecorations](#getdecorations)
  - [getSpecialAreas](#getspecialareas)
  - [getNavMesh](#getnavmesh)
  - [getPathNodes](#getpathnodes)
  - [getEnvironmentSettings](#getenvironmentsettings)
  - [getMapBounds](#getmapbounds)
  - [getCurrentTheme](#getcurrenttheme)
  - [isInBounds](#isinbounds)
  - [getTerrainHeight](#getterrainheight)
  - [getNearestWalkablePosition](#getnearestwalkableposition)
  - [saveMapData](#savemapdata)
  - [loadMapData](#loadmapdata)
- [MapAnalyzer (src\frontend\MapData.js)](#mapanalyzer)
  - [constructor](#constructor)
  - [analyzePathDifficulty](#analyzepathdifficulty)
  - [calculatePathLength](#calculatepathlength)
  - [findChokePoints](#findchokepoints)
  - [calculateDifficultyScore](#calculatedifficultyscore)
- [MultiplayerManager (src\frontend\MultiplayerManager.js)](#multiplayermanager)
  - [constructor](#constructor)
  - [setupSocketListeners](#setupsocketlisteners)
  - [syncTowerPlacement](#synctowerplacement)
  - [createRoom](#createroom)
  - [joinRoom](#joinroom)
  - [sendChatMessage](#sendchatmessage)
  - [isMultiplayerConnected](#ismultiplayerconnected)
- [NotificationManager (src\frontend\NotificationManager.js)](#notificationmanager)
  - [constructor](#constructor)
  - [initContainer](#initcontainer)
  - [show](#show)
  - [showInfo](#showinfo)
  - [showSuccess](#showsuccess)
  - [showWarning](#showwarning)
  - [showError](#showerror)
  - [showAchievement](#showachievement)
  - [showWaveStart](#showwavestart)
  - [showWaveComplete](#showwavecomplete)
  - [showBossAppearing](#showbossappearing)
  - [showResourceGained](#showresourcegained)
  - [showTowerBuilt](#showtowerbuilt)
  - [showTowerUpgraded](#showtowerupgraded)
  - [showEnemyDefeated](#showenemydefeated)
  - [showBaseDamage](#showbasedamage)
  - [showInsufficientResources](#showinsufficientresources)
  - [showGamePaused](#showgamepaused)
  - [showGameResumed](#showgameresumed)
  - [showLevelComplete](#showlevelcomplete)
  - [showGameOver](#showgameover)
  - [createNotification](#createnotification)
  - [createNotificationElement](#createnotificationelement)
  - [addNotification](#addnotification)
  - [setAudioManager](#setaudiomanager)
  - [dismiss](#dismiss)
  - [removeNotificationElement](#removenotificationelement)
  - [addPulseEffect](#addpulseeffect)
  - [addShakeEffect](#addshakeeffect)
  - [addCelebrationEffect](#addcelebrationeffect)
  - [addKeyframes](#addkeyframes)
  - [createConfetti](#createconfetti)
  - [dismissAll](#dismissall)
  - [dismissByType](#dismissbytype)
  - [getActiveNotifications](#getactivenotifications)
  - [hasNotificationType](#hasnotificationtype)
  - [setMaxNotifications](#setmaxnotifications)
  - [setDefaultDuration](#setdefaultduration)
  - [setAnimationDuration](#setanimationduration)
  - [dispose](#dispose)
- [ParticleSystem (src\frontend\ParticleSystem.js)](#particlesystem)
  - [constructor](#constructor)
  - [initializeParticleTypes](#initializeparticletypes)
  - [createBurst](#createburst)
  - [createParticle](#createparticle)
  - [createEmitter](#createemitter)
  - [stopEmitter](#stopemitter)
  - [removeEmitter](#removeemitter)
  - [update](#update)
  - [updateParticles](#updateparticles)
  - [updateParticleVisuals](#updateparticlevisuals)
  - [handleParticleBounce](#handleparticlebounce)
  - [updateEmitters](#updateemitters)
  - [emitParticle](#emitparticle)
  - [render](#render)
  - [renderParticle](#renderparticle)
  - [createExplosion](#createexplosion)
  - [createImpact](#createimpact)
  - [createTrail](#createtrail)
  - [randomBetween](#randombetween)
  - [clearAllParticles](#clearallparticles)
  - [setMaxParticles](#setmaxparticles)
  - [getParticleCount](#getparticlecount)
  - [getEmitterCount](#getemittercount)
  - [addEventListener](#addeventlistener)
  - [removeEventListener](#removeeventlistener)
  - [triggerEvent](#triggerevent)
  - [getSystemStats](#getsystemstats)
- [Pathfinding (src\frontend\Pathfinding.js)](#pathfinding)
  - [constructor](#constructor)
  - [initializeGrid](#initializegrid)
  - [isPositionWalkable](#ispositionwalkable)
  - [generatePath](#generatepath)
  - [findPathAStar](#findpathastar)
  - [getNeighbors](#getneighbors)
  - [retracePath](#retracepath)
  - [gridPathToWorldPath](#gridpathtoworldpath)
  - [smoothPath](#smoothpath)
  - [hasLineOfSight](#haslineofsight)
  - [generateFallbackPath](#generatefallbackpath)
  - [updatePath](#updatepath)
  - [generateFlowField](#generateflowfield)
  - [getFlowFieldDirection](#getflowfielddirection)
  - [worldToGrid](#worldtogrid)
  - [gridToWorld](#gridtoworld)
  - [isValidGridPosition](#isvalidgridposition)
  - [getDistance](#getdistance)
  - [resetGrid](#resetgrid)
  - [cacheResult](#cacheresult)
  - [clearCache](#clearcache)
  - [validatePath](#validatepath)
  - [repairPath](#repairpath)
  - [findNearestWalkablePosition](#findnearestwalkableposition)
  - [setAllowDiagonal](#setallowdiagonal)
  - [setHeuristicWeight](#setheuristicweight)
  - [setGridSize](#setgridsize)
  - [getDebugInfo](#getdebuginfo)
  - [visualizeGrid](#visualizegrid)
- [PlayerHealthSystem (src\frontend\PlayerHealthSystem.js)](#playerhealthsystem)
  - [constructor](#constructor)
  - [takeDamage](#takedamage)
  - [heal](#heal)
  - [handleDeath](#handledeath)
  - [isDead](#isdead)
  - [isFullHealth](#isfullhealth)
  - [isLowHealth](#islowhealth)
  - [getCurrentLives](#getcurrentlives)
  - [getMaxLives](#getmaxlives)
  - [getHealthPercentage](#gethealthpercentage)
  - [getTotalDamageTaken](#gettotaldamagetaken)
  - [triggerInvulnerability](#triggerinvulnerability)
  - [update](#update)
  - [enableRegeneration](#enableregeneration)
  - [disableRegeneration](#disableregeneration)
  - [updateRegeneration](#updateregeneration)
  - [setRegenerationRate](#setregenerationrate)
  - [triggerDamageFlash](#triggerdamageflash)
  - [applyScreenFlash](#applyscreenflash)
  - [addDamageToHistory](#adddamagetohistory)
  - [getDamageHistory](#getdamagehistory)
  - [getRecentDamage](#getrecentdamage)
  - [increaseMaxLives](#increasemaxlives)
  - [setMaxLives](#setmaxlives)
  - [addEventListener](#addeventlistener)
  - [removeEventListener](#removeeventlistener)
  - [onHealthChanged](#onhealthchanged)
  - [onDamage](#ondamage)
  - [onPlayerDeath](#onplayerdeath)
  - [onLifeLoss](#onlifeloss)
  - [onRegeneration](#onregeneration)
  - [notifyHealthChange](#notifyhealthchange)
  - [notifyDamageTaken](#notifydamagetaken)
  - [notifyDeath](#notifydeath)
  - [notifyLifeLost](#notifylifelost)
  - [notifyHealthRegenerated](#notifyhealthregenerated)
  - [saveState](#savestate)
  - [loadState](#loadstate)
  - [reset](#reset)
  - [getDebugInfo](#getdebuginfo)
  - [updateDependencies](#updatedependencies)
- [ProjectileSystem (src\frontend\ProjectileSystem.js)](#projectilesystem)
  - [constructor](#constructor)
  - [initializeProjectileTypes](#initializeprojectiletypes)
  - [createProjectile](#createprojectile)
  - [handleInstantHit](#handleinstanthit)
  - [update](#update)
  - [updateHoming](#updatehoming)
  - [updateTrail](#updatetrail)
  - [checkCollisions](#checkcollisions)
  - [handleProjectileHit](#handleprojectilehit)
  - [applyStatusEffects](#applystatuseffects)
  - [handleSplashDamage](#handlesplashdamage)
  - [handleChainLightning](#handlechainlightning)
  - [handleBounce](#handlebounce)
  - [isOutOfBounds](#isoutofbounds)
  - [removeProjectile](#removeprojectile)
  - [getDistance](#getdistance)
  - [getAllProjectiles](#getallprojectiles)
  - [getProjectilesByTower](#getprojectilesbytower)
  - [getProjectile](#getprojectile)
  - [clearAllProjectiles](#clearallprojectiles)
  - [addEventListener](#addeventlistener)
  - [removeEventListener](#removeeventlistener)
  - [triggerEvent](#triggerevent)
  - [getSystemStats](#getsystemstats)
- [ResourceManager (src\frontend\ResourceManager.js)](#resourcemanager)
  - [constructor](#constructor)
  - [startPassiveIncome](#startpassiveincome)
  - [stopPassiveIncome](#stoppassiveincome)
  - [addGold](#addgold)
  - [spendGold](#spendgold)
  - [getGold](#getgold)
  - [addEnergy](#addenergy)
  - [spendEnergy](#spendenergy)
  - [getEnergy](#getenergy)
  - [addScore](#addscore)
  - [getScore](#getscore)
  - [getLives](#getlives)
  - [loseLive](#loselive)
  - [canAfford](#canafford)
  - [spendResources](#spendresources)
  - [recordEnemyDefeated](#recordenemydefeated)
  - [recordTowerBuilt](#recordtowerbuilt)
  - [recordWaveSurvived](#recordwavesurvived)
  - [getEnemiesDefeated](#getenemiesdefeated)
  - [getTowersBuilt](#gettowersbuilt)
  - [getWavesSurvived](#getwavessurvived)
  - [setGoldPerSecond](#setgoldpersecond)
  - [setEnergyPerSecond](#setenergypersecond)
  - [getGoldPerSecond](#getgoldpersecond)
  - [getEnergyPerSecond](#getenergypersecond)
  - [upgradeGoldIncome](#upgradegoldincome)
  - [upgradeEnergyIncome](#upgradeenergyincome)
  - [onResourceChanged](#onresourcechanged)
  - [onInsufficientResource](#oninsufficientresource)
  - [notifyResourceChange](#notifyresourcechange)
  - [notifyInsufficientResources](#notifyinsufficientresources)
  - [saveState](#savestate)
  - [loadState](#loadstate)
  - [reset](#reset)
  - [destroy](#destroy)
  - [getAllResources](#getallresources)
  - [getAllStats](#getallstats)
  - [getDebugInfo](#getdebuginfo)
  - [cheatAddGold](#cheataddgold)
  - [cheatAddEnergy](#cheataddenergy)
  - [cheatMaxResources](#cheatmaxresources)
- [StatusEffectSystem (src\frontend\StatusEffectSystem.js)](#statuseffectsystem)
  - [constructor](#constructor)
  - [initializeEffectTypes](#initializeeffecttypes)
  - [applyEffect](#applyeffect)
  - [removeEffect](#removeeffect)
  - [setupUpdateTimer](#setupupdatetimer)
  - [findEffectByType](#findeffectbytype)
  - [applySlowEffect](#applysloweffect)
  - [updateSlowEffect](#updatesloweffect)
  - [removeSlowEffect](#removesloweffect)
  - [applyPoisonEffect](#applypoisoneffect)
  - [updatePoisonEffect](#updatepoisoneffect)
  - [removePoisonEffect](#removepoisoneffect)
  - [applyFreezeEffect](#applyfreezeeffect)
  - [updateFreezeEffect](#updatefreezeeffect)
  - [removeFreezeEffect](#removefreezeeffect)
  - [applyBurnEffect](#applyburneffect)
  - [updateBurnEffect](#updateburneffect)
  - [removeBurnEffect](#removeburneffect)
  - [applyStunEffect](#applystuneffect)
  - [updateStunEffect](#updatestuneffect)
  - [removeStunEffect](#removestuneffect)
  - [applyArmorReductionEffect](#applyarmorreductioneffect)
  - [updateArmorReductionEffect](#updatearmorreductioneffect)
  - [removeArmorReductionEffect](#removearmorreductioneffect)
  - [applyDamageBoostEffect](#applydamageboosteffect)
  - [updateDamageBoostEffect](#updatedamageboosteffect)
  - [removeDamageBoostEffect](#removedamageboosteffect)
  - [applySpeedBoostEffect](#applyspeedboosteffect)
  - [updateSpeedBoostEffect](#updatespeedboosteffect)
  - [removeSpeedBoostEffect](#removespeedboosteffect)
  - [applyRegenerationEffect](#applyregenerationeffect)
  - [updateRegenerationEffect](#updateregenerationeffect)
  - [removeRegenerationEffect](#removeregenerationeffect)
  - [applyShieldEffect](#applyshieldeffect)
  - [updateShieldEffect](#updateshieldeffect)
  - [removeShieldEffect](#removeshieldeffect)
  - [getEntity](#getentity)
  - [getActiveEffects](#getactiveeffects)
  - [hasEffect](#haseffect)
  - [removeAllEffects](#removealleffects)
  - [removeAllEffectsOfType](#removealleffectsoftype)
  - [getEffectTypes](#geteffecttypes)
  - [addEventListener](#addeventlistener)
  - [removeEventListener](#removeeventlistener)
  - [triggerEvent](#triggerevent)
  - [getSystemStats](#getsystemstats)
  - [clearAllEffects](#clearalleffects)
- [TargetingSystem (src\frontend\TargetingSystem.js)](#targetingsystem)
  - [constructor](#constructor)
  - [initializeTargetingModes](#initializetargetingmodes)
  - [setTargetingMode](#settargetingmode)
  - [getTargetingMode](#gettargetingmode)
  - [findTarget](#findtarget)
  - [getEnemiesInRange](#getenemiesinrange)
  - [getClosestTarget](#getclosesttarget)
  - [getStrongestTarget](#getstrongesttarget)
  - [getWeakestTarget](#getweakesttarget)
  - [getFirstTarget](#getfirsttarget)
  - [getLastTarget](#getlasttarget)
  - [getFastestTarget](#getfastesttarget)
  - [getSlowestTarget](#getslowesttarget)
  - [getHighestValueTarget](#gethighestvaluetarget)
  - [getRandomTarget](#getrandomtarget)
  - [getSmartTarget](#getsmarttarget)
  - [calculateTargetScore](#calculatetargetscore)
  - [getEnemiesInSplashRadius](#getenemiesinsplashradius)
  - [getChainLightningTargets](#getchainlightningtargets)
  - [findNearestUnusedTarget](#findnearestunusedtarget)
  - [predictEnemyPosition](#predictenemyposition)
  - [isValidTarget](#isvalidtarget)
  - [getOptimalTargetingMode](#getoptimaltargetingmode)
  - [getAvailableTargetingModes](#getavailabletargetingmodes)
  - [calculateTargetingEfficiency](#calculatetargetingefficiency)
  - [getDistance](#getdistance)
  - [addEventListener](#addeventlistener)
  - [removeEventListener](#removeeventlistener)
  - [triggerEvent](#triggerevent)
  - [getSystemStats](#getsystemstats)
  - [getMostUsedTargetingMode](#getmostusedtargetingmode)
  - [resetAllTargetingModes](#resetalltargetingmodes)
  - [removeTower](#removetower)
  - [batchUpdateTargetingModes](#batchupdatetargetingmodes)
  - [getTargetingRecommendations](#gettargetingrecommendations)
- [Tower (src\frontend\tower.js)](#tower)
  - [constructor](#constructor)
  - [createMesh](#createmesh)
  - [update](#update)
  - [findTarget](#findtarget)
  - [fire](#fire)
  - [upgrade](#upgrade)
- [TowerFactory (src\frontend\tower.js)](#towerfactory)
  - [constructor](#constructor)
  - [createTower](#createtower)
- [TowerStoreUI (src\frontend\TowerStoreUI.js)](#towerstoreui)
  - [constructor](#constructor)
  - [initializeUI](#initializeui)
  - [createStoreContainer](#createstorecontainer)
  - [createTowerGrid](#createtowergrid)
  - [createTowerCard](#createtowercard)
  - [createUpgradePanel](#createupgradepanel)
  - [createCurrencyDisplay](#createcurrencydisplay)
  - [updateCurrencyDisplay](#updatecurrencydisplay)
  - [getCurrency](#getcurrency)
  - [createControlButtons](#createcontrolbuttons)
  - [setupEventListeners](#setupeventlisteners)
  - [setupResourceManagerIntegration](#setupresourcemanagerintegration)
  - [show](#show)
  - [hide](#hide)
  - [toggle](#toggle)
  - [switchTab](#switchtab)
  - [selectTowerForPurchase](#selecttowerforpurchase)
  - [selectTowerForUpgrade](#selecttowerforupgrade)
  - [refreshTowerGrid](#refreshtowergrid)
  - [refreshUpgradePanel](#refreshupgradepanel)
  - [updateTowerStats](#updatetowerstats)
  - [updateLevelUpgradeInfo](#updatelevelupgradeinfo)
  - [updateTypeUpgrades](#updatetypeupgrades)
  - [upgradeTowerLevel](#upgradetowerlevel)
  - [upgradeTowerType](#upgradetowertype)
  - [sellSelectedTower](#sellselectedtower)
  - [isTowerUnlocked](#istowerunlocked)
  - [getTowerUnlockLevel](#gettowerunlocklevel)
  - [handleKeyboardInput](#handlekeyboardinput)
  - [showError](#showerror)
  - [addEventListener](#addeventlistener)
  - [removeEventListener](#removeeventlistener)
  - [triggerEvent](#triggerevent)
  - [destroy](#destroy)
- [TowerSystem (src\frontend\TowerSystem.js)](#towersystem)
  - [constructor](#constructor)
  - [initializeTowerTypes](#initializetowertypes)
  - [canPlaceTower](#canplacetower)
  - [placeTower](#placetower)
  - [upgradeTower](#upgradetower)
  - [upgradeTowerLevel](#upgradetowerlevel)
  - [upgradeTowerType](#upgradetowertype)
  - [sellTower](#selltower)
  - [update](#update)
  - [findTarget](#findtarget)
  - [canAttack](#canattack)
  - [isValidTarget](#isvalidtarget)
  - [attackTarget](#attacktarget)
  - [getDistance](#getdistance)
  - [getGridKey](#getgridkey)
  - [getTower](#gettower)
  - [getAllTowers](#getalltowers)
  - [getTowersByPlayer](#gettowersbyplayer)
  - [getTowerTypes](#gettowertypes)
  - [getTowerTypeConfig](#gettowertypeconfig)
  - [addEventListener](#addeventlistener)
  - [removeEventListener](#removeeventlistener)
  - [triggerEvent](#triggerevent)
  - [getSystemStats](#getsystemstats)
  - [clearAllTowers](#clearalltowers)
- [VisualFeedbackSystem (src\frontend\VisualFeedbackSystem.js)](#visualfeedbacksystem)
  - [constructor](#constructor)
  - [initializeEffectTypes](#initializeeffecttypes)
  - [showDamageNumber](#showdamagenumber)
  - [showHealingNumber](#showhealingnumber)
  - [showFloatingText](#showfloatingtext)
  - [createScreenShake](#createscreenshake)
  - [highlightEntity](#highlightentity)
  - [removeHighlight](#removehighlight)
  - [showRangeIndicator](#showrangeindicator)
  - [removeRangeIndicator](#removerangeindicator)
  - [createExplosion](#createexplosion)
  - [createImpactEffect](#createimpacteffect)
  - [createMuzzleFlash](#createmuzzleflash)
  - [createTrailEffect](#createtraileffect)
  - [update](#update)
  - [updateDamageNumbers](#updatedamagenumbers)
  - [updateFloatingTexts](#updatefloatingtexts)
  - [updateScreenShakes](#updatescreenshakes)
  - [updateHighlights](#updatehighlights)
  - [updateEffects](#updateeffects)
  - [updateEffect](#updateeffect)
  - [updateExplosion](#updateexplosion)
  - [updateImpact](#updateimpact)
  - [updateMuzzleFlash](#updatemuzzleflash)
  - [updateTrail](#updatetrail)
  - [updateRangeIndicator](#updaterangeindicator)
  - [render](#render)
  - [applyScreenShake](#applyscreenshake)
  - [renderRangeIndicators](#renderrangeindicators)
  - [renderHighlights](#renderhighlights)
  - [renderEffects](#rendereffects)
  - [renderExplosion](#renderexplosion)
  - [renderImpact](#renderimpact)
  - [renderMuzzleFlash](#rendermuzzleflash)
  - [renderTrail](#rendertrail)
  - [renderDamageNumbers](#renderdamagenumbers)
  - [renderFloatingTexts](#renderfloatingtexts)
  - [randomizeColor](#randomizecolor)
  - [addEventListener](#addeventlistener)
  - [removeEventListener](#removeeventlistener)
  - [triggerEvent](#triggerevent)
  - [clearAllEffects](#clearalleffects)
  - [getSystemStats](#getsystemstats)
- [WaveManager (src\frontend\WaveManager.js)](#wavemanager)
  - [constructor](#constructor)
  - [initialize](#initialize)
  - [startNextWave](#startnextwave)
  - [setupWave](#setupwave)
  - [createSpawnQueue](#createspawnqueue)
  - [beginWave](#beginwave)
  - [startSpawnTimer](#startspawntimer)
  - [updateSpawning](#updatespawning)
  - [spawnEnemy](#spawnenemy)
  - [startWaveCompletionCheck](#startwavecompletioncheck)
  - [checkWaveCompletion](#checkwavecompletion)
  - [completeWave](#completewave)
  - [calculateWaveResults](#calculatewaveresults)
  - [calculateWaveRating](#calculatewaverating)
  - [awardWaveRewards](#awardwaverewards)
  - [completeAllWaves](#completeallwaves)
  - [calculateLevelResults](#calculatelevelresults)
  - [awardLevelRewards](#awardlevelrewards)
  - [onEnemyKilled](#onenemykilled)
  - [onEnemyReachedEnd](#onenemyreachedend)
  - [skipWave](#skipwave)
  - [pauseWave](#pausewave)
  - [resumeWave](#resumewave)
  - [stopSpawnTimer](#stopspawntimer)
  - [stopWaveTimer](#stopwavetimer)
  - [onWaveStart](#onwavestart)
  - [onWaveComplete](#onwavecomplete)
  - [onWaveFailed](#onwavefailed)
  - [onAllWavesComplete](#onallwavescomplete)
  - [triggerWaveStartCallbacks](#triggerwavestartcallbacks)
  - [triggerWaveCompleteCallbacks](#triggerwavecompletecallbacks)
  - [triggerWaveFailedCallbacks](#triggerwavefailedcallbacks)
  - [triggerAllWavesCompleteCallbacks](#triggerallwavescompletecallbacks)
  - [getCurrentWave](#getcurrentwave)
  - [getTotalWaves](#gettotalwaves)
  - [isActive](#isactive)
  - [canStartNextWave](#canstartnextwave)
  - [getWaveProgress](#getwaveprogress)
  - [getTimeUntilNextSpawn](#gettimeuntilnextspawn)
  - [getRemainingEnemies](#getremainingenemies)
  - [getActiveEnemies](#getactiveenemies)
  - [getWaveStats](#getwavestats)
  - [getWaveData](#getwavedata)
  - [setAutoStartNextWave](#setautostartnextwave)
  - [setAutoStartDelay](#setautostartdelay)
  - [setPreWaveDelay](#setprewavedelay)
  - [resetWaveStats](#resetwavestats)
  - [getEstimatedWaveDuration](#getestimatedwaveduration)
  - [getWaveDescription](#getwavedescription)
  - [getDebugInfo](#getdebuginfo)
  - [dispose](#dispose)

# Combined API Documentation


## File: src\frontend\AudioManager.js
# Class `AudioManager`

## `constructor()`

## `init()`

## `initFallback()`

## `loadDefaultSounds()`

## `generateTone(frequency, duration, )`

Sound generation methods

## `generateExplosion()`

## `generateShot()`

## `generateLaser()`

## `generateFreeze()`

## `generateAlarm()`

## `generateFanfare()`

## `generateGameOver()`

## `generateVictory()`

## `generateBossIntro()`

## `createSoundPool(soundName)`

Sound pool management

## `getAvailableSource(soundName)`

## `playSound(soundName, , )`

Public sound methods

## `playWebAudioSound(soundName, volume, pitch)`

## `playHTML5Sound(soundName, volume, pitch)`

## `playBackgroundMusic(, )`

Background music methods

## `stopBackgroundMusic()`

## `createMusicLoop()`

## `fadeInMusic()`

## `fadeOutMusic()`

## `setMasterVolume(volume)`

Volume controls

## `setMusicVolume(volume)`

## `setSFXVolume(volume)`

## `mute()`

## `unmute()`

## `toggleMute()`

## `getMasterVolume()`

Getters

## `getMusicVolume()`

## `getSFXVolume()`

## `isMusicPlaying()`

## `dispose()`

Cleanup


## File: src\frontend\AuthManager.js
# Class `AuthManager`

## `constructor()`

## `register(username, password)`

*
   * Register a new user by sending a request to the backend.
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise<Object>} Registration result

## `login(username, password)`

*
   * Login user by sending credentials to the backend.
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise<Object>} Login result

## `logout()`

*
   * Logout current user.

## `getCurrentUser()`

*
   * Get current user data.
   * @returns {Object|null} Current user data

## `getToken()`

*
   * Gets the current session token (JWT).
   * @returns {string|null} The session token.

## `saveSession()`

*
   * Save current session to localStorage.

## `loadSession()`

*
   * Load session from localStorage.

## `validateUsername(username)`

--- Local Validation Helpers ---

## `validateEmail(email)`

## `validatePassword(password)`


## File: src\frontend\BossAISystem.js
# Class `BossAISystem`

## `constructor()`

## `queueAerialAbility(boss)`

... [your full class implementation remains unchanged] ...

## `queueDesperateAbility(boss)`

*
   * Queue desperate ability
   * @param {Object} boss

## `queueRandomAbility(boss)`

*
   * Queue a random ability
   * @param {Object} boss

## `findSafestPosition(boss, towers)`

*
   * Find the safest position (dummy logic for now)
   * @param {Object} boss
   * @param {Array} towers
   * @returns {Object} target position

## `evadeTowers(boss, towers)`

*
   * Evade threatening towers
   * @param {Object} boss
   * @param {Array} towers

## `performAerialMovement(boss, towers)`

*
   * Perform aerial movement logic
   * @param {Object} boss
   * @param {Array} towers

## `attackTower(boss, tower)`

*
   * Attack a specific tower
   * @param {Object} boss
   * @param {Object} tower

## `getDistance(x1, y1, x2, y2)`

*
   * Calculate distance between two points
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @returns {number}

## `getAbilityCooldown(ability)`

*
   * Get cooldown time for a given ability
   * @param {string} ability
   * @returns {number}

## `emitEvent(type, payload)`

*
   * Emit game-wide event
   * @param {string} type
   * @param {Object} payload


## File: src\frontend\enemy.js
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


## File: src\frontend\EnemyUIManager.js
# Class `EnemyUIManager`

## `constructor()`

## `updateDependencies()`

Method to update dependencies if they become available later

## `initContainer()`

## `update(enemies)`

Main update method

## `updateHealthBars(enemies)`

Health bar management

## `createHealthBar(enemy)`

## `updateHealthBarPosition(enemy, healthBar)`

## `updateHealthBarValue(enemy, healthBar)`

## `updateHealthBarVisibility(enemy, healthBar)`

## `triggerHealthBarDamageEffect(healthBar)`

## `updateStatusIndicators(enemies)`

Status indicator management

## `createStatusIndicator(enemy)`

## `updateStatusIndicatorPosition(enemy, statusIndicator)`

## `updateStatusIndicatorEffects(enemy, statusIndicator)`

## `createStatusEffectElement(effect)`

## `showDamageNumber(enemy, damage, )`

Damage number management

## `createDamageNumber(enemy, damage, type)`

## `positionDamageNumber(enemy, element)`

## `updateDamageNumbers()`

## `removeDamageNumber(damageNumber)`

## `cleanupUnusedElements(enemies)`

Cleanup methods

## `removeHealthBar(enemyId)`

## `removeStatusIndicator(enemyId)`

## `getEnemyTypeIcon(enemyType)`

Utility methods

## `setHealthBarVisibility(visible)`

Settings

## `setDamageNumberVisibility(visible)`

## `setStatusEffectVisibility(visible)`

## `dispose()`

Cleanup


## File: src\frontend\GameLoop.js
# Class `GameLoop`

## `constructor()`

## `start()`

## `stop()`

## `loop(currentTime)`

## `update(deltaTime)`

## `render()`

## `updateFPS(deltaTime)`

## `handleError(error)`

## `getCurrentFPS()`

Getters

## `getDeltaTime()`

## `isGameRunning()`

## `pause()`

Pause/Resume functionality

## `resume()`

## `setTargetFPS(fps)`

Performance optimization methods

## `getDebugInfo()`

Debug information


## File: src\frontend\HealthSystem.js
# Class `HealthSystem`

## `constructor()`

## `registerEntity(entityId, healthConfig)`

*
   * Register an entity with the health system
   * @param {string} entityId - Unique identifier for the entity
   * @param {Object} healthConfig - Health configuration

## `unregisterEntity(entityId)`

*
   * Remove entity from health system
   * @param {string} entityId

## `dealDamage(entityId, damage, )`

*
   * Deal damage to an entity
   * @param {string} entityId 
   * @param {number} damage 
   * @param {Object} damageInfo - Additional damage information
   * @returns {Object} Damage result

## `heal(entityId, healAmount, )`

*
   * Heal an entity
   * @param {string} entityId 
   * @param {number} healAmount 
   * @param {Object} healInfo 
   * @returns {Object} Healing result

## `setHealth(entityId, health)`

*
   * Set entity health directly
   * @param {string} entityId 
   * @param {number} health

## `getHealthInfo(entityId)`

*
   * Get entity health information
   * @param {string} entityId 
   * @returns {Object|null}

## `modifyStats(entityId, statChanges)`

*
   * Modify entity stats
   * @param {string} entityId 
   * @param {Object} statChanges

## `startRegeneration(entityId)`

*
   * Start health regeneration for an entity
   * @param {string} entityId

## `stopRegeneration(entityId)`

*
   * Stop health regeneration for an entity
   * @param {string} entityId

## `handleDeath(entityId, )`

*
   * Handle entity death
   * @param {string} entityId 
   * @param {string} source

## `addDeathCallback(entityId, callback)`

*
   * Add death callback for an entity
   * @param {string} entityId 
   * @param {Function} callback

## `applyStatusEffect(entityId, effectId, effectData)`

*
   * Apply status effect to entity
   * @param {string} entityId 
   * @param {string} effectId 
   * @param {Object} effectData

## `removeStatusEffect(entityId, effectId)`

*
   * Remove status effect from entity
   * @param {string} entityId 
   * @param {string} effectId

## `getEntitiesByCondition(condition)`

*
   * Get all entities with specific health conditions
   * @param {Function} condition 
   * @returns {Array}

## `getAliveEntities()`

*
   * Get all alive entities
   * @returns {Array}

## `getDeadEntities()`

*
   * Get all dead entities
   * @returns {Array}

## `getEntitiesByType(entityType)`

*
   * Get entities by type
   * @param {string} entityType 
   * @returns {Array}

## `getLowHealthEntities()`

*
   * Get low health entities (below specified threshold)
   * @param {number} threshold - Health percentage threshold (0.0 to 1.0)
   * @returns {Array}

## `addEventListener(event, callback)`

*
   * Add event listener
   * @param {string} event 
   * @param {Function} callback

## `removeEventListener(event, callback)`

*
   * Remove event listener
   * @param {string} event 
   * @param {Function} callback

## `triggerEvent(event, data)`

*
   * Trigger event - uses both internal listeners and external event emitter
   * @param {string} event 
   * @param {Object} data

## `update(deltaTime)`

*
   * Update system (called each frame)
   * @param {number} deltaTime

## `updateStatusEffects(deltaTime)`

*
   * Update status effects with duration
   * @param {number} deltaTime

## `processDamageQueue()`

This is a hook for future status effect duration management

## `processHealingQueue()`

*
   * Process queued healing

## `queueDamage(entityId, damage, )`

*
   * Queue damage to be processed next frame
   * @param {string} entityId 
   * @param {number} damage 
   * @param {Object} damageInfo

## `queueHealing(entityId, healAmount, )`

*
   * Queue healing to be processed next frame
   * @param {string} entityId 
   * @param {number} healAmount 
   * @param {Object} healInfo

## `resetAllHealth()`

*
   * Reset all entities health to full

## `getSystemStats()`

*
   * Get system statistics
   * @returns {Object}

## `destroy()`

*
   * Cleanup method to be called when destroying the system


## File: src\frontend\HUDManager.js
# Class `HUDManager`

## `constructor()`

## `init()`

## `initMinimap()`

## `setupEventListeners()`

## `startUpdateLoops()`

## `update()`

Main update method

## `updateAll()`

## `updateResources()`

Resource updates

## `updateResource(type, newValue, oldValue)`

## `updateGold(amount)`

## `updateEnergy(amount)`

## `updateHealth()`

Health updates

## `updateWaveInfo()`

Wave info updates

## `updateScore()`

Score updates

## `updateControlButtons()`

Control button updates

## `updateMinimap()`

Minimap updates

## `drawMinimapPath(ctx)`

## `drawMinimapTowers(ctx)`

## `drawMinimapEnemies(ctx)`

## `drawMinimapBase(ctx)`

## `worldToMinimap(worldX, worldZ)`

## `getTowerColor(towerType)`

## `getEnemyColor(enemyType)`

## `triggerResourceGainEffect(resourceType)`

Visual effects

## `triggerScoreGainEffect()`

## `triggerHealthFlash()`

## `triggerWaveStartEffect()`

## `triggerWaveCompleteEffect()`

## `showInsufficientResourceFeedback(resourceType)`

## `formatNumber(num)`

Utility methods

## `showElement(elementName)`

Show/hide HUD elements

## `hideElement(elementName)`

## `toggleElement(elementName)`

## `showHUD()`

HUD visibility

## `hideHUD()`

## `dispose()`

Cleanup


## File: src\frontend\InputManager.js
# Class `InputManager`

## `constructor()`

## `initializeCameraPosition()`

## `onKeyDown(event)`

Keyboard input handlers

## `onKeyUp(event)`

## `onClick(event)`

Mouse input handlers

## `onMouseMove(event)`

## `onMouseDown(event)`

## `onMouseUp(event)`

## `onWheel(event)`

## `onTouchStart(event)`

Touch input handlers

## `onTouchMove(event)`

## `onTouchEnd(event)`

## `setInputMode(mode, )`

Input mode management

## `cancelCurrentAction()`

## `selectTowerType(towerType)`

Tower selection and placement

## `createTowerPlacementPreview()`

## `updateTowerPlacementPreview()`

## `clearTowerPlacementPreview()`

## `rotatePlacementPreview()`

## `handleNormalClick(event, isDoubleClick)`

Click handlers

## `handleTowerPlacement(event)`

## `handleTowerUpgrade(event)`

## `handleTouchTap(touch)`

## `handleCameraRotation(event)`

Camera controls

## `handleCameraPanning(event)`

## `handleCameraZoom(deltaY)`

## `handleCameraRotationFromTouch(touch)`

## `handleTouchZoomAndPan(touches)`

## `updateCameraPosition()`

## `startCameraMovement(direction)`

## `updateMousePosition(event)`

Utility methods

## `updateMousePositionFromTouch(touch)`

## `getWorldPosition()`

## `getIntersectedObject()`

## `isValidTowerPosition(position)`

## `updateHoverEffects()`

## `selectTower(tower)`

## `upgradeTower(tower)`

## `selectEnemy(enemy)`

## `deselectAll()`

## `isKeyPressed(key)`

Public methods

## `getMousePosition()`

## `enableCameraControls()`

## `disableCameraControls()`

## `dispose()`

Cleanup


## File: src\frontend\LevelData.js
# Class `LevelData`

## `constructor()`

## `initializeEnemyTemplates()`

Initialize enemy templates

## `initializeWaveTemplates()`

Initialize wave templates

## `loadLevel(levelNumber)`

Load level data

## `generateLevel(levelNumber)`

Generate level data

## `generateWaves(levelNumber, waveCount)`

Generate waves for a level

## `generateWave(levelNumber, waveIndex, totalWaves, baseDifficulty)`

## `selectWaveTemplates(levelNumber, waveProgress)`

## `scaleWave(template, difficulty, levelNumber)`

## `calculateWaveCount(levelNumber)`

Calculation methods

## `calculateLevelDifficulty(levelNumber)`

## `calculateLevelDuration(waves)`

## `calculateLevelRewards(levelNumber)`

## `calculateWaveRewards(waveNumber, difficulty)`

## `calculatePreWaveDelay(waveNumber, levelNumber)`

## `getScaledEnemyTemplate(enemyType, levelNumber)`

Get enemy template with level scaling

## `getLevelDescription(levelNumber)`

Level metadata

## `getLevelTheme(levelNumber)`

## `getLevelObjectives(levelNumber)`

## `getLevelSpecialRules(levelNumber)`

## `getLevelUnlocks(levelNumber)`

## `getCurrentLevel()`

Getters

## `getLevelData(levelNumber)`

## `getWaveData(levelNumber, waveNumber)`

## `getEnemyTemplate(enemyType)`

## `getWaveTemplate(templateName)`

## `getMaxLevels()`

## `isValidLevel(levelNumber)`

Validation

## `isLevelUnlocked(levelNumber, )`

## `saveLevelData()`

Save/Load

## `loadLevelData(data)`

## `getDebugInfo()`

Debug methods


## File: src\frontend\main.js
# Class `Game`

## `constructor()`

## `init()`

## `initThreeJS()`

## `initGameSystems()`

## `setupEventListeners()`

## `prepareIntro()`

## `startGame()`

## `handleGameOver()`

## `togglePause()`

## `addEnemy(enemyData)`

## `addEventListener(event, callback)`

## `triggerEvent(event, data)`

## `update(deltaTime)`

## `render()`


## File: src\frontend\MapData.js
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


## File: src\frontend\MultiplayerManager.js
# Class `MultiplayerManager`

## `constructor()`

## `setupSocketListeners()`

*
   * Sets up listeners for events coming from the server.

## `syncTowerPlacement(towerType, position)`

*
   * Sends a request to the server to build a tower.
   * This will be broadcast to other players.
   * @param {string} towerType 
   * @param {object} position - { x, y, z }

## `createRoom()`

--- Other Multiplayer Methods ---

## `joinRoom(roomId)`

*
   * Join an existing multiplayer game room.
   * @param {string} roomId

## `sendChatMessage(message)`

*
   * Send a chat message to other players.
   * @param {string} message

## `isMultiplayerConnected()`

*
   * Check if connected to multiplayer.
   * @returns {boolean}


## File: src\frontend\NotificationManager.js
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


## File: src\frontend\ParticleSystem.js
# Class `ParticleSystem`

## `constructor(canvas, context, )`

## `initializeParticleTypes()`

*
   * Initialize particle type configurations

## `createBurst(x, y, , )`

*
   * Create particle burst at position
   * @param {number} x 
   * @param {number} y 
   * @param {string} type 
   * @param {Object} options

## `createParticle(x, y, config, )`

*
   * Create individual particle
   * @param {number} x 
   * @param {number} y 
   * @param {Object} config 
   * @param {Object} options 
   * @returns {Object}

## `createEmitter(x, y, , )`

*
   * Create continuous particle emitter
   * @param {number} x 
   * @param {number} y 
   * @param {string} type 
   * @param {Object} options 
   * @returns {string} Emitter ID

## `stopEmitter(emitterId)`

*
   * Stop particle emitter
   * @param {string} emitterId

## `removeEmitter(emitterId)`

*
   * Remove particle emitter
   * @param {string} emitterId

## `update(deltaTime)`

*
   * Update particle system
   * @param {number} deltaTime

## `updateParticles(deltaTime)`

*
   * Update all particles
   * @param {number} deltaTime

## `updateParticleVisuals(particle, deltaTime)`

*
   * Update particle visual properties
   * @param {Object} particle 
   * @param {number} deltaTime

## `handleParticleBounce(particle)`

*
   * Handle particle bouncing off boundaries
   * @param {Object} particle

## `updateEmitters(deltaTime)`

*
   * Update all emitters
   * @param {number} deltaTime

## `emitParticle(emitter)`

*
   * Emit single particle from emitter
   * @param {Object} emitter

## `render()`

*
   * Render all particles

## `renderParticle(particle)`

*
   * Render individual particle
   * @param {Object} particle

## `createExplosion(x, y, , )`

*
   * Create explosion effect
   * @param {number} x 
   * @param {number} y 
   * @param {number} intensity 
   * @param {Object} options

## `createImpact(x, y, , )`

*
   * Create impact effect
   * @param {number} x 
   * @param {number} y 
   * @param {string} materialType 
   * @param {Object} options

## `createTrail(x, y, , )`

*
   * Create trail effect
   * @param {number} x 
   * @param {number} y 
   * @param {string} trailType 
   * @param {Object} options

## `randomBetween(min, max)`

*
   * Get random value between min and max
   * @param {number} min 
   * @param {number} max 
   * @returns {number}

## `clearAllParticles()`

*
   * Clear all particles

## `setMaxParticles(maxCount)`

*
   * Set maximum particle count
   * @param {number} maxCount

## `getParticleCount()`

*
   * Get particle count
   * @returns {number}

## `getEmitterCount()`

*
   * Get active emitter count
   * @returns {number}

## `addEventListener(event, callback)`

*
   * Add event listener
   * @param {string} event 
   * @param {Function} callback

## `removeEventListener(event, callback)`

*
   * Remove event listener
   * @param {string} event 
   * @param {Function} callback

## `triggerEvent(event, data)`

*
   * Trigger event
   * @param {string} event 
   * @param {Object} data

## `getSystemStats()`

*
   * Get system statistics
   * @returns {Object}


## File: src\frontend\Pathfinding.js
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


## File: src\frontend\PlayerHealthSystem.js
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


## File: src\frontend\ProjectileSystem.js
# Class `ProjectileSystem`

## `constructor()`

## `initializeProjectileTypes()`

*
   * Initialize projectile type configurations

## `createProjectile(projectileData)`

*
   * Create a new projectile
   * @param {Object} projectileData 
   * @returns {string} Projectile ID

## `handleInstantHit(projectile)`

*
   * Handle instant hit projectiles (laser, lightning)
   * @param {Object} projectile

## `update(deltaTime, )`

*
   * Update projectile system
   * @param {number} deltaTime - Time since last update in seconds
   * @param {Array} enemies - Array of enemy objects

## `updateHoming(projectile, deltaTime)`

*
   * Update homing behavior for projectile
   * @param {Object} projectile 
   * @param {number} deltaTime

## `updateTrail(projectile)`

*
   * Update projectile trail effect
   * @param {Object} projectile

## `checkCollisions(projectile, enemies)`

*
   * Check collisions with enemies
   * @param {Object} projectile 
   * @param {Array} enemies

## `handleProjectileHit(projectile, target)`

*
   * Handle projectile hitting a target
   * @param {Object} projectile 
   * @param {Object} target

## `applyStatusEffects(projectile, target)`

*
   * Apply status effects from projectile
   * @param {Object} projectile 
   * @param {Object} target

## `handleSplashDamage(projectile, epicenter)`

*
   * Handle splash damage
   * @param {Object} projectile 
   * @param {Object} epicenter

## `handleChainLightning(projectile, initialTarget)`

*
   * Handle chain lightning effect
   * @param {Object} projectile 
   * @param {Object} initialTarget

## `handleBounce(projectile, target)`

*
   * Handle projectile bouncing
   * @param {Object} projectile 
   * @param {Object} target

## `isOutOfBounds(projectile)`

*
   * Check if projectile is out of bounds
   * @param {Object} projectile 
   * @returns {boolean}

## `removeProjectile(projectileId)`

*
   * Remove projectile from system
   * @param {string} projectileId

## `getDistance(x1, y1, x2, y2)`

*
   * Get distance between two points
   * @param {number} x1 
   * @param {number} y1 
   * @param {number} x2 
   * @param {number} y2 
   * @returns {number}

## `getAllProjectiles()`

*
   * Get all projectiles
   * @returns {Array}

## `getProjectilesByTower(towerId)`

*
   * Get projectiles by tower
   * @param {string} towerId 
   * @returns {Array}

## `getProjectile(projectileId)`

*
   * Get projectile by ID
   * @param {string} projectileId 
   * @returns {Object|null}

## `clearAllProjectiles()`

*
   * Clear all projectiles

## `addEventListener(event, callback)`

*
   * Add event listener
   * @param {string} event 
   * @param {Function} callback

## `removeEventListener(event, callback)`

*
   * Remove event listener
   * @param {string} event 
   * @param {Function} callback

## `triggerEvent(event, data)`

*
   * Trigger event
   * @param {string} event 
   * @param {Object} data

## `getSystemStats()`

*
   * Get system statistics
   * @returns {Object}


## File: src\frontend\ResourceManager.js
# Class `ResourceManager`

## `constructor()`

## `startPassiveIncome()`

Passive income system

## `stopPassiveIncome()`

Method to stop passive income (useful for cleanup)

## `addGold(amount)`

Gold management

## `spendGold(amount)`

## `getGold()`

## `addEnergy(amount)`

Energy management

## `spendEnergy(amount)`

## `getEnergy()`

## `addScore(amount)`

Score management

## `getScore()`

## `getLives()`

Lives management

## `loseLive()`

## `canAfford(, )`

Resource checking

## `spendResources(, )`

Bulk operations

## `recordEnemyDefeated()`

Statistics

## `recordTowerBuilt()`

## `recordWaveSurvived()`

## `getEnemiesDefeated()`

## `getTowersBuilt()`

## `getWavesSurvived()`

## `setGoldPerSecond(amount)`

Income management

## `setEnergyPerSecond(amount)`

## `getGoldPerSecond()`

## `getEnergyPerSecond()`

## `upgradeGoldIncome(cost)`

Upgrade income rates

## `upgradeEnergyIncome(cost)`

## `onResourceChanged(callback)`

Event system

## `onInsufficientResource(callback)`

## `notifyResourceChange(resourceType, newValue, oldValue)`

## `notifyInsufficientResources(resourceType, required, available)`

## `saveState()`

Save/Load system

## `loadState(state)`

## `reset()`

Reset resources

## `destroy()`

Cleanup method (important for proper resource management)

## `getAllResources()`

Debug methods

## `getAllStats()`

## `getDebugInfo()`

## `cheatAddGold(amount)`

Cheat methods (for testing)

## `cheatAddEnergy(amount)`

## `cheatMaxResources()`


## File: src\frontend\StatusEffectSystem.js
# Class `StatusEffectSystem`

## `constructor(healthSystem)`

## `initializeEffectTypes()`

*
   * Initialize available status effect types

## `applyEffect(entityId, effectType, )`

*
   * Apply a status effect to an entity
   * @param {string} entityId 
   * @param {string} effectType 
   * @param {Object} effectData 
   * @returns {string|null} Effect instance ID

## `removeEffect(entityId, effectInstanceId)`

*
   * Remove a status effect from an entity
   * @param {string} entityId 
   * @param {string} effectInstanceId 
   * @returns {boolean} Success

## `setupUpdateTimer(effectInstance)`

*
   * Setup update timer for an effect
   * @param {Object} effectInstance

## `findEffectByType(entityId, effectType)`

*
   * Find effect by type for an entity
   * @param {string} entityId 
   * @param {string} effectType 
   * @returns {Object|null}

## `applySlowEffect(effectInstance)`

Effect Implementation Methods

## `updateSlowEffect(effectInstance)`

*
   * Update slow effect
   * @param {Object} effectInstance

## `removeSlowEffect(effectInstance)`

Slow effect is passive, no periodic updates needed

## `applyPoisonEffect(effectInstance)`

*
   * Apply poison effect
   * @param {Object} effectInstance

## `updatePoisonEffect(effectInstance)`

*
   * Update poison effect (deals damage over time)
   * @param {Object} effectInstance

## `removePoisonEffect(effectInstance)`

*
   * Remove poison effect
   * @param {Object} effectInstance

## `applyFreezeEffect(effectInstance)`

*
   * Apply freeze effect
   * @param {Object} effectInstance

## `updateFreezeEffect(effectInstance)`

*
   * Update freeze effect
   * @param {Object} effectInstance

## `removeFreezeEffect(effectInstance)`

*
   * Remove freeze effect
   * @param {Object} effectInstance

## `applyBurnEffect(effectInstance)`

*
   * Apply burn effect
   * @param {Object} effectInstance

## `updateBurnEffect(effectInstance)`

*
   * Update burn effect
   * @param {Object} effectInstance

## `removeBurnEffect(effectInstance)`

*
   * Remove burn effect
   * @param {Object} effectInstance

## `applyStunEffect(effectInstance)`

*
   * Apply stun effect
   * @param {Object} effectInstance

## `updateStunEffect(effectInstance)`

*
   * Update stun effect
   * @param {Object} effectInstance

## `removeStunEffect(effectInstance)`

*
   * Remove stun effect
   * @param {Object} effectInstance

## `applyArmorReductionEffect(effectInstance)`

*
   * Apply armor reduction effect
   * @param {Object} effectInstance

## `updateArmorReductionEffect(effectInstance)`

*
   * Update armor reduction effect
   * @param {Object} effectInstance

## `removeArmorReductionEffect(effectInstance)`

Passive effect, no updates needed

## `applyDamageBoostEffect(effectInstance)`

*
   * Apply damage boost effect
   * @param {Object} effectInstance

## `updateDamageBoostEffect(effectInstance)`

*
   * Update damage boost effect
   * @param {Object} effectInstance

## `removeDamageBoostEffect(effectInstance)`

Passive effect, no updates needed

## `applySpeedBoostEffect(effectInstance)`

*
   * Apply speed boost effect
   * @param {Object} effectInstance

## `updateSpeedBoostEffect(effectInstance)`

*
   * Update speed boost effect
   * @param {Object} effectInstance

## `removeSpeedBoostEffect(effectInstance)`

Passive effect, no updates needed

## `applyRegenerationEffect(effectInstance)`

*
   * Apply regeneration effect
   * @param {Object} effectInstance

## `updateRegenerationEffect(effectInstance)`

*
   * Update regeneration effect
   * @param {Object} effectInstance

## `removeRegenerationEffect(effectInstance)`

*
   * Remove regeneration effect
   * @param {Object} effectInstance

## `applyShieldEffect(effectInstance)`

*
   * Apply shield effect
   * @param {Object} effectInstance

## `updateShieldEffect(effectInstance)`

*
   * Update shield effect
   * @param {Object} effectInstance

## `removeShieldEffect(effectInstance)`

*
   * Remove shield effect
   * @param {Object} effectInstance

## `getEntity(entityId)`

*
   * Get entity reference (placeholder - would integrate with game's entity system)
   * @param {string} entityId 
   * @returns {Object|null}

## `getActiveEffects(entityId)`

*
   * Get all active effects for an entity
   * @param {string} entityId 
   * @returns {Array}

## `hasEffect(entityId, effectType)`

*
   * Check if entity has specific effect type
   * @param {string} entityId 
   * @param {string} effectType 
   * @returns {boolean}

## `removeAllEffects(entityId)`

*
   * Remove all effects from an entity
   * @param {string} entityId

## `removeAllEffectsOfType(effectType)`

*
   * Remove all effects of a specific type
   * @param {string} effectType

## `getEffectTypes()`

*
   * Get effect types
   * @returns {Array}

## `addEventListener(event, callback)`

*
   * Add event listener
   * @param {string} event 
   * @param {Function} callback

## `removeEventListener(event, callback)`

*
   * Remove event listener
   * @param {string} event 
   * @param {Function} callback

## `triggerEvent(event, data)`

*
   * Trigger event
   * @param {string} event 
   * @param {Object} data

## `getSystemStats()`

*
   * Get system statistics
   * @returns {Object}

## `clearAllEffects()`

*
   * Clear all effects


## File: src\frontend\TargetingSystem.js
# Class `TargetingSystem`

## `constructor()`

## `initializeTargetingModes()`

*
   * Initialize available targeting modes

## `setTargetingMode(towerId, mode)`

*
   * Set targeting mode for a tower
   * @param {string} towerId 
   * @param {string} mode 
   * @returns {boolean} Success

## `getTargetingMode(towerId)`

*
   * Get targeting mode for a tower
   * @param {string} towerId 
   * @returns {string}

## `findTarget(tower, enemies)`

*
   * Find the best target for a tower based on its targeting mode
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object|null}

## `getEnemiesInRange(tower, enemies)`

*
   * Get enemies in tower's range
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Array}

## `getClosestTarget(tower, enemies)`

*
   * Get closest enemy to tower
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object|null}

## `getStrongestTarget(tower, enemies)`

*
   * Get enemy with most health
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object|null}

## `getWeakestTarget(tower, enemies)`

*
   * Get enemy with least health
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object|null}

## `getFirstTarget(tower, enemies)`

*
   * Get enemy closest to the exit (furthest along path)
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object|null}

## `getLastTarget(tower, enemies)`

*
   * Get enemy furthest from the exit (least progress along path)
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object|null}

## `getFastestTarget(tower, enemies)`

*
   * Get fastest moving enemy
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object|null}

## `getSlowestTarget(tower, enemies)`

*
   * Get slowest moving enemy
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object|null}

## `getHighestValueTarget(tower, enemies)`

*
   * Get enemy with highest reward value
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object|null}

## `getRandomTarget(tower, enemies)`

*
   * Get random enemy in range
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object|null}

## `getSmartTarget(tower, enemies)`

*
   * Smart targeting that considers multiple factors
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object|null}

## `calculateTargetScore(tower, enemy)`

*
   * Calculate target score for smart targeting
   * @param {Object} tower 
   * @param {Object} enemy 
   * @returns {number}

## `getEnemiesInSplashRadius(centerX, centerY, radius, enemies, )`

*
   * Get enemies that can be hit by splash damage
   * @param {number} centerX 
   * @param {number} centerY 
   * @param {number} radius 
   * @param {Array} enemies 
   * @param {Object} excludeEnemy 
   * @returns {Array}

## `getChainLightningTargets(initialTarget, enemies, maxTargets, chainRange)`

*
   * Find targets for chain lightning
   * @param {Object} initialTarget 
   * @param {Array} enemies 
   * @param {number} maxTargets 
   * @param {number} chainRange 
   * @returns {Array}

## `findNearestUnusedTarget(currentTarget, enemies, chainRange, usedTargets)`

*
   * Find nearest unused target for chain lightning
   * @param {Object} currentTarget 
   * @param {Array} enemies 
   * @param {number} chainRange 
   * @param {Set} usedTargets 
   * @returns {Object|null}

## `predictEnemyPosition(enemy, projectileSpeed)`

*
   * Predict enemy position based on movement
   * @param {Object} enemy 
   * @param {number} projectileSpeed 
   * @returns {Object} Predicted position

## `isValidTarget(tower, target)`

*
   * Check if target is still valid
   * @param {Object} tower 
   * @param {Object} target 
   * @returns {boolean}

## `getOptimalTargetingMode(towerType)`

*
   * Get optimal targeting mode for tower type
   * @param {string} towerType 
   * @returns {string}

## `getAvailableTargetingModes()`

*
   * Get all available targeting modes
   * @returns {Array}

## `calculateTargetingEfficiency(tower, enemies)`

*
   * Calculate targeting efficiency for a tower
   * @param {Object} tower 
   * @param {Array} enemies 
   * @returns {Object}

## `getDistance(x1, y1, x2, y2)`

*
   * Get distance between two points
   * @param {number} x1 
   * @param {number} y1 
   * @param {number} x2 
   * @param {number} y2 
   * @returns {number}

## `addEventListener(event, callback)`

*
   * Add event listener
   * @param {string} event 
   * @param {Function} callback

## `removeEventListener(event, callback)`

*
   * Remove event listener
   * @param {string} event 
   * @param {Function} callback

## `triggerEvent(event, data)`

*
   * Trigger event
   * @param {string} event 
   * @param {Object} data

## `getSystemStats()`

*
   * Get system statistics
   * @returns {Object}

## `getMostUsedTargetingMode(modeUsage)`

*
   * Get the most used targeting mode
   * @param {Object} modeUsage 
   * @returns {string|null}

## `resetAllTargetingModes()`

*
   * Reset targeting modes for all towers

## `removeTower(towerId)`

*
   * Remove tower from targeting system
   * @param {string} towerId

## `batchUpdateTargetingModes(updates)`

*
   * Batch update targeting modes for multiple towers
   * @param {Array} updates - Array of {towerId, mode} objects
   * @returns {Object} Results of batch update

## `getTargetingRecommendations(tower, enemies, )`

*
   * Get targeting recommendations for a tower based on current game state
   * @param {Object} tower 
   * @param {Array} enemies 
   * @param {Object} gameState 
   * @returns {Array} Recommended targeting modes


## File: src\frontend\tower.js
# Class `Tower`

## `constructor(type, position, )`

## `createMesh(color)`

## `update(deltaTime, enemies)`

## `findTarget(enemies)`

## `fire()`

## `upgrade()`
# Class `TowerFactory`

## `constructor(scene, resourceManager)`

## `createTower(type, position, dependencies)`


## File: src\frontend\TowerStoreUI.js
# Class `TowerStoreUI`

## `constructor(dependencies)`

## `initializeUI()`

*
   * Initialize the store UI elements

## `createStoreContainer()`

*
   * Create main store container

## `createTowerGrid()`

*
   * Create tower grid for purchasing

## `createTowerCard(towerType, config)`

*
   * Create individual tower card
   * @param {string} towerType 
   * @param {Object} config 
   * @returns {HTMLElement}

## `createUpgradePanel()`

*
   * Create upgrade panel

## `createCurrencyDisplay()`

*
   * Create currency display

## `updateCurrencyDisplay()`

*
   * Update currency display

## `getCurrency()`

*
   * Get current currency from resource manager or auth manager
   * @returns {number}

## `createControlButtons()`

*
   * Create control buttons

## `setupEventListeners()`

*
   * Setup event listeners

## `setupResourceManagerIntegration()`

*
   * Setup integration with resource manager for currency updates

## `show()`

*
   * Show the store

## `hide()`

*
   * Hide the store

## `toggle()`

*
   * Toggle store visibility

## `switchTab(tabName)`

*
   * Switch between tabs
   * @param {string} tabName

## `selectTowerForPurchase(towerType)`

*
   * Select tower for purchase
   * @param {string} towerType

## `selectTowerForUpgrade(tower)`

*
   * Select tower for upgrade
   * @param {Object} tower

## `refreshTowerGrid()`

*
   * Refresh tower grid

## `refreshUpgradePanel()`

*
   * Refresh upgrade panel

## `updateTowerStats()`

*
   * Update tower stats display

## `updateLevelUpgradeInfo()`

*
   * Update level upgrade information

## `updateTypeUpgrades()`

*
   * Update type upgrade options

## `upgradeTowerLevel()`

*
   * Upgrade selected tower level

## `upgradeTowerType(upgradeType)`

*
   * Upgrade selected tower type
   * @param {string} upgradeType

## `sellSelectedTower()`

*
   * Sell selected tower

## `isTowerUnlocked(towerType)`

*
   * Check if tower is unlocked for current player
   * @param {string} towerType 
   * @returns {boolean}

## `getTowerUnlockLevel(towerType)`

*
   * Get tower unlock level
   * @param {string} towerType 
   * @returns {number}

## `handleKeyboardInput(e)`

*
   * Handle keyboard input
   * @param {KeyboardEvent} e

## `showError(message)`

*
   * Show error message
   * @param {string} message

## `addEventListener(event, callback)`

*
   * Add event listener
   * @param {string} event 
   * @param {Function} callback

## `removeEventListener(event, callback)`

*
   * Remove event listener
   * @param {string} event 
   * @param {Function} callback

## `triggerEvent(event, data)`

*
   * Trigger event
   * @param {string} event 
   * @param {Object} data

## `destroy()`

*
   * Destroy the UI and clean up resources


## File: src\frontend\TowerSystem.js
# Class `TowerSystem`

## `constructor()`

## `initializeTowerTypes()`

## `canPlaceTower(x, y)`

## `placeTower(towerType, x, y, )`

## `upgradeTower(towerId, )`

## `upgradeTowerLevel(tower)`

## `upgradeTowerType(tower, newType)`

## `sellTower(towerId)`

## `update(deltaTime, )`

## `findTarget(tower, enemies)`

## `canAttack(tower, currentTime)`

## `isValidTarget(target, tower)`

## `attackTarget(tower, target)`

## `getDistance(x1, y1, x2, y2)`

## `getGridKey(x, y)`

## `getTower(towerId)`

## `getAllTowers()`

## `getTowersByPlayer(playerId)`

## `getTowerTypes()`

## `getTowerTypeConfig(towerType)`

## `addEventListener(event, callback)`

## `removeEventListener(event, callback)`

## `triggerEvent(event, data)`

## `getSystemStats()`

## `clearAllTowers()`


## File: src\frontend\VisualFeedbackSystem.js
# Class `VisualFeedbackSystem`

## `constructor(canvas, context, )`

## `initializeEffectTypes()`

*
   * Initialize visual effect types

## `showDamageNumber(x, y, damage, )`

*
   * Show damage number at position
   * @param {number} x 
   * @param {number} y 
   * @param {number} damage 
   * @param {Object} options

## `showHealingNumber(x, y, healing, )`

*
   * Show healing number at position
   * @param {number} x 
   * @param {number} y 
   * @param {number} healing 
   * @param {Object} options

## `showFloatingText(x, y, text, )`

*
   * Show floating text
   * @param {number} x 
   * @param {number} y 
   * @param {string} text 
   * @param {Object} options

## `createScreenShake(, , )`

*
   * Create screen shake effect
   * @param {number} intensity 
   * @param {number} duration 
   * @param {Object} options

## `highlightEntity(entityId, x, y, radius, )`

*
   * Highlight entity with visual effect
   * @param {string} entityId 
   * @param {number} x 
   * @param {number} y 
   * @param {number} radius 
   * @param {Object} options

## `removeHighlight(entityId)`

*
   * Remove highlight from entity
   * @param {string} entityId

## `showRangeIndicator(x, y, range, )`

*
   * Show range indicator for tower
   * @param {number} x 
   * @param {number} y 
   * @param {number} range 
   * @param {Object} options

## `removeRangeIndicator(indicatorId)`

*
   * Remove range indicator
   * @param {string} indicatorId

## `createExplosion(x, y, radius, )`

*
   * Create explosion effect
   * @param {number} x 
   * @param {number} y 
   * @param {number} radius 
   * @param {Object} options

## `createImpactEffect(x, y, )`

*
   * Create impact effect
   * @param {number} x 
   * @param {number} y 
   * @param {Object} options

## `createMuzzleFlash(x, y, angle, )`

*
   * Create muzzle flash effect
   * @param {number} x 
   * @param {number} y 
   * @param {number} angle 
   * @param {Object} options

## `createTrailEffect(trailPoints, )`

*
   * Create trail effect for projectiles
   * @param {Array} trailPoints 
   * @param {Object} options

## `update(deltaTime)`

*
   * Update all visual effects
   * @param {number} deltaTime

## `updateDamageNumbers(currentTime, deltaTime)`

*
   * Update damage numbers
   * @param {number} currentTime 
   * @param {number} deltaTime

## `updateFloatingTexts(currentTime, deltaTime)`

*
   * Update floating texts
   * @param {number} currentTime 
   * @param {number} deltaTime

## `updateScreenShakes(currentTime, deltaTime)`

*
   * Update screen shakes
   * @param {number} currentTime 
   * @param {number} deltaTime

## `updateHighlights(currentTime, deltaTime)`

*
   * Update highlights
   * @param {number} currentTime 
   * @param {number} deltaTime

## `updateEffects(currentTime, deltaTime)`

*
   * Update effects
   * @param {number} currentTime 
   * @param {number} deltaTime

## `updateEffect(effect, progress, deltaTime)`

*
   * Update individual effect
   * @param {Object} effect 
   * @param {number} progress 
   * @param {number} deltaTime

## `updateExplosion(explosion, progress, deltaTime)`

*
   * Update explosion effect
   * @param {Object} explosion 
   * @param {number} progress 
   * @param {number} deltaTime

## `updateImpact(impact, progress, deltaTime)`

*
   * Update impact effect
   * @param {Object} impact 
   * @param {number} progress 
   * @param {number} deltaTime

## `updateMuzzleFlash(flash, progress, deltaTime)`

*
   * Update muzzle flash
   * @param {Object} flash 
   * @param {number} progress 
   * @param {number} deltaTime

## `updateTrail(trail, progress, deltaTime)`

*
   * Update trail effect
   * @param {Object} trail 
   * @param {number} progress 
   * @param {number} deltaTime

## `updateRangeIndicator(indicator, progress, deltaTime)`

*
   * Update range indicator
   * @param {Object} indicator 
   * @param {number} progress 
   * @param {number} deltaTime

## `render()`

*
   * Render all visual effects

## `applyScreenShake()`

*
   * Apply screen shake offset

## `renderRangeIndicators()`

*
   * Render range indicators

## `renderHighlights()`

*
   * Render highlights

## `renderEffects()`

*
   * Render all effects

## `renderExplosion(explosion)`

*
   * Render explosion effect
   * @param {Object} explosion

## `renderImpact(impact)`

*
   * Render impact effect
   * @param {Object} impact

## `renderMuzzleFlash(flash)`

*
   * Render muzzle flash
   * @param {Object} flash

## `renderTrail(trail)`

*
   * Render trail effect
   * @param {Object} trail

## `renderDamageNumbers()`

*
   * Render damage numbers

## `renderFloatingTexts()`

*
   * Render floating texts

## `randomizeColor(baseColor)`

*
   * Randomize color for particles
   * @param {string} baseColor 
   * @returns {string}

## `addEventListener(event, callback)`

*
   * Add event listener
   * @param {string} event 
   * @param {Function} callback

## `removeEventListener(event, callback)`

*
   * Remove event listener
   * @param {string} event 
   * @param {Function} callback

## `triggerEvent(event, data)`

*
   * Trigger event
   * @param {string} event 
   * @param {Object} data

## `clearAllEffects()`

*
   * Clear all effects

## `getSystemStats()`

*
   * Get system statistics
   * @returns {Object}


## File: src\frontend\WaveManager.js
# Class `WaveManager`

## `constructor()`

## `initialize(levelNumber)`

Initialize with level data

## `startNextWave()`

Start the next wave

## `setupWave()`

## `createSpawnQueue()`

## `beginWave()`

## `startSpawnTimer()`

## `updateSpawning()`

## `spawnEnemy(enemyType)`

## `startWaveCompletionCheck()`

## `checkWaveCompletion()`

## `completeWave()`

## `calculateWaveResults()`

## `calculateWaveRating(killRate, survivalRate)`

## `awardWaveRewards(results)`

## `completeAllWaves()`

## `calculateLevelResults()`

## `awardLevelRewards(results)`

## `onEnemyKilled(enemy)`

Handle enemy events

## `onEnemyReachedEnd(enemy)`

## `skipWave()`

Wave control

## `pauseWave()`

## `resumeWave()`

## `stopSpawnTimer()`

Timer management

## `stopWaveTimer()`

## `onWaveStart(callback)`

Event system

## `onWaveComplete(callback)`

## `onWaveFailed(callback)`

## `onAllWavesComplete(callback)`

## `triggerWaveStartCallbacks()`

## `triggerWaveCompleteCallbacks(results)`

## `triggerWaveFailedCallbacks()`

## `triggerAllWavesCompleteCallbacks(results)`

## `getCurrentWave()`

Getters

## `getTotalWaves()`

## `isActive()`

## `canStartNextWave()`

## `getWaveProgress()`

## `getTimeUntilNextSpawn()`

## `getRemainingEnemies()`

## `getActiveEnemies()`

## `getWaveStats()`

## `getWaveData()`

## `setAutoStartNextWave(enabled)`

Settings

## `setAutoStartDelay(delay)`

## `setPreWaveDelay(delay)`

## `resetWaveStats()`

Utility methods

## `getEstimatedWaveDuration()`

## `getWaveDescription()`

## `getDebugInfo()`

Debug methods

## `dispose()`

Cleanup
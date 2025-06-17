// Level Data System
export class LevelData {
  constructor() {
    console.log("Calling method: constructor");
    this.currentLevel = 1;
    this.levels = new Map();
    this.waveTemplates = new Map();
    this.enemyTemplates = new Map();

    // Level progression settings
    this.maxLevels = 20;
    this.baseWaveCount = 10;
    this.maxWaveCount = 15;

    // Difficulty scaling
    this.difficultyScaling = {
      enemyHealth: 1.2,
      // 20% increase per level
      enemySpeed: 1.05,
      // 5% increase per level
      enemyCount: 1.15,
      // 15% increase per level
      bossHealth: 1.5,
      // 50% increase per level
      waveInterval: 0.95 // 5% decrease per level (faster waves)
    };

    // Initialize templates
    this.initializeEnemyTemplates();
    this.initializeWaveTemplates();
    console.log('LevelData initialized');
  }

  // Initialize enemy templates
  initializeEnemyTemplates() {
    console.log("Calling method: initializeEnemyTemplates");
    this.enemyTemplates.set('basic', {
      name: 'Basic Enemy',
      type: 'basic',
      health: 100,
      speed: 2,
      damage: 1,
      bounty: 10,
      scoreValue: 10,
      size: 1,
      color: 0xff4444,
      abilities: [],
      resistances: {},
      weaknesses: {}
    });
    this.enemyTemplates.set('fast', {
      name: 'Fast Enemy',
      type: 'fast',
      health: 60,
      speed: 4,
      damage: 1,
      bounty: 15,
      scoreValue: 15,
      size: 0.8,
      color: 0xff8844,
      abilities: ['speed_burst'],
      resistances: {},
      weaknesses: {
        'slow': 1.5
      }
    });
    this.enemyTemplates.set('heavy', {
      name: 'Heavy Enemy',
      type: 'heavy',
      health: 300,
      speed: 1,
      damage: 2,
      bounty: 25,
      scoreValue: 25,
      size: 1.5,
      color: 0x884444,
      abilities: ['armor'],
      resistances: {
        'physical': 0.5
      },
      weaknesses: {
        'energy': 1.5
      }
    });
    this.enemyTemplates.set('flying', {
      name: 'Flying Enemy',
      type: 'flying',
      health: 80,
      speed: 3,
      damage: 1,
      bounty: 20,
      scoreValue: 20,
      size: 1,
      color: 0x8844ff,
      abilities: ['flying', 'dodge'],
      resistances: {
        'ground': 0
      },
      weaknesses: {
        'air': 1.5
      }
    });
    this.enemyTemplates.set('shielded', {
      name: 'Shielded Enemy',
      type: 'shielded',
      health: 150,
      speed: 1.5,
      damage: 1,
      bounty: 30,
      scoreValue: 30,
      size: 1.2,
      color: 0x44aaff,
      abilities: ['energy_shield'],
      resistances: {
        'energy': 0.3
      },
      weaknesses: {
        'physical': 1.2
      }
    });
    this.enemyTemplates.set('regenerating', {
      name: 'Regenerating Enemy',
      type: 'regenerating',
      health: 120,
      speed: 2,
      damage: 1,
      bounty: 35,
      scoreValue: 35,
      size: 1.1,
      color: 0x44ff88,
      abilities: ['regeneration'],
      resistances: {},
      weaknesses: {
        'poison': 2.0
      }
    });

    // Boss enemies
    this.enemyTemplates.set('boss_tank', {
      name: 'Tank Boss',
      type: 'boss',
      subtype: 'tank',
      health: 2000,
      speed: 0.8,
      damage: 5,
      bounty: 200,
      scoreValue: 500,
      size: 3,
      color: 0xff0000,
      abilities: ['massive_armor', 'ground_slam', 'minion_spawn'],
      resistances: {
        'physical': 0.3,
        'energy': 0.5
      },
      weaknesses: {
        'fire': 1.3
      },
      phases: [{
        healthThreshold: 0.75,
        abilities: ['rage']
      }, {
        healthThreshold: 0.5,
        abilities: ['berserker']
      }, {
        healthThreshold: 0.25,
        abilities: ['desperate_fury']
      }]
    });
    this.enemyTemplates.set('boss_flyer', {
      name: 'Sky Boss',
      type: 'boss',
      subtype: 'flyer',
      health: 1500,
      speed: 1.5,
      damage: 3,
      bounty: 250,
      scoreValue: 600,
      size: 2.5,
      color: 0x8800ff,
      abilities: ['flying', 'air_strike', 'teleport'],
      resistances: {
        'ground': 0,
        'air': 0.4
      },
      weaknesses: {
        'lightning': 1.5
      },
      phases: [{
        healthThreshold: 0.66,
        abilities: ['storm_call']
      }, {
        healthThreshold: 0.33,
        abilities: ['lightning_barrage']
      }]
    });
  }

  // Initialize wave templates
  initializeWaveTemplates() {
    console.log("Calling method: initializeWaveTemplates");
    this.waveTemplates.set('basic_wave', {
      name: 'Basic Wave',
      enemies: [{
        type: 'basic',
        count: 10,
        interval: 1000
      }],
      totalDuration: 15000,
      difficulty: 1
    });
    this.waveTemplates.set('mixed_wave', {
      name: 'Mixed Wave',
      enemies: [{
        type: 'basic',
        count: 8,
        interval: 1000
      }, {
        type: 'fast',
        count: 4,
        interval: 1500,
        delay: 5000
      }],
      totalDuration: 20000,
      difficulty: 1.5
    });
    this.waveTemplates.set('heavy_wave', {
      name: 'Heavy Wave',
      enemies: [{
        type: 'basic',
        count: 6,
        interval: 800
      }, {
        type: 'heavy',
        count: 3,
        interval: 3000,
        delay: 8000
      }],
      totalDuration: 25000,
      difficulty: 2
    });
    this.waveTemplates.set('air_assault', {
      name: 'Air Assault',
      enemies: [{
        type: 'flying',
        count: 8,
        interval: 1200
      }, {
        type: 'basic',
        count: 5,
        interval: 1000,
        delay: 3000
      }],
      totalDuration: 18000,
      difficulty: 2.2
    });
    this.waveTemplates.set('shield_formation', {
      name: 'Shield Formation',
      enemies: [{
        type: 'shielded',
        count: 6,
        interval: 1500
      }, {
        type: 'basic',
        count: 10,
        interval: 800,
        delay: 2000
      }],
      totalDuration: 22000,
      difficulty: 2.5
    });
    this.waveTemplates.set('regeneration_swarm', {
      name: 'Regeneration Swarm',
      enemies: [{
        type: 'regenerating',
        count: 8,
        interval: 1000
      }, {
        type: 'fast',
        count: 6,
        interval: 1200,
        delay: 4000
      }],
      totalDuration: 20000,
      difficulty: 2.8
    });
    this.waveTemplates.set('boss_wave', {
      name: 'Boss Wave',
      enemies: [{
        type: 'basic',
        count: 5,
        interval: 1000
      }, {
        type: 'boss_tank',
        count: 1,
        interval: 0,
        delay: 10000
      }],
      totalDuration: 45000,
      difficulty: 5,
      isBossWave: true
    });
    this.waveTemplates.set('final_assault', {
      name: 'Final Assault',
      enemies: [{
        type: 'basic',
        count: 15,
        interval: 600
      }, {
        type: 'fast',
        count: 8,
        interval: 800,
        delay: 5000
      }, {
        type: 'heavy',
        count: 4,
        interval: 2000,
        delay: 10000
      }, {
        type: 'flying',
        count: 6,
        interval: 1000,
        delay: 15000
      }, {
        type: 'boss_flyer',
        count: 1,
        interval: 0,
        delay: 25000
      }],
      totalDuration: 60000,
      difficulty: 8,
      isBossWave: true
    });
  }

  // Load level data
  async loadLevel(levelNumber) {
    console.log("Calling method: loadLevel");
    this.currentLevel = levelNumber;
    try {
      // Generate level if not exists
      if (!this.levels.has(levelNumber)) {
        this.generateLevel(levelNumber);
      }
      console.log(`Level ${levelNumber} data loaded`);
      return this.levels.get(levelNumber);
    } catch (error) {
      console.error(`Failed to load level ${levelNumber}:`, error);
      return null;
    }
  }

  // Generate level data
  generateLevel(levelNumber) {
    console.log("Calling method: generateLevel");
    const waveCount = this.calculateWaveCount(levelNumber);
    const waves = this.generateWaves(levelNumber, waveCount);
    const levelData = {
      levelNumber: levelNumber,
      name: `Level ${levelNumber}`,
      description: this.getLevelDescription(levelNumber),
      theme: this.getLevelTheme(levelNumber),
      waves: waves,
      totalWaves: waves.length,
      estimatedDuration: this.calculateLevelDuration(waves),
      difficulty: this.calculateLevelDifficulty(levelNumber),
      rewards: this.calculateLevelRewards(levelNumber),
      objectives: this.getLevelObjectives(levelNumber),
      specialRules: this.getLevelSpecialRules(levelNumber)
    };
    this.levels.set(levelNumber, levelData);
    return levelData;
  }

  // Generate waves for a level
  generateWaves(levelNumber, waveCount) {
    console.log("Calling method: generateWaves");
    const waves = [];
    const difficulty = this.calculateLevelDifficulty(levelNumber);
    for (let waveIndex = 1; waveIndex <= waveCount; waveIndex++) {
      const wave = this.generateWave(levelNumber, waveIndex, waveCount, difficulty);
      waves.push(wave);
    }
    return waves;
  }
  generateWave(levelNumber, waveIndex, totalWaves, baseDifficulty) {
    console.log("Calling method: generateWave");
    const waveProgress = waveIndex / totalWaves;
    const waveDifficulty = baseDifficulty * (0.5 + waveProgress * 0.5);

    // Determine wave type
    let waveTemplate;
    if (waveIndex === totalWaves) {
      // Final wave - always a boss or major challenge
      waveTemplate = levelNumber % 5 === 0 ? 'final_assault' : 'boss_wave';
    } else if (waveIndex % 5 === 0) {
      // Every 5th wave is a boss wave
      waveTemplate = 'boss_wave';
    } else {
      // Regular waves with increasing complexity
      const templates = this.selectWaveTemplates(levelNumber, waveProgress);
      waveTemplate = templates[Math.floor(Math.random() * templates.length)];
    }
    const template = this.waveTemplates.get(waveTemplate);
    if (!template) {
      console.warn(`Wave template '${waveTemplate}' not found, using basic_wave`);
      waveTemplate = 'basic_wave';
    }

    // Scale wave based on difficulty
    const scaledWave = this.scaleWave(template, waveDifficulty, levelNumber);
    return {
      waveNumber: waveIndex,
      name: `Wave ${waveIndex}`,
      template: waveTemplate,
      enemies: scaledWave.enemies,
      totalDuration: scaledWave.totalDuration,
      difficulty: waveDifficulty,
      isBossWave: scaledWave.isBossWave || false,
      rewards: this.calculateWaveRewards(waveIndex, waveDifficulty),
      preWaveDelay: this.calculatePreWaveDelay(waveIndex, levelNumber)
    };
  }
  selectWaveTemplates(levelNumber, waveProgress) {
    console.log("Calling method: selectWaveTemplates");
    const availableTemplates = ['basic_wave', 'mixed_wave'];
    if (levelNumber >= 2) availableTemplates.push('heavy_wave');
    if (levelNumber >= 3) availableTemplates.push('air_assault');
    if (levelNumber >= 4) availableTemplates.push('shield_formation');
    if (levelNumber >= 5) availableTemplates.push('regeneration_swarm');

    // Later waves in a level can use more complex templates
    if (waveProgress > 0.6) {
      return availableTemplates.slice(-3); // Use more complex templates
    } else if (waveProgress > 0.3) {
      return availableTemplates.slice(1); // Skip basic waves
    } else {
      return availableTemplates.slice(0, 3); // Use simpler templates
    }
  }
  scaleWave(template, difficulty, levelNumber) {
    console.log("Calling method: scaleWave");
    const scaledWave = {
      enemies: [],
      totalDuration: template.totalDuration,
      isBossWave: template.isBossWave
    };
    template.enemies.forEach(function (enemyGroup) {
      const scaledGroup = {
        type: enemyGroup.type,
        count: Math.ceil(enemyGroup.count * difficulty * this.difficultyScaling.enemyCount ** (levelNumber - 1)),
        interval: Math.max(500, enemyGroup.interval * this.difficultyScaling.waveInterval ** (levelNumber - 1)),
        delay: enemyGroup.delay || 0
      };
      scaledWave.enemies.push(scaledGroup);
    });
    return scaledWave;
  }

  // Calculation methods
  calculateWaveCount(levelNumber) {
    console.log("Calling method: calculateWaveCount");
    return Math.min(this.baseWaveCount + Math.floor(levelNumber / 3), this.maxWaveCount);
  }
  calculateLevelDifficulty(levelNumber) {
    console.log("Calling method: calculateLevelDifficulty");
    return 1 + (levelNumber - 1) * 0.3; // 30% increase per level
  }
  calculateLevelDuration(waves) {
    console.log("Calling method: calculateLevelDuration");
    return waves.reduce(function (total, wave) {
      return total + wave.totalDuration + wave.preWaveDelay;
    }, 0);
  }
  calculateLevelRewards(levelNumber) {
    console.log("Calling method: calculateLevelRewards");
    const baseGold = 100;
    const baseEnergy = 50;
    const baseScore = 1000;
    return {
      gold: Math.floor(baseGold * 1.2 ** (levelNumber - 1)),
      energy: Math.floor(baseEnergy * 1.1 ** (levelNumber - 1)),
      score: Math.floor(baseScore * 1.5 ** (levelNumber - 1)),
      unlocks: this.getLevelUnlocks(levelNumber)
    };
  }
  calculateWaveRewards(waveNumber, difficulty) {
    console.log("Calling method: calculateWaveRewards");
    return {
      gold: Math.floor(10 * difficulty),
      energy: Math.floor(5 * difficulty),
      score: Math.floor(50 * difficulty)
    };
  }
  calculatePreWaveDelay(waveNumber, levelNumber) {
    console.log("Calling method: calculatePreWaveDelay");
    const baseDelay = 5000; // 5 seconds
    const minDelay = 2000; // 2 seconds minimum

    // Shorter delays for higher levels and later waves
    const levelFactor = Math.max(0.5, 1 - (levelNumber - 1) * 0.05);
    const waveFactor = Math.max(0.7, 1 - waveNumber * 0.03);
    return Math.max(minDelay, baseDelay * levelFactor * waveFactor);
  }

  // Get enemy template with level scaling
  getScaledEnemyTemplate(enemyType, levelNumber) {
    console.log("Calling method: getScaledEnemyTemplate");
    const template = this.enemyTemplates.get(enemyType);
    if (!template) {
      console.warn(`Enemy template '${enemyType}' not found`);
      return this.enemyTemplates.get('basic');
    }

    // Create scaled copy
    const scaledTemplate = {
      ...template
    };

    // Apply level scaling
    const levelMultiplier = levelNumber - 1;
    scaledTemplate.health = Math.floor(template.health * this.difficultyScaling.enemyHealth ** levelMultiplier);
    scaledTemplate.speed = template.speed * this.difficultyScaling.enemySpeed ** levelMultiplier;

    // Scale boss enemies more dramatically
    if (template.type === 'boss') {
      scaledTemplate.health = Math.floor(template.health * this.difficultyScaling.bossHealth ** levelMultiplier);
    }
    return scaledTemplate;
  }

  // Level metadata
  getLevelDescription(levelNumber) {
    console.log("Calling method: getLevelDescription");
    const descriptions = ["Welcome to the battlefield! Learn the basics of tower defense.", "The enemy forces are growing stronger. Adapt your strategy!", "Flying enemies appear! You'll need anti-air defenses.", "Heavily armored enemies test your firepower.", "Energy shields protect the enemy. Use physical weapons!", "Regenerating enemies require sustained damage.", "The first boss appears! Prepare for a tough fight.", "Multiple enemy types attack simultaneously.", "Advanced enemy abilities challenge your defenses.", "The final assault begins. Survive at all costs!"];
    const index = Math.min(levelNumber - 1, descriptions.length - 1);
    return descriptions[index];
  }
  getLevelTheme(levelNumber) {
    console.log("Calling method: getLevelTheme");
    if (levelNumber <= 3) return 'grassland';
    if (levelNumber <= 6) return 'desert';
    if (levelNumber <= 9) return 'winter';
    if (levelNumber <= 12) return 'volcanic';
    if (levelNumber <= 15) return 'crystal';
    if (levelNumber <= 18) return 'shadow';
    return 'cosmic';
  }
  getLevelObjectives(levelNumber) {
    console.log("Calling method: getLevelObjectives");
    const objectives = [{
      type: 'survive',
      description: 'Survive all waves'
    }, {
      type: 'score',
      description: `Achieve ${1000 * levelNumber} points`,
      target: 1000 * levelNumber
    }];
    if (levelNumber >= 3) {
      objectives.push({
        type: 'efficiency',
        description: 'Complete with 80% accuracy',
        target: 0.8
      });
    }
    if (levelNumber >= 5) {
      objectives.push({
        type: 'speed',
        description: 'Complete in under 10 minutes',
        target: 600000
      });
    }
    return objectives;
  }
  getLevelSpecialRules(levelNumber) {
    console.log("Calling method: getLevelSpecialRules");
    const rules = [];
    if (levelNumber >= 4) {
      rules.push({
        type: 'fog_of_war',
        description: 'Limited visibility range'
      });
    }
    if (levelNumber >= 7) {
      rules.push({
        type: 'resource_scarcity',
        description: 'Reduced resource generation'
      });
    }
    if (levelNumber >= 10) {
      rules.push({
        type: 'time_pressure',
        description: 'Faster wave intervals'
      });
    }
    return rules;
  }
  getLevelUnlocks(levelNumber) {
    console.log("Calling method: getLevelUnlocks");
    const unlocks = [];
    switch (levelNumber) {
      case 2:
        unlocks.push({
          type: 'tower',
          name: 'Laser Tower'
        });
        break;
      case 3:
        unlocks.push({
          type: 'tower',
          name: 'Missile Tower'
        });
        break;
      case 4:
        unlocks.push({
          type: 'tower',
          name: 'Freeze Tower'
        });
        break;
      case 5:
        unlocks.push({
          type: 'upgrade',
          name: 'Tower Upgrades'
        });
        break;
      case 7:
        unlocks.push({
          type: 'ability',
          name: 'Air Strike'
        });
        break;
      case 10:
        unlocks.push({
          type: 'tower',
          name: 'Tesla Tower'
        });
        break;
    }
    return unlocks;
  }

  // Getters
  getCurrentLevel() {
    console.log("Calling method: getCurrentLevel");
    return this.currentLevel;
  }
  getLevelData(levelNumber) {
    console.log("Calling method: getLevelData");
    return this.levels.get(levelNumber);
  }
  getWaveData(levelNumber, waveNumber) {
    console.log("Calling method: getWaveData");
    const level = this.levels.get(levelNumber);
    if (!level || !level.waves) return null;
    return level.waves.find(function (wave) {
      return wave.waveNumber === waveNumber;
    });
  }
  getEnemyTemplate(enemyType) {
    console.log("Calling method: getEnemyTemplate");
    return this.enemyTemplates.get(enemyType);
  }
  getWaveTemplate(templateName) {
    console.log("Calling method: getWaveTemplate");
    return this.waveTemplates.get(templateName);
  }
  getMaxLevels() {
    console.log("Calling method: getMaxLevels");
    return this.maxLevels;
  }

  // Validation
  isValidLevel(levelNumber) {
    console.log("Calling method: isValidLevel");
    return levelNumber >= 1 && levelNumber <= this.maxLevels;
  }
  isLevelUnlocked(levelNumber, completedLevels = []) {
    console.log("Calling method: isLevelUnlocked");
    if (levelNumber === 1) return true;
    return completedLevels.includes(levelNumber - 1);
  }

  // Save/Load
  saveLevelData() {
    console.log("Calling method: saveLevelData");
    return {
      currentLevel: this.currentLevel,
      levels: Array.from(this.levels.entries()),
      maxLevels: this.maxLevels
    };
  }
  loadLevelData(data) {
    console.log("Calling method: loadLevelData");
    if (data.currentLevel !== undefined) this.currentLevel = data.currentLevel;
    if (data.maxLevels !== undefined) this.maxLevels = data.maxLevels;
    if (data.levels) {
      this.levels = new Map(data.levels);
    }
  }

  // Debug methods
  getDebugInfo() {
    console.log("Calling method: getDebugInfo");
    return {
      currentLevel: this.currentLevel,
      loadedLevels: this.levels.size,
      enemyTemplates: this.enemyTemplates.size,
      waveTemplates: this.waveTemplates.size,
      maxLevels: this.maxLevels
    };
  }
}
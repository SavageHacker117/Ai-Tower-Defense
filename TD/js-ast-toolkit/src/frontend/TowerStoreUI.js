/**
 * TowerStoreUI.js
 * Manages the tower store interface for purchasing and upgrading towers
 * in the tower defense game
 * 
 * Refactored to use ES6 modules and dependency injection
 */

export class TowerStoreUI {
  constructor(dependencies) {
    console.log("Calling method: constructor");
    // Use dependency injection instead of direct references
    const {
      towerSystem,
      authManager,
      resourceManager,
      notificationManager,
      // Functions passed from the main game
      onTowerSelectedForPurchase,
      onTowerPlaced,
      onTowerUpgraded,
      onTowerSold
    } = dependencies;
    this.towerSystem = towerSystem;
    this.authManager = authManager;
    this.resourceManager = resourceManager;
    this.notificationManager = notificationManager;

    // Store callback functions instead of relying on events
    this.onTowerSelectedForPurchase = onTowerSelectedForPurchase;
    this.onTowerPlaced = onTowerPlaced;
    this.onTowerUpgraded = onTowerUpgraded;
    this.onTowerSold = onTowerSold;
    this.isVisible = false;
    this.selectedTower = null;
    this.eventListeners = new Map();

    // UI element references
    this.storeContainer = null;
    this.towerGrid = null;
    this.upgradePanel = null;
    this.currencyDisplay = null;
    this.initializeUI();
    this.setupEventListeners();
    this.setupResourceManagerIntegration();
  }

  /**
   * Initialize the store UI elements
   */
  initializeUI() {
    console.log("Calling method: initializeUI");
    this.createStoreContainer();
    this.createTowerGrid();
    this.createUpgradePanel();
    this.createCurrencyDisplay();
    this.createControlButtons();

    // Initially hide the store
    this.hide();
  }

  /**
   * Create main store container
   */
  createStoreContainer() {
    console.log("Calling method: createStoreContainer");
    this.storeContainer = document.createElement('div');
    this.storeContainer.id = 'tower-store';
    this.storeContainer.className = 'tower-store-container';
    this.storeContainer.innerHTML = `
            <div class="store-header">
                <h2>Tower Store</h2>
                <button class="close-btn" id="store-close-btn">&times;</button>
            </div>
            <div class="store-content">
                <div class="store-tabs">
                    <button class="tab-btn active" data-tab="purchase">Purchase</button>
                    <button class="tab-btn" data-tab="upgrade">Upgrade</button>
                </div>
                <div class="store-body">
                    <div id="purchase-tab" class="tab-content active">
                        <div id="tower-grid"></div>
                    </div>
                    <div id="upgrade-tab" class="tab-content">
                        <div id="upgrade-panel"></div>
                    </div>
                </div>
            </div>
        `;
    document.body.appendChild(this.storeContainer);

    // Get references to created elements
    this.towerGrid = document.getElementById('tower-grid');
    this.upgradePanel = document.getElementById('upgrade-panel');
  }

  /**
   * Create tower grid for purchasing
   */
  createTowerGrid() {
    console.log("Calling method: createTowerGrid");
    if (!this.towerGrid) return;
    const towerTypes = this.towerSystem.getTowerTypes();
    this.towerGrid.innerHTML = '';
    towerTypes.forEach(function (config, towerType) {
      const towerCard = this.createTowerCard(towerType, config);
      this.towerGrid.appendChild(towerCard);
    });
  }

  /**
   * Create individual tower card
   * @param {string} towerType 
   * @param {Object} config 
   * @returns {HTMLElement}
   */
  createTowerCard(towerType, config) {
    console.log("Calling method: createTowerCard");
    const card = document.createElement('div');
    card.className = 'tower-card';
    card.dataset.towerType = towerType;
    const currentCurrency = this.getCurrency();
    const canAfford = currentCurrency >= config.cost;
    const isUnlocked = this.isTowerUnlocked(towerType);
    if (!canAfford) card.classList.add('unaffordable');
    if (!isUnlocked) card.classList.add('locked');
    card.innerHTML = `
            <div class="tower-icon">
                <img src="assets/towers/${config.sprite}.png" alt="${config.name}" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <div class="tower-placeholder" style="display:none;">${towerType.charAt(0).toUpperCase()}</div>
            </div>
            <div class="tower-info">
                <h3>${config.name}</h3>
                <p class="tower-description">${config.description}</p>
                <div class="tower-stats">
                    <div class="stat">
                        <span class="stat-label">Damage:</span>
                        <span class="stat-value">${config.damage}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Range:</span>
                        <span class="stat-value">${config.range}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Speed:</span>
                        <span class="stat-value">${config.attackSpeed.toFixed(1)}/s</span>
                    </div>
                </div>
                <div class="tower-cost">
                    <span class="cost-amount">${config.cost}</span>
                    <span class="currency-icon">💰</span>
                </div>
                ${!isUnlocked ? '<div class="unlock-requirement">Unlock at level ' + this.getTowerUnlockLevel(towerType) + '</div>' : ''}
            </div>
            <div class="tower-actions">
                <button class="purchase-btn" ${!canAfford || !isUnlocked ? 'disabled' : ''}>
                    ${!isUnlocked ? 'Locked' : !canAfford ? 'Not enough gold' : 'Purchase'}
                </button>
            </div>
        `;

    // Add click handler
    const purchaseBtn = card.querySelector('.purchase-btn');
    purchaseBtn.addEventListener('click', function () {
      if (canAfford && isUnlocked) {
        this.selectTowerForPurchase(towerType);
      }
    });
    return card;
  }

  /**
   * Create upgrade panel
   */
  createUpgradePanel() {
    console.log("Calling method: createUpgradePanel");
    if (!this.upgradePanel) return;
    this.upgradePanel.innerHTML = `
            <div class="upgrade-content">
                <div class="no-tower-selected">
                    <p>Select a tower to view upgrade options</p>
                </div>
                <div class="tower-upgrade-info" style="display: none;">
                    <div class="selected-tower-info">
                        <h3 id="selected-tower-name"></h3>
                        <div class="tower-level">Level <span id="selected-tower-level"></span></div>
                        <div class="tower-stats" id="selected-tower-stats"></div>
                    </div>
                    <div class="upgrade-options">
                        <div class="level-upgrade">
                            <h4>Level Upgrade</h4>
                            <div class="upgrade-benefits" id="level-upgrade-benefits"></div>
                            <button class="upgrade-btn" id="level-upgrade-btn">Upgrade Level</button>
                        </div>
                        <div class="type-upgrades" id="type-upgrades">
                            <h4>Tower Upgrades</h4>
                            <div class="upgrade-grid" id="upgrade-grid"></div>
                        </div>
                    </div>
                    <div class="tower-actions">
                        <button class="sell-btn" id="sell-tower-btn">Sell Tower</button>
                    </div>
                </div>
            </div>
        `;
  }

  /**
   * Create currency display
   */
  createCurrencyDisplay() {
    console.log("Calling method: createCurrencyDisplay");
    this.currencyDisplay = document.createElement('div');
    this.currencyDisplay.className = 'currency-display';
    this.updateCurrencyDisplay();

    // Add to store header
    const storeHeader = this.storeContainer.querySelector('.store-header');
    storeHeader.appendChild(this.currencyDisplay);
  }

  /**
   * Update currency display
   */
  updateCurrencyDisplay() {
    console.log("Calling method: updateCurrencyDisplay");
    if (!this.currencyDisplay) return;
    const currentCurrency = this.getCurrency();
    this.currencyDisplay.innerHTML = `
            <span class="currency-icon">💰</span>
            <span class="currency-amount">${currentCurrency}</span>
        `;
  }

  /**
   * Get current currency from resource manager or auth manager
   * @returns {number}
   */
  getCurrency() {
    console.log("Calling method: getCurrency");
    // Try resource manager first (for in-game currency)
    if (this.resourceManager && typeof this.resourceManager.getGold === 'function') {
      return this.resourceManager.getGold();
    }

    // Fallback to auth manager for persistent currency
    if (this.authManager && this.authManager.isLoggedIn) {
      const user = this.authManager.getCurrentUser();
      if (user && typeof user.currency === 'number') {
        return user.currency;
      }
    }

    // Default fallback
    return 1000;
  }

  /**
   * Create control buttons
   */
  createControlButtons() {
    console.log("Calling method: createControlButtons");
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'store-controls';
    controlsContainer.innerHTML = `
            <button class="control-btn" id="hotkey-info-btn">Hotkeys</button>
            <button class="control-btn" id="tower-info-btn">Tower Guide</button>
        `;
    this.storeContainer.appendChild(controlsContainer);
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    console.log("Calling method: setupEventListeners");
    // Close button
    const closeBtn = document.getElementById('store-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        return this.hide();
      });
    }

    // Tab switching
    const tabBtns = this.storeContainer.querySelectorAll('.tab-btn');
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        this.switchTab(e.target.dataset.tab);
      });
    });

    // Upgrade panel buttons
    const levelUpgradeBtn = document.getElementById('level-upgrade-btn');
    if (levelUpgradeBtn) {
      levelUpgradeBtn.addEventListener('click', function () {
        this.upgradeTowerLevel();
      });
    }
    const sellBtn = document.getElementById('sell-tower-btn');
    if (sellBtn) {
      sellBtn.addEventListener('click', function () {
        this.sellSelectedTower();
      });
    }

    // Keyboard shortcuts
    this.keyboardHandler = function (e) {
      if (this.isVisible) {
        this.handleKeyboardInput(e);
      }
    };
    document.addEventListener('keydown', this.keyboardHandler);
  }

  /**
   * Setup integration with resource manager for currency updates
   */
  setupResourceManagerIntegration() {
    console.log("Calling method: setupResourceManagerIntegration");
    if (this.resourceManager && typeof this.resourceManager.addEventListener === 'function') {
      // Listen for currency changes
      this.resourceManager.addEventListener('currencyChanged', function () {
        this.updateCurrencyDisplay();
        this.refreshTowerGrid();
        this.refreshUpgradePanel();
      });
    }
  }

  /**
   * Show the store
   */
  show() {
    console.log("Calling method: show");
    this.isVisible = true;
    this.storeContainer.style.display = 'block';
    this.storeContainer.classList.add('visible');

    // Update currency display
    this.updateCurrencyDisplay();
    this.refreshTowerGrid();

    // Notify via callback instead of event
    this.triggerEvent('storeOpened', {});
  }

  /**
   * Hide the store
   */
  hide() {
    console.log("Calling method: hide");
    this.isVisible = false;
    this.storeContainer.classList.remove('visible');
    setTimeout(function () {
      this.storeContainer.style.display = 'none';
    }, 300);
    this.triggerEvent('storeClosed', {});
  }

  /**
   * Toggle store visibility
   */
  toggle() {
    console.log("Calling method: toggle");
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Switch between tabs
   * @param {string} tabName 
   */
  switchTab(tabName) {
    console.log("Calling method: switchTab");
    // Update tab buttons
    const tabBtns = this.storeContainer.querySelectorAll('.tab-btn');
    tabBtns.forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update tab content
    const tabContents = this.storeContainer.querySelectorAll('.tab-content');
    tabContents.forEach(function (content) {
      content.classList.toggle('active', content.id === `${tabName}-tab`);
    });
    if (tabName === 'upgrade') {
      this.refreshUpgradePanel();
    }
  }

  /**
   * Select tower for purchase
   * @param {string} towerType 
   */
  selectTowerForPurchase(towerType) {
    console.log("Calling method: selectTowerForPurchase");
    const config = this.towerSystem.getTowerTypeConfig(towerType);

    // Use callback instead of event
    if (this.onTowerSelectedForPurchase) {
      this.onTowerSelectedForPurchase({
        towerType,
        config
      });
    }

    // Also trigger internal event for backward compatibility
    this.triggerEvent('towerSelectedForPurchase', {
      towerType,
      config
    });

    // Enter placement mode
    this.hide();
  }

  /**
   * Select tower for upgrade
   * @param {Object} tower 
   */
  selectTowerForUpgrade(tower) {
    console.log("Calling method: selectTowerForUpgrade");
    this.selectedTower = tower;
    this.switchTab('upgrade');
    this.refreshUpgradePanel();
    if (!this.isVisible) {
      this.show();
    }
  }

  /**
   * Refresh tower grid
   */
  refreshTowerGrid() {
    console.log("Calling method: refreshTowerGrid");
    this.createTowerGrid();
  }

  /**
   * Refresh upgrade panel
   */
  refreshUpgradePanel() {
    console.log("Calling method: refreshUpgradePanel");
    const noTowerDiv = this.upgradePanel.querySelector('.no-tower-selected');
    const upgradeInfoDiv = this.upgradePanel.querySelector('.tower-upgrade-info');
    if (!this.selectedTower) {
      noTowerDiv.style.display = 'block';
      upgradeInfoDiv.style.display = 'none';
      return;
    }
    noTowerDiv.style.display = 'none';
    upgradeInfoDiv.style.display = 'block';

    // Update tower info
    const towerNameEl = document.getElementById('selected-tower-name');
    const towerLevelEl = document.getElementById('selected-tower-level');
    if (towerNameEl) {
      towerNameEl.textContent = this.towerSystem.getTowerTypeConfig(this.selectedTower.type).name;
    }
    if (towerLevelEl) {
      towerLevelEl.textContent = this.selectedTower.level;
    }

    // Update stats
    this.updateTowerStats();

    // Update level upgrade
    this.updateLevelUpgradeInfo();

    // Update type upgrades
    this.updateTypeUpgrades();
  }

  /**
   * Update tower stats display
   */
  updateTowerStats() {
    console.log("Calling method: updateTowerStats");
    const statsContainer = document.getElementById('selected-tower-stats');
    if (!statsContainer || !this.selectedTower) return;
    statsContainer.innerHTML = `
            <div class="stat">
                <span class="stat-label">Damage:</span>
                <span class="stat-value">${this.selectedTower.damage}</span>
            </div>
            <div class="stat">
                <span class="stat-label">Range:</span>
                <span class="stat-value">${this.selectedTower.range}</span>
            </div>
            <div class="stat">
                <span class="stat-label">Attack Speed:</span>
                <span class="stat-value">${this.selectedTower.attackSpeed.toFixed(1)}/s</span>
            </div>
            <div class="stat">
                <span class="stat-label">Kills:</span>
                <span class="stat-value">${this.selectedTower.kills || 0}</span>
            </div>
            <div class="stat">
                <span class="stat-label">Total Damage:</span>
                <span class="stat-value">${this.selectedTower.totalDamageDealt || 0}</span>
            </div>
        `;
  }

  /**
   * Update level upgrade information
   */
  updateLevelUpgradeInfo() {
    console.log("Calling method: updateLevelUpgradeInfo");
    const benefitsContainer = document.getElementById('level-upgrade-benefits');
    const upgradeBtn = document.getElementById('level-upgrade-btn');
    if (!benefitsContainer || !upgradeBtn || !this.selectedTower) return;
    const canUpgrade = this.selectedTower.level < (this.selectedTower.maxLevel || 10);
    const baseCost = this.towerSystem.getTowerTypeConfig(this.selectedTower.type).cost;
    const upgradeCost = Math.floor(baseCost * 0.5 * this.selectedTower.level);
    const currentCurrency = this.getCurrency();
    const canAfford = currentCurrency >= upgradeCost;
    if (canUpgrade) {
      benefitsContainer.innerHTML = `
                <div class="benefit">+30% Damage</div>
                <div class="benefit">+10% Range</div>
                <div class="benefit">+10% Attack Speed</div>
                <div class="upgrade-cost">Cost: ${upgradeCost} 💰</div>
            `;
      upgradeBtn.textContent = `Upgrade (${upgradeCost} 💰)`;
      upgradeBtn.disabled = !canAfford;
    } else {
      benefitsContainer.innerHTML = '<div class="max-level">Maximum level reached</div>';
      upgradeBtn.textContent = 'Max Level';
      upgradeBtn.disabled = true;
    }
  }

  /**
   * Update type upgrade options
   */
  updateTypeUpgrades() {
    console.log("Calling method: updateTypeUpgrades");
    const upgradeGrid = document.getElementById('upgrade-grid');
    if (!upgradeGrid || !this.selectedTower) return;
    upgradeGrid.innerHTML = '';
    const availableUpgrades = this.selectedTower.availableUpgrades || [];
    availableUpgrades.forEach(function (upgradeType) {
      const upgradeConfig = this.towerSystem.getTowerTypeConfig(upgradeType);
      if (!upgradeConfig) return;
      const baseCost = this.towerSystem.getTowerTypeConfig(this.selectedTower.type).cost;
      const upgradeCost = upgradeConfig.cost - baseCost;
      const currentCurrency = this.getCurrency();
      const canAfford = currentCurrency >= upgradeCost;
      const upgradeCard = document.createElement('div');
      upgradeCard.className = 'upgrade-card';
      if (!canAfford) upgradeCard.classList.add('unaffordable');
      upgradeCard.innerHTML = `
                <div class="upgrade-icon">
                    <img src="assets/towers/${upgradeConfig.sprite}.png" alt="${upgradeConfig.name}"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <div class="upgrade-placeholder" style="display:none;">${upgradeType.charAt(0).toUpperCase()}</div>
                </div>
                <div class="upgrade-info">
                    <h4>${upgradeConfig.name}</h4>
                    <p>${upgradeConfig.description}</p>
                    <div class="upgrade-cost">${upgradeCost} 💰</div>
                </div>
                <button class="upgrade-type-btn" ${!canAfford ? 'disabled' : ''}>
                    ${!canAfford ? 'Not enough gold' : 'Upgrade'}
                </button>
            `;
      const upgradeBtn = upgradeCard.querySelector('.upgrade-type-btn');
      upgradeBtn.addEventListener('click', function () {
        if (canAfford) {
          this.upgradeTowerType(upgradeType);
        }
      });
      upgradeGrid.appendChild(upgradeCard);
    });
  }

  /**
   * Upgrade selected tower level
   */
  upgradeTowerLevel() {
    console.log("Calling method: upgradeTowerLevel");
    if (!this.selectedTower) return;
    const result = this.towerSystem.upgradeTower(this.selectedTower.id, 'level');
    if (result.success) {
      // Use callback instead of event
      if (this.onTowerUpgraded) {
        this.onTowerUpgraded({
          tower: this.selectedTower,
          upgradeType: 'level',
          cost: result.cost
        });
      }
      this.triggerEvent('towerLevelUpgraded', {
        tower: this.selectedTower,
        cost: result.cost
      });

      // Show success notification
      if (this.notificationManager) {
        this.notificationManager.showSuccess('Tower upgraded successfully!');
      }
    } else {
      this.showError(result.reason);
    }
  }

  /**
   * Upgrade selected tower type
   * @param {string} upgradeType 
   */
  upgradeTowerType(upgradeType) {
    console.log("Calling method: upgradeTowerType");
    if (!this.selectedTower) return;
    const result = this.towerSystem.upgradeTower(this.selectedTower.id, upgradeType);
    if (result.success) {
      // Use callback instead of event
      if (this.onTowerUpgraded) {
        this.onTowerUpgraded({
          tower: this.selectedTower,
          upgradeType,
          cost: result.cost
        });
      }
      this.triggerEvent('towerTypeUpgraded', {
        tower: this.selectedTower,
        upgradeType,
        cost: result.cost
      });

      // Show success notification
      if (this.notificationManager) {
        this.notificationManager.showSuccess(`Tower upgraded to ${upgradeType}!`);
      }
    } else {
      this.showError(result.reason);
    }
  }

  /**
   * Sell selected tower
   */
  sellSelectedTower() {
    console.log("Calling method: sellSelectedTower");
    if (!this.selectedTower) return;
    const result = this.towerSystem.sellTower(this.selectedTower.id);
    if (result.success) {
      // Use callback instead of event
      if (this.onTowerSold) {
        this.onTowerSold({
          tower: this.selectedTower,
          sellValue: result.sellValue
        });
      }
      this.triggerEvent('towerSold', {
        tower: this.selectedTower,
        sellValue: result.sellValue
      });

      // Show success notification
      if (this.notificationManager) {
        this.notificationManager.showSuccess(`Tower sold for ${result.sellValue} gold!`);
      }
      this.selectedTower = null;
      this.refreshUpgradePanel();
    } else {
      this.showError(result.reason);
    }
  }

  /**
   * Check if tower is unlocked for current player
   * @param {string} towerType 
   * @returns {boolean}
   */
  isTowerUnlocked(towerType) {
    console.log("Calling method: isTowerUnlocked");
    if (!this.authManager || !this.authManager.isLoggedIn) {
      return towerType === 'basic'; // Only basic tower for guests
    }
    const user = this.authManager.getCurrentUser();
    return user && user.unlockedTowers && user.unlockedTowers.includes(towerType);
  }

  /**
   * Get tower unlock level
   * @param {string} towerType 
   * @returns {number}
   */
  getTowerUnlockLevel(towerType) {
    console.log("Calling method: getTowerUnlockLevel");
    const unlockLevels = {
      basic: 1,
      cannon: 2,
      laser: 3,
      ice: 5,
      poison: 7,
      lightning: 10
    };
    return unlockLevels[towerType] || 1;
  }

  /**
   * Handle keyboard input
   * @param {KeyboardEvent} e 
   */
  handleKeyboardInput(e) {
    console.log("Calling method: handleKeyboardInput");
    switch (e.key) {
      case 'Escape':
        this.hide();
        break;
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
        const towerIndex = parseInt(e.key) - 1;
        const towerTypes = Array.from(this.towerSystem.getTowerTypes().keys());
        if (towerIndex < towerTypes.length) {
          this.selectTowerForPurchase(towerTypes[towerIndex]);
        }
        break;
      case 'Tab':
        e.preventDefault();
        const currentTab = this.storeContainer.querySelector('.tab-btn.active').dataset.tab;
        const newTab = currentTab === 'purchase' ? 'upgrade' : 'purchase';
        this.switchTab(newTab);
        break;
    }
  }

  /**
   * Show error message
   * @param {string} message 
   */
  showError(message) {
    console.log("Calling method: showError");
    // Use notification manager if available
    if (this.notificationManager) {
      this.notificationManager.showError(message);
      return;
    }

    // Fallback to temporary error display
    const errorDiv = document.createElement('div');
    errorDiv.className = 'store-error';
    errorDiv.textContent = message;
    this.storeContainer.appendChild(errorDiv);
    setTimeout(function () {
      errorDiv.remove();
    }, 3000);
  }

  /**
   * Add event listener
   * @param {string} event 
   * @param {Function} callback 
   */
  addEventListener(event, callback) {
    console.log("Calling method: addEventListener");
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  /**
   * Remove event listener
   * @param {string} event 
   * @param {Function} callback 
   */
  removeEventListener(event, callback) {
    console.log("Calling method: removeEventListener");
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Trigger event
   * @param {string} event 
   * @param {Object} data 
   */
  triggerEvent(event, data) {
    console.log("Calling method: triggerEvent");
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(function (callback) {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} event listener:`, error);
        }
      });
    }
  }

  /**
   * Destroy the UI and clean up resources
   */
  destroy() {
    console.log("Calling method: destroy");
    // Remove keyboard event listener
    if (this.keyboardHandler) {
      document.removeEventListener('keydown', this.keyboardHandler);
    }

    // Remove DOM elements
    if (this.storeContainer) {
      this.storeContainer.remove();
    }

    // Clear event listeners
    this.eventListeners.clear();

    // Clear references
    this.towerSystem = null;
    this.authManager = null;
    this.resourceManager = null;
    this.notificationManager = null;
    this.onTowerSelectedForPurchase = null;
    this.onTowerPlaced = null;
    this.onTowerUpgraded = null;
    this.onTowerSold = null;
  }
}
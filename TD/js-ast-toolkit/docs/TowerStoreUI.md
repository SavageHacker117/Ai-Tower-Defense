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
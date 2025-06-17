class HUDManager {
    constructor(minimapElement, scoreDisplayElement, waveIndicatorElement, goldDisplayElement, livesDisplayElement, waveCountdownElement, startWaveButtonElement, towerSelectionContainer) {
        this.minimap = minimapElement;
        this.scoreDisplay = scoreDisplayElement;
        this.waveIndicator = waveIndicatorElement;
        this.goldDisplay = goldDisplayElement;
        this.livesDisplay = livesDisplayElement;
        this.waveCountdown = waveCountdownElement;
        this.startWaveButton = startWaveButtonElement;
        this.towerSelection = towerSelectionContainer;

        this.initEventListeners();
    }

    initEventListeners() {
        if (this.startWaveButton) {
            this.startWaveButton.addEventListener('click', () => {
                document.dispatchEvent(new CustomEvent('startWave'));
            });
        }

        if (this.towerSelection) {
            this.towerSelection.addEventListener('click', (event) => {
                const button = event.target.closest('button[data-tower-type]');
                if (button) {
                    const towerType = button.dataset.towerType;
                    document.dispatchEvent(new CustomEvent('selectTower', { detail: { towerType } }));
                }
            });
        }
    }

    updateGold(amount) {
        if (this.goldDisplay) this.goldDisplay.textContent = amount;
    }

    updateLives(amount) {
        if (this.livesDisplay) this.livesDisplay.textContent = amount;
    }

    updateWaveNumber(currentWave, totalWaves) {
        if (this.waveIndicator) this.waveIndicator.textContent = `${currentWave}`;
        const totalWavesElement = document.getElementById('total-waves');
        if (totalWavesElement) totalWavesElement.textContent = totalWaves;
    }

    updateWaveCountdown(seconds) {
        if (this.waveCountdown) this.waveCountdown.textContent = seconds;
    }

    updateScore(score) {
        if (this.scoreDisplay) {
            this.scoreDisplay.querySelector('span').textContent = score;
        }
    }

    showStartWaveButton(show) {
        if (this.startWaveButton) {
            this.startWaveButton.style.display = show ? 'block' : 'none';
        }
    }

    showTowerSelection(show) {
        if (this.towerSelection) {
            this.towerSelection.style.display = show ? 'block' : 'none';
        }
    }

    displayTowerUpgradeOptions(tower) {
        const upgradePanel = document.getElementById('upgrade-panel');
        if (upgradePanel) {
            upgradePanel.innerHTML = `
                <h3>Upgrade ${tower.type} Tower</h3>
                <p>Damage: ${tower.damage} -> ${tower.damage + 10}</p>
                <p>Range: ${tower.range} -> ${tower.range + 50}</p>
                <button data-upgrade-type="damage" data-cost="50">Upgrade Damage ($50)</button>
                <button data-upgrade-type="range" data-cost="75">Upgrade Range ($75)</button>
            `;
            upgradePanel.style.display = 'block';

            upgradePanel.querySelectorAll('button').forEach(button => {
                button.onclick = () => {
                    const upgradeType = button.dataset.upgradeType;
                    const cost = parseInt(button.dataset.cost);
                    document.dispatchEvent(new CustomEvent('upgradeTower', {
                        detail: { towerId: tower.id, upgradeType, cost }
                    }));
                };
            });
        }
    }

    hideTowerUpgradeOptions() {
        const upgradePanel = document.getElementById('upgrade-panel');
        if (upgradePanel) upgradePanel.style.display = 'none';
    }
}

export default HUDManager;

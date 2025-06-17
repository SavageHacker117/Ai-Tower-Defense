// Enhanced 3D Tower Defense Game - Additional Features
// This file contains enhancements and fixes for the main game

// Add enhanced visual effects and better 3D rendering
class EnhancedTowerDefenseGame extends TowerDefenseGame {
    constructor() {
        super();
        this.particleSystem = null;
        this.weatherEffects = [];
        this.soundEnabled = true;
    }
    
    setupEnhancedLighting() {
        super.setupLighting();
        
        // Add fog for depth
        this.scene.fog = new THREE.Fog(0x87CEEB, 200, 800);
        
        // Add hemisphere light for better ambient lighting
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.3);
        this.scene.add(hemiLight);
        
        // Add point lights for dramatic effect
        this.addDynamicLights();
    }
    
    addDynamicLights() {
        // Create colored lights that change with seasons
        this.seasonLights = [];
        const colors = [0x90EE90, 0xFFD700, 0xFF8C00, 0x87CEEB];
        
        for (let i = 0; i < 4; i++) {
            const light = new THREE.PointLight(colors[i], 0.5, 200);
            light.position.set(
                (Math.random() - 0.5) * 400,
                50,
                (Math.random() - 0.5) * 400
            );
            this.seasonLights.push(light);
            this.scene.add(light);
        }
    }
    
    createEnhancedTerrain() {
        super.createTerrain();
        
        // Add height variation to terrain
        this.addTerrainFeatures();
        
        // Add water features
        this.addWaterFeatures();
        
        // Add more detailed path
        this.enhancePathVisualization();
    }
    
    addTerrainFeatures() {
        // Add hills and valleys
        const hillCount = 8;
        for (let i = 0; i < hillCount; i++) {
            const hill = this.createHill();
            const x = (Math.random() - 0.5) * this.gridWidth * this.gridSize * 0.7;
            const z = (Math.random() - 0.5) * this.gridHeight * this.gridSize * 0.7;
            hill.position.set(x, 0, z);
            this.scene.add(hill);
        }
    }
    
    createHill() {
        const geometry = new THREE.SphereGeometry(30, 16, 8);
        geometry.scale(1, 0.3, 1); // Flatten to make hill-like
        const material = new THREE.MeshLambertMaterial({ 
            color: this.getSeasonalColor(),
            transparent: true,
            opacity: 0.8
        });
        const hill = new THREE.Mesh(geometry, material);
        hill.receiveShadow = true;
        return hill;
    }
    
    addWaterFeatures() {
        // Add a small pond
        const pondGeometry = new THREE.CircleGeometry(40, 32);
        const pondMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x4169E1,
            transparent: true,
            opacity: 0.7
        });
        const pond = new THREE.Mesh(pondGeometry, pondMaterial);
        pond.rotation.x = -Math.PI / 2;
        pond.position.set(200, 0.5, -200);
        this.scene.add(pond);
        
        // Add animated water ripples
        this.animateWater(pond);
    }
    
    animateWater(waterMesh) {
        const startTime = Date.now();
        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            waterMesh.material.opacity = 0.7 + Math.sin(elapsed * 2) * 0.1;
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    enhancePathVisualization() {
        // Remove old path line
        const oldPath = this.scene.children.find(child => child.type === 'Line');
        if (oldPath) this.scene.remove(oldPath);
        
        // Create enhanced path with markers
        this.createPathMarkers();
        this.createPathGlow();
    }
    
    createPathMarkers() {
        for (let i = 0; i < this.enemyPath.length; i += 3) {
            const marker = new THREE.Mesh(
                new THREE.CylinderGeometry(2, 2, 8),
                new THREE.MeshLambertMaterial({ color: 0xFFFFFF })
            );
            marker.position.copy(this.enemyPath[i]);
            marker.position.y = 4;
            marker.castShadow = true;
            this.scene.add(marker);
        }
    }
    
    createPathGlow() {
        const pathGeometry = new THREE.BufferGeometry().setFromPoints(this.enemyPath);
        const pathMaterial = new THREE.LineBasicMaterial({ 
            color: 0x00FFFF,
            linewidth: 5,
            transparent: true,
            opacity: 0.6
        });
        const pathLine = new THREE.Line(pathGeometry, pathMaterial);
        pathLine.position.y = 2;
        this.scene.add(pathLine);
        
        // Animate path glow
        this.animatePathGlow(pathLine);
    }
    
    animatePathGlow(pathLine) {
        const startTime = Date.now();
        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            pathLine.material.opacity = 0.6 + Math.sin(elapsed * 3) * 0.2;
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    createEnhancedTower(type, gridX, gridZ) {
        const tower = super.createTower(type, gridX, gridZ);
        
        // Add enhanced visual details
        this.addTowerDetails(tower, type);
        
        // Add construction effect
        this.playConstructionEffect(tower.position);
        
        return tower;
    }
    
    addTowerDetails(tower, type) {
        const towerData = this.towerTypes[type];
        
        // Add glowing elements based on tower type
        const glowGeometry = new THREE.SphereGeometry(3);
        const glowMaterial = new THREE.MeshBasicMaterial({ 
            color: towerData.color,
            transparent: true,
            opacity: 0.8
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.y = 40;
        tower.add(glow);
        
        // Animate glow
        this.animateTowerGlow(glow);
        
        // Add type-specific details for all 15 tower types
        switch(type) {
            case 1: // Basic tower
                this.addBasicDetails(tower);
                break;
            case 2: // Laser tower
                this.addLaserDetails(tower);
                break;
            case 3: // Missile tower
                this.addMissileDetails(tower);
                break;
            case 4: // Lightning tower
                this.addLightningDetails(tower);
                break;
            case 5: // Ice tower
                this.addIceDetails(tower);
                break;
            case 6: // Plasma tower
                this.addPlasmaDetails(tower);
                break;
            case 7: // Tesla tower
                this.addTeslaDetails(tower);
                break;
            case 8: // Cannon tower
                this.addCannonDetails(tower);
                break;
            case 9: // Poison tower
                this.addPoisonDetails(tower);
                break;
            case 10: // Sniper tower
                this.addSniperDetails(tower);
                break;
            case 11: // Flame tower
                this.addFlameDetails(tower);
                break;
            case 12: // Gravity tower
                this.addGravityDetails(tower);
                break;
            case 13: // Shield tower
                this.addShieldDetails(tower);
                break;
            case 14: // Quantum tower
                this.addQuantumDetails(tower);
                break;
            case 15: // Nuclear tower
                this.addNuclearDetails(tower);
                break;
        }
    }
    
    addBasicDetails(tower) {
        // Simple antenna
        const antennaGeometry = new THREE.CylinderGeometry(0.5, 0.5, 10);
        const antennaMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });
        const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
        antenna.position.y = 45;
        tower.add(antenna);
    }
    
    addPlasmaDetails(tower) {
        // Plasma orb
        const orbGeometry = new THREE.SphereGeometry(4);
        const orbMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xFF00FF,
            transparent: true,
            opacity: 0.8
        });
        const orb = new THREE.Mesh(orbGeometry, orbMaterial);
        orb.position.y = 42;
        tower.add(orb);
        
        // Animate plasma orb
        this.animatePlasmaOrb(orb);
    }
    
    addTeslaDetails(tower) {
        // Tesla coils
        for (let i = 0; i < 4; i++) {
            const coilGeometry = new THREE.CylinderGeometry(1, 1, 12);
            const coilMaterial = new THREE.MeshLambertMaterial({ color: 0x00FFFF });
            const coil = new THREE.Mesh(coilGeometry, coilMaterial);
            const angle = (i / 4) * Math.PI * 2;
            coil.position.set(Math.cos(angle) * 10, 42, Math.sin(angle) * 10);
            tower.add(coil);
        }
        
        // Add electrical effects
        this.addElectricalEffects(tower);
    }
    
    addCannonDetails(tower) {
        // Large cannon barrel
        const barrelGeometry = new THREE.CylinderGeometry(3, 4, 20);
        const barrelMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
        const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
        barrel.position.set(0, 35, 12);
        barrel.rotation.x = Math.PI / 2;
        tower.add(barrel);
    }
    
    addPoisonDetails(tower) {
        // Poison tanks
        for (let i = 0; i < 3; i++) {
            const tankGeometry = new THREE.CylinderGeometry(2, 2, 8);
            const tankMaterial = new THREE.MeshLambertMaterial({ color: 0x9ACD32 });
            const tank = new THREE.Mesh(tankGeometry, tankMaterial);
            const angle = (i / 3) * Math.PI * 2;
            tank.position.set(Math.cos(angle) * 8, 38, Math.sin(angle) * 8);
            tower.add(tank);
        }
        
        // Add poison mist effect
        this.addPoisonMist(tower);
    }
    
    addSniperDetails(tower) {
        // Long rifle barrel
        const rifleGeometry = new THREE.CylinderGeometry(1, 1, 25);
        const rifleMaterial = new THREE.MeshLambertMaterial({ color: 0x2F4F4F });
        const rifle = new THREE.Mesh(rifleGeometry, rifleMaterial);
        rifle.position.set(0, 40, 15);
        rifle.rotation.x = Math.PI / 2;
        tower.add(rifle);
        
        // Scope
        const scopeGeometry = new THREE.CylinderGeometry(1.5, 1.5, 8);
        const scopeMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
        const scope = new THREE.Mesh(scopeGeometry, scopeMaterial);
        scope.position.set(0, 45, 8);
        scope.rotation.x = Math.PI / 2;
        tower.add(scope);
    }
    
    addFlameDetails(tower) {
        // Flame nozzles
        for (let i = 0; i < 6; i++) {
            const nozzleGeometry = new THREE.CylinderGeometry(0.8, 1.2, 6);
            const nozzleMaterial = new THREE.MeshLambertMaterial({ color: 0xFF4500 });
            const nozzle = new THREE.Mesh(nozzleGeometry, nozzleMaterial);
            const angle = (i / 6) * Math.PI * 2;
            nozzle.position.set(Math.cos(angle) * 12, 38, Math.sin(angle) * 12);
            tower.add(nozzle);
        }
        
        // Add flame effects
        this.addFlameEffects(tower);
    }
    
    addGravityDetails(tower) {
        // Gravity rings
        for (let i = 0; i < 3; i++) {
            const ringGeometry = new THREE.RingGeometry(8 + i * 4, 10 + i * 4, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x800080,
                transparent: true,
                opacity: 0.6,
                side: THREE.DoubleSide
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.position.y = 35 + i * 5;
            ring.rotation.x = Math.PI / 2;
            tower.add(ring);
            
            // Animate gravity rings
            this.animateGravityRing(ring, i);
        }
    }
    
    addShieldDetails(tower) {
        // Shield generator
        const generatorGeometry = new THREE.OctahedronGeometry(6);
        const generatorMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xFFD700,
            transparent: true,
            opacity: 0.8
        });
        const generator = new THREE.Mesh(generatorGeometry, generatorMaterial);
        generator.position.y = 42;
        tower.add(generator);
        
        // Animate shield generator
        this.animateShieldGenerator(generator);
    }
    
    addQuantumDetails(tower) {
        // Quantum core
        const coreGeometry = new THREE.IcosahedronGeometry(5);
        const coreMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00FF00,
            transparent: true,
            opacity: 0.9
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        core.position.y = 42;
        tower.add(core);
        
        // Quantum particles
        this.addQuantumParticles(tower);
    }
    
    addNuclearDetails(tower) {
        // Nuclear reactor core
        const reactorGeometry = new THREE.SphereGeometry(8);
        const reactorMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xFF6347,
            transparent: true,
            opacity: 0.7
        });
        const reactor = new THREE.Mesh(reactorGeometry, reactorMaterial);
        reactor.position.y = 42;
        tower.add(reactor);
        
        // Cooling rods
        for (let i = 0; i < 8; i++) {
            const rodGeometry = new THREE.CylinderGeometry(0.5, 0.5, 15);
            const rodMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });
            const rod = new THREE.Mesh(rodGeometry, rodMaterial);
            const angle = (i / 8) * Math.PI * 2;
            rod.position.set(Math.cos(angle) * 12, 42, Math.sin(angle) * 12);
            tower.add(rod);
        }
        
        // Add radiation effects
        this.addRadiationEffects(tower);
    }
    
    // Animation methods for new tower types
    animatePlasmaOrb(orb) {
        const startTime = Date.now();
        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            orb.material.opacity = 0.8 + Math.sin(elapsed * 6) * 0.2;
            orb.rotation.y += 0.05;
            orb.scale.setScalar(1 + Math.sin(elapsed * 4) * 0.1);
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    addPoisonMist(tower) {
        const mistCount = 20;
        for (let i = 0; i < mistCount; i++) {
            const mist = new THREE.Mesh(
                new THREE.SphereGeometry(1),
                new THREE.MeshBasicMaterial({ 
                    color: 0x9ACD32,
                    transparent: true,
                    opacity: 0.3
                })
            );
            mist.position.set(
                (Math.random() - 0.5) * 30,
                30 + Math.random() * 20,
                (Math.random() - 0.5) * 30
            );
            tower.add(mist);
            
            this.animatePoisonMist(mist);
        }
    }
    
    animatePoisonMist(mist) {
        const animate = () => {
            mist.position.y += 0.1;
            mist.rotation.y += 0.02;
            if (mist.position.y > 60) {
                mist.position.y = 30;
            }
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    addFlameEffects(tower) {
        const flameCount = 15;
        for (let i = 0; i < flameCount; i++) {
            const flame = new THREE.Mesh(
                new THREE.SphereGeometry(0.5),
                new THREE.MeshBasicMaterial({ 
                    color: Math.random() > 0.5 ? 0xFF4500 : 0xFF8C00,
                    transparent: true,
                    opacity: 0.8
                })
            );
            flame.position.set(
                (Math.random() - 0.5) * 25,
                35 + Math.random() * 15,
                (Math.random() - 0.5) * 25
            );
            tower.add(flame);
            
            this.animateFlame(flame);
        }
    }
    
    animateFlame(flame) {
        const animate = () => {
            flame.position.y += 0.2;
            flame.material.opacity -= 0.01;
            if (flame.material.opacity <= 0) {
                flame.position.y = 35;
                flame.material.opacity = 0.8;
            }
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    animateGravityRing(ring, index) {
        const animate = () => {
            ring.rotation.z += 0.02 * (index + 1);
            ring.material.opacity = 0.6 + Math.sin(Date.now() * 0.003 + index) * 0.2;
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    animateShieldGenerator(generator) {
        const animate = () => {
            generator.rotation.x += 0.03;
            generator.rotation.y += 0.02;
            generator.material.opacity = 0.8 + Math.sin(Date.now() * 0.005) * 0.2;
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    addQuantumParticles(tower) {
        const particleCount = 30;
        for (let i = 0; i < particleCount; i++) {
            const particle = new THREE.Mesh(
                new THREE.SphereGeometry(0.3),
                new THREE.MeshBasicMaterial({ 
                    color: 0x00FF00,
                    transparent: true,
                    opacity: 0.9
                })
            );
            const radius = 15 + Math.random() * 10;
            const angle = Math.random() * Math.PI * 2;
            particle.position.set(
                Math.cos(angle) * radius,
                42 + (Math.random() - 0.5) * 10,
                Math.sin(angle) * radius
            );
            tower.add(particle);
            
            this.animateQuantumParticle(particle, angle, radius);
        }
    }
    
    animateQuantumParticle(particle, initialAngle, radius) {
        let angle = initialAngle;
        const animate = () => {
            angle += 0.05;
            particle.position.x = Math.cos(angle) * radius;
            particle.position.z = Math.sin(angle) * radius;
            particle.material.opacity = 0.9 + Math.sin(angle * 3) * 0.1;
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    addRadiationEffects(tower) {
        const radiationCount = 25;
        for (let i = 0; i < radiationCount; i++) {
            const radiation = new THREE.Mesh(
                new THREE.SphereGeometry(0.8),
                new THREE.MeshBasicMaterial({ 
                    color: 0xFF6347,
                    transparent: true,
                    opacity: 0.4
                })
            );
            radiation.position.set(
                (Math.random() - 0.5) * 40,
                30 + Math.random() * 25,
                (Math.random() - 0.5) * 40
            );
            tower.add(radiation);
            
            this.animateRadiation(radiation);
        }
    }
    
    animateRadiation(radiation) {
        const animate = () => {
            radiation.scale.multiplyScalar(1.002);
            radiation.material.opacity -= 0.002;
            if (radiation.material.opacity <= 0) {
                radiation.scale.setScalar(1);
                radiation.material.opacity = 0.4;
            }
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    addLaserDetails(tower) {
        // Add laser emitter
        const emitterGeometry = new THREE.CylinderGeometry(1, 1, 5);
        const emitterMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
        const emitter = new THREE.Mesh(emitterGeometry, emitterMaterial);
        emitter.position.set(0, 42, 0);
        tower.add(emitter);
    }
    
    addMissileDetails(tower) {
        // Add missile pods
        for (let i = 0; i < 4; i++) {
            const podGeometry = new THREE.CylinderGeometry(1.5, 1.5, 8);
            const podMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
            const pod = new THREE.Mesh(podGeometry, podMaterial);
            const angle = (i / 4) * Math.PI * 2;
            pod.position.set(Math.cos(angle) * 8, 38, Math.sin(angle) * 8);
            tower.add(pod);
        }
    }
    
    addLightningDetails(tower) {
        // Add lightning rod
        const rodGeometry = new THREE.CylinderGeometry(0.5, 0.5, 15);
        const rodMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD700 });
        const rod = new THREE.Mesh(rodGeometry, rodMaterial);
        rod.position.y = 47;
        tower.add(rod);
        
        // Add electrical effects
        this.addElectricalEffects(tower);
    }
    
    addIceDetails(tower) {
        // Add ice crystals
        for (let i = 0; i < 6; i++) {
            const crystalGeometry = new THREE.OctahedronGeometry(2);
            const crystalMaterial = new THREE.MeshLambertMaterial({ 
                color: 0x87CEEB,
                transparent: true,
                opacity: 0.8
            });
            const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
            const angle = (i / 6) * Math.PI * 2;
            crystal.position.set(Math.cos(angle) * 12, 35, Math.sin(angle) * 12);
            crystal.rotation.set(Math.random(), Math.random(), Math.random());
            tower.add(crystal);
        }
    }
    
    addElectricalEffects(tower) {
        // Create electrical arcs around lightning tower
        const arcCount = 5;
        for (let i = 0; i < arcCount; i++) {
            const points = [];
            const segments = 10;
            for (let j = 0; j <= segments; j++) {
                const t = j / segments;
                const x = (Math.random() - 0.5) * 20;
                const y = 30 + t * 20 + (Math.random() - 0.5) * 5;
                const z = (Math.random() - 0.5) * 20;
                points.push(new THREE.Vector3(x, y, z));
            }
            
            const arcGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const arcMaterial = new THREE.LineBasicMaterial({ 
                color: 0xFFFFFF,
                transparent: true,
                opacity: 0.7
            });
            const arc = new THREE.Line(arcGeometry, arcMaterial);
            tower.add(arc);
            
            // Animate electrical arcs
            this.animateElectricalArc(arc);
        }
    }
    
    animateTowerGlow(glow) {
        const startTime = Date.now();
        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            glow.material.opacity = 0.8 + Math.sin(elapsed * 4) * 0.2;
            glow.rotation.y += 0.02;
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    animateElectricalArc(arc) {
        const startTime = Date.now();
        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            arc.material.opacity = 0.7 + Math.sin(elapsed * 8) * 0.3;
            if (Math.random() < 0.1) {
                arc.visible = !arc.visible;
            }
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    playConstructionEffect(position) {
        // Create construction particles
        for (let i = 0; i < 20; i++) {
            const particle = new THREE.Mesh(
                new THREE.SphereGeometry(1),
                new THREE.MeshBasicMaterial({ color: 0xFFD700 })
            );
            particle.position.copy(position);
            particle.position.add(new THREE.Vector3(
                (Math.random() - 0.5) * 40,
                Math.random() * 40,
                (Math.random() - 0.5) * 40
            ));
            
            this.scene.add(particle);
            
            // Animate construction particles
            this.animateConstructionParticle(particle);
        }
    }
    
    animateConstructionParticle(particle) {
        const startTime = Date.now();
        const initialY = particle.position.y;
        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            if (elapsed < 2) {
                particle.position.y = initialY + Math.sin(elapsed * 3) * 10;
                particle.material.opacity = 1 - elapsed / 2;
                particle.scale.setScalar(1 + elapsed);
                requestAnimationFrame(animate);
            } else {
                this.scene.remove(particle);
            }
        };
        animate();
    }
    
    createWeatherEffects() {
        switch(this.currentSeason) {
            case 0: // Spring - Rain
                this.createRainEffect();
                break;
            case 1: // Summer - Heat shimmer
                this.createHeatShimmer();
                break;
            case 2: // Autumn - Falling leaves
                this.createFallingLeaves();
                break;
            case 3: // Winter - Snow
                this.createSnowEffect();
                break;
        }
    }
    
    createRainEffect() {
        const rainCount = 1000;
        const rainGeometry = new THREE.BufferGeometry();
        const rainPositions = new Float32Array(rainCount * 3);
        
        for (let i = 0; i < rainCount; i++) {
            rainPositions[i * 3] = (Math.random() - 0.5) * 1000;
            rainPositions[i * 3 + 1] = Math.random() * 500;
            rainPositions[i * 3 + 2] = (Math.random() - 0.5) * 1000;
        }
        
        rainGeometry.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
        
        const rainMaterial = new THREE.PointsMaterial({
            color: 0x87CEEB,
            size: 2,
            transparent: true,
            opacity: 0.6
        });
        
        const rain = new THREE.Points(rainGeometry, rainMaterial);
        this.scene.add(rain);
        this.weatherEffects.push(rain);
        
        // Animate rain
        this.animateRain(rain);
    }
    
    animateRain(rain) {
        const animate = () => {
            const positions = rain.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] -= 5; // Fall down
                if (positions[i + 1] < 0) {
                    positions[i + 1] = 500; // Reset to top
                }
            }
            rain.geometry.attributes.position.needsUpdate = true;
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    createSnowEffect() {
        const snowCount = 500;
        const snowGeometry = new THREE.BufferGeometry();
        const snowPositions = new Float32Array(snowCount * 3);
        
        for (let i = 0; i < snowCount; i++) {
            snowPositions[i * 3] = (Math.random() - 0.5) * 1000;
            snowPositions[i * 3 + 1] = Math.random() * 500;
            snowPositions[i * 3 + 2] = (Math.random() - 0.5) * 1000;
        }
        
        snowGeometry.setAttribute('position', new THREE.BufferAttribute(snowPositions, 3));
        
        const snowMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 3,
            transparent: true,
            opacity: 0.8
        });
        
        const snow = new THREE.Points(snowGeometry, snowMaterial);
        this.scene.add(snow);
        this.weatherEffects.push(snow);
        
        // Animate snow
        this.animateSnow(snow);
    }
    
    animateSnow(snow) {
        const animate = () => {
            const positions = snow.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] -= 1; // Fall slowly
                positions[i] += Math.sin(Date.now() * 0.001 + i) * 0.1; // Drift
                if (positions[i + 1] < 0) {
                    positions[i + 1] = 500;
                }
            }
            snow.geometry.attributes.position.needsUpdate = true;
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    createFallingLeaves() {
        const leafCount = 200;
        for (let i = 0; i < leafCount; i++) {
            const leaf = new THREE.Mesh(
                new THREE.PlaneGeometry(3, 2),
                new THREE.MeshLambertMaterial({ 
                    color: Math.random() > 0.5 ? 0xFF8C00 : 0xFFD700,
                    transparent: true,
                    opacity: 0.8,
                    side: THREE.DoubleSide
                })
            );
            
            leaf.position.set(
                (Math.random() - 0.5) * 1000,
                Math.random() * 300 + 200,
                (Math.random() - 0.5) * 1000
            );
            
            this.scene.add(leaf);
            this.weatherEffects.push(leaf);
            
            // Animate falling leaf
            this.animateFallingLeaf(leaf);
        }
    }
    
    animateFallingLeaf(leaf) {
        const startTime = Date.now();
        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            leaf.position.y -= 0.5;
            leaf.position.x += Math.sin(elapsed * 2) * 0.5;
            leaf.rotation.z += 0.02;
            
            if (leaf.position.y < 0) {
                leaf.position.y = 500;
                leaf.position.x = (Math.random() - 0.5) * 1000;
                leaf.position.z = (Math.random() - 0.5) * 1000;
            }
            
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    clearWeatherEffects() {
        for (let effect of this.weatherEffects) {
            this.scene.remove(effect);
        }
        this.weatherEffects = [];
    }
    
    updateSeasonalEffects() {
        super.updateSeasonalEffects();
        
        // Clear old weather effects
        this.clearWeatherEffects();
        
        // Create new weather effects
        this.createWeatherEffects();
        
        // Update seasonal lights
        if (this.seasonLights) {
            const colors = [0x90EE90, 0xFFD700, 0xFF8C00, 0x87CEEB];
            this.seasonLights.forEach((light, index) => {
                light.color.setHex(colors[this.currentSeason]);
            });
        }
    }
}

// Override the original game class
window.TowerDefenseGame = EnhancedTowerDefenseGame;


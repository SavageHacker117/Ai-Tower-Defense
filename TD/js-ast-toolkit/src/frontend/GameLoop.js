// Game Loop System
export class GameLoop {
  constructor({
    updateCallback,
    renderCallback,
    notificationManager
  }) {
    console.log("Calling method: constructor");
    // Use dependency injection instead of passing the whole game object
    this.updateCallback = updateCallback;
    this.renderCallback = renderCallback;
    this.notificationManager = notificationManager;
    this.isRunning = false;
    this.lastTime = 0;
    this.deltaTime = 0;
    this.targetFPS = 60;
    this.frameTime = 1000 / this.targetFPS;
    this.accumulator = 0;

    // Performance monitoring
    this.fpsCounter = 0;
    this.fpsTimer = 0;
    this.currentFPS = 0;

    // Animation frame request ID
    this.animationFrameId = null;

    // Bind the loop function
    this.loop = this.loop.bind(this);
  }
  start() {
    console.log("Calling method: start");
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.animationFrameId = requestAnimationFrame(this.loop);
    console.log('Game loop started');
  }
  stop() {
    console.log("Calling method: stop");
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    console.log('Game loop stopped');
  }
  loop(currentTime) {
    console.log("Calling method: loop");
    if (!this.isRunning) return;

    // Calculate delta time
    this.deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Cap delta time to prevent spiral of death
    if (this.deltaTime > 100) {
      this.deltaTime = 100;
    }

    // Update FPS counter
    this.updateFPS(this.deltaTime);

    // Fixed timestep update with accumulator
    this.accumulator += this.deltaTime;
    while (this.accumulator >= this.frameTime) {
      // Update game logic at fixed timestep
      this.update(this.frameTime / 1000); // Convert to seconds
      this.accumulator -= this.frameTime;
    }

    // Render at display refresh rate
    this.render();

    // Schedule next frame
    this.animationFrameId = requestAnimationFrame(this.loop);
  }
  update(deltaTime) {
    console.log("Calling method: update");
    try {
      // Call the injected update function instead of accessing this.game
      if (this.updateCallback) {
        this.updateCallback(deltaTime);
      }
    } catch (error) {
      console.error('Error in game update:', error);
      this.handleError(error);
    }
  }
  render() {
    console.log("Calling method: render");
    try {
      // Call the injected render function instead of accessing this.game
      if (this.renderCallback) {
        this.renderCallback();
      }
    } catch (error) {
      console.error('Error in game render:', error);
      this.handleError(error);
    }
  }
  updateFPS(deltaTime) {
    console.log("Calling method: updateFPS");
    this.fpsCounter++;
    this.fpsTimer += deltaTime;
    if (this.fpsTimer >= 1000) {
      // Update every second
      this.currentFPS = Math.round(this.fpsCounter * 1000 / this.fpsTimer);
      this.fpsCounter = 0;
      this.fpsTimer = 0;

      // Update FPS display if element exists
      const fpsElement = document.getElementById('fps');
      if (fpsElement) {
        fpsElement.textContent = this.currentFPS;
      }

      // Performance warning
      if (this.currentFPS < 30) {
        console.warn(`Low FPS detected: ${this.currentFPS}`);
      }
    }
  }
  handleError(error) {
    console.log("Calling method: handleError");
    console.error('Critical error in game loop:', error);
    this.stop();

    // Show error to user using injected notification manager
    if (this.notificationManager) {
      this.notificationManager.show('Game Error: Please refresh', 5000);
    }
  }

  // Getters
  getCurrentFPS() {
    console.log("Calling method: getCurrentFPS");
    return this.currentFPS;
  }
  getDeltaTime() {
    console.log("Calling method: getDeltaTime");
    return this.deltaTime;
  }
  isGameRunning() {
    console.log("Calling method: isGameRunning");
    return this.isRunning;
  }

  // Pause/Resume functionality
  pause() {
    console.log("Calling method: pause");
    if (this.isRunning) {
      this.stop();
    }
  }
  resume() {
    console.log("Calling method: resume");
    if (!this.isRunning) {
      this.start();
    }
  }

  // Performance optimization methods
  setTargetFPS(fps) {
    console.log("Calling method: setTargetFPS");
    this.targetFPS = Math.max(30, Math.min(120, fps)); // Clamp between 30-120
    this.frameTime = 1000 / this.targetFPS;
    console.log(`Target FPS set to: ${this.targetFPS}`);
  }

  // Debug information
  getDebugInfo() {
    console.log("Calling method: getDebugInfo");
    return {
      isRunning: this.isRunning,
      currentFPS: this.currentFPS,
      targetFPS: this.targetFPS,
      deltaTime: this.deltaTime,
      accumulator: this.accumulator
    };
  }
}
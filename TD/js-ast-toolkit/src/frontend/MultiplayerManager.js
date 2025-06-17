/**
 * MultiplayerManager.js
 * Manages multiplayer game coordination by communicating with the Socket.IO server.
 */

export class MultiplayerManager {
  constructor({
    authManager,
    notificationManager,
    eventBus,
    socket
  }) {
    console.log("Calling method: constructor");
    // Injected dependencies
    this.authManager = authManager;
    this.notificationManager = notificationManager;
    this.eventBus = eventBus; // For internal communication between JS modules
    this.socket = socket; // The actual Socket.IO client instance

    this.isHost = false;
    this.isConnected = false;
    this.gameRoom = null;
    this.players = new Map(); // playerId -> playerData

    if (this.socket) {
      this.setupSocketListeners();
    } else {
      console.error("MultiplayerManager initialized without a socket connection!");
    }
  }

  /**
   * Sets up listeners for events coming from the server.
   */
  setupSocketListeners() {
    console.log("Calling method: setupSocketListeners");
    this.socket.on('connect', function () {
      this.isConnected = true;
      this.notificationManager.showSuccess('Connected to server!');
    });
    this.socket.on('disconnect', function () {
      this.isConnected = false;
      this.notificationManager.showError('Disconnected from server.');
    });

    // This is a generic response listener you had in events.py
    this.socket.on('response', function (data) {
      console.log('Server says:', data.data);
    });

    // Listen for when another player places a tower
    this.socket.on('tower_placed', function (data) {
      if (data.sid !== this.socket.id) {
        // Don't re-render our own tower
        this.notificationManager.showInfo(`Another player built a ${data.type} tower!`);
        // Use the event bus to tell the main game to render this tower
        this.eventBus.triggerEvent('remoteTowerPlaced', data);
      }
    });

    // Add other listeners for events like 'playerJoined', 'gameStarted', etc. here
  }

  /**
   * Sends a request to the server to build a tower.
   * This will be broadcast to other players.
   * @param {string} towerType 
   * @param {object} position - { x, y, z }
   */
  syncTowerPlacement(towerType, position) {
    console.log("Calling method: syncTowerPlacement");
    if (!this.isConnected) return;
    const payload = {
      type: towerType,
      position: {
        x: position.x,
        y: position.y,
        z: position.z
      },
      sid: this.socket.id // Include our session ID
    };
    this.socket.emit('build_tower_request', payload);
  }

  // --- Other Multiplayer Methods ---

  /**
   * Create a new multiplayer game room.
   * In a full implementation, this would also emit an event to the server.
   * @param {Object} roomConfig 
   */
  async createRoom(roomConfig = {}) {
    console.log("Calling method: createRoom");
    if (!this.authManager.isLoggedIn) {
      this.notificationManager.showError('Must be logged in to create a room.');
      return;
    }
    // Example: this.socket.emit('create_room', roomConfig);
    this.notificationManager.showInfo('Creating multiplayer room...');
  }

  /**
   * Join an existing multiplayer game room.
   * @param {string} roomId 
   */
  async joinRoom(roomId) {
    console.log("Calling method: joinRoom");
    if (!this.authManager.isLoggedIn) {
      this.notificationManager.showError('Must be logged in to join a room.');
      return;
    }
    // Example: this.socket.emit('join_room', { roomId });
    this.notificationManager.showInfo(`Joining room ${roomId}...`);
  }

  /**
   * Send a chat message to other players.
   * @param {string} message 
   */
  sendChatMessage(message) {
    console.log("Calling method: sendChatMessage");
    if (!this.isConnected) return;
    // Example: this.socket.emit('chat_message', { message });
  }

  /**
   * Check if connected to multiplayer.
   * @returns {boolean}
   */
  isMultiplayerConnected() {
    console.log("Calling method: isMultiplayerConnected");
    return this.isConnected;
  }
}
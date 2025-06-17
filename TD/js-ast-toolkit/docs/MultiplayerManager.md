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
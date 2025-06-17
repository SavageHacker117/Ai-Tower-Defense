# In app/events.py

from flask_socketio import emit, join_room, leave_room
from flask import request, current_app
from . import socketio, db
from .models import Player, GameState
import jwt

# In-memory dictionary to track connected players.
# For a scalable production app, you might use Redis or another shared store.
connected_players = {}

@socketio.on('connect')
def handle_connect():
    """
    Handles a new client connection.
    Authenticates the user via JWT token provided in the connection query.
    Loads the player's game state and sends it back to the client.
    """
    sid = request.sid
    # The token should be sent by the client during connection.
    # For JS clients, this is often done in the `auth` or `query` option.
    token = request.args.get('token')

    if not token:
        print(f"Connection rejected from {sid}: No token provided.")
        # 'return False' silently rejects the connection.
        # You could also emit an error event before returning.
        return False

    try:
        # Decode the token to get the player_id
        data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
        player_id = data.get('player_id')

        if not player_id:
             print(f"Connection rejected from {sid}: Token is missing player_id.")
             return False

        player = Player.query.get(player_id)

        if not player:
            print(f"Connection rejected from {sid}: Player with id {player_id} not found.")
            return False

        # --- Player Authenticated Successfully ---
        # 1. Associate SID with player_id for this session
        connected_players[sid] = player_id
        print(f'Client connected: {player.username} (SID: {sid})')

        # 2. Add player to a general game room
        join_room('game_room_1')

        # 3. Load the player's game state or create a new one if it doesn't exist
        game_state = GameState.query.filter_by(player_id=player.id).first()
        if not game_state:
            print(f"No saved game for {player.username}, creating a new default state.")
            game_state = GameState(player_id=player.id) # Uses default values from model
            db.session.add(game_state)
            db.session.commit()

        # 4. Emit the loaded game state directly to the connecting client
        # The client will listen for this event to load the stat screen.
        emit('game_state_loaded', game_state.to_dict(), to=sid)
        print(f"Sent game state to {player.username}.")

    except jwt.ExpiredSignatureError:
        print(f"Connection rejected from {sid}: Token has expired.")
        return False
    except jwt.InvalidTokenError:
        print(f"Connection rejected from {sid}: Invalid token provided.")
        return False

@socketio.on('disconnect')
def handle_disconnect():
    """
    Handles a client disconnection.
    Removes the player from our tracking dictionary and the room.
    """
    sid = request.sid
    if sid in connected_players:
        player_id = connected_players.pop(sid) # Remove player from tracking
        player = Player.query.get(player_id)
        username = player.username if player else "Unknown"
        print(f'Client disconnected: {username} (SID: {sid})')
        leave_room('game_room_1', sid)
    else:
        print(f'An anonymous client disconnected: {sid}')

@socketio.on('start_wave_request')
def handle_start_wave(data):
    """
    Handles a client's request to start the next wave.
    In a real game, you would add logic here to check if all players are ready.
    """
    sid = request.sid
    if sid not in connected_players:
        return # Ignore requests from unauthenticated clients

    player_id = connected_players[sid]
    wave_number = data.get('wave_number', 'N/A')
    print(f"Player {player_id} requested to start wave {wave_number}")

    # Broadcast to all clients in the room that the wave is starting
    # The frontend will use this to trigger animations and enemy spawning.
    emit('wave_started', data, to='game_room_1')

@socketio.on('build_tower_request')
def handle_build_tower(data):
    """
    Handles a client's request to build a tower and broadcasts it.
    """
    sid = request.sid
    if sid not in connected_players:
        return # Ignore requests from unauthenticated clients

    # You could add server-side validation here:
    # - Does the player have enough resources?
    # - Is the tower placement valid?
    
    print(f"Received build_tower_request from {connected_players[sid]}: {data}")

    # Broadcast the tower placement to all other clients in the room.
    # The `include_self=False` argument is important so the sender doesn't
    # get their own event back and render the tower twice.
    emit('tower_placed', data, to='game_room_1', include_self=False)
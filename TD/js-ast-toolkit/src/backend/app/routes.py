from flask import Blueprint, jsonify, request, current_app
from . import db
from .models import Player, GameState
from flask_bcrypt import generate_password_hash # Make sure this is imported
import jwt
import datetime

api_bp = Blueprint('api', __name__)

@api_bp.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # More robust check to ensure data and keys exist
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'error': 'Username and password are required'}), 400

    username = data.get('username')
    password = data.get('password')

    # Check if user already exists
    if Player.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400

    # --- THE FIX ---
    # 1. Hash the password first.
    hashed_password = generate_password_hash(password).decode('utf8')
    
    # 2. Create the Player object with all required data at once.
    new_player = Player(
        username=username, 
        password_hash=hashed_password
    )
    # --- END OF FIX ---

    db.session.add(new_player)
    db.session.commit()
    
    return jsonify({'message': 'Player registered successfully'}), 201


@api_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    player = Player.query.filter_by(username=username).first()
    if player and player.check_password(password):
        token = jwt.encode({
            'player_id': player.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, current_app.config['SECRET_KEY'], algorithm="HS256")
        return jsonify({'token': token}), 200
    return jsonify({'error': 'Invalid credentials'}), 401


@api_bp.route('/api/save', methods=['POST'])
def save_game_state():
    data = request.get_json()
    player_id = data.get('player_id')
    if not player_id:
        return jsonify({'error': 'Player ID is required'}), 400
    player = Player.query.get(player_id)
    if not player:
        return jsonify({'error': 'Player not found'}), 404
    game_state = player.game_state
    if not game_state:
        game_state = GameState(player_id=player_id)
    game_state.wave_number = data.get('wave_number', game_state.wave_number)
    game_state.resources = data.get('resources', game_state.resources)
    game_state.player_lives = data.get('player_lives', game_state.player_lives)
    game_state.towers_data = data.get('towers_data', game_state.towers_data)
    db.session.add(game_state)
    db.session.commit()
    return jsonify({'message': f'Game saved for player {player_id}'}), 200


@api_bp.route('/api/load/<int:player_id>', methods=['GET'])
def load_game_state(player_id):
    player = Player.query.get(player_id)
    if not player:
        return jsonify({'error': 'Player not found'}), 404
    game_state = player.game_state
    if not game_state:
        return jsonify({'error': 'No saved game found for this player'}), 404
    return jsonify(game_state.to_dict()), 200
from . import db
from flask_bcrypt import generate_password_hash, check_password_hash
from sqlalchemy.dialects.mysql import JSON

class Player(db.Model):
    __tablename__ = 'player'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    high_score = db.Column(db.Integer, default=0)
    password_hash = db.Column(db.String(128), nullable=False)
    game_state = db.relationship('GameState', backref='player', uselist=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password).decode('utf8')
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class GameState(db.Model):
    __tablename__ = 'game_state'
    id = db.Column(db.Integer, primary_key=True)
    wave_number = db.Column(db.Integer, nullable=False, default=1)
    resources = db.Column(db.Integer, nullable=False, default=100)
    player_lives = db.Column(db.Integer, nullable=False, default=20)
    towers_data = db.Column(JSON)
    player_id = db.Column(db.Integer, db.ForeignKey('player.id'), unique=True, nullable=False)

    def to_dict(self):
        return {
            "wave_number": self.wave_number,
            "resources": self.resources,
            "player_lives": self.player_lives,
            "towers_data": self.towers_data,
            "player_id": self.player_id
        }
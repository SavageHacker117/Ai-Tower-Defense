# In app/__init__.py

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
import os

db = SQLAlchemy()
socketio = SocketIO()

def create_app():
    app = Flask(__name__)
    # It's better to get the secret key from an environment variable as well
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'a_very_secret_key_for_dev_fallback')

    # --- AWS RDS Database Configuration using Environment Variables ---
    db_user = os.environ.get('DB_USER')
    db_password = os.environ.get('DB_PASSWORD')
    db_host = os.environ.get('DB_HOST')
    db_name = os.environ.get('DB_NAME')

    # Check if all required environment variables are set
    if not all([db_user, db_password, db_host, db_name]):
        raise ValueError("One or more database environment variables are not set. Please set DB_USER, DB_PASSWORD, DB_HOST, and DB_NAME.")

    app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+mysqlconnector://{db_user}:{db_password}@{db_host}/{db_name}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    # Allow all origins in development, but you should restrict this in production
    socketio.init_app(app, cors_allowed_origins="*")

    with app.app_context():
        from . import models
        from . import events # Make sure events are imported to register handlers
        from .routes import api_bp
        app.register_blueprint(api_bp)

        # This is okay for development, but for production,
        # you might want to use a migration tool like Flask-Migrate.
        db.create_all()

    return app
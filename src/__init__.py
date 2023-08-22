"""This package implements HTTP server hosted by flask framework.
Return: application launching function.
"""

from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_socketio import SocketIO
import json

# create flask instance with indication path of static files (scr/static)
app = Flask(__name__, static_url_path = '/static')    
# create login manager
login_manager = LoginManager()
# create sqlalchemy instance
db = SQLAlchemy()
# create bcrypt instance
bcrypt = Bcrypt()
# create socketio instance
socketio = SocketIO(app, logger = True)

# import handlers
from src import account, views, models, sockets, solver

def init_app():
    """Initialize application."""
    # create task manager instance
    app.task_manager = solver.TaskManager(4, socketio)
    # load config file
    app.config.from_file('config.json', load = json.load)
    # initiate login manager
    login_manager.init_app(app)
    # initialize sqlalchemy
    db.init_app(app)
    with app.app_context():
        db.create_all()
    # initialte bcypt
    bcrypt.init_app(app)
    # register blueprint
    app.register_blueprint(account.auth)
    
def start_app():
    """Launch application."""
    try:
        init_app()
        socketio.run(app)
    except KeyboardInterrupt:
        app.task_manager.close()
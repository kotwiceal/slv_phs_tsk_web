"""This package implements HTTP server hosted by flask framework.
Return: application launching function.
"""

from flask import Flask
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
import json

# create flask instance with indication path of static files (scr/static)
app = Flask(__name__, static_url_path = '/static')    
# create sqlalchemy DBMS
db = SQLAlchemy()
# create socketio
socketio = SocketIO(app, logger = True)

# import handlers
from src import views, sockets, solver, database

def init_app():
    """Initialize application."""
    # create task manager instance
    app.task_manager = solver.TaskManager(4, socketio)
    # load config file
    app.config.from_file('config.json', load = json.load)
    # initialize sqlalchemy
    db.init_app(app)
    with app.app_context():
        db.create_all()
    
def start_app():
    """Launch application."""
    try:
        init_app()
        socketio.run(app)
    except KeyboardInterrupt:
        app.task_manager.close()
        app.database.close()
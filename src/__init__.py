"""This package implements HTTP server hosted by flask framework.
Return: application launching function.
"""

from flask import Flask
from flask_socketio import SocketIO

# create flask instance with indication path of static files (scr/static)
app = Flask(__name__, static_url_path = '/static')    
# create socketio
socketio = SocketIO(app, logger = True)

# import handlers
from src import views
from src import sockets
from src import solver

def create_app():
    """Launch server."""
    try:
        # create task manager
        app.task_manager = solver.TaskManager(4, socketio)
        socketio.run(app)
    except KeyboardInterrupt:
        app.task_manager.close()
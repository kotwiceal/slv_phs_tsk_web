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
from src import postgres

def init_app():
    """Initialize application."""
    # create DBMS instanse
    app.database = postgres.DBMS()
    # create task manager instance
    app.task_manager = solver.TaskManager(4, socketio, app.database)
    
def start_app():
    """Launch application."""
    try:
        init_app()
        socketio.run(app)
    except KeyboardInterrupt:
        app.task_manager.close()
        app.database.close()
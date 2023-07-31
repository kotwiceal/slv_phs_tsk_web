from src import app, socketio, solver
from flask import request
from flask_socketio import emit

@socketio.on('connect')
def on_connect():
    currentSocketId = request.sid
    print(f'client with id {currentSocketId} connect in global namespace')
    
@socketio.on('disconnect')
def on_disconnect():
    currentSocketId = request.sid
    print(f'client with id {currentSocketId} disconnect in global namespace')
    
@socketio.on('connect', namespace = '/solver')
def ns_on_connect():
    currentSocketId = request.sid
    print(f'client with id {currentSocketId} connect in namespace')
    
@socketio.on('disconnect', namespace = '/solver')
def ns_on_disconnect():
    currentSocketId = request.sid
    print(f'client with id {currentSocketId} disconnect in namespace')
    
@socketio.on('process', namespace = '/solver')
def ns_on_channel():
    """Start solver to process the task."""    
    tasks = [solver.TaskClassicalGravitation(solver.build_problem(), request.sid)]
    app.task_manager.process(tasks)
    
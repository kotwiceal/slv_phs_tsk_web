"""This module provide socketIO imlementation of server-client communication."""

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
    # registrate client by sid
    app.task_manager.registrate_client(currentSocketId)
    print(f'client with id {currentSocketId} connect in namespace')
    
@socketio.on('disconnect', namespace = '/solver')
def ns_on_disconnect():
    currentSocketId = request.sid
    print(f'client with id {currentSocketId} disconnect in namespace')
    
@socketio.on('process', namespace = '/solver')
def ns_on_process(data):
    """Start solver to process tasks."""   
    tasks = []  
    for task in data:
        match task['type']['id']:
            case 'tsk_cgrv':
                tasks.append(solver.TaskClassicalGravitation(problem = solver.build_problem_classical_gravitation(task['problem']), 
                    sid = request.sid, id = task['id']))
    app.task_manager.process(tasks)
    
@socketio.on('postprocess', namespace = '/solver')
def ns_on_postprocess(data):
    """Start solver to postprocess tasks."""
    tasks = []  
    for task in data:
        match task['type']['id']:
            case 'tsk_cgrv':
                tasks.append(solver.TaskClassicalGravitation(sid = request.sid, id = task['id']))
    app.task_manager.postprocess(tasks)
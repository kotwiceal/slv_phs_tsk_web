"""This module implements a server hander functional.
Return: modified flask instance
"""
# load app instance
from src import app, solver

from flask import request
import numpy, dill

@app.route('/')
def index():
    """Assign enter point."""   
    return app.send_static_file('./dist/index.html')

@app.route('/<path:path>')
def route_static_file(path):
    """Route static files located in `static_url_path`"""
    return app.send_static_file('./dist/' + path)

@app.route('/postprocess', methods = ['GET', 'POST'])
def postprocess():
    response = request.get_json()
    try:
        # acquire lock
        app.task_manager.mng_lock.acquire()
        plots = app.task_manager.mng_dkt[response['sid']][response['id']]['plots'].copy()
        animations = app.task_manager.mng_dkt[response['sid']][response['id']]['animations'].copy()
    finally:
        # release lock
        app.task_manager.mng_lock.release()
    return dict(plots = plots, animations = animations)
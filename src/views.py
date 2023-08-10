"""This module implements a server hander functional.
Return: modified flask instance
"""
# load app instance
from src import app

from flask import request

@app.route('/')
def index():
    """Assign enter point."""   
    return app.send_static_file('./dist/index.html')

@app.route('/<path:path>')
def route_static_file(path):
    """Route static files located in `static_url_path`"""
    return app.send_static_file('./dist/' + path)

@app.route('/result', methods = ['GET', 'POST'])
def result():
    response = request.get_json()
    print(response)
    try:
        # acquire lock
        app.task_manager.mng_lock.acquire()
        data = app.task_manager.mng_dkt[response['sid']][response['id']]
    finally:
        # release lock
        app.task_manager.mng_lock.release()
    return data
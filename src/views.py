"""This module implements a server hander functional.
Return: modified flask instance
"""
# load app instance
from src import app

@app.route('/')
def index():
    """Assign enter point."""   
    return app.send_static_file('./dist/index.html')

@app.route('/<path:path>')
def route_static_file(path):
    """Route static files located in `static_url_path`"""
    return app.send_static_file('./dist/' + path)
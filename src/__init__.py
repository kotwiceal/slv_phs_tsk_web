"""This package implements HTTP server hosted by flask framework.
Return: application launching function.
"""

from flask import Flask

# create flask instance with indication path of static files (scr/static)
app = Flask(__name__, static_url_path = '/static')    

# import handlers
from src import views

def create_app():
    """Launch server."""
    app.run(debug = True)
"""Pre-initialization module."""

import pytest
from src import app, db, models, socketio, init_app, solver
from flask_login import FlaskLoginClient
from flask_socketio import SocketIOTestClient
import numpy as np

# initialize application
init_app()

@pytest.fixture(scope = 'module')
def app_t():
    app.test_client_class = FlaskLoginClient
    return app
    
@pytest.fixture(scope = 'module')
def app_client():
    yield app.test_client()
    
@pytest.fixture(scope = 'module')
def socketio_client():
    yield SocketIOTestClient(app, socketio, namespace = '/solver')
    
@pytest.fixture(scope = 'module')
def task_clsgrv_2d():
    """Create 2D problem of classical gravitation task."""
    tasks = [
        dict(id = 'ca499813037e8c4b37f4d1465ace2930', type = dict(id = 'tsk_cgrv', label = 'Classical gravitation'),
            problem = dict(dimension = 2, initial = [
                    dict(r = [-2, 0], dr = [0, 0], m = 1),
                    dict(r = [2, 2], dr = [0, 0], m = 1),
                    dict(r = [1, -2], dr = [0, 0], m = 2),
                ],
                physics = dict(g = 1, t = [0, 100, 10000])
            )
        )
    ]
    return tasks
    
@pytest.fixture(scope = 'module')
def task_clsgrv_3d():
    """Create 3D problem of classical gravitation task."""
    tasks = [
        dict(id = '2e3a2eec38a8478111fe35bfa026ce28', type = dict(id = 'tsk_cgrv', label = 'Classical gravitation'),
            problem = dict(dimension = 3, initial = [
                    dict(r = [-2, 0, 0], dr = [0, 0, 0], m = 1),
                    dict(r = [2, 2, -2], dr = [0, 0, 0], m = 1),
                    dict(r = [1, -2, 1], dr = [0, 0, 0], m = 2),
                ]
            )
        )
    ]
    return tasks
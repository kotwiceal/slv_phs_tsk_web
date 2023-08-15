"""Pre-initialization module."""

import pytest
from src import app, socketio, init_app, solver, postgres
from flask_socketio import SocketIOTestClient
import numpy as np

# initialize application
init_app()

@pytest.fixture(scope = 'module')
def dbms():
    """Capture dbms instance."""
    dbms = postgres.DBMS()
    yield dbms
    dbms.close()
    
@pytest.fixture(scope = 'module')
def table():
    """Capture test data."""
    table_name = 'task_clsgrv'
    attributes = dict(task_id = 'VARCHAR(255) PRIMARY KEY', t = 'FLOAT[]', r = 'FLOAT[][][]', dr = 'FLOAT[][][]')
    data = dict(task_id = '#a1', t = np.random.rand(10).tolist(), r = np.random.rand(10, 3, 2).tolist(), 
        dr = np.random.rand(10, 3, 2).tolist())
    return table_name, attributes, data

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
        dict(id = '7b8e6b9da38ae0037a7a1f7dbcd29ea9', type = dict(id = 'tsk_cgrv', label = 'Classical gravitation'),
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
            problem = dict(dimension = 2, initial = [
                    dict(r = [-2, 0, 0], dr = [0, 0, 0], m = 1),
                    dict(r = [2, 2, -2], dr = [0, 0, 0], m = 1),
                    dict(r = [1, -2, 1], dr = [0, 0, 0], m = 2),
                ]
            )
        )
    ]
    return tasks
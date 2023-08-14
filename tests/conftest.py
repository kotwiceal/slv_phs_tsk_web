"""Pre-initialization module."""

import pytest
from src import postgres
import numpy as np

@pytest.fixture(scope = 'module')
def dbms_t():
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
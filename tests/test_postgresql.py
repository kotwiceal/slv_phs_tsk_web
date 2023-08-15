"""Thesing module of database manager sysmtem."""

import time

def test_table_methods(dbms, table):
    """Test auto-build SQL queries."""
    # create test data
    table_name, attributes, data = table  

    # create test table
    dbms.create(table_name = table_name, attributes = attributes)
    # insert data
    dbms.insert(table_name = table_name, data = data)
    # query data
    result = dbms.select(table_name = table_name)
    # check returned data with original
    assert result[0] == tuple([value for _, value in data.items()])
    
def test_build_schema(dbms):
    """Test building of data schema."""
    # build database schema
    dbms._build_schema()
    # generate test data to task
    task = dict(task_id = '7b8e6b9da38ae0037a7a1f7dbcd29ea9', t = [0, 1, 2, 3], 
        r = [[[1, 2], [1, 2]], [[3, 4], [3, 4]], [[5, 6], [5, 6]]], dr = [[[1, 2], [1, 2]], [[3, 4], [3, 4]], [[5, 6], [5, 6]]])
    # insert test data to task table
    dbms.insert(table_name = 'task_clsgrv', data = task)
    # query data
    result = dbms.select(table_name = 'task_clsgrv')
    # check returned data with original
    assert result[0] == tuple([value for _, value in task.items()])
    
    # generate test data to worker
    worker = dict(worker_id = task['task_id'], name = 'SpawnProcess-1', pid = 1000, time = 1.15)
    dbms.insert(table_name = 'worker', data = worker)
    # query data
    result = dbms.select(table_name = 'worker')
    # check returned data with original
    assert result[0] == tuple([value for _, value in worker.items()])
    
def test_task_fullsession(app_client, socketio_client, task_clsgrv_2d, dbms):
    """Test session: process, data storing, postprocessing."""
    # build database schema
    dbms._build_schema()
    
    # specify namespace
    namespace = '/solver'
        
    # check client is connected at socketio_client initialization
    assert socketio_client.is_connected(namespace) == True

    # process task
    socketio_client.emit('process', task_clsgrv_2d, **dict(namespace = namespace, callback = True))
    
    # wait resutl from worker (subprocess), simple synchronization
    while True:
        time.sleep(1)
        result = socketio_client.get_received(namespace = namespace)
        if result:
            break
        
    # check event function name
    assert result[0]['name'] == 'process'
    # check id task of returned worker result
    assert result[0]['args'][0]['id'] == task_clsgrv_2d[0]['id']
    
    # postprocess task
    socketio_client.emit('postprocess', task_clsgrv_2d, **dict(namespace = namespace, callback = True))
    
    # wait resutl from worker (subprocess), simple synchronization
    while True:
        time.sleep(1)
        result = socketio_client.get_received(namespace = namespace)
        if result:
            break
       
    # check event function name
    assert result[0]['name'] == 'postprocess'
    # check id task of returned worker result
    assert result[0]['args'][0]['id'] == task_clsgrv_2d[0]['id']
        
    request = dict(id = result[0]['args'][0]['id'], sid = result[0]['args'][0]['sid'])
        
    responce = app_client.post('/postprocess', json = request)
    
    assert responce.status_code == 200
    
    
    
"""Thesing module of database manager system."""

import time
    
def test_task_fullsession(app_client, socketio_client, task_clsgrv_2d):
    """Test session: process, data storing, postprocessing."""
    
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
    
    
    
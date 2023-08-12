"This module provides implementation of parallel execution solving tasks."
import multiprocessing, time, json
import numpy as np
from scipy.integrate import odeint
import plotly.graph_objects as go
from flask_socketio import join_room, leave_room, send, emit, Namespace

class NumpyEncoder(json.JSONEncoder):
    """Class to serialize ndarray object."""
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)

def worker_watcher(mng_dkt, mng_lock):
    """Parametrize decorator in order to watch parallelized worker state and store results at calculation of task."""
    def decorator(function):
        def wrapper(*args, **kwargs):
            time_start = time.time()
            result = function(*args, **kwargs)
            time_end = time.time()
            result['worker'] = dict(pid = multiprocessing.current_process().pid, 
                name = multiprocessing.current_process().name, 
                time = time_end - time_start)
            try:
                # acquire lock
                mng_lock.acquire()
                mng_dkt[result['sid']] |= {result['id']: result}
            finally:
                # release lock
                mng_lock.release()
        return wrapper
    return decorator

class TaskClassicalGravitation:
    """Numerical solving the cauchy problem of classical gravitation."""
    _valid_attr = ['problem', 'sid', 'id']
    def __init__(self, **kwargs) -> None:
        [setattr(self, key, kwargs.get(key, None)) for key in kwargs.keys() if key in self._valid_attr]
        self.status = False
    
    # @worker_info
    def solve(self) -> dict:
        """Solve task."""
        try:
            # assemble parameters
            parameters = tuple(list(self.problem['m'])) + (self.problem['g'], self.problem['order'],
                self.problem['dimension'])
            solution = odeint(self.system_equations, self.problem['initial'], self.problem['mesh'], args = parameters)
            # extract solution
            shape = (-1, self.problem['order'], self.problem['dimension']) # shape = (time, order, dimension)
            self.r = solution[:, ::2].reshape(shape)
            self.dr = solution[:, 1::2].reshape(shape)
            self.status = True
        except Exception:
            self.r = np.array([])
            self.dr = np.array([])
            self.status = False
        finally:
            # assemble results
            result = dict(task_name = self.__class__.__name__, sid = self.sid, id = self.id,
                solution = dict(r = self.r, dr = self.dr, status = self.status), 
                problem = self.problem)
        return result
    
    def process(self, mng_dkt, mng_lock):
        """Solve task at parallelized worker session."""
        worker_watcher(mng_dkt, mng_lock)(self.solve)()
        
    def postprocess(self, mng_dkt, mng_lock):
        """Solve task at parallelized worker session."""
        # extract data
        try:
            # acquire lock
            mng_lock.acquire()
            solution = mng_dkt[self.sid][self.id]['solution'].copy()
        except:
            # empty record by SID or/and ID
            solution = dict(status = False)
        finally:
            # release lock
            mng_lock.release()
        if solution['status']:
            worker_watcher(mng_dkt, mng_lock)(self.export)(solution, self.sid, self.id)

    def system_equations(self, argument: np.ndarray, t: float, *parameters) -> np.ndarray:
        """Assemble the cauchy problem."""
        # extract gravitational constant
        g = parameters[-3]
        # extract order of task
        order = parameters[-2]
        # extract dimensional count of task
        dimension = parameters[-1]

        # extract mass vector
        m = parameters[:-3]
        # extract vector of unknown variables
        r = np.reshape(argument[::2], (-1, dimension))
        # extract first derivatives vector of unknown variables
        dr = argument[1::2]
        
        # calculate matrix of mutual coordinate difference
        r_ij = r.reshape((1, order, dimension)) - r.reshape((order, 1, dimension)) # shape = (order, order, dimension)
        # fill diagonal elements nan to exclude influence of self-term
        [np.fill_diagonal(r_ij[:, :, i], np.nan) for i in np.arange(r_ij.shape[2])]
        # calculate matrix of mutual distance
        d_ij = np.sqrt(np.nansum(r_ij**2, axis = 2)) # shape = (order, order)
        # fill diagonal elements nan to exclude influence of self-term
        np.fill_diagonal(d_ij, np.nan)
        d_ij = np.repeat(d_ij, dimension, axis = 1).reshape((order, order, dimension)) # shape = (order, order, dimension)
        # calculate matrix of mutual mass
        m_ij = np.repeat(m, order * dimension, axis = 0).reshape((order, order, dimension)) # shape = (order, order, dimension)  
        # transpose mass matrix
        m_ij = np.moveaxis(m_ij, 0, 1) # shape = (order, order, dimension)  
        # calculate matrix of second derivatives
        ddr = np.nansum(g * m_ij * r_ij / d_ij**3, axis = 1) # shape = (order, dimension)

        # fill left-side vertor of cauchy problem
        vector = np.zeros(2 * order * dimension)
        vector[0::2] = dr
        vector[1::2] = ddr.flatten()
        return vector       
        
    @staticmethod
    def plot(vector, layout) -> str:
        """Plot the space/phase trajectory."""
        try:
            # define axis range
            vector_min = np.min(vector, (0, 1))
            vector_max = np.max(vector, (0, 1))
            index = np.arange(vector.shape[1])
            # select dimension
            match vector.shape[2]:
                case 2:
                    data = [go.Scatter(x = vector[:, i, 0], y = vector[:, i, 1], mode = 'lines', name = str(i + 1))
                        for i in index]
                    layout_axis = dict(xaxis = dict(range = [vector_min[0], vector_max[0]], autorange = False),
                        yaxis = dict(range = [vector_min[1], vector_min[1]], scaleanchor = 'x', scaleratio = 1, autorange = False))                    
                case 3:                  
                    data = [go.Scatter3d(x = vector[:, i, 0], y = vector[:, i, 1], z = vector[:, i, 2], mode = 'lines', name = str(i + 1))
                        for i in index]
                    layout_axis = dict(xaxis = dict(range = [vector_min[0], vector_max[0]], autorange = False),
                        yaxis = dict(range = [vector_min[1], vector_min[1]], scaleanchor = 'x', scaleratio = 1, autorange = False),
                        zaxis = dict(range = [vector_min[2], vector_min[2]], scaleanchor = 'x', scaleratio = 1, autorange = False))   
            # create layout
            layout = dict(hovermode = 'closest') | layout_axis | layout
            # create figure
            figure = json.loads(go.Figure(data = data, layout = layout).to_json())
        except Exception:
            figure = {}
        finally:
            return figure
        
    @staticmethod
    def animate(vector, n_trace, layout) -> str:
        """Animation plot the space/phase trajectory."""
        try:
            n_frame = vector.shape[0]
                        
            # define axis range
            vector_min = np.min(vector, (0, 1))
            vector_max = np.max(vector, (0, 1))
            
            # contains enumeration of bodies
            index = np.arange(vector.shape[1])
            # select dimension
            match vector.shape[2]:
                case 2:
                    data = [go.Scatter(x = [vector[0, i, 0]], y = [vector[0, i, 1]], mode = 'markers', name = str(i + 1))
                        for i in index]
                    frames = [go.Frame(data = [go.Scatter(x = vector[nf-n_trace:nf, i, 0], y = vector[nf-n_trace:nf, i, 1], mode = 'lines') 
                            if nf > n_trace else go.Scatter(x = vector[0:nf, i, 0], y = vector[0:nf, i, 1], mode = 'lines')
                            for i in index]) for nf in np.arange(n_frame)]
                    layout_axis = dict(xaxis = dict(range = [vector_min[0], vector_max[0]], autorange = False),
                        yaxis = dict(range = [vector_min[1], vector_min[1]], scaleanchor = 'x', scaleratio = 1, autorange = False))                    
                case 3:                  
                    data = [go.Scatter3d(x = [vector[0, i, 0]], y = [vector[0, i, 1]], z = [vector[0, i, 2]], mode = 'markers', name = str(i + 1))
                        for i in index]
                    frames = [go.Frame(data = [go.Scatter3d(x = vector[nf-n_trace:nf, i, 0], y = vector[nf-n_trace:nf, i, 1], z = vector[nf-n_trace:nf, i, 2], mode = 'lines') 
                            if nf > n_trace else go.Scatter3d(x = vector[0:nf, i, 0], y = vector[0:nf, i, 1], z = vector[nf-n_trace:nf, i, 2], mode = 'lines')
                            for i in index]) for nf in np.arange(n_frame)]
                    layout_axis = dict(xaxis = dict(range = [vector_min[0], vector_max[0]], autorange = False),
                        yaxis = dict(range = [vector_min[1], vector_min[1]], scaleanchor = 'x', scaleratio = 1, autorange = False),
                        zaxis = dict(range = [vector_min[2], vector_min[2]], scaleanchor = 'x', scaleratio = 1, autorange = False))   
            # create animate button
            button_animate = dict(label = 'Play', method = 'animate', 
                args = [None, dict(frame = dict(duration = 0, redraw = False), transition = dict(duration = 0), mode = 'immediate')])
            # create layout
            layout = dict(updatemenus = [dict(type = 'buttons', buttons = [button_animate])], 
                hovermode = 'closest') | layout_axis | layout
            # create figure
            figure = json.loads(go.Figure(data = data, layout = layout, frames = frames).to_json())
        except Exception:
            figure = {}
        finally:
            return figure
        
    @classmethod
    def export(cls, solution, sid, id):
        try:
            n_slice = 10
            n_trace = 50
            # extract data
            r = solution['r']
            dr = solution['dr']            
            # date reduction
            r = r[::n_slice, :, :]
            dr = dr[::n_slice, :, :]
            # build figures
            plots = dict(trajectory = cls.plot(r, dict(title = 'Space trajectory')),
                velocity = cls.plot(dr, dict(title = 'Phase trajectory')))
            animations = dict(trajectory = cls.animate(r, n_trace, dict(title = 'Space trajectory')),
                velocity = cls.animate(dr, n_trace, dict(title = 'Phase trajectory')))
        except:
            plots = {}
            animations = {}
        finally:
            result = dict(sid = sid, id = id, plots = plots, animations = animations)
            return result

class TaskManager():
    """Task manager to parallelize solvers"""
    def __init__(self, pool_size, socketio) -> None:
        self.socketio = socketio
        
        self.manager = multiprocessing.Manager()
        self.mng_dkt = self.manager.dict()
        self.mng_lock = self.manager.Lock()
        
        self.pool_size = pool_size
        self.pool = multiprocessing.Pool(processes = self.pool_size)
        self.task = []
    
    def process(self, tasks: list) -> None:
        """Launch pool processing session."""
        print(f'TaskManager: process({tasks})')
        [self.pool.apply_async(task.process, args = (self.mng_dkt, self.mng_lock,), 
            callback = lambda result, channel = 'process', sid = task.sid, id = task.id: self.callback(channel, sid, id, result)) for task in tasks]   
    
    def postprocess(self, tasks: list) -> None:
        """Launch pool postprocessing session."""
        print(f'TaskManager: postprocess({tasks})')
        [self.pool.apply_async(task.postprocess, args = (self.mng_dkt, self.mng_lock,), 
            callback = lambda result, channel = 'postprocess', sid = task.sid, id = task.id: self.callback(channel, sid, id, result)) for task in tasks] 
        pass
    
    def callback(self, channel, sid, id, result) -> None:
        """Callback function at finishing task."""
        try:
            # acquire lock
            self.mng_lock.acquire()
            data = self.mng_dkt[sid][id].copy()
        finally:
            # release lock
            self.mng_lock.release()
        
        # emit results to client socket
        self.socketio.emit(channel, dict(id = id, worker = data['worker']), to = sid, namespace = '/solver')
        
    def registrate_client(self, sid: str) -> None:
        """Create client account in dict manager."""
        try:
            # acquire lock
            self.mng_lock.acquire()
            self.mng_dkt[sid] = {}
        finally:
            # release lock
            self.mng_lock.release()
        
    def close(self) -> None:
        """Finishing pool session."""
        self.pool.close()
        self.pool.join()

def build_problem_classical_gravitation(data: dict) -> dict:
    """Assemble problem of classical gravitation."""
    order = len(data['initial'])
    dimension = len(data['initial'][0]['r'])
    mesh = np.linspace(data['physics']['t'][0], data['physics']['t'][1], num = data['physics']['t'][2])
    m = [value['m'] for value in data['initial']]
    initial = np.array([[body['r'], body['dr']] for body in data['initial']])
    initial = np.moveaxis(initial, (0, 1, 2), (0, 2, 1)).flatten()
    g = data['physics']['g']
    problem = dict(initial = initial, mesh = mesh, dimension = dimension, order = order, m = m, g = g)
    return problem
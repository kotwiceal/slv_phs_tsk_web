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
    def __init__(self, problem: dict, sid: str, id: str) -> None:
        self.problem = problem
        self.sid = sid
        self.id = id
        self.layout = {}
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
            plot = self.plot()
        except Exception:
            self.r = np.array([])
            self.dr = np.array([])
            self.status = False
        finally:
            # assemble results
            result = dict(task_name = self.__class__.__name__, sid = self.sid, id = self.id,
                solution = dict(r = self.r, dr = self.dr, status = self.status), 
                problem = self.problem) | plot
        return result
    
    def solve_w(self, mng_dkt, mng_lock):
        """Solve task at parallelized worker session."""
        worker_watcher(mng_dkt, mng_lock)(self.solve)()

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
    
    def plot_trajectory(self) -> str:
        """Plot the space trajectory."""
        try:
            index = np.arange(self.problem['order'])
            match self.problem['dimension']:
                case 2:
                    data = [go.Scatter(x = self.r[:, i, 0], y = self.r[:, i, 1], mode = 'lines', name = str(i + 1))
                        for i in index]
                case 3:
                    data = [go.Scatter3d(x = self.r[:, i, 0], y = self.r[:, i, 1], z = self.r[:, i, 2], 
                        mode = 'lines', name = str(i + 1)) for i in index]
            figure = json.loads(go.Figure(data = data, layout = dict(title = 'Trajectory')).to_json())
        except Exception:
            figure = {}
        finally:
            return figure
        
    def plot_velocity(self) -> str:
        """Plot the phase trajectory."""
        try:
            index = np.arange(self.problem['order'])
            match self.problem['dimension']:
                case 2:
                    data = [go.Scatter(x = self.dr[:, i, 0], y = self.dr[:, i, 1], mode = 'lines', name = str(i + 1))
                        for i in index]
                case 3:
                    data = [go.Scatter3d(x = self.dr[:, i, 0], y = self.dr[:, i, 1], z = self.dr[:, i, 2], 
                        mode = 'lines', name = str(i + 1)) for i in index]
            figure = json.loads(go.Figure(data = data, layout = dict(title = 'Velocity')).to_json())
        except Exception:
            figure = {}
        finally:
            return figure
            
    def plot(self) -> dict:  
        result = dict(plot = dict(trajectory = self.plot_trajectory(), velocity = self.plot_velocity())) if self.status else dict(plot = {})
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
        """Launch pool session."""
        print(f'TaskManager: process({tasks})')
        [self.pool.apply_async(task.solve_w, args = (self.mng_dkt, self.mng_lock,), 
            callback = lambda result, sid = task.sid, id = task.id: self.callback(sid, id, result)) for task in tasks]   
    
    def callback(self, sid, id, result) -> None:
        """Callback function at finishing task."""
        try:
            # acquire lock
            self.mng_lock.acquire()
            data = self.mng_dkt[sid][id].copy()
        finally:
            # release lock
            self.mng_lock.release()
        
        # emit results to client socket
        self.socketio.emit('process', dict(worker = data['worker']), to = sid, namespace = '/solver')
        
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

def generate_problem_classical_gravitation_2d() -> dict:
    """Test task initialization in 2D configuration."""
    order = 3
    dimension = 2
    mesh = np.linspace(0, 25, num = 10000)
    m = np.array([1.1, 1.2, 1.3])
    g = 1
    initial = np.zeros((order, 2 * dimension))
    initial = initial.flatten()
    initial[[0, 2]] = np.array([-1, 1]) + np.random.rand(2)*0.01
    initial[[4, 6]] = np.array([1, 0]) + np.random.rand(2)*0.01
    initial[[8, 10]] = np.array([0, 1]) + np.random.rand(2)*0.01
    problem = dict(initial = initial, mesh = mesh, dimension = dimension, order = order, m = m, g = g)
    return problem

def build_problem_classical_gravitation(data: dict) -> dict:
    """Assemble problem of classical gravitation."""
    order = len(data['body'])
    dimension = len(data['body'][0]['r'])
    mesh = np.linspace(data['param']['t'][0], data['param']['t'][1], num = data['param']['t'][2])
    m = [value['m'] for value in data['body']]
    initial = [[body['r'], body['dr']] for body in data['body']]
    initial = [ii for s in initial for i in s for ii in i]
    g = data['param']['g']
    problem = dict(initial = initial, mesh = mesh, dimension = dimension, order = order, m = m, g = g)
    return problem
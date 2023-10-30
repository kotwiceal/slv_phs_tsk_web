/**
 * @brief The module provides application component routing
 */

// import react-router-dom dependencies
import {createBrowserRouter} from 'react-router-dom'

// import custom components
import {Main} from '../main'
import {ErrorPage} from './errors'
import {Dashboard} from '../dashboard/navigation'
import {Auth} from '../authorization/auth'
import {TaskBrowser, taskLoader, TaskInitialize} from '../manager/manager'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Main/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: 'dashboard',
                element: <Dashboard/>,
                children: [
                    {
                        path: 'tasks',
                        element: <TaskBrowser/>,
                        loader: taskLoader,
                        children: [
                            {
                                path: 'initialize',
                                element: <TaskInitialize/>
                            }
                        ]
                    }
                ]
            },
            {
                path: 'auth',
                element: <Auth/>,
            }
        ]
    }
])

export {router}
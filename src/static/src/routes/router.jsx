/**
 * @brief
 */

// import react-router-dom dependencies
import {createBrowserRouter} from 'react-router-dom'

// import custom components
import {ErrorPage} from './errors'
import {Dashboard} from '../dashboard/navigation'
import {Auth} from '../authorization/auth'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Auth/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: 'dashboard',
                element: <Dashboard/>
            },
            {
                path: 'auth',
                element: <Auth/>,
            }
        ]
    }
])

export {router}
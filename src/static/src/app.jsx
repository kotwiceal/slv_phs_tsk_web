/**
 * @brief Entry application point 
 */

// import styles
import './styles/index.scss'

// import react-router-dom dependencies
import {RouterProvider} from 'react-router-dom'
import {router} from './routes/router'
// import redux dependencies
import {Provider} from 'react-redux'
import {store} from './store/store'

const App = () => {
    document.querySelector('html').setAttribute('data-bs-theme', 'dark')
    return (
        <>
            <Provider store = {store}>
                <RouterProvider router = {router}/>
            </Provider>
        </>
    )
}

export default App
/**
 * @brief The module provides the global application store
 */

import {configureStore} from '@reduxjs/toolkit'

import {authorizedReducer} from './authorizedSlice'

const store = configureStore({
    reducer: {
        authorized: authorizedReducer
    }
})

export {store}
/**
 * @brief The module provides action and reducer of authorization component
 */

import {createSlice} from '@reduxjs/toolkit'

const authorizedSlice = createSlice({
    name: 'authorized',
    initialState: {
      value: false
    },
    reducers: {
        signout: state => {
            state.value = false
        },
        signin: state => {
            state.value = true
        },
    }
})

const authorizedReducer = authorizedSlice.reducer
const {signout, signin} = authorizedSlice.actions

export {authorizedReducer, signout, signin}
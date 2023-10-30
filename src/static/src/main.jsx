/**
 * @brief The module provides main component
 */

// import react hooks
import {useEffect, useState} from 'react'
// import react-router-dom dependencies
import {RouterProvider, Outlet, useNavigate} from 'react-router-dom'
// import redux dependencies
import {useSelector, useDispatch} from 'react-redux'

const Main = () => {

    const authorized = useSelector(state => state.authorized.value)
    const navigate = useNavigate()

    useEffect(() => {
        if (!authorized) {
            navigate('/auth')
        }
    }, [authorized])

    return (<>
        <Outlet/>
    </>)
}


export {Main}
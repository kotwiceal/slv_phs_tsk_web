/**
 * @brief The module provides main tool components
 */

// import bootstrap dependencies
import ProgressBar from 'react-bootstrap/ProgressBar'

// import react hooks
import {useEffect, useReducer} from 'react'

/**
 * @brief Progess bar displaing task state.
 * @param {string} type 
 * @returns custom react component 
 */
const ProgressBarPattern = ({type}) => {

    const statePattern = {
        created: {variant: 'success', striped: false, animated: false, now: 25, label: 'created'},
        initialized: {variant: 'success', striped: false, animated: false, now: 45, label: 'initialized'},
        processing: {variant: 'primary', striped: true, animated: true, now: 65, label: 'processing'},
        processed: {variant: 'success', striped: false, animated: false, now: 70, label: 'processed'},
        postprocessing: {variant: 'primary', striped: true, animated: true, now: 85, label: 'postprocessing'},
        postprocessed: {variant: 'success', striped: false, animated: false, now: 100, label: 'postprocessed'},
        failed: {variant: 'danger', striped: false, animated: false, now: 100, label: 'failed'}
    }

    const reducer = (state, action) => {
        try {
            return statePattern[action.type]
        } catch {
            return statePattern[action.failed]
        }
    }

    const [state, dispatch] = useReducer(reducer, statePattern.created)

    useEffect(() => dispatch({type: type}), [type])

    return (<>
        <ProgressBar {...state}/>
    </>)
}

export {
    ProgressBarPattern
}
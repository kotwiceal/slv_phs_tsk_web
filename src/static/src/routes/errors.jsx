/**
 * @brief The module provides error notification components
 */

// import react-router-dom dependencies
import {useRouteError} from 'react-router-dom'

const ErrorPage = () => {
    const error = useRouteError()
    return (<>
        <Alert variant = 'danger'>
            <Alert.Heading>Sorry, an unexpected error has occurred.</Alert.Heading>
            {error.statusText || error.message}
        </Alert>
    </>)
}

export {ErrorPage}
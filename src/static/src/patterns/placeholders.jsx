/**
 * @brief The module provides placeholder components
 */

const PlaceholderImagePattern = () => {
    return (
        <>
        <Container style = {{'backgroundColor': '#343a40'}}>
            <Row className = 'justify-content-md-center'>
                <Col md = 'auto'>
                    <i className = 'bi bi-image' style = {{'fontSize': '200px'}}></i>    
                </Col>
            </Row>
        </Container>
        </>
    )
}

/**
 * @brief Generalized placeholder.
 * @param {object} children 
 * @param {boolean} state
 * @param {string} type
 * @param {string} xs
 * @returns custom react component
 */
const PlaceholderPattern = ({children, state, type, xs}) => {

    const renderSwitch = (type) => {
        switch (type) {
            case 'button':
                return <Placeholder.Button xs = {xs}/>
            case 'image':
                return <PlaceholderImagePattern/>
            default:
                return <Placeholder xs = {xs}/>
        }
    }

    return (
    <>
    {
        state ?
        <>{children}</>
        :
        <Placeholder animation = 'glow'>
            {renderSwitch(type)}
        </Placeholder>
    }
    </>
    )
}

export {
    PlaceholderImagePattern,
    PlaceholderPattern
}
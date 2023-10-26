/**
 * @brief The module provides navigation menu component
 */

// import boostrap components
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Offcanvas from 'react-bootstrap/Offcanvas'

// import react hooks
import {useId} from 'react'
// import react-router-dom dependencies
import {useNavigate, Outlet} from 'react-router-dom'
// import redux dependencies
import {useDispatch} from 'react-redux'

const Dashboard = () => {

    const expand = false

    const id_toggle = useId()
    const id_label = useId()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const signOut = () => {
        navigate('/')
        dispatch({type: 'authorized/signout'})
    }

    return (<>
    <Navbar 
        key = {expand} 
        expand = {expand} 
        className = 'bg-body-tertiary mb-3'
    >
        <Container fluid>
            <Navbar.Brand>ODE Solver</Navbar.Brand>
            
            <Navbar.Toggle 
                aria-controls = {id_toggle} 
            />
            
            <Navbar.Offcanvas
              id = {id_toggle}
              aria-labelledby = {id_label}
              placement = 'end'
            >
            
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title id = {id_label}>
                        Menu
                    </Offcanvas.Title>
                </Offcanvas.Header>

                <Offcanvas.Body>
                    <Nav>
                        <Button onClick = {() => {navigate('tasks')}}>Tasks</Button>
                        <hr/>
                        <Button onClick = {signOut}>
                            Sign Out
                        </Button>
                    </Nav>
                </Offcanvas.Body>
            
            </Navbar.Offcanvas>
        </Container>
    </Navbar>
    <Outlet/>
    </>)
}

export {Dashboard}
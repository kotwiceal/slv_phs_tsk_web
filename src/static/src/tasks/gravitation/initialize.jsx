/**
 * @brief The module presents a dynamically form to initialize parameters of physical task.
 */

// import bootstrap dependencies
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import Modal from 'react-bootstrap/Modal'
import Spinner from 'react-bootstrap/Spinner'
import Stack from 'react-bootstrap/Stack'

// import react hooks
import {useState} from 'react'
// import react-hook-form dependencies
import {useForm, FormProvider} from 'react-hook-form'

// import custom components
import {NumberInputPattern, RadioPattern} from '../../patterns/toolkit'
import {ProblemAnnatation} from './description'

const Problem = () => {
    return (<>
    <Card>
        <Card.Header>Problem description</Card.Header>
        <Card.Body>
            <ProblemAnnatation/>
        </Card.Body>
    </Card>
    </>)
}

const Dimension = () => {
    return (<>
    <Card>
        <Card.Header>Dimension</Card.Header>
        <Card.Body>
            <RadioPattern 
                name = 'dim'
                inline = {true}
                radios = {
                    [{label: '2D', value: '2'}, 
                    {label: '3D', value: '3'}]
                }
            />
        </Card.Body>
    </Card>
    </>)
}

const TaskParameters = () => {
    return (<>
    <Card>
        <Card.Header>Task parameters</Card.Header>
        <Card.Body>
            <Stack gap = {2}>
                <NumberInputPattern 
                    label = 'Time [s]' 
                    name = 'time' 
                    range = {[0, 100]}
                />
                <NumberInputPattern 
                    label = 'Time node' 
                    name = 'tn' 
                    range = {[2, 1000]} 
                />
                <NumberInputPattern 
                    label = 'Gravitation constant' 
                    name = 'g' 
                    range = {[0.001, 100]} 
                />
            </Stack>
        </Card.Body>
    </Card>
    </>)
}

const SolverParameters = () => {
    const [showModal, setShowModal] = useState(false)

    return (<>
    <Card>
        <Card.Header>Solver parameters</Card.Header>
        <Card.Body>
            <Stack gap = {2}>
                <NumberInputPattern 
                    label = 'Relative tolerance' 
                    name = 'rtol' 
                    range = {[0, 10]}
                />
                <NumberInputPattern 
                    label = 'Absolute tolerance' 
                    name = 'atol' 
                    range = {[0, 1000]} 
                />
                <Button onClick = {() => {setShowModal(true)}}>Advanced</Button>
            </Stack>
            <AdvanceMenu show = {showModal} setShow = {setShowModal}/>
        </Card.Body>
    </Card>
    </>)
}

const AdvanceMenu = ({show, setShow}) => {
    
    const handleClose = () => {setShow(false)}
    
    return (<>
    <Modal centered show = {show} onHide = {handleClose}>
        <Modal.Dialog className = 'm-0'>
            <Modal.Header closeButton>
                <Modal.Title>Advance settings</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                TODO
            </Modal.Body>

            <Modal.Footer>
                <Button variant = 'primary' onClick = {handleClose}>Save changes</Button>
            </Modal.Footer>
        </Modal.Dialog>
    </Modal>
    </>)
}

/**
 * @brief Main inputs form.
 * @returns custom react component
 */
const InitTaskGravitation = () => {
    const methods = useForm({
        mode: 'all',
        defaultValues: {
            dim: '2',
            time: 100,
            tn: 100,
            g: 1,
            rtol: 1e-6,
            atol: 10,
            scale_m: 30,
            scale_dr: 1
        }
    })
    const {handleSubmit} = methods

    const handleSubmitCustom = (data) => {
        console.log(data)
    }

    const state = methods.formState.isSubmitted

    return (<>
    <FormProvider {...methods}>
        <Form onSubmit = {handleSubmit(handleSubmitCustom)}>
            <fieldset disabled = {state}>
            <Container>
                <Row className = 'mb-3'>
                    <Col>
                        <Problem/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Dimension/>
                    </Col>
                    <Col>
                        <TaskParameters/>
                    </Col>
                    <Col>
                        <SolverParameters/>
                    </Col>
                </Row>
                <Row>
                    <ButtonGroup className = 'mt-3'>
                        <Button variant = 'secondary' type = 'submit'>
                            {!state ? <><i className = 'bi bi-send-fill'/> Send</> :
                                <><Spinner size = 'sm' animation = 'border'/>Processing</>
                            }
                        </Button>
                    </ButtonGroup>
                </Row>
            </Container>
            </fieldset>
        </Form>
    </FormProvider>
    </>)
}

export {InitTaskGravitation}
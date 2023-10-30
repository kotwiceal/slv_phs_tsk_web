/**
 * @brief The module provides task view interface
 */

// import boostrap components
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import ListGroup from 'react-bootstrap/ListGroup'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import Stack from 'react-bootstrap/Stack'
import ToggleButton from 'react-bootstrap/ToggleButton'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'

// import react hooks
import {useState, useReducer, useId} from 'react'
// import react-hook-form dependencies
import {useForm, useFieldArray, useWatch, FormProvider, useFormContext} from 'react-hook-form'

// import custom components
import {DialogTaskCreate, DialogTakDelete, DialogTaskInitialize} from './dialogs'
import {ProgressBarPattern} from './tools'

// import react-router-dom dependencies
import {useLoaderData, useNavigate, Outlet} from 'react-router-dom'

/**
 * @brief Component to dispay task initiazliation form.
 * @return custom react component
 */
const TaskInitialize = () => {

    const navigate = useNavigate()

    const stepBack = () => {
        navigate('tasks')
    }

    return (<>
        <Button onClick = {() => stepBack}>
            <i className = 'bi bi-arrow-left'></i>
        </Button>
        {/* TODO: container of task initializaion */}
    </>)
}

/** 
 * @param {object} taskList
 * @returns custom react component
 */
const TaksGroup = ({taskList}) => {

    const fielArrayName = 'tasks'

    const methods = useForm({
        defaultValues: {tasks: taskList}
    })

    const {control} = methods
    const {fields, append, remove} = useFieldArray({
        control, name: fielArrayName
    })

    const reducerDialogDelete = (state, action) => ({show: action.show, index: state.index})
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [stateDeletaDialog, dispatchDialogDelete] = useReducer(reducerDialogDelete, {show: false, index: null})
    const [stateInitDialog, setStateInitDialog] = useState({show: false, type: null, index: null})

    return (<>
    <Stack>
        <ButtonGroup className = 'mb-3'>
            <Button onClick = {() => setShowCreateDialog(true)}>
                <i className = 'bi bi-file-earmark-plus-fill'/>
            </Button>
        </ButtonGroup>
        <DialogTaskCreate 
            show = {showCreateDialog} 
            setShow = {setShowCreateDialog} 
            append = {append}
        />
        <DialogTakDelete 
            state = {stateDeletaDialog} 
            setState = {dispatchDialogDelete} 
            remove = {remove}
        />
        <FormProvider {...methods}>
            <Form>
                <ListGroup>
                {
                    fields.map((field, index) => (
                        <Task 
                            key = {field.id}
                            index = {index}
                            handleDelete = {dispatchDialogDelete}
                            fielArrayName = {fielArrayName}
                        />
                    ))
                }
                </ListGroup>
            </Form>
        </FormProvider>
    </Stack>
    </>)
}

/**
 * @brief Container displaing task information.
 * @param {number} index 
 * @param {object} handleDelete
 * @param {string} fielArrayName
 * @returns custom react component 
 */
const Task = ({index, handleDelete, fielArrayName}) => {

    const idCheckbox = useId()

    const {control} = useFormContext()
    const watchTask = useWatch({control, name: `${fielArrayName}.${index}`})

    const [value, setValue] = useState([1])
    const handleChange = (val) => setValue(val)

    const navigate = useNavigate()

    const handleInitTask = () => {
        navigate('initialize')
    }

    const handleResultTask = () => {
        // TODO: display a result panel
    }

    const handleDeletaTask = () => {
        handleDelete({show: true})
    }

    return (<>
    <ListGroup.Item>
        <Stack direction = 'horizontal' gap = {3}>
            <ToggleButtonGroup type = 'checkbox' value = {value} onChange = {handleChange}>
                <ToggleButton 
                    id = {idCheckbox}
                    value = {index}
                >
                    <i className = 'bi bi-plus-square'/>
                </ToggleButton>
            </ToggleButtonGroup >
            <Container>
                <Row>
                    <Col>
                        <h3>{watchTask.name}</h3>
                    </Col>
                    <Col>
                        {watchTask.date}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {watchTask.id}
                    </Col>
                </Row>
                <ProgressBarPattern type = 'created'/>
            </Container>
            <div className = 'vr'/>
            <ButtonGroup vertical>
                <Button onClick = {handleInitTask}>
                    <i className = 'bi bi-gear'/>
                </Button>
                <Button onClick = {handleResultTask}>
                    <i className = 'bi bi-graph-up'/>
                </Button>
                <Button variant = 'danger' onClick = {handleDeletaTask}>
                    <i className = 'bi bi-trash-fill'/>
                </Button>
            </ButtonGroup>
        </Stack>
    </ListGroup.Item>
    </>)
}

/**
 * @brief Container displaing task list.
 * @returns custom react component
 */
const TaskBrowser = () => {

    const taskList = useLoaderData()

    return (<>
        <Card>
            <Card.Body>
                <TaksGroup taskList = {taskList}/>
            </Card.Body>
        </Card>
        <Outlet/>
    </>)
}

/**
 * @brief Load task list.
 * @returns object
 */
const taskLoader = () => {
    // TODO: requst data

    // dummy data
    const tasks = [
        {
            name: 'test-1', type: 'grav', comment: '', date: '10/15/2023, 7:30:36 PM', 
            id: '25c8a8028571f993bfa6cad65b78b',
            problem: {
                dim: '2',
                time: 100,
                tn: 100,
                g: 1,
                rtol: 1e-6,
                atol: 10,
                scale_m: 30,
                scale_dr: 1,
                bodies: [
                    {r: [0, 1], dr: [0, 0], m: 1},
                    {r: [1, 1], dr: [0, 0], m: 2},
                    {r: [-1, -1], dr: [0, 0], m: 3}
                ]
            }
        },
        {
            name: 'test-2', type: 'grav', comment: '', date: '10/15/2023, 7:30:36 PM', 
            id: '84165fb26906ee26b4'
        },
    ]
    return tasks
}

export {TaskBrowser, taskLoader, TaskInitialize}
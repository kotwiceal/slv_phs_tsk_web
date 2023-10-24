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
import ListGroup from 'react-bootstrap/ListGroup'
import Dropdown from 'react-bootstrap/Dropdown'

// import react hooks
import {useState, useEffect, useMemo, forwardRef} from 'react'
// import react-hook-form dependencies
import {useForm, FormProvider, useFieldArray, useWatch, useFormContext} from 'react-hook-form'

// import custom components
import {NumberInputPattern, ArrayInputPattern, RadioPattern, RangePattern} from '../../patterns/inputs'
import {ProblemAnnatation} from './description'
import {PlaceholderPattern} from '../../patterns/placeholders'

// import plotter
import Plot from 'react-plotly.js'

/**
 * @param {string} fielArrayName 
 * @returns custom react component
 */
const MonitorFigure = ({fielArrayName}) => {

    const {control, getFieldState, formState} = useFormContext()
    const {error} = getFieldState(fielArrayName, formState)
    const watchDimension = useWatch({control, name: 'dim'})
    const watchFieldArray = useWatch({control, name: fielArrayName})
    const watchScales = useWatch({control, name: ['scale_m', 'scale_dr']})

    const [placeholder, setPlaceholder] = useState(true)
    
    const [layout, setLayout] = useState({
            autosize: true,
            showTips: false,
            plot_bgcolor: '#212529',
            paper_bgcolor: '#212529',
            font: {color: '#b4c1d1'},
            showlegend: true,
            title: 'Initial state', autosize: true,
            xaxis: {title: 'x'},
            yaxis: {title: 'y'},
    })

    const plotData = useMemo(() => {
        let result = []
        if ((error === undefined) && Array.isArray(watchFieldArray)) {
            setPlaceholder(true)

            let bodies = watchFieldArray

            if (watchDimension == '2') {
                result = bodies.map((body, index) => ({
                        type: 'scatter', 
                        x: [body.r[0], body.r[0] + watchScales[1]*body.dr[0]], 
                        y: [body.r[1], body.r[1] + watchScales[1]*body.dr[1]], 
                        name: index,
                        marker: {symbol: ['circle', 'arrow'], angleref: 'previous', size: watchScales[0]*body.m}
                    }
                ))    
            } else {
                result = bodies.map((body, index) => ({
                    type: 'scatter3d', 
                    x: [body.r[0], body.r[0] + watchScales[1]*body.dr[0]], 
                    y: [body.r[1], body.r[1] + watchScales[1]*body.dr[1]], 
                    z: [body.r[2], body.r[2] + watchScales[1]*body.dr[2]], 
                    name: index,
                    marker: {symbol: ['circle', 'arrow'], angleref: 'previous', size: watchScales[0]*body.m}
                }
            )) 
            }
        } else {
            setPlaceholder(false)
        }  
        return result 
    }, [watchFieldArray, watchDimension, error, watchScales])

    return (<>
    <PlaceholderPattern state = {placeholder} xs = {12}>
        <Plot
            data = {plotData}
            layout = {layout}
            config = {{displayModeBar: false}}
        />
    </PlaceholderPattern>
    </>)
}

/**
 * @param {string} style
 * @param {string} className
 * @param {object} ref
 */
const MonitorPalette = forwardRef(({style, className}, ref) => {
    // TODO: close menu
    return (<>
    <Stack 
        ref = {ref}
        style = {style}
        className = {className}
        gap = {3}
    >
        <Container>
            <RangePattern
                name = 'scale_m'
                label = 'Mass scale'
                min = {1} 
                max = {100} 
                step = {1}
            />
            <RangePattern 
                name = 'scale_dr'
                label = 'Vector scale'
                min = {1} 
                max = {100} 
                step = {1}
            />
        </Container>
    </Stack>
    </>)
})

/**
 * @param {number} index
 * @param {number} length
 * @param {object} handleDelete
 * @param {string} fielArrayName
 * @returns custom react component
 */
const Body = ({index, length, handleDelete, fielArrayName}) => {

    const {control} = useFormContext()
    const watchDimension = useWatch({control, name: 'dim'})

    const labelPosttionPattern = {2: '[x,y]', 3: '[x,y,z]'}
    const labelVelocityPattern = {2: '[u,v]', 3: '[u,v,w]'}

    const [labelPosttion, setLabelPostion] = useState('[x,y]')
    const [labelVelocity, setlabelVelocity] = useState('[u,v]')

    useEffect(() => {
        setLabelPostion(labelPosttionPattern[watchDimension])
        setlabelVelocity(labelVelocityPattern[watchDimension])
    }, [watchDimension])

    return (<>
    <ListGroup.Item>
        <Stack direction = 'horizontal' gap = {3}>
            <ArrayInputPattern 
                label = {labelPosttion}
                name = {`${fielArrayName}.${index}.r`}
                length = {length} 
                range = {[-10, 10]}
            />
            <ArrayInputPattern 
                label = {labelVelocity}
                name = {`${fielArrayName}.${index}.dr`}
                length = {length} 
                range = {[-10, 10]}
            />
            <NumberInputPattern 
                label = 'm' 
                name = {`${fielArrayName}.${index}.m`}
                range = {[0, 10]}
            />
            <Button variant = 'danger' onClick = {handleDelete}>
                <i className = 'bi bi-trash-fill'/>
            </Button>
        </Stack>
    </ListGroup.Item>
    </>)
}

const Bodies = () => {

    const fielArrayName = 'bodies'

    const {control, trigger} = useFormContext()

    const {fields, append, remove} = useFieldArray({
        control, name: fielArrayName
    })

    // change length of inputs array according to dimension value of radio group
    const dimensionWatch = useWatch({control, name: 'dim'})
    const [length, setlength] = useState(parseInt(dimensionWatch))

    useEffect(() => {
        setlength(parseInt(dimensionWatch))
    }, [dimensionWatch])

    useEffect(() => {
        trigger(fielArrayName)
    }, [length])

    // define CRUD handles
    const handleAdd = () => {
        let data = {r: [0, 0], dr: [0, 0], m: 1}
        if (length == 2) {
            data = {r: [0, 0], dr: [1, 1], m: 1}
        } else {
            data = {r: [0, 0, 0], dr: [1, 0, 1], m: 1}
        }
        append(data)
    }

    const handleDelete = (index) => {
        remove(index)
    }

    return (<>
        <Card className = 'mt-3'>
            <Card.Header>Bodies</Card.Header>
            <Card.Body>
                <Stack gap = {2}>
                    <ButtonGroup className = 'mb-3'>
                        <Button onClick = {handleAdd}>
                            <i className = 'bi bi-plus-square'/>
                        </Button>
                        <Dropdown 
                            className = 'w-50' 
                            drop = 'down-centered' 
                            align = 'start' 
                            as = {ButtonGroup}
                        >
                            <Dropdown.Toggle>
                                <i className = 'bi bi-palette-fill'/>
                            </Dropdown.Toggle>
                            <Dropdown.Menu as = {MonitorPalette}>
                            </Dropdown.Menu>    
                        </Dropdown>
                    </ButtonGroup>
                    <ListGroup>
                    {
                        fields.map((field, index) => (
                            <Body 
                                key = {field.id}
                                index = {index}
                                length = {length}
                                handleDelete = {() => {handleDelete(index)}}
                                fielArrayName = {fielArrayName}
                            />
                        ))
                    }
                    </ListGroup>
                    <MonitorFigure fielArrayName = {fielArrayName}/>
                </Stack>
            </Card.Body>
        </Card>
    </>)
}

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

/**
 * @param {boolean} show
 * @param {object} setShow
 * @returns custom react component
 */
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
const InitializeTaskGravitation = () => {
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
                <Bodies/>
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

export {InitializeTaskGravitation}
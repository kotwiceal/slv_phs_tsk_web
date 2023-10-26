/**
 * @brief The module provides dialog components
 */

// import boostrap components
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Stack from 'react-bootstrap/Stack'

// import encryptor
import {sha256} from 'js-sha256'

// import react-hook-form dependencies
import {useForm, FormProvider} from 'react-hook-form'

// import custom components
import {InitializeTaskGravitation} from '../tasks/gravitation/initialize'
import {TextInputPattern, SelectPattern} from '../patterns/inputs'

/**
 * @brief Modal dialog to create task.
 * @param {boolean} show
 * @param {object} setShow
 * @param {object} append  
 * @returns custom react component
 */
const DialogTaskCreate = ({show, setShow, append}) => {

    const methods = useForm()
    const handleClose = () => {setShow(false)}

    const handleApply = (data) => {
        let temporary = {...data}
        temporary.date = new Date().toLocaleString()
        temporary.id = sha256(JSON.stringify(temporary))
        console.log(temporary)
        handleClose()
        append(temporary)
    }

    return (<>
    <Modal centered show = {show} onHide = {handleClose}>
        <Modal.Dialog className = 'm-0'>
            <FormProvider {...methods}>
                <Form onSubmit = {methods.handleSubmit(handleApply)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create task</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            <Stack gap = {3}>
                                <TextInputPattern
                                    name = 'name'
                                    label = 'Task name'
                                    required = {{required: 'Value must not be empty'}}
                                />
                                <SelectPattern
                                    name = 'type'
                                    label = 'Choose task type'
                                    options = {[
                                        {value: 'grav', label: 'grav'},
                                        {value: 'grav2', label: 'grav2'}
                                    ]}
                                />
                                <TextInputPattern
                                    name = 'commment'
                                    label = 'Comment'
                                    asInput = 'textarea'
                                />
                                <Button type = 'submit'>Continue</Button>
                            </Stack>
                    </Modal.Body>
                </Form>
            </FormProvider>
        </Modal.Dialog>
    </Modal>
    </>)
}

/**
 * @brief Component to delete selected task.
 * @param {object} state
 * @param {object} setState
 * @param {object} remove
 * @returns 
 */
const DialogTakDelete = ({state, setState, remove}) => {

    const handleClose = () => {setState({show: false})}
    const handleApply = () => {
        handleClose()
        remove(state.index)
    }

    return (<>
    <Modal centered show = {state.show} onHide = {handleClose}>
        <Modal.Dialog className = 'm-0'>
            <Modal.Header closeButton>
                <Modal.Title>Delete task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    Are you sure?
            </Modal.Body>
            <Modal.Footer>
                <Button variant = 'secondary' onClick = {handleClose}>No</Button>
                <Button variant = 'primary' onClick = {handleApply}>Yes</Button>
            </Modal.Footer>
        </Modal.Dialog>
    </Modal>
    </>)
}

export {
    DialogTaskCreate,
    DialogTakDelete
}
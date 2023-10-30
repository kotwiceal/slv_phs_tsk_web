/**
 * @brief The module provides authorization form
 */

// import bootstrap dependencies
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Stack from 'react-bootstrap/Stack'

// import react hooks
import {useEffect, useState} from 'react'
// import react-hook-form dependencies
import {useForm, useWatch, FormProvider} from 'react-hook-form'
// import react-router-dom dependencies
import {useNavigate} from 'react-router-dom'
// import redux dependencies
import {useSelector, useDispatch} from 'react-redux'

// import custom components
import {LoginInputPattern, PasswordInputPattern} from './inputs'

/**
 * @brief Generalized sign in/up form.
 * @param {boolean} signup 
 * @param {object} submit
 * @returns custom react component
 */
const Sign = ({signup, submit}) => {

    const methods = useForm()
    const {control, setError, handleSubmit} = methods
    const watchPassword = useWatch({control, name: ['password', 'password_confirm']})

    // confirm password match
    useEffect(() => {
        if (signup) {
            let state = watchPassword[0] == watchPassword[1]
            console.log(state)
            if (!state) {
                setError('password_confirm', {type: 'confirm', message: 'password must be match'})
            }
        }
    }, [watchPassword])

    return (<>
    <FormProvider {...methods}>
        <Form onSubmit = {handleSubmit(submit)}>
            <Row className = 'mt-4'>
                <LoginInputPattern
                    label = 'Login'
                    name = 'username'
                    autoComplete = 'username'
                />
            </Row>
            <Row className = 'mt-2'>
                <PasswordInputPattern
                    label = 'Password'
                    name = 'password'
                    autoComplete = 'currrent-password'
                />
            </Row>
            {signup &&
                <Row className = 'mt-2'>
                    <PasswordInputPattern
                        label = 'Confirm password'
                        name = 'password_confirm'
                        autoComplete = 'new-password'
                    />
                </Row>
            }
            <Stack className = 'mt-2'>
                <Button type = 'submit'>Sign</Button>
            </Stack>
        </Form>
    </FormProvider>
    </>)
}

/**
 * @brief Authorization dialog.
 * @returns custom react component
 */
const Auth = () => {
    
    // capture authorized state from store
    const authorized = useSelector(state => state.authorized.value)
    const dispatch = useDispatch()

    const navigate = useNavigate()
    
    const [show, setShow] = useState(!authorized)

    // when is not authorized: navigate to auth and open modal dialog 
    useEffect(() => {
        if (authorized) {
            navigate('/dashboard')
        }
        setShow(!authorized)
    }, [authorized])

    // when submit: update authorized, navigate to dashboard
    const submit = (data) => {
        console.log(data)
        dispatch({type: 'authorized/signin'})
        navigate('/dashboard')
    }

    return (<>
        <Modal show = {show} centered>
            <Modal.Body>
                <Tabs
                    defaultActiveKey = 'sigin'
                    fill
                >
                    <Tab eventKey = 'sigin' title = 'Sign In'>
                       <Sign submit = {submit}/>
                    </Tab>
                    <Tab eventKey = 'sigup' title = 'Sign Up'>
                        <Sign submit = {submit} signup = {true}/>
                    </Tab>
                </Tabs>
            </Modal.Body>
        </Modal>
    </>)
}

export {Auth}
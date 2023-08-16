import {Modal, Input, Nav} from './toolkit'

/**
 * @brief Dialog form at authorization.
 */
class SignIn {
    /**
     * @param parameters object
     * @example parameters = { user: {label: 'User', id: 'label-user', validation: true, type: 'text'}, 
     * password: {label: 'Password', id: 'label-password', validation: true, type: 'password'}, }
     */
    constructor(parameters) {
        this.parameters = parameters
        this.states = [false, false]

        // build interface
        this.create_elements()
        // assign callback functions
        this.create_callbacks()
    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {
        // create container
        this.container = $('<div></div>').addClass('container')

        // create user input
        this.user = new Input(this.parameters.user)
        this.user.input.addClass('mt-2 mb-2')
        this.user.export.prop('autofocus', true)

        // create password input
        this.password = new Input(this.parameters.password)
        this.password.export.addClass('mt-2 mb-2')

        // create confirm button
        this.button_confirm = $('<button></button>').addClass('btn btn-primary').attr({type: 'button'})
            .prop('disabled', true).append('Confirm').on('click', () => {this.confirm()})

        // create confirm button
        this.button_cancel = $('<button></button>').addClass('btn btn-secondary').attr({type: 'button'})
            .prop('disabled', false).append('Cancel').on('click', () => {this.cancel()})

        // store buttons
        this.buttons = [this.button_cancel, this.button_confirm]

        // appent to container
        this.container.append([this.user.export, this.password.export])

        // specify output jQuery object 
        this.export = this.container
    }

    /**
     * @brief Assign event functions created interface objects.
     */
    create_callbacks() {
        // check input user data is correct
        this.user.event = (state) => {
            this.states[0] = state
            this.check()
        }
        // check input password data is correct
        this.password.event = (state) => {
            this.states[1] = state
            this.check()
        }
    }

    /**
     * @brief Check content.
     */
    check() {
        this.state = this.states.reduce((accumulation, element) => accumulation * element, true)
        this.button_confirm.prop('disabled', !this.state)
    }

    /**
     * @brief Confirm input data.
     */
    confirm () {
        let data = {user: this.user.data(), password: this.password.data(), date: new Date().toLocaleString()}
        data['id'] = sha256(JSON.stringify(data)).slice(0, 32)
        this.proceed(data)
    }

    /**
     * @brief Close modal handler
     */
    cancel() {}

    /**
     * @brief External event.
     */
    proceed(data) {}

    /**
     * @brief Clear input form.
     */
    empty() {
        this.user.data('')
        this.password.data('')
    }
}

/**
 * @brief Dialog form to create account.
 */
class SignUp {
    constructor(parameters) {
        this.parameters = parameters

        // build interface
        this.create_elements()
    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {
        this.export = $('<div></div>').addClass('container')    
    }
}

/**
 * @brief Authorization menu.
 */
class Login {
    constructor() {
        this.modal_parameters = {label: 'Authorization', id: 'modal-auth'}

        this.signin_parameters = {
            user: {label: 'User', id: 'label-user', validation: true, type: 'text'},  
            password: {label: 'Password', id: 'label-password', validation: true, type: 'password'},
        }

        this.signup_parameters = {
            user: {label: 'User', id: 'label-user', validation: true, type: 'text'},  
            password: {label: 'Password', id: 'label-password', validation: true, type: 'password'},
            password_confirm: {label: 'Confirm', id: 'label-password-confirm', validation: true, type: 'password'},
        }

        // build interface
        this.create_elements()
        // assign callback functions
        this.create_callbacks()
    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {
        // create modal
        this.modal = new Modal(this.modal_parameters)

        // create sign in dialog
        this.sign_in = new SignIn(this.signin_parameters)

        // create sign up dialog
        this.sign_up = new SignUp(this.signup_parameters)

        // create nav
        this.nav = new Nav()

        // append content to nav
        this.nav.append({id: 'sign_in', label: 'Sign In', content: this.sign_in.export})
        this.nav.append({id: 'sign_up', label: 'Sign up', content: this.sign_up.export})
        
        // create tab trigger object 
        this.tab_trigger = {}
        Object.entries(this.nav.labels).forEach(([id, label]) => {
            this.tab_trigger[id] = new bootstrap.Tab(label)
        })
        // specify output jQuery object 
        this.export = this.nav.export

        // append content
        this.modal.append_body(this.nav.export)
        this.modal.append_footer(this.sign_in.buttons)

    }

    /**
     * @brief Assign event functions created interface objects.
     */
    create_callbacks() {
        // reasign process method
        this.sign_in.proceed = () => {this.proceed()}

        // cancel button handler
        this.sign_in.cancel = () => {this.modal.hide()}
    }

    /**
     * @brief External event handler.
     */
    proceed() {}
}

export {Login}
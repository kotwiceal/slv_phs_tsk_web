import {Modal, Input, Nav} from './toolkit'

/**
 * @brief Dialog form at authorization.
 */
class Sign {
    /**
     * @param parameters object
     * @example parameters = {user: {label: 'User', id: 'label-user', validation: true, type: 'text'}, 
     * password: {label: 'Password', id: 'label-password', validation: true, type: 'password'}}
     */
    constructor(parameters) {
        this.parameters = parameters
        this.states = {}
        this.inputs = {}

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

        // create specified inputs form
        Object.entries(this.parameters.inputs).forEach(([key, value]) => {
            this.inputs[key] = new Input(value)   
            this.inputs[key].input.addClass('mt-3 mb-2')
            // appent to container
            this.container.append(this.inputs[key].export)
        })

        // initialte styles of inputs
        this.empty()

        // define initial state of inputs
        Object.entries(this.inputs).forEach(([key, input]) => {
            this.states[key] = input.state
        })

        // specify output jQuery object 
        this.export = this.container
    }

    /**
     * @brief Assign event functions created interface objects.
     */
    create_callbacks() {
        // check inputs data is correct
        Object.entries(this.inputs).forEach(([key, input]) => {
            input.event = (state) => {
                this.states[key] = state
                this.check()
            }
        })
    }

    /**
     * @brief Check content.
     */
    check() {
        this.state = Object.values(this.states).reduce((accumulation, element) => accumulation * element, true)
        this.event(this.state)
    }

    /**
     * @brief Append/extract input from data.
     * @param data object
     * @returns object
     * @example data = {user: 'user-name', password: 'password', date: 'date'}
     */
    data () {
        if (arguments.length == 1) {
            Object.entries(arguments[0]).forEach(([key, value]) => {
                this.inputs[key].data(value)
            })
        } else {
            let data = {}
            let result = {}
            Object.entries(this.inputs).forEach(([key, input]) => {
                data[key] = input.data()
            })
            data['date'] = new Date().toLocaleString()
            result[this.parameters.id] = data
            return result
        }
    }

    /**
     * @brief Event handler.
     */
    event(stete) {}

    /**
     * @brief Clear input form.
     */
    empty() {
        Object.entries(this.inputs).forEach(([key, input]) => {
            input.data('')
            input.input.removeClass('is-invalid')
        })
    }

    /**
     * @brief Reset menu.
     */
    reset() {
        this.event = (state) => {}
        this.empty()
    }
}

/**
 * @brief Toast notification.
 */
class Toast {
    constructor() {
        // to store toasts
        this.toast = []
        // to store toast bootstrap objects
        this.toas_obj = []
        // build interface
        this.create_elements()
    }
    
    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {
        // specify output jQuery object 
        this.export = $('<div></div>').addClass('toast-container position-static')
    }

    show(message, style) {
        this.toast = $('<div></div>').addClass('toast').addClass(style)
            .attr({role: 'alert', 'aria-live': 'assertive', 'aria-atomic': 'true'}).append(
            $('<div></div>').addClass('toast-body').append(message)
        )

        this.export.empty()
        this.export.append(this.toast)
        this.toas_obj = new  bootstrap.Toast(this.toast)
        this.toas_obj.show()
    }
}

/**
 * @brief Authorization menu.
 */
class Login {
    constructor() {
        this.modal_parameters = {label: 'Authorization', id: 'modal-auth', options: {backdrop: 'static', keyboard: false}}

        this.sign_parameters = {
            sign_in: {id: 'sign_in', label: 'Sign In', inputs: {
                    user: {label: 'User', id: 'label-user', validation: true, type: 'text'},  
                    password: {label: 'Password', id: 'label-password', validation: true, type: 'password'}
                }
            },
            sign_up: {id: 'sign_up', label: 'Sign Up',inputs: {
                    user: {label: 'User', id: 'label-user', validation: true, type: 'text'},  
                    password: {label: 'Password', id: 'label-password', validation: true, type: 'password'},
                    password_confirm: {label: 'Confirm password', id: 'label-password-confirm', validation: true, type: 'password'}
                }
            }
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

        // create toast
        this.toast = new Toast()
        this.modal.modal_content.prepend(this.toast.export)

        // store active sign
        this.sign = {}

        // create nav
        this.nav = new Nav()

        // append signs to nav
        Object.entries(this.sign_parameters).forEach(([key, sign]) => {
            this.nav.append(Object.assign(sign, {content: []}))
        })

        // create confirm button
        this.button_confirm = $('<button></button>').addClass('btn btn-primary').attr({type: 'button'})
        .prop('disabled', true).append('Confirm').on('click', () => {this.confirm()})
    
        // create confirm button
        this.button_cancel = $('<button></button>').addClass('btn btn-secondary').attr({type: 'button'})
            .prop('disabled', false).append('Cancel').on('click', () => {this.cancel()})

        this.buttons = [this.button_cancel, this.button_confirm]

        // append content
        this.modal.append_body(this.nav.export)
        this.modal.append_footer(this.buttons)

        // specify output jQuery object 
        this.export = this.nav.export

        // create tab trigger object 
        this.tab_trigger = {}
        Object.entries(this.nav.labels).forEach(([id, label]) => {
            this.tab_trigger[id] = new bootstrap.Tab(label)
        })
    }

    /**
     * @brief Assign event functions created interface objects.
     */
    create_callbacks() {
        // assign handler to activate tab content
        Object.entries(this.nav.labels).forEach(([key, label]) => {
            label.on('click', () => {
                this.activate(key)
            })
        })
    }

    /**
     * @brief Show modal specified content.
     */
    show(id) {
        setTimeout(() => {
            this.activate(id)
            this.tab_trigger[id].show()
        }, 500)
    }

    /**
     * @brief External event handler.
     */
    proceed(data) {}

    /**
     * @brief Confirm input data.
     */
    confirm () {
        // disabled inputs and tabs
        this.froze(true)

        // set button status
        this.button_confirm.empty()
        this.button_confirm.append([
            $('<span></span>').addClass('spinner-border spinner-border-sm').attr({'aria-hidden': 'true'}),
            $('<span></span>').attr({role: 'status'}).append(' Confirming...')
        ])

        // extract inputs data
        let data = this.sign.data()

        // wait animation starting 
        setTimeout(async () => {
            // prepare request
            let request = {'method': 'POST', 'headers': {'Content-Type': 'application/json'}, 'body': JSON.stringify(data)}
            console.log(request)
            // request
            await fetch('/authorize', request).then(response => response.json()).then(json => {
                console.log(json)
                
                this.toast.show(json['answer']['message'], 
                        json['answer']['state'] ? 'text-bg-primary' : 'text-bg-danger')

                if (json['answer']['state']) {
                    this.proceed(json)
                }

            }).catch(error => {
                this.toast.show(`Error: ${error}`, 'text-bg-danger')
            })

            // rollback appearance of interface
            this.button_confirm.empty()
            this.button_confirm.append('Confirm')
            this.froze(false)
        }, 500)
    }

    /**
     * @brief Cancel handler
     */
    cancel() {
        this.modal.hide()
    }

    /**
     * @brief Check button confirm state.
     */
    check(state) {
        this.button_confirm.prop('disabled', !state)  
    }

    /**
     * @brief Activate specified tab content.
     * @param id string
     */
    activate(id) {
        this.sign = new Sign(this.sign_parameters[id])
        this.nav.edit(id, this.sign.export)

        // set manual criteria handler
        this.sign.inputs['user'].criteria = this.criteria
        this.sign.inputs['password'].criteria = this.criteria

        if (this.sign.inputs.hasOwnProperty('password_confirm'))  {
            this.sign.inputs['password_confirm'].criteria = (value) => {
                let result = this.criteria(value)
                if (result['state']) {
                    if (value != this.sign.inputs['password'].data()) {
                        result = {state: false, message: 'Passwords must coincide.'}
                    }
                }
                return result
            }
        }

        // track button state
        this.check(false)
        this.sign.event = (state) => {this.check(state)}
    }

    /**
     * @brief Manual criteria handler.
     * @param value string
     * @return object
     * @example {state: false, message: "Field must not be empty."}
     */
    criteria(value) {
        let length = 5
        let result = {}
        if (value == '') {
            result = {state: false, message: "Field must not be empty."}
        } else {
            if (value.length < length) {
                result = {state: false, message: `Field length must be greater ${length}.`}
            } else {
                result = {state: true, message: 'Passed'}
            }
        }
        return result
    }

    /**
     * @brief Enable/disable action interface.
     * @param state bool
     */
    froze(state) {
        // disabled all nav tabs
        Object.entries(this.nav.labels).forEach(([key, label]) => {
            label.prop('disabled', state)
        })

        // disable all inputs form
        Object.entries(this.sign.inputs).forEach(([key, input]) => {
            input.input.prop('disabled', state)
        })

        // disable confirm button
        this.button_confirm.prop('disabled', state)  
    }
}

export {Login}
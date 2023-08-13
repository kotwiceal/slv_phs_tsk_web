/**
 * @brief Card container to content other elements.
 */
class Card {
    /**
     * @param header label of card 
     */
    constructor(header) {
        this.header = header
        // store content
        this.body = []
        this.card = $('<div></div>').addClass('card mt-2 mb-4')
        this.card_header = $('<h5></h5>').addClass('card-header').append(this.header)
        this.card_body = $('<div></div>').addClass('card-body')
        this.card.append(this.card_header, this.card_body)

        // specify output jQuery object 
        this.export = this.card
    }

    /**
     * @brief Append to card body
     * @param body appended object 
     */
    append(body) {
        this.card_body.append(body)
    }

    /**
     * @brief Erase content.
     */
    empty() {
        this.card_body.empty()
    }
}

/**
 * @brief Radio group with call event at toggle.
 */
class Radios {
    /**
     * @param parameters object to specify creating radios
     */
    constructor(parameters) {

        // store parameters
        this.parameters = parameters

        // store radios
        this.radios = {}

        // create elements
        this.group = $('<div></div>').addClass('btn-group w-100').attr({role: 'group'})

        // create radios
        this.parameters['radios'].forEach(parameter => {
            let label = $('<label></label>').addClass('btn btn-primary').attr({'for': `radio-${parameter.id}`}).append(parameter.label)
            let input = $('<input>').addClass('btn-check').attr({type: 'radio', name: 'btnradio', value: parameter.value, autocomplete: 'off', id: `radio-${parameter.id}`})
            input.on('change', () => {this.change(input.val())})
            this.parameters['value'] === parameter.value ? input.prop('checked', true) : input.prop('checked', false)
            this.radios[parameter.id] = {input: input, label: label}

            Object.entries(this.radios[parameter.id]).forEach(([id, item]) => {
                this.group.append(item)
            })

        })

        this.export = this.group
    }

    /**
     * @brief Event function at taggle radio group.
     * @param value corresponds to given radio
     */
    change (value) {}

    /**
     * @brief Assign/extract input data.
     * @param value arbitrary: number, string
     * @returns arbitrary: number, string
     */
    data(value) {
        switch (arguments.length) {
            case 0:
                Object.entries(this.radios).forEach(([id, radio]) => {
                    if (radio.input.prop('checked')) {
                        return radio.input.val()
                    }
                })
            case 1:
                Object.entries(this.radios).forEach(([id, radio]) => {
                    if (radio.input.val() == value) {
                        radio.input.prop('checked', true)
                        this.change(value)
                    }
                })
        }

    }
}

/**
 * @brief Checking of value correction in field: array size and belonging value of each element to range.
 * @param value string
 * @param parameters object
 * @example parameters = {dim: 16, limit: [0, 15]}
 * @return result = {state: false, message: 'message'}
 */
function JsonChecker (value, parameters) {
    /**
     * Check JSON string notation.
     * @param jsonString - examed string
     */
    function isValidJsonString(jsonString) {    
        if(!(jsonString && typeof jsonString === 'string')) {
            return false
        }    
        try {
            JSON.parse(jsonString);
            return true
        } catch(error) {
            return false
        }    
    }

    let message = ''
    let state = false
    let line = value
    if (isValidJsonString(line)) {
        let object = JSON.parse(line) 
        if (typeof object == 'number' && parameters.dim == 1) {
            state = true
        }
        else {
            // check length array
            if (object.length == parameters.dim) {
                // check belonging each element to given range
                for (let index in object) {
                    let value = object[index]
                    state = (!isNaN(value)) ? ((value >= parameters.limit[0] && value <= parameters.limit[1]) ? true : false) : false
                }
                if (!state) {
                    message = `data must be an array with elements in range: ${JSON.stringify(parameters.limit)}`
                }
            } else {
                state = false
                message = `data must be an array of given size: ${parameters.dim}`
            }
        }
    } else {
        state = false
        message = `data must be presented in JSON format`
    }
            
    return {state: state, message: message}
}

/**
 * @brief Texarea pattern.
 */
class Textarea {
    /**
     * @param parameter object
     * @example parameter = {label: 'label', id: 'id', validation: true}
     */
    constructor(parameters) {
        this.parameters = parameters
        this.state = false
        // build interface
        this.create_elements()
        // initiate state
        this.check()
    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() { 
        this.textarea = $('<textarea></textarea>').addClass('form-control').attr({id: this.parameters.id})
            .on('blur', () => {this.check()}).on('input', () => {this.check()})
        this.label = $('<label></label>').attr({for: this.parameters.id}).append(this.parameters.label)
        this.feedback = $('<div></div>').addClass('isvalid-feedback')

        // specify output jQuery object 
        this.export = $('<div></div>').addClass('form-floating mt-2 mb-2').append([this.textarea, this.label, this.feedback])
    }

    /**
     * @brief Assign/extract input data.
     * @param value string
     * @returns string
     */
    data() {
        if (arguments.length == 1) {
            this.textarea.val(arguments[0])
            this.check()
        } 
        else {
            return this.textarea.val()
        }
    }

    /**
     * @brief Handler at input changing event.
     */
    check() {
        if (this.parameters.validation) {
            this.status(this.criteria(this.data()))
        } 
        else {
            this.state = true
        }
        this.event(this.state)
    }

    /**
     * @brief Default criteria function (must be changed).
     * @param value string
     * @returns object
     * @example result = {state: false, message: 'invalid value'}
     */
    criteria(value) {
        let result = {state: value == "" ? false : true}
        result['state'] ? result['message'] = 'ok' : result['message'] = 'invalid value'
        return result
    }

    /**
     * @brief Assign appearance according to checking.
     * @param result object
     * @example result = {state: false, message: 'invalid value'}
     * @return bool of state
     */
    status(result) {
        if (arguments.length == 0) {
            return this.state
        }
        else {
            this.state = result['state']
            if (this.state) {
                this.feedback.empty()
                this.feedback.addClass('valid-feedback').removeClass('invalid-feedback')
                this.textarea.addClass('is-valid').removeClass('is-invalid')
            }
            else {
                this.cause(result['message'])
                this.feedback.addClass('invalid-feedback').removeClass('valid-feedback')
                this.textarea.addClass('is-invalid').removeClass('is-valid')
            }
        }
    }

    /**
     * @brief Display feedback message of input form.
     * @param message string to explain cause of fail data checking
     */
    cause(message) {
        this.feedback.empty().append(message)
    }

    /**
     * @brief External event function.
     * @param state bool
     */
    event(state) {}
}

/**
 * @brief Select pttern.
 */
class Select {
    /**
     * @param parameters object
     * @example parameters = {id: 'id-select', label: 'label-select', 
     *  option: [{label: 'label-option', id: 'id-option', value: 'value-option', selected: false}]}
     */
    constructor(parameters) {
        this.parameters = parameters
        this.state = false
        // build interface
        this.create_elements()
    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {
        // create select
        this.div = $('<div></div>').addClass('form-floating')
        this.select = $('<select></select>').addClass('form-select').attr({id: `select-${this.parameters.id}`, 
            'aria-label': this.parameters.label})
        this.select_label = $('<label></label>').attr({for: `select-${this.parameters.id}`}).append(this.parameters.label)
        // append to form
        this.div.append([this.select, this.select_label])
        // create options
        this.options = {}
        this.parameters.options.forEach(option => {
            let option_obj = $('<option></option>').append(option.label).attr({value: option.value}).prop('selected', option.selected)
            this.options[option.id] = option_obj
            this.select.append(option_obj)
        })
        // specify output jQuery object 
        this.export = this.div
    }    

    /**
     * @brief Assign/extract input data.
     * @param value string
     * @returns object
     * @example {id: 'tsk-type', label: 'Task of Type'}
     */
    data() {
        if (arguments.length == 1) {
            this.select.val(arguments[0])
        } 
        else {
            let id = this.select.val()
            return {id: id, label: this.options[id].text()}
        }
    }
}

/**
 * @brief Modal patterm
 * @param parameters object
 * @example parameters = {label: 'Label-modal-header', id: 'id-modal'}
 */
class Modal {
    constructor(parameters) {
        this.parameters = parameters
        // build interface
        this.create_elements()
    }
    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {       
        // create modal
        this.modal = $('<div></div>').addClass('modal fade').attr({id: this.parameters.id, tabindex: '-1', 'aria-hidden': 'true',
            'aria-labelledby': `label-${this.parameters.id}`})
        // create dialog
        this.modal_dialog = $('<div></div>').addClass('modal-dialog modal-dialog-centered')
        // create content
        this.modal_content= $('<div></div>').addClass('modal-content')
        // create header
        this.modal_header = $('<div></div>').addClass('modal-header')
        // create label
        this.modal_label = $('<h5></h5>').addClass('modal-title').append(this.parameters.label).attr({id: `label-${this.parameters.id}`})
        // create close button
        this.button_close = $('<button></button>').addClass('btn-close').on('click', () => {this.hide()})
            .attr({type: 'button', 'aria-label': 'Close'})
        // create body
        this.modal_body = $('<div></div>').addClass('modal-body')
        // create footer
        this.modal_footer = $('<div></div>').addClass('modal-footer')

        // append elements
        this.modal_header.append([this.modal_label, this.button_close])
        this.modal_content.append([this.modal_header, this.modal_body, this.modal_footer])
        this.modal_dialog.append(this.modal_content)
        this.modal.append(this.modal_dialog)

        // create modal object
        this.modal_obj = new bootstrap.Modal(this.modal)

        // specify output jQuery object 
        this.export = this.modal
    }

    /**
     * @brief Hide modal.
     */
    hide() {
        this.modal_obj.hide()
    }

    /**
     * @brief Show modal.
     */
    show() {
        this.modal_obj.show()
    }

    /**
     * @brief Append content to body.
     * @param body jQuery object
     */
    append_body(body) {
        this.modal_body.append(body)
    }

    /**
     * @brief Append content to footer.
     * @param body jQuery object
     */
    append_footer(body) {
        this.modal_footer.append(body)
    }

    /**
     * @brief Erase body content.
     */
    empty_body() {
        this.modal_body.empty()
    }

    /**
     * @brief Erase footer content.
     */
    empty_footer() {
        this.modal_footer.empty()
    }    
}

/**
 * @bief Input pattern.
 */
class Input {
    /**
     * @param parameter object
     * @example parameter = {label: 'label', id: 'id', validation: true}
     */
    constructor(parameters) {
        this.parameters = parameters
        this.state = false
        // build interface
        this.create_elements()
        // initiate state
        this.check()
    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() { 
        // create input
        this.input = $('<input>').addClass('form-control is-invalid')
            .attr({id: this.parameters.id, type: 'text'})
            .on('blur', () => {this.check()}).on('input', () => {this.check()})
        // create input label
        this.label = $('<label></label>').attr({for: this.parameters.id}).append(this.parameters.label)
        // create status notification
        this.feedback = $('<div></div>').addClass('isvalid-feedback')
        // specify output jQuery object 
        this.export = $('<div></div>').addClass('form-floating').append([this.input, this.label, this.feedback])
    }

    /**
     * @brief Assign/extract input data.
     * @param value string
     * @returns string
     */
    data() {
        if (arguments.length == 1) {
            this.input.val(arguments[0])
            this.check()
        } 
        else {
            return this.input.val()
        }
    }

    /**
     * @brief Handler at input changing event.
     */
    check() {
        if (this.parameters.validation) {
            this.status(this.criteria(this.data()))
        } 
        else {
            this.state = true
        }
        this.event(this.state)
    }

    /**
     * @brief Default criteria function (must be changed).
     * @param value string
     * @returns objetc
     * @example result = {state: false, message: 'invalid value'}
     */
    criteria(value) {
        let result = {state: value == "" ? false : true}
        result['state'] ? result['message'] = 'ok' : result['message'] = 'invalid value'
        return result
    }

    /**
     * @brief Assign appearance according to checking.
     * @param result object
     * @example result = {state: false, message: 'invalid value'}
     * @return bool of state
     */
    status(result) {
        if (arguments.length == 0) {
            return this.state
        }
        else {
            this.state = result['state']
            if (this.state) {
                this.feedback.empty()
                this.feedback.addClass('valid-feedback').removeClass('invalid-feedback')
                this.input.addClass('is-valid').removeClass('is-invalid')
            }
            else {
                this.cause(result['message'])
                this.feedback.addClass('invalid-feedback').removeClass('valid-feedback')
                this.input.addClass('is-invalid').removeClass('is-valid')
            }
        }
    }

    /**
     * @brief Display feedback message of input form.
     * @param message string to explain cause of fail data checking
     */
    cause(message) {
        this.feedback.empty().append(message)
    }

    /**
     * @brief External event function.
     * @param state bool
     */
    event(state) {}
}


/**
 * @brief List patters.
 */
class List {
    constructor() {
        this.items = {}
        // build interface
        this.create_elements()
    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {
        this.list_group = $('<div></div>').addClass('list-group')
        this.export = this.list_group
    }

    /**
     * @brief Append item in list.
     * @param parameters object
     */
    append(item, id) {
        this.items[item.parameters.id] = item
        this.list_group.append(this.items[item.parameters.id].export)
    }

    /**
     * Erase list.
     */
    empty() {
        this.list_group.empty()
    }

    /**
     * Remove item by keys.
     */
    remove(key) {
        delete this.items[key]
        this.list_group.find(`#${key}`).remove()
    }
}

/**
 * @brief Nav tab pattern.
 */
class Nav {
    constructor () {
        this.labels = {}
        this.containers = {}
        // build interface
        this.create_elements()
        // create callbacks
        this.create_callbacks()
    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {
        this.label = $('<div></div>').addClass('nav nav-tabs').attr({role: 'tablist'})
        this.content = $('<div></div>').addClass('tab-content')
        this.export = [$('<nav></nav>').append(this.label), this.content]
    }

    /**
     * @brief Assign event functions created interface objects.
     */
    create_callbacks() {

    }

    /**
     * @brief Add tab.
     */
    append(parameters) {
        let button = $('<button></button>').addClass('nav-link').attr({'data-bs-toggle': 'tab', 'data-bs-target': `#nav-${parameters.id}`,
            type: 'button', 'aria-controls': `nav-${parameters.id}`, 'aria-selected': 'false', id: `nav-tab-${parameters.id}`})
            .append(parameters.label)
        let content = $('<div></div>').addClass('tab-pane fade').attr({id: `nav-${parameters.id}`, role: 'tabpanel',
            'aria-labelledby': `nav-tab-${parameters.id}`, tabindex: '0'}).append(parameters.content)
        this.labels[parameters.id] = button
        this.containers[parameters.id] = content

        this.label.append(this.labels[parameters.id])
        this.content.append(this.containers[parameters.id])
    }
}

export {Textarea, Select, Modal, Input, List, Card, Radios, JsonChecker, Nav}
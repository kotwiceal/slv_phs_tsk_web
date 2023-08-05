import * as bootstrap from 'bootstrap'

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
        this.div = $('<div></div>').addClass('form-floating mt-2 mb-2')
        this.textarea = $('<textarea></textarea>').addClass('form-control').attr({id: this.parameters.id})
            .on('blur', () => {this.check()}).on('input', () => {this.check()})
        this.label = $('<label></label>').attr({for: this.parameters.id}).append(this.parameters.label)
        this.feedback = $('<div></div>').addClass('isvalid-feedback')
        this.div.append([this.textarea, this.label, this.feedback])

        // specify output jQuery object 
        this.export = this.div
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
     * @returns bool
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
            console.log(option)
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
     * @returns string
     */
    data() {
        if (arguments.length == 1) {
            this.select.val(arguments[0])
        } 
        else {
            return this.select.val()
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
        // create modal object
        // this.modal_obj = new bootstrap.Modal(this.modal)
        // create dialog
        this.modal_dialog = $('<div></div>').addClass('modal-dialog modal-dialog-centered')
        // create content
        this.modal_content= $('<div></div>').addClass('modal-content')
        // create header
        this.modal_header = $('<div></div>').addClass('modal-header')
        // create label
        this.modal_label = $('<h5></h5>').addClass('modal-title').append(this.parameters.label).attr({id: `label-${this.parameters.id}`})
        // create close button
        this.button_close = $('<button></button>').addClass('btn-close').attr({type: 'button', 'data-bs-dismiss': 'modal', 'aria-label': 'Close'})
        // create body
        this.modal_body = $('<div></div>').addClass('modal-body')
        // create footer
        this.modal_footer = $('<div></div>').addClass('modal-footer')

        // append elements
        this.modal_header.append([this.modal_label, this.button_close])
        this.modal_content.append([this.modal_header, this.modal_body, this.modal_footer])
        this.modal_dialog.append(this.modal_content)
        this.modal.append(this.modal_dialog)

        // specify output jQuery object 
        this.export = this.modal
    }

    /**
     * @brief Show/hide modal.
     * @param value bool
     */
    show() {
        // TODO
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

export {Textarea, Select, Modal}
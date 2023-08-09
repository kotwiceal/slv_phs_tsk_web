import {Textarea, Select, Modal, Input, List} from './toolkit'
import {Main, Problem} from './task_panel'

import {Socket} from './socket'

/**
 * @brief Card container to content other elements.
 */
class Card {
    /**
     * @param header label of card 
     */
    constructor() {
        // create card
        this.card = $('<div></div>').addClass('card mt-2 mb-4')
        // create card body
        this.card_body = $('<div></div>').addClass('card-body')
        // append
        this.card.append(this.card_body)

        // specify output jQuery object 
        this.export = this.card
    }

    /**
     * @brief Append to card body
     * @param obj object 
     */
    append(obj) {
        this.card_body.append(obj.export)
    }

    /**
     * @brief Erase content.
     */
    empty() {
        this.card_body.empty()
    }
}

/**
 * @brief Vertical tab pattert container.
 */
class Tab {
    constructor(parameters) {
        this.parameters = parameters
        this.id = this.parameters.id
        // build interface
        this.create_elements()

    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {
        // create tab link
        this.button_link = $('<button></button>').addClass('nav-link').attr({type: 'button', 'data-bs-toggle': 'pill',
            id: `v-pills-${this.parameters.id}-tab`,
            'data-bs-target': `#v-pills-${this.parameters.id}`, role: 'tab', 
            'aria-controls': `#v-pills-${this.parameters.id}`, 'aria-selected': 'true'}).append(this.parameters.label)
        // create container for tab content
        this.div_content = $('<div></div>').addClass('tab-pane fade').attr({role: 'tabpanel', tabindex: '0', 
            id: `v-pills-${this.parameters.id}`, 'aria-labelledby': `v-pills-${this.parameters.id}-tab`})
    }

    /**
     * @brief Erase content.
     */
    empty(){
        this.div_content.empty()
    }

    /**
     * @brief Append content.
     * @param body jQuery object
     */
    append(body) {
        this.div_content.append(body)
    }
}

/**
 * @brief Menu
 */
class NavTab {
    /**
     * @param 
     */
    constructor() {
        // to store tabs
        this.tabs = {}

        // build interface
        this.create_elements()
    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {
        // create container
        this.div_container = $('<div></div>').addClass('d-flex align-items-start')
        // create contaner to tabs lin
        this.div_link = $('<div></div>').addClass('nav flex-column nav-pills me-3')
        // create container to tabs content
        this.div_content = $('<div></div>').addClass('tab-content')
        // append
        this.div_container.append([this.div_link, this.div_content])
        // specify output jQuery object 
        this.export = this.div_container
    }

    /**
     * @brief Append tabs.
     * @param tabs object
     */
    append(tabs) {
        if (Array.isArray(tabs)) {
            tabs.forEach(tab => {
                let tab_obj = new Tab(tab)
                this.tabs[tab['id']] = tab_obj
                this.div_link.append(tab_obj.button_link)
                this.div_content.append(tab_obj.div_content)
            })
        } else {
            let tab_obj = new Tab(tabs)
            this.tabs[tabs['id']] = tab_obj
            this.div_link.append(tab_obj.button_link)
            this.div_content.append(tab_obj.div_content)
        }
    }

    /**
     * Erase tabs.
     */
    empty() {
        this.tabs = {}
        this.div_link.empty()
        this.div_content.empty()
    }

    /**
     * Remove tab by keys.
     */
    remove(keys) {
        if (Array.isArray(keys)) {
            keys.forEach(key => {
                delete this.tabs[key]
                this.div_link.find(`button[id="v-pills-${key}-tab"]`).remove()
                this.div_container.find(`div[id="v-pills-${key}"]`).remove()
            })
        } else {
            delete this.tabs[keys]
            this.div_link.find(`button[id="v-pills-${keys}-tab"]`).remove()
            this.div_container.find(`div[id="v-pills-${keys}"]`).remove()
        }
    }
}

/**
 * @brief Dialog to create task
 * @param parameters object
 * @example parameters = {select: {}, name: {}, comment: {}}
 */
class Dialog {
    constructor(parameters) {
        this.parameters = parameters

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

        // create select
        this.select = new Select(this.parameters.select)
        // create textarea name
        this.name = new Input(this.parameters.name)
        this.name.input.prop('autofocus', true)
        // create textarea comment
        this.comment = new Textarea(this.parameters.comment)

        // create confirm button
        this.button = $('<button></button>').addClass('btn btn-primary').attr({type: 'button'})
            .prop('disabled', true).append('Confirm').on('click', () => {this.confirm()})

        // appent to container
        this.container.append([this.select.export, this.name.export, this.comment.export])

        // specify output jQuery object 
        this.export = this.container
    }

    /**
     * @brief Assign event functions created interface objects.
     */
    create_callbacks() {
        // check input name data is correct
        this.name.event = (state) => {
            this.button.prop('disabled', !state)
        }
    }

    /**
     * @brief Confirm input data.
     */
    confirm () {
        let data = {type: this.select.data(), name: this.name.data(), comment: this.comment.data(), date: new Date().toLocaleString()}
        data['id'] = sha256(JSON.stringify(data))
        this.proceed(data)
    }

    /**
     * @brief External event.
     */
    proceed(data) {}

    /**
     * @brief Clear input form.
     */
    empty() {
        this.select.data(this.parameters.select.options[0].value)
        this.name.data('')
        this.comment.data('')
    }
}


/**
 * @brief Menu tool.
 */
class WorkspaceOptions {
    constructor() {
        // build interface
        this.create_elements()
    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {
        // create checkbox selector
        this.checkbox = $('<input></input>').addClass('btn-check').prop('disabled', true)
            .attr({type: 'checkbox', id: 'btncheck', autocomplete: 'off', 'data-bs-placement': 'top', 
            'data-bs-title': 'Select', tabindex: '0', 'data-bs-custom-class': 'custom-tooltip'}).on('input', () => {this.check()}),
        // create add button
        this.button_add = $('<button></button>').addClass('btn btn-primary').append($('<i></i>').addClass('bi-plus-lg').css({'font-size': '30px'}))                  
            .attr({type: 'button', 'data-bs-placement': 'top', 
            'data-bs-title': 'Add', 'data-bs-custom-class': 'custom-tooltip'}).on('click', () => {this.add()}),
        // create process button
        this.button_process = $('<button></button>').addClass('btn btn-primary').append($('<i></i>').addClass('bi-cpu').css({'font-size': '30px'}))
            .attr({type: 'button', 'data-bs-placement': 'top', 
            'data-bs-title': 'Process', 'data-bs-custom-class': 'custom-tooltip'}).prop('disabled', true).on('click', () => {this.process()})
        // specify output jQuery object 
        this.export = $('<div></div>').addClass('card mb-4').append(
            $('<div></div>').addClass('card-body').append(
                $('<div></div>').addClass('btn-group w-100').attr({role: 'group'}).append(
                    this.checkbox,
                    $('<label></label>').addClass('btn btn-outline-primary').append(
                        $('<i></i>').addClass('bi-ui-checks').css({'font-size': '30px'})).attr({for: 'btncheck'}),
                    this.button_add,
                    this.button_process
                )
            )
        )

        // define css class for appearance of tooltip
        $('<style>').prop('type', 'text/css').html(".custom-tooltip {--bs-tooltip-bg: var(--bd-violet-bg);--bs-tooltip-color: var(--bs-white);}").appendTo("head");               

        // create tooltip
        this.tooltip = [this.checkbox, this.button_add, this.button_process].map(element => new bootstrap.Tooltip(element))
    }

    /**
     * @brief External event function.
     */
    check() {}

    /**
     * @brief External event function.
     */
    add() {}

    /**
     * @brief External event function.
     */
    process() {}
} 

/**
 * @brief Task create dialog based modal.
 */
class ModalCreate {
    constructor() {
        this.modal_parameters = {label: 'Create task', id: 'modal-create-task'}

        this.dialog_parameters = {
            select: {id: 'dialog-create', label: 'Type', options: [
                    {label: 'Classical gravitation', id: 'tsk_cgrv', value: 'tsk_cgrv', selected: false},
                    {label: 'Linear oscillation', id: 'tsk_losc', value: 'tsk_losc', selected: false}
                ]
            },
            name: {label: 'Name', id: 'label-name', validation: true},  
            comment: {label: 'Comment', id: 'label-comment', validation: false},
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
        // create dialog
        this.dialog = new Dialog(this.dialog_parameters)
        // append content
        this.modal.append_body(this.dialog.container)
        this.modal.append_footer(this.dialog.button)

    }

    /**
     * @brief Assign event functions created interface objects.
     */
    create_callbacks() {
        this.dialog.proceed = () => {this.proceed()}

        // set autu-focus to name input at opening madal
        this.modal.modal.on('shown.bs.modal', () => {
            this.dialog.name.input.focus()
        })
    }

    /**
     * @brief External event handler.
     */
    proceed() {}
}

/**
 * @brief Task delete dialog based modal.
 */
class ModalDelete {
    constructor() {
        this.modal_parameters = {label: 'Delete task', id: 'modal-delete-task'}
        // build interface
        this.create_elements()
    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {
        // create modal
        this.modal = new Modal(this.modal_parameters)
        // append content
        this.modal.append_body('Are you sure?')
        this.modal.append_footer([
            $('<button></button>').addClass('btn btn-secondary').append('Cancel').on('click', () => {this.cancel()}),
            $('<button></button>').addClass('btn btn-primary').append('Confirm').on('click', () => {this.confirm()})
        ])

    }

    /**
     * @brief External event handler.
     */
    cancel() {}

    /**
     * @brief External event handler.
     */
    confirm() {}
}

/**
 * @brief Task edit dialog based modal.
 */
class ModalEdit {
    constructor() {
        this.modal_parameters = {label: 'Configure task', id: 'modal-edit-task'}
        // build interface
        this.create_elements()
    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {
        // create modal
        this.modal = new Modal(this.modal_parameters)
        // aooly style of large container
        this.modal.modal_dialog.addClass('modal-xl')
        // append content
        this.modal.append_footer([
            $('<button></button>').addClass('btn btn-secondary').append('Cancel').on('click', () => {this.cancel()}),
            $('<button></button>').addClass('btn btn-primary').append('Apply').on('click', () => {this.apply()})
        ])

    }

    /**
     * @brief External event handler.
     */
    cancel() {}

    /**
     * @brief External event handler.
     */
    apply() {}
}

/**
 * @brief Progress pattern.
 */
class Progress {
    constructor() {
        // define states
        this.states = {'25%': 'created', '50%': 'initialized', '75%': 'processing', '75%': 'processed'}
        // build interface
        this.create_elements()
    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {
        this.bar = $('<div></div>').addClass('progress-bar progress-bar-striped progress-bar-animated')
        this.export = $('<div></div>').addClass('progress').attr({role: 'progressbar', 
        'aria-valuenow': '25', 'aria-valuemin': '0', 'aria-valuemax': '100'}).css({'height': '3vh', 'font-size': '1.5vh'}).append(this.bar)
    }

    /**
     * @brief Set state.
     */
    set(percent, label) {
        this.bar.empty()
        this.bar.css({'width': percent}).append(label)
    }

    /**
     * @brief Toggle animation
     * @param bool 
     */
    animate(bool) {
        bool ? this.bar.addClass('progress-bar-striped progress-bar-animated') : 
            this.bar.removeClass('progress-bar-striped progress-bar-animated')
    }
}
/**
 * @brief Item task pattern.
 */
class Item {
    constructor(parameters) {
        this.parameters = parameters
        // build interface
        this.create_elements()
    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {
        this.checkbox = $('<input></input>').addClass('form-check-input is-valid me-1')
            .attr({type: 'checkbox', checked: this.parameters.checked}).css({'width': '35px', 'height': '35px'})
            .on('input', () => {this.check()})
        // create edit button
        this.button_edit = $('<button></button>').addClass('btn btn-primary ').append($('<i></i>')
            .addClass('bi-gear').css({'font-size': '30px'})).on('click', () => {this.edit(this.parameters.id)})
            .attr({'data-bs-placement': 'right', 'data-bs-title': 'Edit', 'data-bs-custom-class': 'custom-tooltip'})
        // create result button
        this.button_result = $('<button></button>').addClass('btn btn-primary').attr({id: 'result'}).append($('<i></i>')
            .addClass('bi-graph-up').css({'font-size': '30px'})).prop('disabled', true)
            .on('click', () => {this.result(this.parameters.id)})
            .attr({'data-bs-placement': 'right', 'data-bs-title': 'Result', 'data-bs-custom-class': 'custom-tooltip'})
        // create delete button
        this.button_delete =  $('<button></button>').addClass('btn btn-primary').append($('<i></i>')
            .addClass('bi-trash').css({'font-size': '30px'})).on('click', () => {this.delete(this.parameters.id)})
            .attr({'data-bs-placement': 'right', 'data-bs-title': 'Delete', 'data-bs-custom-class': 'custom-tooltip'})
        // create comment info
        this.comment = new Textarea({label: 'Comment', id: 'label-comment', validation: false})
        this.comment.textarea.addClass('overflow-y-scroll')
        this.comment.textarea.prop('disabled', true).css({'max-height': '100px'})
        this.comment.data(this.parameters.comment)

        // create progress bar
        this.progress = new Progress()
        this.progress.set('25%', 'created')

        // specify output jQuery object 
        this.export = $('<a></a>').addClass('list-group-item').attr({'aria-current': 'true', 
            id: this.parameters.id}).append(
            $('<div></div>').addClass('container').append(
                $('<div></div>').addClass('row d-flex align-items-center').append(
                    $('<div></div>').addClass('col-1').append(
                        this.checkbox,
                        $('<div></div>').addClass('invalid-feedback').append('fail')
                    ),
                    $('<div></div>').addClass('col').append(
                        $('<div></div>').addClass('d-flex justify-content-between').append(
                            $('<h5></h5>').addClass('mb-1').append(this.parameters.name),
                            $('<small></small>').append('Created: ' + this.parameters.date),                                        
                        ),
                        $('<p></p>').addClass('mb-1').append(`${this.parameters.type.label}`),
                        this.comment.export,
                        // $('<small></small>').append(`Comment: ${this.parameters.comment}`),
                        this.progress.export,
                        $('<br></br>'),
                        $('<small></small>').append(`ID: ${this.parameters.id}`)
                    ),
                    $('<div></div>').addClass('col-1').append(
                        $('<div></div>').addClass('btn-group-vertical').attr({role: 'group'}).append(
                                this.button_edit,
                                this.button_result,
                                this.button_delete
                        )
                    )
                ),
            )
        )

        // create tooltip
        this.tooltip = [this.button_edit, this.button_result, this.button_delete].map(element => new bootstrap.Tooltip(element))

    }

    /**
     * @brief External event handler.
     * @param id
     */
    edit(id) {}

    /**
     * @brief External event handler.
     * @param id
     */
    delete(id) {}

    /**
     * @brief External event handler.
     * @param id
     */
    check() {}

    /**
     * @brief External event handler.
     * @param id
     */
    result(id) {}
}

/**
 * @brief Toast pattern.
 */
class Toast {
    constructor() {
        // to store toasts
        this.toasts = {}
        // to store toast bootstrap objects
        this.toastBootstrap = []
        // build interface
        this.create_elements()
    }
    
    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {
        this.export = $('<div></div>').addClass('toast-container position-static')
    }

    show(data) {
        this.toasts[data['id']] = $('<div></div>').addClass('toast').attr({role: 'alert', 'ria-live': 'assertive', 'aria-atomic': 'true'}).append(
            $('<div></div>').addClass('toast-header').append(
                $('<strong></strong>').addClass('me-auto').append('Task manager'),
                $('<small></small>').addClass('text-body-secondary').append(new Date().toLocaleString()),
                $('<button></button>').attr({type: 'button', 'data-bs-dismiss': 'toast', 'aria-label': 'Close'}).addClass('btn-close')
            ),
            $('<div></div>').addClass('toast-body').append(
                `Task with ID: ${data['id']} is processed successfully.`
            )
        )
        this.export.append(this.toasts[data['id']])
        this.toastBootstrap.push(new  bootstrap.Toast(this.toasts[data['id']]))
        this.toastBootstrap[this.toastBootstrap.length-1].show()
    }
}


/**
 * @brief Workspace tab interface
 */
class Workspace {
    constructor() {
        // store task
        this.tasks = {}
        // store task object
        this.task_obj = {}
        // define problem default parameters
        this.problem_default = {dimension: 2, initial: [{r: [0, 0], dr: [0, 0], m: 1}, {r: [2, 2], dr: [0, 0], m: 1}, 
            {r: [1, -2], dr: [0, 0], m: 2}], 
            physics: {g: 1, t: [0, 50, 1000]}}

        // create socket
        this.socket = new Socket('/solver')

        // build interface
        this.create_elements()
       // assign callback functions
        this.create_callbacks()
    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {

        // create modal creating/editing/deleteing dialogs
        this.modal_create_task = new ModalCreate()
        this.modal_edit_task = new ModalEdit()
        this.modal_delete_task = new ModalDelete()

        // create option button group
        this.option = new WorkspaceOptions()
        
        // create task list
        this.list = new List()

        // create toast
        this.toast = new Toast()

        // specify output jQuery object 
        this.export = $('<div></div>').addClass('container-fluid').append([this.option.export, this.list.export, this.toast.export])
    }

    /**
     * @brief Assign event functions created interface objects.
     */
    create_callbacks() {

        this.modal_edit_task.cancel = () => {this.modal_edit_task.modal.hide()}
        this.modal_edit_task.apply = () => {
            
            let id = this.modal_edit_task.target

            // define state of item according to correcness task problem initialization
            if (this.task_obj.status()) {
                // apply data of input from problem object and store them
                this.tasks[id]['problem'] = this.task_obj.data()
                this.tasks[id]['problem']['status'] = true
                this.list.items[id].checkbox.addClass('is-valid').removeClass('is-invalid')
                this.list.items[id].checkbox.prop('disabled', false)
                // set progress status
                this.list.items[id].progress.set('50%', 'initiated')
                this.list.items[id].progress.animate(true)

            } else {
                this.list.items[id].checkbox.addClass('is-invalid').removeClass('is-valid')
                this.list.items[id].checkbox.prop('disabled', true)
                // set progress status
                this.list.items[id].progress.set('25%', 'created')
                this.list.items[id].progress.animate(true)
                this.list.items[id].check()
            }
            // hide dialog
            this.modal_edit_task.modal.hide()
        }
        
        // define cancel handler function
        this.modal_delete_task.cancel = () => {this.modal_delete_task.modal.hide()}
        // define handler function at deleting item 
        this.modal_delete_task.confirm = () => {
            this.modal_delete_task.modal.hide()
            this.list.remove(this.modal_delete_task.target)
            delete this.tasks[this.modal_delete_task.target]

            // define option buttons behaviour
            if (Object.keys(this.tasks).length === 0 && this.tasks.constructor === Object) {
                this.option.checkbox.prop('disabled', true)
                this.option.button_process.prop('disabled', true)
            }
        }

        this.modal_create_task.dialog.proceed = (data) => {
            // TODO separation task types

            // define task problem parameters
            this.tasks[data.id] = Object.assign({}, data, {problem: this.problem_default, result: {}})

            // define initial state of option checkbox
            this.option.checkbox.prop('disabled', false)

            // define checkbox state accordint to checkobx of ooption panel
            data['checked'] = this.option.checkbox.prop('checked')

            // create task item
            this.list.append(new Item(data))

            // define state of item according to correcness task problem initialization
            this.list.items[data.id].checkbox.prop('disabled', true)

            // clear input form of dialog
            this.modal_create_task.dialog.empty()

            // hide dialog
            this.modal_create_task.modal.hide()
        }


        // define add button handler
        this.option.add = () => {
            this.modal_create_task.modal.show()
        }
        // to check items
        this.option.check = () => {
            let state_array = []
            // store state option checkbox
            let state = this.option.checkbox.prop('checked')
            Object.entries(this.list.items).forEach(([key, item]) => {
                // assign value attribute according to state of option checkbox
                if (!item.checkbox.prop('disabled')) {
                    item.checkbox.prop('checked', state)
                    state_array.push(state)
                }
            })
            // define option buttons behaviour: logical OR
            state = state_array.reduce((accumulation, element) => accumulation + element, true)
            if (state > 1) {
                this.option.button_process.prop('disabled', false)
            } else {
                this.option.button_process.prop('disabled', true)
            }
        }

        // define process button handler
        this.option.process = () => {
            let tasks = []
            // list tasks
            Object.entries(this.tasks).forEach(([id, task]) => {
                // check state of initialization and selected checkbox
                if (task['problem']['status'] && this.list.items[id].checkbox.prop('checked')) {
                    // accumulate tasks
                    tasks.push(task)

                    // disabled checkbox of item
                    this.list.items[id].checkbox.prop('disabled', true)

                    // set progress status
                    this.list.items[id].progress.set('75%', 'processing')
                    this.list.items[id].progress.animate(true)
                }
            })
            // send data via socket to server
            this.socket.emit('process', tasks)
        }
        
        // define edit task handler
        Item.prototype.edit = (id) => {
            // empty previosly content of modal body
            this.modal_edit_task.modal.empty_body()

            // define target
            this.modal_edit_task.target = id

            // create problem
            this.task_obj = new Problem()

            // set data to problem
            this.task_obj.data(this.tasks[id]['problem'])

            // display problem content
            this.modal_edit_task.modal.append_body(this.task_obj.export)

            // open dialog
            this.modal_edit_task.modal.show()
        }

        // define delete task handler
        Item.prototype.delete = (id) => {
            this.modal_delete_task.modal.show()
            this.modal_delete_task.target = id
        }

        // define check handler
        Item.prototype.check = () => {
            let state_array = []
            Object.entries(this.list.items).forEach(([key, item]) => {
                // check state of checkbox
                if (!item.checkbox.prop('disabled')) {
                    // accumulate state
                    state_array.push(item.checkbox.prop('checked'))
                }
            })
            // define option buttons behaviour: logical OR
            let state = state_array.reduce((accumulation, element) => accumulation + element, true)
            if (state > 1) {
                this.option.button_process.prop('disabled', false)
            } else {
                this.option.button_process.prop('disabled', true)
            }
        }

        // define socket handler
        this.socket.socket.on('process', (data) => {
            console.log(data)
            // enable result button
            this.list.items[data['id']].button_result.prop('disabled', false)

            // set progress status
            this.list.items[data['id']].progress.set('100%', 'processed')
            this.list.items[data['id']].progress.animate(false)

            // enable checkbox of item            
            this.list.items[data['id']].checkbox.prop('disabled', false)

            this.toast.show(data)
        })

    }
}

class Menu {
    constructor(parent) {
        this.parent = parent

        // build interface
        // this.create_elements()
        this.bypass_interface()
    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {

        // create container
        this.div_container = $('<div></div>').addClass('container')
            .css({'padding-top': '5vh', 'width': '50%'})

        // create card
        this.card = new Card()
        // create navtab
        this.navtab = new NavTab()
        this.card.append(this.navtab)

        // append to parent
        this.div_container.append(this.card.export)
        this.parent.append(this.div_container)

        // create tabs
        let parameters = [{id: 'workspace', label: 'Workspace'}, {id: 'profile', label: 'Profile'}]
        this.navtab.append(parameters)
        
        this.workspace = new Workspace()
        this.navtab.tabs['workspace'].append(this.workspace.export)

    }

    bypass_interface() {
        // create container
        this.div_container = $('<div></div>').addClass('container')
            .css({'padding-top': '5vh', 'width': '50%'})
        this.workspace = new Workspace()

        this.div_container.append(this.workspace.export)

        this.parent.append(this.div_container)
    }
}

export {Menu}
import {Textarea, Select, Modal, List} from './toolkit'
import {Main, Problem} from './task_panel'

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
        this.name = new Textarea(this.parameters.name)
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
}


/**
 * @brief Menu tool.
 */
class WorkspaceOptions {
    constructor() {
        this.export = $('<div></div>').addClass('card mb-4').append(
            $('<div></div>').addClass('card-body').append(
                $('<div></div>').addClass('btn-group w-100').attr({role: 'group'}).append(
                    $('<input></input>').addClass('btn-check')
                        .attr({type: 'checkbox', id: 'btncheck', autocomplete: 'off'}).on('input', () => {this.check()}),
                    $('<label></label>').addClass('btn btn-outline-primary').append(
                        $('<i></i>').addClass('bi-ui-checks').css({'font-size': '30px'})).attr({for: 'btncheck'}),
                    $('<button></button>').addClass('btn btn-primary').append($('<i></i>').addClass('bi-plus-lg').css({'font-size': '30px'}))                  
                        .attr({type: 'button'}).on('click', () => {this.add()}),
                    $('<button></button>').addClass('btn btn-primary').append($('<i></i>').addClass('bi-cpu').css({'font-size': '30px'}))
                        .attr({type: 'button'}).on('click', () => {this.manager()})
                )
            )
        )
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
    manager() {}
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
        this.export = $('<a></a>').addClass('list-group-item').attr({'aria-current': 'true', 
            id: this.parameters.id}).append(
            $('<div></div>').addClass('container').append(
                $('<div></div>').addClass('row d-flex align-items-center').append(
                    $('<div></div>').addClass('col').append(
                        $('<input></input>').addClass('form-check-input is-valid me-1')
                            .attr({type: 'checkbox', value: '', id: 'firstCheckbox'})
                            .css({'width': '35px', 'height': '35px'}),
                        $('<div></div>').addClass('invalid-feedback').append('Incorrect initialization')
                    ),
                    $('<div></div>').addClass('col').append(
                        $('<div></div>').addClass('d-flex justify-content-between').append(
                            $('<h5></h5>').addClass('mb-1').append(this.parameters.name),
                            $('<small></small>').append(this.parameters.date),                                        
                        ),
                        $('<p></p>').addClass('mb-1').append(`${this.parameters.type.label}`),
                        $('<small></small>').append(`Comment: ${this.parameters.comment}`),
                        $('<br></br>'),
                        $('<small></small>').append(`ID: ${this.parameters.id}`)
                    ),
                    $('<div></div>').addClass('col').append(
                        $('<div></div>').addClass('btn-group-vertical').attr({role: 'group'}).append(
                            $('<button></button>').addClass('btn btn-primary ').append($('<i></i>')
                                .addClass('bi-gear').css({'font-size': '30px'})).on('click', () => {this.edit(this.parameters.id)}),
                            $('<button></button>').addClass('btn btn-primary').append($('<i></i>')
                                .addClass('bi-trash').css({'font-size': '30px'})).on('click', () => {this.delete(this.parameters.id)})
                        )
                    )
                ),
            )
        )
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
}

/**
 * @brief Workspace tab interface
 */
class Workspace {
    constructor() {
        // store task
        this.tasks = {}
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

        // specify output jQuery object 
        this.export = $('<div></div>').addClass('container-fluid').append([this.option.export, this.list.export])
    }

    /**
     * @brief Assign event functions created interface objects.
     */
    create_callbacks() {

        this.modal_edit_task.cancel = () => {this.modal_edit_task.modal.hide()}
        this.modal_edit_task.apply = () => {this.modal_edit_task.modal.hide()}
        
        this.modal_delete_task.cancel = () => {this.modal_delete_task.modal.hide()}
        this.modal_delete_task.confirm = () => {
            console.log(this.modal_delete_task.target)
            this.modal_delete_task.modal.hide()
            this.list.remove(this.modal_delete_task.target)
            delete this.tasks[this.modal_delete_task.target]
        }

        this.modal_create_task.dialog.proceed = (data) => {
            // TODO separation task types
            this.modal_edit_task.modal.empty_body()
            this.tasks[data.id] = new Problem()
            this.modal_edit_task.modal.append_body(this.tasks[data.id].export)
            let item = new Item(data)
            this.list.append(item.export, data.id)
            this.modal_create_task.modal.hide()
        }

        // to open task creation dialog
        this.option.add = () => {this.modal_create_task.modal.show()}

        // this.list.item_pattern = (parameters) => {return this.create_item(parameters)}

        Item.prototype.edit = (id) => {
            this.modal_edit_task.modal.empty_body()
            this.tasks[id] = new Problem
            this.modal_edit_task.modal.append_body(this.tasks[id].export)
            this.modal_edit_task.modal.show()
        }

        Item.prototype.delete = (id) => {
            this.modal_delete_task.modal.show()
            this.modal_delete_task.target = id
        }
    }

    /**
     * @brief Open task creation dialog.
     */
    item_create() {
        this.modal_create_task.modal.show()
    }

    /**
     * @brief Create task item in list.
     */
    proceed(data) {
        console.log(data)
        this.list.append(data)
        this.modal_create_task.modal.hide()
    }

    /**
     * @brief Edit item event.
     * @param id
     */
    item_edit(id) {
        this.modal_edit_task.modal.empty_body()
        this.tasks[id] = new Problem
        this.modal_edit_task.modal.append_body(this.tasks[id].export)
        this.modal_edit_task.modal.show()
    }

    /**
     * @brief Edit item event.
     * @param id
     */
    item_delete(id) {
        this.modal_delete_task.modal.show()
        this.modal_delete_task.target = id
    }

    create_item(parameters) {
        return $('<a></a>').addClass('list-group-item').attr({'aria-current': 'true', 
            id: parameters.id}).append(
            $('<div></div>').addClass('container').append(
                $('<div></div>').addClass('row d-flex align-items-center').append(
                    $('<div></div>').addClass('col').append(
                        $('<input></input>').addClass('form-check-input is-valid me-1')
                            .attr({type: 'checkbox', value: '', id: 'firstCheckbox'})
                            .css({'width': '35px', 'height': '35px'}),
                        // $('<div></div>').addClass('invalid-feedback').append('Incorrect initialization')
                    ),
                    $('<div></div>').addClass('col').append(
                        $('<div></div>').addClass('d-flex justify-content-between').append(
                            $('<h5></h5>').addClass('mb-1').append(parameters.name),
                            $('<small></small>').append(parameters.date),                                        
                        ),
                        $('<p></p>').addClass('mb-1').append(`${parameters.type.label}`),
                        $('<small></small>').append(`Comment: ${parameters.comment}`),
                        $('<br></br>'),
                        $('<small></small>').append(`ID: ${parameters.id}`)
                    ),
                    $('<div></div>').addClass('col').append(
                        $('<div></div>').addClass('btn-group-vertical').attr({role: 'group'}).append(
                            $('<button></button>').addClass('btn btn-primary ').append($('<i></i>')
                                .addClass('bi-gear').css({'font-size': '30px'})).on('click', () => {this.item_edit(parameters.id)}),
                            $('<button></button>').addClass('btn btn-primary').append($('<i></i>')
                                .addClass('bi-trash').css({'font-size': '30px'})).on('click', () => {this.item_delete(parameters.id)})
                        )
                    )
                ),
            )
        )
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
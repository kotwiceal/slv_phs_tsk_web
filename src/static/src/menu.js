import {Textarea, Select, Modal} from './toolkit'

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
            console.log(tabs)
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
        this.div = $('<div></div >').addClass('list-group')
        this.export = this.div
    }

    /**
     * @brief Append item in list.
     * @param parameters object
     */
    append(parameters) {
        if (Array.isArray(parameters)) {
            parameters.forEach(parameter => {
                let item = $('<button></button>').addClass('list-group-item list-group-item-action')
                    .attr({type: 'button', id: `list-group-item-${parameter.id}`})
                    .append(parameter.label).on('click', () => {this.event(parameter.value)})
                this.items[parameter.id] = item
                this.div.append(item)
            })
        } 
        else {
            let item = $('<button></button>').addClass('list-group-item list-group-item-action')
                .attr({type: 'button', id: `list-group-item-${parameters.id}`})
                .append(parameters.label).on('click', () => {this.event(parameters.value)})
            this.items[parameters.id] = item
            this.div.append(item)
        }
    }

    /**
     * Erase list.
     */
    empty() {
        this.div.empty()
    }

    /**
     * Remove item by keys.
     */
    remove(keys) {
        if (Array.isArray(keys)) {
            keys.forEach(key => {
                delete this.item[key]
                this.div.find(`button[id="list-group-item-${key}"]`).remove()
            })
        } else {
            delete this.tabs[keys]
            this.div.find(`button[id="list-group-item-${keys}"]`).remove()
        }
    }

    /**
     * @brief Event handler at push item of list.
     * @param value objet
     */
    event(value) {
        console.log(value)
    }
}

/**
 * @brief Dialog to create task
 * @param parameters object
 * @example parameters = {id: 'id-select', label: 'label-select', option: [{label: 'label-option', id: 'id-option', value: 'value-option', selected: 'true/false'}]}
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
            .prop('disabled', true).append('Confirm').on('click', () => {this.proceed()})

        // appent to container
        this.container.append([this.select.export, this.name.export, this.comment.export])

        // specify output jQuery object 
        this.export = this.container
    }

    create_callbacks() {
        this.name.event = (state) => {
            this.button.prop('disabled', !state)
        }
    }

    /**
     * @brief Confirm input data.
     */
    proceed () {
        let data = {type: this.select.data(), name: this.name.data(), comment: this.comment.data()}
        console.log(data)
        this.proceed_event(data)
    }

    /**
     * @brief External event.
     */
    proceed_event(data) {}
}

/**
 * @brief Workspace tab interface
 */
class Workspace {
    constructor() {
        this.index = 0
        // build interface
        this.create_elements()
    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {
        // create coontainer
        this.div_container = $('<div></div>').addClass('container')

        // create modal creation dialog
        let modal_parameters = {label: 'Create task', id: 'modal-create-task'}
        this.modal_create = new Modal(modal_parameters)

        // create dialog form
        let dialog_parameters = {
            select: {id: 'dialog-create', label: 'Type', options: [
                    {label: 'Classical gravitation', id: 'tsk_cgrv', value: 'tsk_cgrv', selected: false},
                    {label: 'Linear oscillation', id: 'tsk_losc', value: 'tsk_losc', selected: false}
                ]
            },
            name: {label: 'Name', id: 'label-name', validation: true},  
            comment: {label: 'Comment', id: 'label-comment', validation: false},
        }
        console.log(dialog_parameters)
        this.dialog = new Dialog(dialog_parameters)
        // appent dialog form to modal
        this.modal_create.append_body(this.dialog.container)
        this.modal_create.append_footer(this.dialog.button)
        // assign callback
        this.dialog.proceed_event = (data) => {
            this.list.append({label: `task: ${data.name}`, id: `task-${this.index}`, value: this.index})
            this.index += 1
        }

        // create add button
        this.button_create = $('<button></button>').addClass('btn btn-primary w-100')
            .append($('<i></i>').addClass('bi-plus-lg'))
            .attr({type: 'button', 'data-bs-toggle': 'modal', 'data-bs-target': `#${modal_parameters.id}`})
        // create list
        this.list = new List()
        // appent to container
        this.div_container.append([this.modal_create.export, this.button_create, this.list.export])
        // specify output jQuery object 
        this.export = this.div_container
    }

}

class Menu {
    constructor(parent) {
        this.parent = parent

        // build interface
        this.create_elements()
    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {

        // create container
        this.div_container = $('<div></div>').addClass('container').css({'padding-top': '5vh', 'width': '70%'})

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
}

export {Menu}
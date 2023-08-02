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
     * Append to card body
     * @param body appended object 
     */
    append(body) {
        this.body.push(body);
        this.card_body.append(body)
    }
}

/**
 * @brief Radio group with call event at toggle.
 */
class Radios {
    /**
     * @param radio_param object to specify creating radios
     * @param value initial value for radio group
     */
    constructor(radio_param, value) {

        this.radio_param = radio_param
        this.value = value

        // store radios
        this.radios = []

        // create elements
        this.div_btn_group = $('<div></div>').addClass('btn-group w-100').attr({role: 'group'})

        // create radios
        this.radio_param.forEach(param => {
            let label = $('<label></label>').addClass('btn btn-primary').attr({'for': `radio-${param.id}`}).append(param.label)
            let input = $('<input>').addClass('btn-check')
                .attr({type: 'radio', name: 'btnradio', autocomplete: 'off', id: `radio-${param.id}`})
                .on('change', () => {
                    this.value = param.value
                    this.change(param.value)
                })
            this.value === param.value ? input.prop('checked', true) : input.prop('checked', false)
            this.radios.push([input, label])
        })

        this.radios = this.radios.flat(1)
        this.div_btn_group.append(this.radios)

        this.export = this.div_btn_group
    }

    /**
     * @brief Event function at taggle radio group.
     * @param value corresponds to given radio
     */
    change (value) {}
}

/**
 * @brief Input pattern to track passed values.
 */
class Input {
    /**
     * @param {*} parameter object presenting layout of appearance 
     * @example parameter = {label: 'Index', dim: 16, initial: [0, 1, 2, 3], limit: [0, 15]}
     */
    constructor(parameter) {
        this.parameter = parameter
        this.state = false

        // create elements
        this.input_group = $('<div></div>').addClass('input-group has-validation')        
        this.div_form_float = $('<div></div>').addClass('form-floating is-invalid')       

        this.input = $('<input>').attr({id: `floatingInputGroup-${this.parameter.id}`, type: 'text', 
            placeholder: this.parameter.label}).prop('required', true)
            .addClass('form-control is-invalid').val(JSON.stringify(this.parameter.initial))
            .on('input', () => {this.change()}).on('blur', () => {this.change()})
        this.label = $('<label></label>').attr({for: `floatingInputGroup-${this.parameter.id}`}).append(this.parameter.label)

        this.div_feedback = $('<div></div>').addClass('invalid-feedback')

        // append elements
        this.div_form_float.append([this.input, this.label])
        this.input_group.append([this.div_form_float, this.div_feedback])

        // initialte state
        this.check()

        // specify output jQuery object 
        this.export = this.input_group
    }

    /**
     * @brief Trigger function at updating input state.
     */
    change() {
        // check input form data
        this.check()
        // call event
        this.event()
    }

    /**
     * @brief Event function at updating input state.
     */
    event() {}

    /**
     * @brief Get input value.
     * @returns input value
     */
    data() {
        let result = []
        try {
            result = JSON.parse(this.input.val())
        }
        catch {
        }
        return result
    }

    /**
     * @brief Checking of value correction in field: array size and belonging value of each element to range.
     */
    check() {
        let line = this.input.val()
        if (this.isValidJsonString(line)) {
            let object = JSON.parse(line) 
            if (typeof object == 'number' && this.parameter.dim == 1) {
                this.state = true
            }
            else {
                // check length array
                if (object.length == this.parameter.dim) {
                    // check belonging each element to given range
                    for (let index in object) {
                        let value = object[index]
                        this.state = (!isNaN(value)) ? ((value >= this.parameter.limit[0] && value <= this.parameter.limit[1]) ? true : false) : false
                    }
                    if (!this.state) {
                        this.cause(`data must be an array with elements in range: ${JSON.stringify(this.parameter.limit)}`)
                    }
                } else {
                    this.state = false
                    this.cause(`data must be an array of given size: ${this.parameter.dim}`)
                }
            }
        } else {
            this.state = false
            this.cause(`data must be presented in JSON format`)
        }
        
        this.update(this.state)
    }

    /**
     * Check JSON string notation.
     * @param jsonString - examed string
     */
    isValidJsonString(jsonString) {    
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

    /**
     * @brief Update input form style.
     * @param state bool
     */
    update (state) {
        if (state) {
            this.input.removeClass('is-invalid').addClass('is-valid')
            this.div_form_float.removeClass('is-invalid').addClass('is-valid')
            this.div_feedback.removeClass('invalid-feedback').addClass('valid-feedback')
            this.cause(`data are passed`)
        }
        else {
            this.input.addClass('is-invalid').removeClass('is-valid')
            this.div_form_float.addClass('is-invalid').removeClass('is-valid')
            this.div_feedback.addClass('invalid-feedback').removeClass('valid-feedback')
        }
    }

    /**
     * @brief Display feedback message of input form.
     * @param message string to explain cause of fail data checking
     */
    cause(message) {
        this.div_feedback.empty().append(message)
    }
}

/**
 * @brief Class presents the tab button and container bound by toggle.
 * @param parameters object presenting layout of appearance
 */
class Tab {
    constructor(parameters) {
        this.parameters = parameters

        // create tab of navbar
        this.button = $('<button></button>').addClass('nav-link')
            .attr({'id': `nav-${this.parameters.id}-tab`, 'data-bs-toggle': 'tab', 'data-bs-target': `#nav-${this.parameters.id}`, 
                'type': 'button', 'role': 'tab', 'aria-controls': `#nav-${this.parameters.id}`,
                'aria-selected': 'false'}).append(this.parameters.label)
        // create container to store content
        this.div = $('<div></div>').addClass('tab-pane fade').attr({'id': `nav-${this.parameters.id}`, 'role': 'tabpanel', 
            'aria-labelledby': `nav-${this.parameters.id}-tab`, 'tabindex': '0'})
    }
}

/**
 * @brief Container content using navigation via tabs.
 * @param parameters object presenting layout of appearance
 * @example parameters = {tabs: [{label: 'Problem', id: 'problem'}, {label: 'Result', id: 'result'}],
 * style: {card: {}, container: {}}}
 */
class CardTab {
    constructor(parameters) {

        this.parameters = parameters
        // store tab objects
        this.tabs = {}

        // build interface
        this.create_elements()

        // create tabs according to parameters.tabs settings
        this.parameters.tabs.forEach(tab_param => {
            this.tabs[tab_param['id']] = new Tab(tab_param)
            this.div_nav_tab.append(this.tabs[tab_param['id']].button)
            this.div_tab_content.append(this.tabs[tab_param['id']].div)
        });

        // append content to card
        this.div_card_footer.append('Footer')

    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {
        // create elements
        this.div_container = $('<div></div>').addClass('container').css(this.parameters.style.container)
        this.div_card = $('<div></div>').addClass('card').css(this.parameters.style.card)
        this.div_card_header = $('<div></div>').addClass('card-header')

        this.div_nav_tab = $('<div></div>').addClass('nav nav-tabs card-header-tabs')
        this.div_tab_content = $('<div></div>').addClass('tab-content overflow-auto')

        this.div_card_body = $('<div></div>').addClass('card-body')
        this.div_card_footer = $('<div></div>').addClass('card-footer text-body-secondary')
        this.div_tab_content = $('<div></div>').addClass('tab-content overflow-auto')

        // append elements
        this.div_card_header.append(this.div_nav_tab)
        this.div_card_body.append(this.div_tab_content)
        this.div_card.append([this.div_card_header, this.div_card_body, this.div_card_footer])
        this.div_container.append(this.div_card)

        // specify output jQuery object 
        this.export = this.div_container
    }
}

/**
 * @brief Container to specify dimension of task.
 */
class Dimension {
    constructor() {
        // build interface
        this.create_elements()
    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {
        // create card container
        this.card = new Card('Dimension')

        // create radio buttons
        this.radios = new Radios([{label: '2D', id: '2d', value: 2}, {label: '3D', id: '3d', value: 3}], 3)
        this.card.append(this.radios.export)

        // specify output jQuery object 
        this.export = this.card.export
    }
}

/**
 * @brief Form to assign initial conditions.
 */
class InitialCondition {
    constructor() {

        this.parameters = {inputs: [{id: 'r', label: 'Initial coordinate vecror', dim: 3, limit: [0, 5], initial: [0.1, 0.2, 1]},
            {id: 'dr', label: 'Initial velocity vecror', dim: 3, limit: [0, 5], initial: [0.1, 0.2, 1]},
            {id: 'm', label: 'Mass', dim: 1, limit: [0, 5], initial: 1}]}

        // store created body objects
        this.bodies = {}
        this.index = 0

        // build interface
        this.create_elements()

        // difine state
        this.state = this.status()

    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {
        // create card container
        this.card = new Card('Initial condition')
        // assign styles to card container
        this.card.card_body.addClass('overflow-y-scroll').css({'height': '30vh'})

        // create add button
        this.button_add = $('<button ></button>').addClass('btn btn-primary w-100').append($('<i></i>').addClass('bi-plus-lg'))
            .on('click', () => {this.add()})
        this.card.append(this.button_add)

        // create list
        this.ul = $('<ul></ul>').addClass('list-group mt-2 mb-2')
        this.card.append(this.ul)

        // specify output jQuery object 
        this.export = this.card.export
    }

    /**
     * @brief Callback add button click
     */
    add() {
        // create body object
        let body = new Body(this.bodies, this.index, this.parameters)
        // append body object to list
        this.ul.append(body.export)
        // registrate created body object in dictionary
        this.bodies[this.index] = body
        this.index += 1
        // perform event
        this.check()

        // if (this.card_preview.card.css('display') == 'none') {
        //     this.card_preview.card.show()
        //     this.fiugre_preview.load()
        // }
    }

    /**
     * @brief Return data of initial conditions.
     * @returns array of object
     * @example data = [{r: [0, 0, 0], dr: [0, 0, 0], m: 1}, {r: [1, 1, 1], dr: [1, 1, 1], m: 2}]
     */
    data() {
        let data = new Array()
        Object.entries(this.bodies).forEach(
            ([key, item]) => {
                data.push(item.data())
            }
        )
        return data
    }

    /**
     * @brief Check correctness of list inputs form data.
     * @returns bool correctness of list inputs form data
     */
    status() {
        let state = true
        if (!(Object.keys(this.bodies).length === 0 && this.bodies.constructor === Object)) {
            Object.entries(this.bodies).forEach(
                ([key, item]) => {
                    state = item.status() && state
                }
            )
            return state
        }
        else {
            return false
        }
    }

    /**
     * @brief Support callback function.
     */
    check() {}
}

/**
 * @brief Form to assign initial condition given body.
 */
class Body {
    constructor(bodies, index, parameter) {

        this.parameter = parameter
        this.bodies = bodies // object of created body instances
        this.index = index // identifier

        // store created inputs objects
        this.inputs = [] 

        // build interface
        this.create_elements()

        // define state
        this.state = this.status()
    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {
        // create list item
        this.li = $('<li></li>').addClass('list-group-item')
        this.div_row = $('<div></div>').addClass('row g-2')
        this.li.append(this.div_row)

        // create inputs
        this.parameter.inputs.forEach(input_param => {
            let input = new Input(input_param)
            let div_col = $('<div></div>').addClass('col-md')
            div_col.append(input.export)
            this.div_row.append(div_col)
            // store input object
            this.inputs.push(input)
        })

        // create delete button
        this.button_delete = $('<button></button>').addClass('btn btn-primary w-100 h-100').append($('<i></i>').addClass('bi-trash'))
            .on('click', () => {this.clear()})
        let div_col = $('<div></div>').addClass('col-1')
        div_col.append(this.button_delete)
        this.div_row.append(div_col)

        // specify output jQuery object 
        this.export = this.li
    }

    /**
     * @brief Return data of given initial condition.
     * @returns object
     * @example data = {r: [0, 0, 0], dr: [0, 0, 0], m: 1}
     */
    data() {
        let data = {}
        this.inputs.forEach(input => {data[input.parameter.id] = input.data()})
        return data
    }

    /**
     * @brief Check correctness of inputs form data.
     * @returns bool correctness of inputs form data
     */
    status() {
        // accumulate bool array
        let state_inputs = []
        this.inputs.forEach(input => {state_inputs.push(input.state)})
        // logical AND to bool array
        this.state = state_inputs.reduce((accumulation, element) => accumulation * element, true)
        return this.state
    }

    /**
     * @brief Delete current object from list. 
     */
    clear() {
        this.li.remove()
        delete this.bodies[this.index]
        this.check()
    }
    
    /**
     * @brief Support callback function.
     */
    check() {}
}

/**
 * @brief Container to specify physics parameters of task.
 */
class Physics {
    constructor() {

        this.parameters = {inputs: [
            {id: 'g', label: 'Gravitational constant', dim: 1, limit: [0, 5], initial: 1},
            {id: 't', label: 'Mesh', dim: 3, limit: [0, 50], initial: [0, 1, 10]}
        ]}

        // store created inputs
        this.inputs = []

        // build interface
        this.create_elements()
    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {
        // create card container
        this.card = new Card('Physics')
        this.div_row = $('<div></div>').addClass('row g-2')

        // create inputs
        this.parameters.inputs.forEach(input_param => {
            let input = new Input(input_param)
            let div_col = $('<div></div>').addClass('col-md')
            div_col.append(input.export)
            this.div_row.append(div_col)

            this.inputs.push(input)
        })
        this.card.append(this.div_row)

        // specify output jQuery object 
        this.export = this.card.export
    }
}

/**
 * @brief Container to display preview graph.
 */
class Preview {
    constructor() {
        // build interface
        this.create_elements()
        this.figure.load()
    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {
        // create card contain
        this.card = new Card('Preview')
        // assign style to carrd container
        this.card.card.css({'height': '60vh'})
        // create figure
        this.figure = new Figure('preview')
        this.card.append(this.figure.export)

        // specify output jQuery object 
        this.export = this.card.export
    }
}

/**
 * @brief Figure graph based Plotly.js
 * @param id - HTML identifier
 */
class Figure {
    constructor(id) {
        this.id = id
        // store data
        this.data = {}
        // build interface
        this.create_elements()
    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {
        // define layout
        this.layout = {grid: {rows: 1, columns: 2, pattern: 'independent'}, 
        plot_bgcolor: $('body').css('background-color'), paper_bgcolor: $('body').css('background-color'), 
        font: {color: $('body').css('color')}}
        this.figure = $('<div></div>').addClass('container-fluid').attr('id', this.id)

        // difine export jquery object
        this.export = this.figure
    }

    /**
     * @brief Load snipper.
     */
    load() {
        this.figure.empty()
        this.spinner = $('<div></div>').addClass('d-flex justify-content-center').append(
            $('<div></div>').addClass('spinner-border text-primary').attr('role', 'status').append(
                $('<span></span>').addClass('visually-hidden')
            )
        )
        this.figure.append(this.spinner)
    }

    /**
     * @bief Clear figure.
     */
    clear() {
        this.figure.empty()
    }
    
    /**
     * @brief Map data to plotly.j graph.
     * @param data JSON data
     * @example data = [{r: [0, 0, 0], dr: [0, 0, 0], m: 1}, {r: [1, 1, 1], dr: [1, 1, 1], m: 2}]
     * @returns JSON of plotly.js object
     */
    data_transform(data) {
        let traces = []
        try {
            // TODO
        }
        catch {
            console.log('Figure: data are not transformed')
        }
        return traces
    }

    /**
     * @brief Plot data by means Plotly.js.
     * @param data JSON data 
     * @example data = data = [{r: [0, 0, 0], dr: [0, 0, 0], m: 1}, {r: [1, 1, 1], dr: [1, 1, 1], m: 2}]
     */
    plot(data) {
        this.data = this.data_transform(data)
        Plotly.newPlot(this.id, this.data, this.layout)
    }
}

/**
 * @brief 
 */
class Problem {
    constructor() {
        // build interface
        this.create_elements()
        // create callbacks
        this.create_callbacks()
    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {
        // create container
        this.div_container = $('<div></div>').addClass('container')

        // create content
        this.dimension = new Dimension()
        this.initialCondition = new InitialCondition()
        this.physics = new Physics()
        this.preview = new Preview()

        // create gridlayout and append
        this.row = $('<div></div>').addClass('row')
        this.col_set = $('<div></div>').addClass('col')
        this.col_preview = $('<div></div>').addClass('col')
        this.row.append([this.col_set, this.col_preview])
        this.row_dim = $('<div></div>').addClass('row')
        this.row_init = $('<div></div>').addClass('row')
        this.row_ph = $('<div></div>').addClass('row')
        this.col_set.append([this.row_dim, this.row_init, this.row_ph])
        this.col_preview.append(this.preview.export)
        this.row_dim.append(this.dimension.export)
        this.row_init.append(this.initialCondition.export)
        this.row_ph.append(this.physics.export)
        this.div_container.append(this.row)

        // specify output jQuery object 
        this.export = this.div_container
    }

    /**
     * @brief Assign event functions created interface objects.
     */
    create_callbacks() {
        this.initialCondition.check = () => {this.check()}
    }
    
    /**
     * @brief Event function at changing, appending and deleting inputs form.
     */
    check() {
        console.log('this.initialCondition.status()', this.initialCondition.status())
        console.log('this.initialCondition.data()', this.initialCondition.data())
    }
}

/**
 * @brief Assemble interface via primitives.
 */
class Main {
    constructor() {
        // define setting to create a custom cardtab
        this.card_tab_param = {
            style: {container: {'padding-top': '10vh', 'width': '90%', 'height': '50vh'}, 
                    card: {'height': '80vh'}},
            tabs: [{label: 'Problem', id: 'problem'}, {label: 'Result', id: 'result'}]
        }

        // build interface
        this.create_elements()
    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {
        // create a custom cardtab
        this.card_tab = new CardTab(this.card_tab_param)
        this.tab_problem = new Problem()
        this.card_tab.tabs['problem'].div.append(this.tab_problem.export)

        // specify output jQuery object 
        this.export = this.card_tab.export
    }
}

export {Main}
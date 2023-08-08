import {Socket} from './socket'

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
        this.body.push(body);
        this.card_body.append(body)
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
        this.radios = []

        // create elements
        this.div_btn_group = $('<div></div>').addClass('btn-group w-100').attr({role: 'group'})

        // create radios
        this.parameters['radios'].forEach(parameter => {
            let label = $('<label></label>').addClass('btn btn-primary').attr({'for': `radio-${parameter.id}`}).append(parameter.label)
            let input = $('<input>').addClass('btn-check')
                .attr({type: 'radio', name: 'btnradio', autocomplete: 'off', id: `radio-${parameter.id}`})
                .on('change', () => {
                    this.value = parameter.value
                    this.change(parameter.value)
                })
            this.parameters['value'] === parameter.value ? input.prop('checked', true) : input.prop('checked', false)
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
     * @param parameter object presenting layout of appearance 
     * @example parameter = {id: 'in', label: 'Index', dim: 16, initial: [0, 1, 2, 3], limit: [0, 15]}
     */
    constructor(parameters) {
        this.parameters = parameters
        this.state = false

        // create elements
        this.input_group = $('<div></div>').addClass('input-group has-validation')        
        this.div_form_float = $('<div></div>').addClass('form-floating is-invalid')       

        this.input = $('<input>').attr({id: `floatingInputGroup-${this.parameters.id}`, type: 'text', 
            placeholder: this.parameters.label}).prop('required', true)
            .addClass('form-control is-invalid').val(JSON.stringify(this.parameters.initial))
            .on('input', () => {this.change()}).on('blur', () => {this.change()})
        this.label = $('<label></label>').attr({for: `floatingInputGroup-${this.parameters.id}`}).append(this.parameters.label)

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
     * @brief Assign/extract input data.
     * @param data setting value
     * @returns input value
     */
    data() {
        if (arguments.length == 1) {
            this.input.val(JSON.stringify(arguments[0]))
            this.check()
        } else {
            let result
            this.state ? result = JSON.parse(this.input.val()) : result = []
            return result 
        }
    }

    /**
     * @brief Checking of value correction in field: array size and belonging value of each element to range.
     */
    check() {
        let line = this.input.val()
        if (this.isValidJsonString(line)) {
            let object = JSON.parse(line) 
            if (typeof object == 'number' && this.parameters.dim == 1) {
                this.state = true
            }
            else {
                // check length array
                if (object.length == this.parameters.dim) {
                    // check belonging each element to given range
                    for (let index in object) {
                        let value = object[index]
                        this.state = (!isNaN(value)) ? ((value >= this.parameters.limit[0] && value <= this.parameters.limit[1]) ? true : false) : false
                    }
                    if (!this.state) {
                        this.cause(`data must be an array with elements in range: ${JSON.stringify(this.parameters.limit)}`)
                    }
                } else {
                    this.state = false
                    this.cause(`data must be an array of given size: ${this.parameters.dim}`)
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
    constructor(parameters) {
        // store parameters
        this.parameters = parameters
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
        this.radios = new Radios(this.parameters)
        this.card.append(this.radios.export)

        // specify output jQuery object 
        this.export = this.card.export
    }
}

/**
 * @brief Form to assign initial conditions.
 */
class InitialCondition {
    constructor(parameters) {
        // store parameters
        this.parameters = parameters

        // store created body objects
        this.bodies = {}
        Body.prototype.bodies = this.bodies
        this.index = 0

        // build interface
        this.create_elements()

        // set callbacks
        this.create_callbacks()

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
     * @brief Assign event functions created interface objects.
     */
    create_callbacks() {

        Body.prototype.event_remove = (index) => {
            delete this.bodies[index]
            console.log(this.bodies)
            if (Object.keys(this.bodies).length === 0 && this.bodies.constructor === Object) {
                console.log('paassss')
                this.event_empty()
            }
        }

    }

    /**
     * @brief Callback add button click.
     */
    add() {

        if (Object.keys(this.bodies).length === 0 && this.bodies.constructor === Object) {
            this.event_anew()
        }

        // create body object
        let body = new Body(this.index, this.parameters)
        // append body object to list
        this.ul.append(body.export)
        // registrate created body object in dictionary
        this.bodies[this.index] = body
        this.index += 1
        // execute event
        this.check()
    }

    /**
     * @brief Assign/extract input from data.
     * @param data object
     * @returns array of object
     * @example data = [{r: [0, 0, 0], dr: [0, 0, 0], m: 1}, {r: [1, 1, 1], dr: [1, 1, 1], m: 2}]
     */
    data() {
        if (arguments.length == 1) {
            let data = arguments[0]
            // clear bodies
            this.bodies = {}
            this.ul.empty()
            // create bodies with specified inputs form data
            data.forEach(body => {
                let index = this.index
                this.add()
                this.bodies[index].data(body)
            })
        } else {
            let data = new Array()
            Object.entries(this.bodies).forEach(
                ([key, body]) => {
                    data.push(body.data())
                }
            )
            return data
        }
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

    /**
     * @brief Event handler at removing all bodies.
     */
    event_empty() {}

    /**
     * @brief Event handler at anew creation bodies list.
     */
    event_anew() {}
}

/**
 * @brief Form to assign initial condition given body.
 */
class Body {
    /**
     * @param index identify index
     * @param parameter object to build inputs form
     * @example parameter = {inputs: [{id: 'r', label: 'Initial coordinate vecror', dim: 3, limit: [0, 5], initial: [0.1, 0.2, 1]},
                {id: 'dr', label: 'Initial velocity vecror', dim: 3, limit: [0, 5], initial: [0.1, 0.2, 1]},
                {id: 'm', label: 'Mass', dim: 1, limit: [0, 5], initial: 1}]},
     */
    constructor(index, parameter) {

        this.parameter = parameter
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
     * @brief Assign/extract input from data.
     * @param data object
     * @returns object
     * @example data = {r: [0, 0, 0], dr: [0, 0, 0], m: 1}
     */
    data() {
        if (arguments.length == 1) {
            let data = arguments[0]
            // assign value to inputs
            this.inputs.forEach(input => {
                input.data(data[input.parameters.id])
            })
        } else {
            let data = {}
            this.inputs.forEach(input => {data[input.parameters.id] = input.data()})
            return data
        }
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
        // delete this.bodies[this.index]
        this.check()
        // remove item of bodies
        this.event_remove(this.index)
    }
    
    /**
     * @brief Event handler at removing all body.
     * @param index 
     */
    event_remove(index) {}

    /**
     * @brief Support callback function.
     */
    check() {}
}

/**
 * @brief Container to specify physics parameters of task.
 */
class Physics {
    constructor(parameters) {
        // store parameters
        this.parameters = parameters

        // store created inputs
        this.inputs = []

        // define initial state
        this.state = false

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

    /**
     * @brief Return data of given initial condition.
     * @param data object
     * @returns object
     * @example data = {g: 1, t: [0, 10, 50]}
     */
    data() {
        if (arguments.length == 1) {
            let data = arguments[0]
            this.inputs.forEach(input => {
                input.data(data[input.parameters.id])
            })
        } else {
            let data = {}
            this.inputs.forEach(input => {data[input.parameters.id] = input.data()})
            return data
        }
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

}

/**
 * @brief Container to display preview graph.
 */
class Preview {
    constructor(parameters) {

        this.parameters = parameters

        // build interface
        this.create_elements()
        this.figure.load()

        // set callbacks
        this.create_callbacks()
    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {
        // create card contain
        this.card = new Card('Preview')

        // create figure
        this.figure = new Figure('preview')
        this.card.append(this.figure.export)

        // create sliders
        this.sliders = []
        this.parameters.sliders.forEach(slider_param => {
            let slider = new Slider(slider_param)
            this.sliders.push(slider)
            this.card.append(slider.export)
        })

        // specify output jQuery object 
        this.export = this.card.export
    }

    /**
     * @brief Assign event functions created interface objects.
     */
    create_callbacks() {
        // add event handler to sliders in order to customize plot
        this.sliders.forEach(slider => {
            slider.event = () => {
                this.figure.parameters[slider.parameters.id] = slider.data()
                this.figure.plot()
            }
        })
    }
}

/**
 * @brief Slider primitive with handler function at changing.
 */
class Slider {
    /**
     * @param parameters object to set appearance
     * @example parameters = {id: 'slider', label: 'Slider', min: 0, max: 10, step: 0.5, value: 4}
     */
    constructor(parameters) {

        this.parameters = parameters

        // build interface
        this.create_elements()
    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {
        // create label
        this.label = $('<label></label>').addClass('form-label').attr({for: `range-${this.parameters.id}`}).append(this.parameters.label)
        // create input range
        this.input = $('<input>').addClass('form-range').attr({id: `range-${this.parameters.id}`, type: 'range', 
            min: String(this.parameters.min), max: String(this.parameters.max), step: String(this.parameters.step),
            value: String(this.parameters.value)})
            .on('input', () => {this.change()})

        // set label
        this.change()

        this.export = [this.label, this.input]
    }

    /**
     * @brief Assign/extract data slider data.
     * @param data object
     * @returns number
     */
    data() {
        if (arguments.length == 1) {
            this.input.val(arguments[0])
            this.change()
        } else {
            return JSON.parse(this.input.val())
        }
    }

    /**
     * @brief Handler function at slider changing.
     */
    change() {
        this.label.empty()
        this.label.append(`${this.parameters.label}: ${this.input.val()}`)
        this.event()
    }
    /**
     * @brief Event function.
     */
    event() {}
}

/**
 * @brief Figure graph based Plotly.js
 * @param id - HTML identifier
 */
class Figure {
    constructor(id) {
        this.id = id
        // defalut parameters
        this.parameters = {scale_m: 5, scale_dr: 5}
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
        this.layout = {autosize: true, yaxis: {scaleanchor: 'x', scaleratio: 1},
            plot_bgcolor: $('body').css('background-color'), paper_bgcolor: $('body').css('background-color'), 
            font: {color: $('body').css('color')}}
        this.figure = $('<div></div>').addClass('container-fluid w-100').attr('id', this.id)

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
     */
    data_transform() {
        let traces = []
        try {
            for (let i = 0; i < this.data_raw.length; i++) {
                let body = this.data_raw[i]
                switch (body['r'].length) {
                    case 2:
                        traces.push({x: [body['r'][0]], y: [body['r'][1]], mode: 'markers',  type: 'scatter', name: String(i + 1), 
                            marker: {size: this.parameters.scale_m*body['m']}})
                        traces.push({x: [body['r'][0], body['r'][0] + body['dr'][0] * this.parameters.scale_dr], 
                            y: [body['r'][1], body['r'][1] + body['dr'][1] * this.parameters.scale_dr], 
                            type: 'scatter', name: String(i + 1), 
                            marker: {size: this.parameters.scale_m*body['m']}, symbol: 'arrow-bar-up', angleref: 'previous'})
                        break
                    case 3:
                        traces.push({x: [body['r'][0]], y: [body['r'][1]], z: [body['r'][2]], mode: 'markers',  type: 'scatter3d', name: String(i + 1),
                            marker: {size: this.parameters.scale_m*body['m']}})
                        break
                }
            }
        }
        catch {
            console.log('Figure: data are not transformed')
        }
        this.data_plt = traces
    }

    /**
     * @brief Plot data by means Plotly.js.
     * @param data JSON data 
     * @example data = data = [{r: [0, 0, 0], dr: [0, 0, 0], m: 1}, {r: [1, 1, 1], dr: [1, 1, 1], m: 2}]
     */
    plot() {
        if (arguments.length == 1) {
            this.data_raw = arguments[0]
            this.clear()
        }
        this.data_transform()
        if ($(`#${this.id}`).length > 0) {
            Plotly.newPlot(this.id, this.data_plt, this.layout, {responsive: true})
        }
    }
}

class Solver {
    constructor() {
        // build interface
        this.create_elements()
    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {
        // create card contain
        this.card = new Card('Solver')
        // assign style to carrd container
        // this.card.card.css({'height': '60vh'})
        // create button
        this.button_solve = $('<button></button>').addClass('btn btn-primary w-100').on('click', () => {this.run()})
            .prop('disabled', true).append('Run')

        this.card.append(this.button_solve)

        // specify output jQuery object 
        this.export = this.card.export
    }

    run() {

    }
}

/**
 * @brief 
 */
class Problem {
    constructor() {
        // define parameters of input form
        this.parameters = {
            dimension: {radios: [{label: '2D', id: '2d', value: 2}, {label: '3D', id: '3d', value: 3}], value: 2},
            initial: {inputs: [{id: 'r', label: 'Position', dim: 2, limit: [-50, 50], initial: [1, 1]},
                {id: 'dr', label: 'Velocity', dim: 2, limit: [-50, 50], initial: [0.1, 0.2]},
                {id: 'm', label: 'Mass', dim: 1, limit: [0, 10], initial: 1}]},
            physics: {inputs: [
                {id: 'g', label: 'Gravitational constant', dim: 1, limit: [0, 5], initial: 1},
                {id: 't', label: 'Mesh', dim: 3, limit: [0, 1000000], initial: [0, 1, 10]}
            ]},
            preview: {sliders: [{id: 'scale_m', label: 'Mass scale', min: 1, max: 25, step: 1, value: 4},
                {id: 'scale_dr', label: 'Velocity scale', min: 0.1, max: 5, step: 0.5, value: 2}
            ]}
        }

        this.set_temporary = new Set(['r', 'dr'])

        // define initial state
        this.state = false

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
        this.dimension = new Dimension(this.parameters['dimension'])
        this.initialCondition = new InitialCondition(this.parameters['initial'])
        this.physics = new Physics(this.parameters['physics'])
        this.preview = new Preview(this.parameters['preview'])
        // this.solver = new Solver()

        // append elements
        // this.div_container.append([this.dimension.export, this.initialCondition.export, this.preview.export, 
        //     this.physics.export, this.solver.export])
        this.div_container.append([this.dimension.export, this.initialCondition.export, this.preview.export, 
            this.physics.export])

        // specify output jQuery object 
        this.export = this.div_container
    }

    /**
     * @brief Assign event functions created interface objects.
     */
    create_callbacks() {

        // difene event handle at toggle radios
        Radios.prototype.change = (value) => {
            // overwrite dimension attribute of input
            this.parameters['initial']['inputs'].forEach(input => {
                if (this.set_temporary.has(input['id'])) {
                    input['dim'] = value
                }
            })
            // update state of all inputs
            Object.entries(this.initialCondition.bodies).forEach(
                ([key, item]) => {
                    item.inputs.forEach(input => {
                        input.check()
                    })
                }
            )
        }

        Input.prototype.event = () => {this.check()}
        Body.prototype.check = () => {this.check()}
        this.initialCondition.check = () => {this.check()}

        // set event handler
        InitialCondition.prototype.event_empty = () => {
            this.preview.figure.load()
            this.preview.figure.data_raw = []
            this.preview.figure.data_plt = []
            this.preview.sliders.forEach(slider => {
                slider.input.prop('disabled', true)
            })
        }

        InitialCondition.prototype.event_anew = () => {
            this.preview.sliders.forEach(slider => {
                slider.input.prop('disabled', false)
            })
        }
    }
    
    /**
     * @brief Event function at changing, appending and deleting inputs form.
     */
    check() {
        let state = this.initialCondition.status()
        // this.solver.button_solve.prop('disabled', !state)
        if (state) {
            this.preview_update()
        }
    }

    preview_update() {
        this.preview.figure.clear()
        this.preview.figure.plot(this.initialCondition.data())
    }

    /**
     * @brief Get/set data from all inputs
     * @param data object
     * @return object
     * @example data = {'dimension': 2, initial: [{r: [0, 0], dr: [1, 1], m: 1}, {r: [2, 2], dr: [2, 2], m: 2}], 
     * physics: {g: 1, t: [0, 10, 50]}}
     */
    data() {
        if (arguments.length == 1) {
            let data = arguments[0]
            if (!(Object.keys(data).length === 0 && data.constructor === Object)) {
                // this.dimension.upload(data['dimension'])
                this.initialCondition.data(data['initial'])
                this.physics.data(data['physics'])
            }
        } else {
            let result = {}
            result['initial'] = this.initialCondition.data()
            result['physics'] = this.physics.data()
            return result
        }
    }

    /**
     * @brief Check correctness of inputs form data.
     * @returns bool correctness of inputs form data
     */
    status() {
        let state_array = []
        state_array.push(this.initialCondition.status())
        state_array.push(this.physics.status())
        this.state = state_array.reduce((accumulation, element) => accumulation * element, true)
        return this.state
    }
}

/**
 * @brief Assemble interface via primitives.
 */
class Main {
    constructor() {
        this.parent = parent

        this.card_tab_param = {
            style: {container: {'padding-top': '5vh', 'width': '90%'}, 
                    card: {}},
            tabs: [{label: 'Problem', id: 'problem'}, {label: 'Result', id: 'result'}]
        }

        // create socket
        this.socket = new Socket('/solver')

        // build interface
        this.create_elements()
        // set callbacks
        this.create_callbacks()

        // upload data
        let data_upload = {dimension: 2, initial: [{r: [0, 0], dr: [0, 0], m: 1}, {r: [2, 2], dr: [0, 0], m: 1}, 
            {r: [1, -2], dr: [0, 0], m: 2}], 
            physics: {g: 1, t: [0, 50, 1000]}}
        this.problem.data(data_upload)
    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {
        // create a custom cardtab
        this.card_tab = new CardTab(this.card_tab_param)
        this.problem = new Problem()
        this.card_tab.tabs['problem'].div.append(this.problem.export)

        // specify output jQuery object 
        this.export = this.card_tab.export
        this.parent.append(this.export)
    }

    /**
     * @brief Assign event functions created interface objects.
     */
    create_callbacks() {
        // define socket handler
        this.socket.socket.on('process', (data) => {
            console.log(data)
        })

        // assign request method
        this.problem.solver.run = () => {
            let state = this.problem.initialCondition.status()
            if (state) {
                let data = this.problem.data()
                this.socket.emit('process', [{id: sha256(JSON.stringify(data)).slice(0, 16), data: data}])
            }
        }
    }
}

export {Main, Problem}
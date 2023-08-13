import {Input, Card, Radios, JsonChecker, Select, Nav} from './toolkit'

/**
 * @brief Container to specify dimension of task.
 */
class Dimension {
    /**
     * 
     * @param parameters object
     * @example parameters = {radios: [{label: '2D', id: '2d', value: 2}, {label: '3D', id: '3d', value: 3}], value: 2}
     */
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
        this.card.card.addClass('mt-2 mb-4')

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
        this.card.card.addClass('mt-2 mb-4')

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
            if (Object.keys(this.bodies).length === 0 && this.bodies.constructor === Object) {
                this.event_empty()
            }
        }

    }

    /**
     * @brief Callback add button click.
     */
    add() {
        // create body object
        let id = this.gen_index()
        let body = new Body(this.bodies, id, this.parameters)
        // append body object to list
        this.ul.append(body.export)
        // registrate created body object in dictionary
        this.bodies[id] = body
        // execute event
        this.check()

        return id
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
                let id = this.add()
                this.bodies[id].data(body)
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
     * @brief Generate index.
     * @returns SHA string
     */
    gen_index() {
        return sha256(JSON.stringify(Math.random())).slice(0, 12)
    }
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
    constructor(bodies, index, parameter) {

        // parent bodies
        this.bodies = bodies 
        // identify childern body
        this.index = index
        this.parameter = parameter

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
            input_param['validation'] = true
            let input = new Input(input_param)
            input.criteria = (value) => {return JsonChecker(value, input_param)}
            let div_col = $('<div></div>').addClass('col-md')
            div_col.append(input.export)
            this.div_row.append(div_col)
            // store input object
            this.inputs.push(input)
        })

        // create delete button
        this.button_delete = $('<button></button>').addClass('btn btn-primary w-100 h-100').append($('<i></i>')
            .addClass('bi-trash').css({'font-size': '30px'}))
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
                input.data(JSON.stringify(data[input.parameters.id]))
            })
        } else {
            let data = {}
            this.inputs.forEach(input => {data[input.parameters.id] = JSON.parse(input.data())})
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
        // define state by means applying logical AND operator of bool array
        this.state = state_inputs.reduce((accumulation, element) => accumulation * element, true)

        // toggle appearance border according to state 
        if (this.state ) {
            this.li.removeClass('border border-danger-subtle')
        } else {
            this.li.addClass('border border-danger-subtle')
        }
        return this.state
    }

    /**
     * @brief Delete current object from list. 
     */
    clear() {
        this.li.remove()
        delete this.bodies[this.index]
        console.log('this.bodies remove after', this.bodies)
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
            input_param['validation'] = true
            let input = new Input(input_param)
            input.criteria = (value) => {return JsonChecker(value, input_param)}
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
                input.data(JSON.stringify(data[input.parameters.id]))
            })
        } else {
            let data = {}
            this.inputs.forEach(input => {data[input.parameters.id] = JSON.parse(input.data())})
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
        this.card.card.addClass('mt-2 mb-4')

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
        // create content
        this.dimension = new Dimension(this.parameters['dimension'])
        this.initialCondition = new InitialCondition(this.parameters['initial'])
        this.physics = new Physics(this.parameters['physics'])
        this.preview = new Preview(this.parameters['preview'])

        // specify output jQuery object 
        this.export = $('<div></div>').addClass('container').append([this.physics.export, this.dimension.export, 
            this.initialCondition.export, this.preview.export])
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
    }
    
    /**
     * @brief Event function at changing, appending and deleting inputs form.
     */
    check() {
        if (this.initialCondition.status()) {
            this.preview.figure.plot(this.initialCondition.data())
            this.preview.sliders.forEach(slider => {
                slider.input.prop('disabled', false)
            })
        } else {
            this.preview.figure.load()
            this.preview.sliders.forEach(slider => {
                slider.input.prop('disabled', true)
            })
        }
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
                // set values
                this.dimension.radios.data(data['dimension'])
                this.initialCondition.data(data['initial'])
                this.physics.data(data['physics'])

                // display load animation
                this.preview.figure.load()

                // to pass fade animation of elements (modal)
                setTimeout(() => {this.check()}, 500)
            }
        } else {
            let result = {}
            result['dimension'] = this.dimension.radios.data()
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

class Graph {
    constructor() {
        this.data = {}
        this.parameters = {
            figure: {id: 'task-plot-result'},
            select: {id: 'graph-select', label: 'Type', options: [
                {label: 'Plot: space trajectory', id: 'plt_trj_sp', value: 'plt_trj_sp', selected: true},
                {label: 'Plot: phase trajectory', id: 'plt_trj_ph', value: 'plt_trj_ph', selected: false},
                {label: 'Animation: space trajectory', id: 'ani_trj_sp', value: 'ani_trj_sp', selected: false},
                {label: 'Animation: phase trajectory', id: 'ani_trj_ph', value: 'ani_trj_ph', selected: false}
            ]}
        }

        this.layout = {autosize: true,
            plot_bgcolor: $('body').css('background-color'), paper_bgcolor: $('body').css('background-color'), 
            font: {color: $('body').css('color')}}

        // build interface
        this.create_elements()
        // create callbacks
        this.create_callbacks()
    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {
        // create figure
        this.figure = $('<div></div>').addClass('container-fluid mt-2').attr({id: this.parameters.figure.id})

        // create select
        this.select = new Select(this.parameters.select)
        this.select.div.addClass('mt-2')

        this.export = [this.select.export, this.figure]
    }
    
    /**
     * @brief Assign event functions created interface objects.
     */
    create_callbacks() {
        // at changing select
        this.select.select.on('input', () => {
            this.plot(this.select.select.val())
        })

    }

    /**
     * @brief Plot selected plot.
     */
    plot() {
        // choose argument
        let type, figure
        arguments.length == 0 ? type = this.select.select.val() : type = arguments[0]
        // checked type
        switch (type) {
            case 'plt_trj_sp':
                figure = this.data['plots']['trajectory']
                break
            case 'plt_trj_ph':
                figure = this.data['plots']['velocity']
                break
            case 'ani_trj_sp':
                figure = this.data['animations']['trajectory']
                break
            case 'ani_trj_ph':
                figure = this.data['animations']['velocity']
                break
        }

        // recustom styles
        Object.entries(this.layout).forEach(([key, item]) => {
            figure['layout'][key] = item
        })
        figure['layout']['template'] = 'plotly_dark'
        // clear figure
        this.figure.empty()

        // visualize
        if ($(`#${this.parameters.figure.id}`).length > 0) {

            if (figure.hasOwnProperty('frames')) {
                Plotly.newPlot(this.parameters.figure.id, figure['data'], figure['layout'], {responsive: true}).then(() => {
                    Plotly.addFrames(this.parameters.figure.id, figure['frames'])
                })
            } else {
                Plotly.newPlot(this.parameters.figure.id, figure['data'], figure['layout'], {responsive: true})
            }
            // enable autoscale
            Plotly.relayout(this.parameters.figure.id, {'xaxis.autorange': true, 'yaxis.autorange': true})
        }
    }
}

class Table {
    constructor() {
        this.data = {}
        this.parameters = {
            figure: {id: 'task-table-result'},
            select: {id: 'table-select', label: 'Type', options: [
                {label: 'Table: space trajectory', id: 'tab_trj_sp', value: 'tab_trj_sp', selected: true},
                {label: 'Table: phase trajectory', id: 'tab_trj_ph', value: 'tab_trj_ph', selected: false},
            ]}
        }

        this.layout = {autosize: true,
            plot_bgcolor: $('body').css('background-color'), paper_bgcolor: $('body').css('background-color'), 
            font: {color: $('body').css('color')}}

        // build interface
        this.create_elements()
        // create callbacks
        this.create_callbacks()
    }

    /**
     * @brief Assemble interface based jQuery objects.
     */
    create_elements() {
        // create figure
        this.figure = $('<div></div>').addClass('container-fluid mt-2').attr({id: this.parameters.figure.id})

        // create select
        this.select = new Select(this.parameters.select)
        this.select.div.addClass('mt-2')

        this.export = [this.select.export, this.figure]
    }
    
    /**
     * @brief Assign event functions created interface objects.
     */
    create_callbacks() {
        // at changing select
        this.select.select.on('input', () => {
            this.plot(this.select.select.val())
        })

    }

    /**
     * @brief Plot selected plot.
     */
    plot() {
        // choose argument
        let type, figure
        arguments.length == 0 ? type = this.select.select.val() : type = arguments[0]
        // checked type
        switch (type) {
            case 'tab_trj_sp':
                figure = this.data['tables']['trajectory']
                break
            case 'tab_trj_ph':
                figure = this.data['tables']['velocity']
                break
        }
        // clear figure
        this.figure.empty()

        // visualize
        if ($(`#${this.parameters.figure.id}`).length > 0) {
            Plotly.newPlot(this.parameters.figure.id, figure['data'], figure['layout'], {responsive: true})
        }
    }
    
}

/**
 * @brief Result interface.
 */
class Result {
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
        // create graph/table
        this.graph = new Graph()
        this.table = new Table()

        // create nav
        this.nav = new Nav()
        // append content to nav
        this.nav.append({id: 'plot', label: 'Plots', content: this.graph.export})
        this.nav.append({id: 'table', label: 'Tables', content: this.table.export})
        
        // create tab trigger object 
        this.tab_trigger = {}
        Object.entries(this.nav.labels).forEach(([id, label]) => {
            this.tab_trigger[id] = new bootstrap.Tab(label)
        })
        // specify output jQuery object 
        this.export = this.nav.export
    }

    /**
     * @brief Assign event functions created interface objects.
     */
    create_callbacks() {
        this.nav.labels['plot'].on('click', () => {
            this.graph.plot()
        })
        this.nav.labels['table'].on('click', () => {
            this.table.plot()
        })
    }

    /**
     * @brief Show specified tab.
     * @param id string
     */
    show(id) {
        switch (id) {
            case 'plot':
                this.graph.plot()
                break
            case 'table': 
                this.table.plot()
                break
        }
        this.tab_trigger[id].show()
    }

}

class Task {
    constructor() {
        // create problem
        this.problem = new Problem()
        // create result
        this.result = new Result()
    }
}

export {Task}
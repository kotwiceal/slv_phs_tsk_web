/**
 * @brief Input pattern to track passed values.
 * @param parameter object presenting layout of appearance 
 * @example parameter = {label: 'Index', dim: 16, initial: [0, 1, 2, 3], limit: [0, 15]}
 */
class Input {
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

        this.div_feedback = $('<div></div>').addClass('invalid-feedback').append('ok')

        // append elements
        this.div_form_float.append([this.input, this.label])
        this.input_group.append([this.div_form_float, this.div_feedback])

        // initialte state
        this.check()

        // specify output point
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
    get() {
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
        this.tabs = {}

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
        // specify output point
        this.export = this.div_container

        // create tabs according to parameters.tabs settings
        this.parameters.tabs.forEach(tab_param => {
            this.tabs[tab_param['id']] = new Tab(tab_param)
            this.div_nav_tab.append(this.tabs[tab_param['id']].button)
            this.div_tab_content.append(this.tabs[tab_param['id']].div)
        });

        // append content to card
        this.div_card_footer.append('Footer')

        this.input = new Input({id: 'location', label: 'Location', dim: 3, limit: [0, 5], initial: [0.1, 0.2, 1]})
        this.tabs['problem'].div.append(this.input.export)

    }
}

/**
 * @brief Assemble interface via primitives.
 */
class Main {
    constructor() {
        // define setting to create a custom cardtab
        this.card_tab_param = {
            style: {container: {'padding-top': '10vh', 'width': '80%', 'height': '50vh'}, 
                    card: {'height': '50vh'}},
            tabs: [{label: 'Problem', id: 'problem'}, {label: 'Result', id: 'result'}]
        }

        // create a custom cardtab
        this.card_tab = new CardTab(this.card_tab_param)

        // specify output point
        this.export = this.card_tab.export
    }
}

export {Main}
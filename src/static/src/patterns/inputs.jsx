/** 
 * @brief The module suggests reused as well as generalized components based on react-bootstrap and 
 * react-hook-form and served to simplify an input form appearience and data validation.
*/

// import bootstrap dependencies
import Form from 'react-bootstrap/Form'

// import react hooks
import {useState, useCallback} from 'react'
// import react-hook-form dependencies
import {useFormContext} from 'react-hook-form'

/**
 * @brief Object is contained validation method of input form data.
 */
const validateHandles = {
    /**
     * @brief Validate numeric string.
     * @param {*} value string
     * @returns true if value is number otherwise string error message
     */
    textNumber: (value) => {
        let message, number
        try {
            message = 'Data must be number'
            number = JSON.parse(value)
            if (!(typeof number === 'number')) {
                return message
            }
            return true
        } catch {
            return message
        }
    },
    /**
     * @brief Validate numeric string belonging to the specified range.
     * @param {*} value string
     * @param {*} range length-2 numeric array like [min, max]
     * @returns true if value is number belonging the range otherwise string error message
     */
    rangeNumber: (value, range) => {
        let message, number, result, state
        try {
            message = 'Data must be number'
            number = JSON.parse(value)
            if (!(typeof number === 'number')) {
                return message
            }
            state = (!isNaN(value)) ? ((number >= range[0] && number <= range[1]) ? true : false) : false
            result = state ? true : `Data must be a single value in range: ${JSON.stringify(range)}.`
            return result
        } catch {
            return message
        }
    },
    /**
     * @brief Validate string JSON-array.
     * @param {*} value string 
     * @returns true if value is string JSON-array otherwise string error message
     */
    jsonArray: (value) => {
        let message = 'Value must be json array'
        if (Array.isArray(value)) {
            return true
        } else {
            try {
                let result = Array.isArray(JSON.parse(value)) ? true : message
                return result
            } catch {
                return message
            }
        }   
    },
    /**
     * @brief Validate string JSON-array each value belonged to the specified range.
     * @param {*} value string
     * @param {*} range length-2 numeric array like [min, max]
     * @returns true if value is string JSON-array each value belonged to the specified range
     *  otherwise string error message
     */
    rangeArray: (value, range) => {
        let array, result, state, message = 'Value must be json array'
        try {
            if (Array.isArray(value)) {
                array = value
            } else {
                array = JSON.parse(value)
            }

            if (!Array.isArray(array)) {
                return message
            }

            state = array.reduce((accumulator, currentValue) => {
                let stateCrrent = (!isNaN(currentValue)) ? ((currentValue >= range[0] && currentValue <= range[1]) ? true : false) : false
                return accumulator * stateCrrent
            }, true)

            result = state ? true : `Data must be an array with elements in range: ${JSON.stringify(range)}.`
            return result
        } catch {
            return message
        }
    },
    /**
     * @brief Validate string JSON-array with specified length.
     * @param {*} value string
     * @param {*} length number specified length
     * @returns true if value is string JSON-array ith specified length otherwise string error message
     */
    lengthArray: (value, length) => {
        let array, result, message = 'Value must be json array'
        try {
            if (Array.isArray(value)) {
                array = value
            } else {
                array = JSON.parse(value)
            }

            if (!Array.isArray(array)) {
                return message
            }

            result = (array.length == length) ? true : `Data must be an array of given size: ${length}.`
            return result
        } catch {
            return message
        }
    }
}

/**
 * @brief Define validation handles to control number input form.
 * @param {*} range length-2 numeric array like [min, max]
 * @returns object of validation hondles 
 */
const validateHandlesNumber = (range) => {
    const {textNumber, rangeNumber} = validateHandles
    return {
        textNumber: textNumber,
        rangeNumber: (value) => (rangeNumber(value, range))
    }
}

/**
 * @brief Define validation handles to control array-JSON input form.
 * @param {*} range length-2 numeric array like [min, max]
 * @param {*} length number of array length
 * @returns object of validation hondles 
 */
const validateHandlesArray = (range, length) => {
    const {jsonArray, rangeArray, lengthArray} = validateHandles
    return {
        jsonArray: jsonArray,
        rangeArray: (value) => (rangeArray(value, range)),
        lengthArray: (value) => (lengthArray(value, length))
    }
}

/**
 * @brief Input form value transformer.
 * @param {*} value string
 * @returns JSON-array|string
 */
const setValueAsJSON = value => {
    try {
        return JSON.parse(value)
    } catch {
        return value
    }
}

/**
 * @brief Numerical input form component with specified  elements value range and length validation.
 * @param {*} prop object {name: string, label: string, range: object}
 * @returns react component
 */
const NumberInputPattern = (prop) => {
    const {range} = prop
    const handle = useCallback(() => validateHandlesNumber(range), [range])

    return <TextInputPattern {...prop}
        required = {{required: 'Value must not be empty'}}
        validate = {{validate: handle()}}
        setValueAs = {{setValueAs: setValueAsJSON}}
    />
}

/**
 * @brief JSON array input form component with specified  elements value range and length validation.
 * @param {*} prop object {name: string, label: string, range: object, length: number}
 * @returns react component
 */
const ArrayInputPattern = (prop) => {
    const {range, length} = prop
    const handle = useCallback(() => validateHandlesArray(range, length), [range, length])

    // TODO: jsonarray serialization;

    return <TextInputPattern {...prop}
        required = {{required: 'Value must not be empty'}}
        validate = {{validate: handle()}}
        setValueAs = {{setValueAs: setValueAsJSON}}
    />
}

/**
 * @brief Generalized text input form component with specified validation, pattern, value setting.
 * @param {string} type string like `password`, default `text`
 * @param {string} asInput string with value `textarea` when necessary to transform custom input component to <textarea></textarea>
 * @param {string} label string displaying on floating label when specified
 * @param {string} name input form alias for `register` of react-hook form 
 * @param {*} value input form default value
 * @param {boolean} autoComplete when necessary to perform autocompleting
 * @param {object} required `required` object of react-hook form
 * @param {object} validate `validate` object of react-hook form
 * @param {object} setValueAs `setValueAs` object of react-hook form
 * @param {RegExp} pattern template of input text validation
 * @returns 
 */
const TextInputPattern = ({type, asInput, label, name, value, autoComplete, required, validate, setValueAs, pattern}) => {
    const {register, formState, setValue, getFieldState} = useFormContext()
    const {error} = getFieldState(name, formState)

    const Input = <>
        <Form.Control 
            type = {type ? type : 'text'}
            as = {asInput}
            isInvalid = {error} 
            isValid = {!error}
            defaultValue = {value}
            autoComplete = {autoComplete}
            {
                ...register(name, {
                    ...required,
                    ...validate,
                    ...setValueAs,
                    ...pattern,
                    onChange: (event) => {setValue(name, event.target.value, {shouldValidate: true})}
                })
            }
        />
        <Form.Control.Feedback type = {error ? 'invalid' : 'valid'}>
            {error && error.message}
        </Form.Control.Feedback>
    </>

    if (label) {
        return (
            <>
            <Form.Group>
                <Form.FloatingLabel label= {label}>
                    {Input}
                </Form.FloatingLabel>
            </Form.Group>
            </>
        )
    }

    return (
        <>
            <Form.Group>
                {Input}
            </Form.Group>
        </>
    )
}

/**
 * @param {string} label 
 * @param {string} name
 * @param {object} required
 * @param {object} options
 * @returns custom react component
 */
const SelectPattern = ({label, name, required, options} ) => {

    const {register, formState, getFieldState} = useFormContext()
    const {error} = getFieldState(name, formState)

    return (
        <>
            <Form.Group>
                <Form.FloatingLabel label= {label}>
                    <Form.Select 
                        {...register(name, {...required})}
                    >
                        {
                            options.map((option, index) => (
                                <option 
                                    key = {index}
                                    value = {option.value}
                                >
                                    {option.label}
                                </option>
                            ))
                        }
                    </Form.Select>
                    <Form.Control.Feedback type = {error ? 'invalid' : 'valid'}>
                        {error && error.message}
                    </Form.Control.Feedback>
                </Form.FloatingLabel>
            </Form.Group>
        </>
    )
}

/**
 * @param {string} label 
 * @param {string} name
 * @param {number} min
 * @param {number} max
 * @param {number} step
 * @returns custom react component
 */
const RangePattern = ({name, label, min, max, step} ) => {
    const {register, setValue, getValues} = useFormContext()
    const [valueLabel, setValueLabel] = useState(getValues(name))

    return (<>
        <Form.Group>
            <Form.Label>{`${label}: ${valueLabel}`}</Form.Label>
            <Form.Range
                min = {min}
                max = {max}
                step = {step}
                onInput = {(event) => {
                    setValue(name, event.target.value)
                    setValueLabel(event.target.value)
                }}
                {
                    ...register(name, {
                        setValueAs: value => parseInt(value)
                    })
                }
            />
        </Form.Group>
    </>)
}

/**
 * @param {string} name 
 * @param {boolean} inline 
 * @param {object} radios
 * @returns custom react component
 */
const RadioPattern = ({name, inline, radios} ) => {
    
    const {register, formState, getFieldState } = useFormContext()
    const {error} = getFieldState(name, formState)

    return (
    <>
    <Form.Group className = 'mb-2'>
        {
            radios.map((radio) => (
                    <Form.Check 
                        type = 'radio' 
                        key = {radio.label} 
                        inline = {inline}
                        value = {radio.value} 
                        label = {radio.label} 
                        {...register(name)}
                    />
                )
            )
        }
        <Form.Control.Feedback type = {error ? 'invalid' : 'valid'}>
            {error && error.message}
        </Form.Control.Feedback>
    </Form.Group>
    </>
    )
}

export {
    TextInputPattern, 
    NumberInputPattern, 
    ArrayInputPattern,
    SelectPattern,
    RangePattern,
    RadioPattern
}
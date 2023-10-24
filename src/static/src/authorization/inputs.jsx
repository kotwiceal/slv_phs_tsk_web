/**
 * @brief The module provides reuse components
 */

// import encryptor
import {sha256} from 'js-sha256'
// import custom components
import {TextInputPattern} from '../patterns/inputs'

const LoginInputPattern = (prop) => {

    const pattern = /^[0-9A-Za-z]{6,16}$/

    return <TextInputPattern {...prop}
        required = {{required: 'Value must not be empty'}}
        pattern = {{pattern: pattern}}
    />
}

const PasswordInputPattern = (prop) => {

    const pattern = /^[0-9A-Za-z]{6,16}$/

    return <TextInputPattern {...prop}
        type = 'password'
        required = {{required: 'Value must not be empty'}}
        setValueAs = {{setValueAs: value => sha256(value)}}
        pattern = {pattern}
    />
}

export {
    LoginInputPattern,
    PasswordInputPattern
}
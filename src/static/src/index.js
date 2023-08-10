import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import {App} from './app'

$(document).ready(() => {
    // set dark interface mode
    $('html').attr({'data-bs-theme': 'dark'})
    // create application
    let app = new App($('#content'))
})
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import {Main} from './task_panel'

$(document).ready(() => {

    // set dark interface mode
    $('html').attr({'data-bs-theme': 'dark'})

    let main = new Main()
    $('#content').append(main.export)

})
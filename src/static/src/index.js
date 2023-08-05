import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import {Menu} from './menu'
import {Main} from './task_panel'

$(document).ready(() => {

    // set dark interface mode
    $('html').attr({'data-bs-theme': 'dark'})

    // let main = new Main($('#content'))
    let menu = new Menu($('#content'))

})
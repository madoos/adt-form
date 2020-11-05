import * as api from './api'
import ui from './ui-ids'
import { isAlphanumeric, isLengthGte5, isLengthLte8 } from './validations'

document.addEventListener('DOMContentLoaded',() => {
    const userInput = document.getElementById(ui.user)
    const passwordInput = document.getElementById(ui.password)
    const enterBtn = document.getElementById(ui.enter)
    const notificationParagraph =  document.getElementById(ui.notification)

    const cleanForm = () => {
        userInput.value = ''
        passwordInput.value = ''
    }

    enterBtn.addEventListener('click', () => {
        const user = userInput.value
        const password = passwordInput.value
        
        if (!isLengthGte5(user)) {
            notificationParagraph.innerHTML = 'User must to be size greater than or equal 5.'
            cleanForm()
        }
        else if (!isAlphanumeric(password) || !(isLengthGte5(password) && isLengthLte8(password)) ) {
            notificationParagraph.innerHTML = 'Password must to be alphanumeric word with size between 5 and 8.'
            cleanForm()

        }else {
            api.login(user, password)
            .then(user => notificationParagraph.innerHTML = `Welcome ${user.name}!`)
            .then(() => cleanForm())
        }
    })
})
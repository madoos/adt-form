import * as api from './api'
import ui from './ui-ids'
import { isAlphanumeric, isLengthGte5, isLengthLte8 } from './validations'

import { pipe, curry, chain, pipeK, sequence } from 'ramda'
import { Either, IO } from 'crocks'
import { Map  } from 'immutable-ext'

////////////// validations

// validateWith :: (a -> Boolean) -> String -> a -> Either String a
const validateWith = curry((predicate, msg, x) => {
    return predicate(x) ? Either.of(x) : Either.Left(msg)
})


// validateUserName :: User -> Either String User
const validateUserName = validateWith(({ user }) => isLengthGte5(user), 'User must to be size greater than or equal 5.')

// validatePasswordAlpha :: User -> Either String User
const validatePasswordAlpha = validateWith(({ password }) => isAlphanumeric(password), 'Password must to be alphanumeric ')

// validateSize :: User -> Either String User
const validateSize = validateWith(({ password }) => (isLengthGte5(password) && isLengthLte8(password)), 'Password must to be a word with size between 5 and 8.')

// validateUser :: User -> Either String User
const validateUser = pipeK(
    validateUserName,
    validatePasswordAlpha,
    validateSize
)

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

        validateUser({ user, password })
            .either(
                msg => {
                    notificationParagraph.innerHTML = msg
                    cleanForm()
                }, 
                ({ user, password }) => {
                    api.login(user, password)
                    .then(user => notificationParagraph.innerHTML = `Welcome ${user.name}!`)
                    .then(() => cleanForm())
                }
            )
    })
})
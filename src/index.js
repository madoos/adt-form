import * as api from './api'
import ids from './ui-ids'
import { fromEvent } from './adt/Stream'
import { ioToStream, ioToAsync, asyncToStream } from './adt/nt'
import { byId, setElementProp, getElementValue } from './document'
import { isAlphanumeric, isLengthGte5, isLengthLte8, validateWith } from './validations'

import { Map } from 'immutable-ext'
import { IO, Result, resultToAsync, bichain, Async } from 'crocks'
import { pipe, pipeK, invoker, traverse, pick, evolve,  both, sequence, chain, map, join, curry, always } from 'ramda'

// immutableMapToJSON :: Map -> JSON
const immutableMapToJSON = invoker(0, 'toJS')

// getBtnEnterClicks :: Document -> Stream Error Event 
const getBtnEnterClicks = pipeK(
    fromEvent('DOMContentLoaded'),
    ioToStream(() => byId(ids.enter)),
    fromEvent('click')
)

// pickCredentials :: JSON -> JSON
const pickCredentials =  pick(['user', 'password'])

// getCredentialsFromForm :: Ids -> IO (Map { user, password })
const getCredentialsFromForm = pipe(
    pickCredentials,
    Map,
    traverse(IO.of, pipeK(byId, getElementValue))
)

// cleanFormCredentials :: Ids -> IO () 
const cleanFormCredentials = pipe(
    pickCredentials,
    Map,
    map(byId),
    traverse(IO.of, chain(setElementProp('value', '')))
)

// fillNotificationParagraph :: Id -> String -> IO ()
const fillNotificationParagraph = curry((id, message) => pipe(byId, chain(setElementProp('innerHTML', message)))(id))

// showFormMessage :: String -> IO ()
const showFormMessage = pipeK(
    fillNotificationParagraph(ids.notification),
    always(cleanFormCredentials(ids))
)

//  validateCredentials :: Map { user, password } -> Result [String] (Map { user, password })
const validateCredentials = pipe(
    immutableMapToJSON,
    evolve({
        user: validateWith('User must to be an string with length >= 5.', isLengthGte5),
        password: validateWith('Password must to be an alphanumeric string with length >= 5 and  <= 8', both(isAlphanumeric, both(isLengthGte5, isLengthLte8)))
    }),
    Map,
    sequence(Result.of)
)

// getUserName :: Map { user,  password } -> Async Error String
const getUserGreeting = pipe(
    immutableMapToJSON,
    ({ user, password }) => api.login(user, password),
    map(({ name }) => `Welcome ${name}!`)
)

// getValidationMessage :: [String] -> Async Error String
const getValidationMessage = pipe(join(', '), Async.of)


// ------------------ MAIN ------------------

// greetUser :: Document -> Stream Error ()
const greetUser = pipeK(
    getBtnEnterClicks,
    ioToStream(always(getCredentialsFromForm(ids))),
    asyncToStream(
        pipe(
            resultToAsync(validateCredentials),
            bichain(getValidationMessage, getUserGreeting),           
            chain(ioToAsync(showFormMessage))
        )
    )
)

// ------------------ IMPURE ------------------

greetUser(document).subscribe()

import { IO } from 'crocks'
import { curry } from 'ramda'

// byId :: String -> IO HTMLElement
export const byId = (id) => IO(() => document.getElementById(id))

// getElementValue :: HTMLElement :: IO String
export const getElementValue = (element) => IO(() => element.value)

// setElementProp :: String -> String -> HTMLElement :: IO ()
export const setElementProp = curry((prop, value, element) => IO(() => element[prop] = value))
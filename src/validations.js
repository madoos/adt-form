import { Pred, Result } from  'crocks'
import { curry } from 'ramda'

const { Ok, Err} = Result

// isAlphanumeric :: String -> Boolean
export const isAlphanumeric = s => /^[a-z0-9]+$/i.test(s)

 // isLengthGte5 :: String -> Boolean
export const isLengthGte5 = s => s.length >= 5

 // isLengthLte8 :: String -> Boolean
export const isLengthLte8 = s => s.length <= 8

// validateWith :: String -> (a -> Boolean) -> (a -> Result [String] a)
export const validateWith = curry((msg, pred) => x => pred(x) ? Ok(x) : Err([msg]))
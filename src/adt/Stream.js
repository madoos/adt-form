import { curryN } from 'ramda'
import { fromEvent as _fromEvent } from 'most'
import { create } from '@most/create'

// fromEvent :: String -> HTMLElement -> Stream Error Event
export const fromEvent = curryN(2, _fromEvent)

// Stream :: (Observer -> (() -> ())) -> Stream Error a
export const Stream = (handler) => create((next, complete, error) => {
    const observer = { next, complete, error }
    return handler(observer)
})

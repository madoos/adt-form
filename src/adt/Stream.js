import * as fl from 'fantasy-land'
import { curry } from 'ramda'

// noop :: () -> ()
const noop = () => {}

const _Observer = (next = noop, error = noop, complete = noop) => {
    let isCompleted = false 

    return {
        next: (x) => {
            if(!isCompleted) next(x)
        },
        error: (e) => {
            if(!isCompleted){
                error(e);
                isCompleted = true
            }
        },
        complete: () => {
            isCompleted = true
            complete()
        }
    }
}


export const Stream = (_subscribe) => {

    const subscribe = (next, error, complete) => _subscribe(_Observer(next, error, complete))

    const map = (f) => {
        return Stream(observer => {
            return subscribe(
                (x) => observer.next(f(x)),
                (e) => observer.error(e),
                () => observer.complete(),
            )
        })
    }

    const chain = (f) => {
        return Stream(observer => {
            const next = (x) => observer.next(x)
            const error = (e) => observer.error(e)
            const complete = () => observer.complete()

            return subscribe(
                x => f(x).subscribe(next, error),
                error,
                complete
            )
        })
    }


    return {
        [fl.map]: map,
        [fl.chain]: chain,
        map,
        chain,
        subscribe
    }
}

export const fromEvent = curry((event, emitter) => {
    return Stream(observer => {
        const next = x => observer.next(x)
        emitter.addEventListener(event, next)
        return () => emitter.removeEventListener(event, next)
    })
}) 
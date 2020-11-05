import { Stream } from './Stream'
import { Async } from 'crocks'
import { is, curryN } from 'ramda'

// noop ::() -> ()
const noop = () => {}

// Functor f => (f -> f) -> a -> f | (a -> f) 
const overload = nt => (src) => is(Function, src) ? 
                                    curryN(src.length, (...args) => nt(src(...args))) : 
                                    nt(src)


// ioToStream :: IO a -> Stream Error a
export const ioToStream = overload((io) => Stream(observer => {
    try{
        observer.next(io.run())
        observer.complete()
    }catch (e) {
        observer.error(e)
    }

    return noop
}))

// ioToAsync :: IO a -> Async Error a
export const ioToAsync = overload((io) => Async((rej, res) => {
    try{
        res(io.run())
    }catch (e) {
        rej(e)
    }
    return noop
}))

// asyncToStream  :: Async Error x -> Stream Error x
export const asyncToStream = overload(async => Stream(observer => {
    return async.fork(
        (e) => observer.error(e),
        (x) => {
            observer.next(x)
            observer.complete()
        }
    )
})) 
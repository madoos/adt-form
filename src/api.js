import { Async } from 'crocks'

export const login = Async.fromPromise(
                        (user, password) => fetch('https://jsonplaceholder.typicode.com/users/1').then(res => res.json())
                    )

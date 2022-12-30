const Millisecond = 1
const Second = Millisecond * 1000
const Minute = Second * 60
const Hour = Minute * 60

export const sleep = (delay: number) => new Promise((r) => setTimeout(r, delay))

type WithinFunc = (now: number, start: number) => boolean

const within = (delta: number) => (now: number, start: number) => {
    return now - start <= delta
}

const withinOneSecond = (now: number, start: number) => {
    return now - start <= Second
}

export { WithinFunc, Minute, Millisecond, Hour, Second, within, withinOneSecond }

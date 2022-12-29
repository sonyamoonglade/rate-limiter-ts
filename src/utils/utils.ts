export const sleep = (delay: number) => new Promise((r) => setTimeout(r, delay))
export const after = (time: number, ...rest: number[]) => {
    const now = Date.now()
    if (rest.length === 0) {
        return time > now
    }
    const add = rest.reduce((acc, curr) => {
        acc += curr
        return acc
    }, 0)
    return time + add > now
}

export const millisecond = 1
export const second = millisecond * 1000

export const withinOneSecond = (now: number, start: number) => {
    return now - start <= second
}

export const within = (delta: number) => (now: number, start: number) => {
    return now - start <= delta
}

export type WithinFunc = (now: number, start: number) => boolean

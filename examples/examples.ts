import fetch from "node-fetch"
import { sleep } from "../src/common/time"

const doRequest = (url: string, ip: string) => {
    return fetch(url, {
        method: "GET",
        headers: {
            "X-Forwarded-From": ip,
        },
    })
}

const N = 100
const start = async () => {
    const url = "http://localhost:8000/rate"
    const ip = "129.92.94.13"
    for (let i = 0; i < N; i++) {
        const res = await doRequest(url, ip)
        console.table({
            status: res.statusText,
            body: res.text(),
        })
        await sleep(505)
    }
}

const start2 = async () => {
    const url = "http://localhost:8000/rate"
    const ips = ["129.92.94.13", "192.184.123.42", "28.16.218.172"]
    for (let i = 0; i < N; i++) {
        for (const ip of ips) {
            const res = await doRequest(url, ip)
            console.table({
                status: res.statusText,
                body: res.text(),
                ip: ip,
            })
            // await sleep(50)
        }
    }
}
console.log(start2, start)
start()
// start2()

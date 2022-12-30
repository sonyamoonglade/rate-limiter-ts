import Server from "./server/server"
import { InMemoryStore } from "./service/store"
import Service from "./service/service"
import { parseMaskToBitSize } from "./network/network"
import { compileRFCForm } from "./http/http"
import { Second, withinOneSecond } from "./common/time"
import { readConfig } from "./config/config"
import path from "node:path"
// import cluster from "node:cluster"
// import os from "os"

// const { isWorker, fork } = cluster
// const isMainProcess = !isWorker
// const CPUs = os.cpus().length
const netBanDuration = Second * 5
const RPS = 4

const main = async () => {
    try {
        const cfg = await readConfig(path.join(__dirname, "../config.yml"))
        console.log(cfg)
        const mask = "255.255.255.0"
        const networkBitSize = parseMaskToBitSize(mask)
        const store = new InMemoryStore(netBanDuration, withinOneSecond)
        const service = new Service(store, {
            rpsLimit: RPS,
            bitSize: networkBitSize,
        })
        const server = new Server(service, {
            networkBanDurationMs: netBanDuration,
            RFCReplyForm: compileRFCForm(RPS),
        })
        server.initRoutes()
        const port = 8000
        server.listen(port)
    } catch (err: any) {
        console.error("fatal error: ", err)
    }
}
// Think for routing request to certain worker
// if (isMainProcess) {
//     console.log("number of workers: ", CPUs)
//     for (let i = 0; i < CPUs; i++) {
//         fork()
//     }
//
//     cluster.on("exit", (worker: Worker) => {
//         console.log(`worker ${worker.id} has exited`)
//     })
//     cluster.on("online", (worker: Worker) => {
//         console.log(`worker ${worker.id} has booted up!`)
//     })
// } else {
//     // On each worker
//     main()
// }
main()

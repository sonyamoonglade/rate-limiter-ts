import Server from "./server/server"
import { InMemoryStore } from "./service/store"
import Service from "./service/service"
import { parseMaskToBitSize } from "./network/network"
import { compileRFCForm } from "./http/http"
import { withinOneSecond } from "./common/time"
import { readConfig } from "./config/config"
import path from "node:path"
// import cluster from "node:cluster"
// import os from "os"

// const { isWorker, fork } = cluster
// const isMainProcess = !isWorker
// const CPUs = os.cpus().length

const main = async () => {
    try {
        const { network, app } = await readConfig(path.join(__dirname, "../config.yml"))
        const networkBitSize = parseMaskToBitSize(network.mask)
        const store = new InMemoryStore(network.banDuration, withinOneSecond)
        const service = new Service(store, {
            rpsLimit: network.rps,
            bitSize: networkBitSize,
        })
        const server = new Server(service, {
            networkBanDurationMs: network.banDuration,
            RFCReplyForm: compileRFCForm(network.rps),
        })
        server.initRoutes()
        server.listen(app.port, app.host)
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

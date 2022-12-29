import Server, { ServerConfig } from "./server/server"
import Store from "./service/store"
import { Second, withinOneSecond } from "./utils/utils"
import Service, { NetConfig } from "./service/service"
import { parseMaskToBitSize } from "./network/network"
import { compileRFCForm } from "./http/http"
// import cluster from "node:cluster"
// import os from "os"

// const { isWorker, fork } = cluster
// const isMainProcess = !isWorker
// const CPUs = os.cpus().length
const netBanDuration = Second * 5
const RPS = 4

const main = async () => {
    const mask = "255.255.255.0"
    const networkBitSize = parseMaskToBitSize(mask)
    const store = new Store(netBanDuration, withinOneSecond)
    const netConfig: NetConfig = {
        rpsLimit: RPS,
        bitSize: networkBitSize,
    }
    const service = new Service(store, netConfig)
    const serverConfig: ServerConfig = {
        networkBanDurationMs: netBanDuration,
        RFCReplyForm: compileRFCForm(RPS),
    }
    const server = new Server(service, serverConfig)
    server.initRoutes()
    const port = 8000
    return server.listen(port, "localhost")
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

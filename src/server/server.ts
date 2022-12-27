import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import Service from "../service/service"

export default class Server {
    private service: Service
    private app: FastifyInstance

    constructor(service: Service) {
        this.app = fastify()
        this.service = service
    }

    initRoutes(): void{
        this.app.get('/rate', this.handleRateLimit)
    }

    async handleRateLimit  (req:FastifyRequest, res:FastifyReply)  {
        res.send("ok")
        console.log(req, this.service)
    }

    listen (port: number, host: string) {
        return this.app.listen({
            port,
            host
        }, () => {
            console.log("server has started on port: ", port)
        })
    }
}


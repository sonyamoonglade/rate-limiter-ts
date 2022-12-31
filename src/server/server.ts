import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import Service from "../service/service"
import { HttpStatus, parseErrorCodeToHttp } from "../http/http"
import RateLimitError from "../errors/errors"

export type ServerConfig = {
    RFCReplyForm: string
    networkBanDurationMs: number
}

export default class Server {
    private readonly service: Service
    private app: FastifyInstance
    private readonly config: ServerConfig

    constructor(service: Service, config: ServerConfig) {
        this.app = fastify()
        this.service = service
        this.config = config
        this.initRoutes = this.initRoutes.bind(this)
        this.handleRateLimit = this.handleRateLimit.bind(this)
    }

    initRoutes(): void {
        this.app.get("/rate", this.handleRateLimit)
    }

    async handleRateLimit(req: FastifyRequest, res: FastifyReply) {
        const headers = req.headers
        const xForwardedFrom = headers["x-forwarded-from"]
        if (xForwardedFrom === "") {
            return res.status(HttpStatus.BAD_REQUEST).send("missing x-forwarded-from header")
        }
        const ip = xForwardedFrom as string
        try {
            this.service.rateLimit(ip)
            const r = res.status(HttpStatus.OK).raw.end()
            this.log(ip, HttpStatus.OK)
            return r
        } catch (err: any) {
            if (!(err instanceof RateLimitError)) {
                console.log(`internal error: ${err.message}`)
                const r = res.status(HttpStatus.INTERNAL_ERROR).raw.end()
                this.log(ip, HttpStatus.INTERNAL_ERROR)
                return r
            }
            console.log(`rateLimiting error: ${err.message} code: ${err.code}`)
            const httpStatus = parseErrorCodeToHttp(err.code)
            const { RFCReplyForm, networkBanDurationMs } = this.config
            res.header("Retry-After", networkBanDurationMs)
            const r = res.status(httpStatus).send(RFCReplyForm).raw.end()
            this.log(ip, httpStatus)
            return r
        }
    }

    log(ip: string, result: number): void {
        console.log(`timestamp: ${Date.now()} /GET ip: ${ip} status: ${result}`)
    }

    listen(port: number, host?: string) {
        return this.app.listen({ port, host: host || "localhost" }, () =>
            console.log("server has started on port: ", port)
        )
    }
}

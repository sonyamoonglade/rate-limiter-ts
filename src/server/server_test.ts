import assert from "node:assert"
import Service from "../service/service"
import Server from "./server"

describe("server suite", () => {
    it("should initialize server an fastify instance", () => {
        const service = new Service()
        const server = new Server(service)
        assert.ok(server)
    })


})
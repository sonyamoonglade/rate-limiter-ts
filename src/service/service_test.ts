import Service, { NetConfig } from "./service"
import Store from "./store"
import assert from "node:assert"
import { sleep, within, withinOneSecond } from "../utils/utils"
import RateLimitError from "../errors/errors"
import { ERROR_CODES } from "../errors/codes"

const newServices = (bitSize: number, rps: number, delta: number): {
    store: Store,
    service: Service
} => {
    const cfg: NetConfig = {
        bitSize,
        rpsLimit: rps
    }
    const store = new Store(100, within(delta))
    const service = new Service(store, cfg)
    return {
        store,
        service
    }
}

describe('positive case scenarois rate limtier service test suite', () => {

    const ip = "128.92.39.29"

    it("should initialize service correctly", () => {
        const store = new Store(1000, withinOneSecond)
        const netConfig: NetConfig = {
            bitSize: 24,
            rpsLimit: 10
        }
        const service = new Service(store, netConfig)
        assert.ok(service)
    })

    it("should not throw any error because hit rate is under limit", () => {
        // setup: 10 requests per 50ms
        const services = newServices(24, 10, 50)
        const srv = services.service
        for(let i = 0; i < 10; i++){
            assert.doesNotThrow(() => srv.rateLimit(ip))
        }
    })

    it("should not throw any error because hit rate is under limit", async () => {
        // setup: 4 requests per 12ms
        const services = newServices(24, 4, 12)
        const srv = services.service
        for(let i =0; i < 10; i++){
            // Each request per 4ms
            // Should pass
            assert.doesNotThrow(() => srv.rateLimit(ip))
            await sleep(4)
        }
    })


})

describe("error case scenarios rate limiter service test suite", () => {

    const ip = "128.92.39.29"

    it("should throw error because hit rate > limit ", () => {
        // setup: 10 requests per 5ms
        const services = newServices(24, 10, 5)
        const srv = services.service
        for (let i = 0; i < 11; i++) {
            if (i !== 10) {
                assert.doesNotThrow(() => {
                    srv.rateLimit(ip)
                })
                continue
            }
            assert.throws(() => {
                srv.rateLimit(ip)
            })
        }
    })

    it("should throw RateLimiterError with ERR_NETWORK_RPS_LIM_REACHED when hit rate > limit by 1 request", () => {
        // setup: 10 requests per 5ms
        const services = newServices(24, 10, 5)
        const srv = services.service
        for (let i = 0; i < 10; i++) {
            assert.doesNotThrow(() => {
                srv.rateLimit(ip)
            })
        }
        try {
            srv.rateLimit(ip)
        } catch (err: any) {
            assert.ok(err instanceof RateLimitError)
            assert.equal(err.code, ERROR_CODES.ERR_NETWORK_RPS_LIM_REACHED)
        }
    })

    it("should throw RateLimiterError with ERR_NETWORK_IN_BLACKLIST when hit rate > limit by 2+ requests", () => {
        // setup: 10 requests per 4ms
        const services = newServices(24, 10, 4)
        const srv = services.service
        for (let i = 0; i < 11; i++) {
            // < 10 requests
            if (i !== 10) {
                assert.doesNotThrow(() => srv.rateLimit(ip))
                continue
            }
            // 11th request
            assert.throws(() => srv.rateLimit(ip))
        }
        try {
            // 12th request
            srv.rateLimit(ip)
        } catch (err: any) {
            assert.ok(err instanceof RateLimitError)
            assert.equal(err.code, ERROR_CODES.ERR_NETWORK_IN_BLACKLIST)
        }
    })
})

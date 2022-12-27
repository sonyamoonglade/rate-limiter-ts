import assert from "node:assert"
import Store from "./store"
import { parseMaskToBitSize, parseNetworkPart } from "../network/network"
import { sleep } from "../utils/utils"

describe("store test suite", () => {
    const ip = "128.92.39.29"
    const mask = "255.255.255.0"
    const bitSize = parseMaskToBitSize(mask)
    const network = parseNetworkPart(ip, bitSize)

    it("should initialize store", () => {
        const ttl = 1000
        const store = new Store(ttl)
        assert.ok(store)
        assert.ok(store.blacklist)
        assert.ok(store.hitsTable)
    })

    it("should increase hit counter of the network by 1", () => {
        const ttl = 1000
        const store = new Store(ttl)
        store.hit(network)
        assert.equal(1, store.hitsTable.get(network))
    })

    it("should increase hit counter of the network 3", () => {
        const ttl = 1000
        const store = new Store(ttl)
        store.hit(network)
        store.hit(network)
        store.hit(network)
        assert.equal(3, store.hitsTable.get(network))
    })

    it("should get current hits by the network", () => {
        const ttl = 1000
        const store = new Store(ttl)
        store.hit(network)
        store.hit(network)
        store.hit(network)
        assert.equal(3, store.getHits(network))
        store.hit(network)
        store.hit(network)
        store.hit(network)
        assert.equal(6, store.getHits(network))
    })

    it("should add network to blacklist once", () => {
        const ttl = 1000
        const store = new Store(ttl)
        store.addToBlacklist(network)
        assert.ok(store.blacklist.get(network) as unknown)
        assert.ok(store.blacklist.get(network)! > Date.now())
        assert.throws(() => {
            store.addToBlacklist(network)
        })
    })

    it("should return true because network is in blacklist", () => {
        const ttl = 200
        const store = new Store(ttl)
        store.addToBlacklist(network)
        assert.ok(store.isInBlacklist(network))
    })

    it("should return false because network is not in blacklist", () => {
        const ttl = 200
        const store = new Store(ttl)
        assert.ok(!store.isInBlacklist(network))
    })

    it("should return false because ttl has passed for network in blacklist", async () => {
        const ttl = 50
        const store = new Store(ttl)
        store.addToBlacklist(network)
        assert.ok(store.isInBlacklist(network))
        // Wait 50ms
        await sleep(50)
        assert.ok(!store.isInBlacklist(network))
    })

    it("should remove network from blacklist", () => {
        const ttl = 50
        const store = new Store(ttl)
        store.addToBlacklist(network)
        assert.ok(store.isInBlacklist(network))
        store.removeFromBlacklist(network)
        assert.ok(!store.isInBlacklist(network))
    })
})

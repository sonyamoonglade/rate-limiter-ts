import assert from "node:assert"
import Store from "./store"
import { parseMaskToBitSize, parseNetworkPart } from "../network/network"
import { millisecond, sleep, within, withinOneSecond } from "../utils/utils"

describe("store test suite", () => {
    const ip = "128.92.39.29"
    const mask = "255.255.255.0"
    const bitSize = parseMaskToBitSize(mask)
    const network = parseNetworkPart(ip, bitSize)

    it("should initialize store", () => {
        const ttl = 1000
        const store = new Store(ttl, withinOneSecond)
        assert.ok(store)
        assert.ok(store.blacklist)
        assert.ok(store.hitsTable)
    })

    it("should increase hit counter of the network by 1", () => {
        const ttl = 1000
        const store = new Store(ttl, withinOneSecond)
        store.hit(network)
        assert.equal(store.hitsTable.get(network)?.requests, 1)
    })

    it("should increase hit counter of the network 3", async () => {
        const ttl = 1000
        const store = new Store(ttl, withinOneSecond)
        store.hit(network)
        store.hit(network)
        store.hit(network)
        assert.equal(store.hitsTable.get(network)?.requests, 3)
    })

    it("should end up on counter = 1 because rate is N requests/10ms but sleep 15ms", async () => {
        const ttl = 1000
        const withinFunc = within(millisecond * 10)
        const store = new Store(ttl, withinFunc)
        // 2 requests within 10ms
        const k1 = store.hit(network)
        const k2 = store.hit(network)
        assert.equal(k1, 1)
        assert.equal(k2, 2)
        await sleep(15)
        // 1 request within 10ms
        const k3 = store.hit(network)
        assert.equal(k3, 1)
    })

    it("should add network to blacklist once", () => {
        const ttl = 1000
        const store = new Store(ttl, withinOneSecond)
        store.addToBlacklist(network)
        assert.ok(store.blacklist.get(network) as unknown)
        assert.throws(() => {
            store.addToBlacklist(network)
        })
    })

    it("should return true because network is in blacklist", () => {
        const ttl = 200
        const store = new Store(ttl, withinOneSecond)
        store.addToBlacklist(network)
        assert.ok(store.isInBlacklist(network))
    })

    it("should return false because network is not in blacklist", () => {
        const ttl = 200
        const store = new Store(ttl, withinOneSecond)
        assert.ok(!store.isInBlacklist(network))
    })

    it("should return false because ttl has passed for network in blacklist", async () => {
        const ttl = 5
        const store = new Store(ttl, withinOneSecond)
        store.addToBlacklist(network)
        assert.ok(store.isInBlacklist(network))
        await sleep(5)
        assert.ok(!store.isInBlacklist(network))
    })

    it("should remove network from blacklist", () => {
        const ttl = 50
        const store = new Store(ttl, withinOneSecond)
        store.addToBlacklist(network)
        assert.ok(store.isInBlacklist(network))
        store.removeFromBlacklist(network)
        assert.ok(!store.isInBlacklist(network))
    })

    it("should not remove network from blacklist because it doesn't exist", () => {
        const ttl = 50
        const store = new Store(ttl, withinOneSecond)
        assert.throws(() => {
            store.removeFromBlacklist(network)
        })
    })
})





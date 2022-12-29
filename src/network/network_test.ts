import assert from "node:assert"
import { parseMaskToBitSize, parseNetworkPart } from "./network"
describe("parse mask test suite", () => {
    it("should parse mask and return 24 as network bit size", () => {
        const mask = "255.255.255.0" // 8 bits for host, 24 for network
        const result = parseMaskToBitSize(mask)
        assert.equal(result, 24)
    })

    it("should throw invalid mask", () => {
        const mask = "255.255.a.0"
        assert.throws(() => {
            parseMaskToBitSize(mask)
        })
    })
})

describe("parse network part test suite", () => {
    it("should parse network and return concrete length binary string", () => {
        const mask = "255.255.255.0"
        const bitSize = parseMaskToBitSize(mask)

        const testingTable: {
            ip: string
            expected: string
        }[] = [
            {
                ip: "172.168.28.93",
                expected: "101011001010100000011100",
            },
            {
                ip: "122.91.28.93",
                expected: "011110100101101100011100",
            },
        ]
        for (const test of testingTable) {
            const network = parseNetworkPart(test.ip, bitSize)
            assert.equal(network.length, bitSize)
            assert.equal(network, test.expected)
        }
    })
})

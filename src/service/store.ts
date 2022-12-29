import { WithinFunc } from "../utils/utils"

type RPSControl = {
    // First request time in milliseconds
    firstRequestAt: number
    requests: number
}

export default class Store {
    hitsTable: Map<string, RPSControl>
    blacklist: Map<string, number>
    // Given in milliseconds
    expirationTTL: number
    withinFunc: WithinFunc

    constructor(expirationTTL: number, withinFunc: WithinFunc) {
        this.hitsTable = new Map<string, RPSControl>()
        this.blacklist = new Map<string, number>()
        this.expirationTTL = expirationTTL
        this.withinFunc = withinFunc
    }

    // Increments counter for requests coming within a second by network
    hit(network: string): number {
        const now = Date.now()
        if (!this.hitsTable.has(network)) {
            const control:RPSControl = {
                firstRequestAt: now,
                requests: 1,
            }
            this.hitsTable.set(network, control)
            return 1
        }
        let currControl = this.hitsTable.get(network) as RPSControl
        if (!this.withinFunc(now, currControl.firstRequestAt)){
            currControl.requests = 1
            currControl.firstRequestAt = now
            return 1
        }
        currControl.requests++
        // No need to hitsTable.set because currControl is a reference
        return currControl.requests
    }

    addToBlacklist(network: string): void {
        if (this.blacklist.has(network)) {
            throw new Error("already in blacklist")
        }
        const expirationTime = Date.now() + this.expirationTTL
        this.blacklist.set(network, expirationTime)
    }

    removeFromBlacklist(network: string): void {
        if (!this.isInBlacklist(network)) {
            throw new Error("not in blacklist")
        }
        this.blacklist.delete(network)
    }

    isInBlacklist(network: string): boolean {
        if (!this.blacklist.has(network)) {
            return false
        }
        const expirationTime = this.blacklist.get(network) as number
        // Ban has not expired yet
        if (expirationTime > Date.now()) {
            return true
        }
        this.blacklist.delete(network)
        return false
    }


}





export default class Store {
    hitsTable: Map<string, number>
    blacklist: Map<string, number>
    // Given in milliseconds
    expirationTTL: number

    constructor(expirationTTL: number) {
        this.hitsTable = new Map<string, number>()
        this.blacklist = new Map<string, number>()
        this.expirationTTL = expirationTTL
    }


    hit(network: string): number {
        if(!this.hitsTable.has(network)){
            this.hitsTable.set(network, 1)
            return 1
        }
        const currHits = this.hitsTable.get(network) as number
        this.hitsTable.set(network, currHits + 1)
        return currHits + 1
    }

    getHits(network: string): number{
        if(!this.hitsTable.has(network)){
            return 0
        }
        return this.hitsTable.get(network)!
    }

    addToBlacklist(network: string): void {
        if (this.blacklist.has(network)){
            throw new Error("already in blacklist")
        }
        const expirationTime = Date.now() + this.expirationTTL
        this.blacklist.set(network, expirationTime)
    }

    removeFromBlacklist(network: string): void {
        if (!this.isInBlacklist(network)){
            throw new Error("not in blacklist")
        }
        this.blacklist.delete(network)
    }

    isInBlacklist(network: string): boolean {
        if (!this.blacklist.has(network)){
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


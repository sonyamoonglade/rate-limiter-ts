import { parseNetworkPart } from "../network/network"
import RateLimitError from "../errors/errors"
import { ERROR_CODES } from "../errors/codes"
import { Store } from "./store"

export interface NetConfig {
    // Number of bits for network part within 32bit ip
    bitSize: number
    rpsLimit: number
}

export default class Service {
    private store: Store
    private readonly netConfig: NetConfig
    constructor(store: Store, netCfg: NetConfig) {
        this.store = store
        this.netConfig = netCfg
    }

    public rateLimit(ip: string): void {
        const { rpsLimit, bitSize } = this.netConfig
        const network = parseNetworkPart(ip, bitSize)
        if (this.store.isInBlacklist(network)) {
            throw new RateLimitError(ERROR_CODES.ERR_NETWORK_IN_BLACKLIST, "network in blacklist")
        }
        const incrementedHits = this.store.hit(network)
        if (incrementedHits > rpsLimit) {
            this.store.addToBlacklist(network)
            throw new RateLimitError(ERROR_CODES.ERR_NETWORK_RPS_LIM_REACHED, "network rps limit reached")
        }
    }
}

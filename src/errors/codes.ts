export const ERROR_CODES = {
    ERR_NETWORK_IN_BLACKLIST: 0,
    ERR_NETWORK_RPS_LIM_REACHED: 1,
} as const

export type ErrorCode = number

import { ErrorCode } from "./codes"

export default class RateLimitError extends Error {
    message: any
    code: ErrorCode

    constructor(code: ErrorCode, message: string) {
        super(message)
        this.message = message
        this.code = code
    }
}

import { ERROR_CODES } from "../errors/codes"

export const HttpStatus = {
    TOO_MANY_REQUESTS: 429,
    OK: 200,
    BAD_REQUEST: 400,
    INTERNAL_ERROR: 500,
} as const

export const parseErrorCodeToHttp = (code: number): number => {
    switch (code) {
        case ERROR_CODES.ERR_NETWORK_IN_BLACKLIST:
        case ERROR_CODES.ERR_NETWORK_RPS_LIM_REACHED:
            return HttpStatus.TOO_MANY_REQUESTS
        default:
            return HttpStatus.INTERNAL_ERROR
    }
}

export const compileRFCForm = (rps: number) => {
    return `
   <html lang="en">
      <head>
         <title>Too Many Requests</title>
      </head>
      <body>
         <h1>Too Many Requests</h1>
         <p>
          Only ${rps} requests is allowed per second.
          Try again soon.
          </p>
      </body>
   </html> 
    `
}

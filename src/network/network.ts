export const parseMaskToBitSize = (mask: string): number => {
    const octets = mask.split(".")
    let countOnes = 0
    for (const octet of octets) {
        let numOctet = parseInt(octet)
        if (Number.isNaN(numOctet)) {
            throw new Error("invalid mask")
        }
        while (numOctet > 0) {
            const [n, remainder] = remainderDivision(numOctet)
            if (remainder === 0) {
                return countOnes
            }
            countOnes++
            numOctet = n
        }
    }

    return countOnes
}

export const parseNetworkPart = (ip: string, bitSize: number): string => {
    const octets = ip.split(".")
    let network = ""
    let k = 0
    for (const octet of octets) {
        if (k >= bitSize) {
            return network
        }
        network += Number(octet).toString(2).padStart(8, "0")
        k += 8
    }
    return network.substring(0, bitSize)
}

const remainderDivision = (n: number): readonly [number, number] => {
    return [Math.floor(n / 2), n % 2]
}

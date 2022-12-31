export const parseMaskToBitSize = (mask: string): number => {
    const octets = mask.split(".")
    let binary: string[] = []
    for (const octet of octets) {
        let numOctet = parseInt(octet)
        if (Number.isNaN(numOctet)) {
            throw new Error("invalid mask")
        }
        binary.push(numOctet.toString(2).padStart(8, "0"))
    }
    return binary.reduce((acc, curr) => {
        // Count all subsequent ones, exit when iter over zero.
        const count = curr.split("").reduce((accOctet, currBit) => {
            if (currBit === "0") {
                return accOctet
            }
            accOctet += 1
            return accOctet
        }, 0)
        acc += count
        return acc
    }, 0)
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

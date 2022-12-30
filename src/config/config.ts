import yaml from "js-yaml"
import fs from "fs/promises"
import { Second } from "../common/time"

export type AppConfig = {
    network: {
        rps: number
        banDuration: number
        mask: string
    }
    app: {
        port: number
        host: string
    }
}

export const readConfig = async (path: string): Promise<AppConfig> => {
    try {
        const buff = await fs.readFile(path, { encoding: "utf-8" })
        const doc = yaml.load(buff) as any
        const cfg: AppConfig = {
            network: {
                rps: doc?.network?.rps,
                banDuration: doc?.network?.banDuration,
                mask: doc?.network?.mask,
            },
            app: {
                port: doc?.app?.port,
                host: doc?.app?.host,
            },
        }
        validate(cfg)
        cfg.network.banDuration = cfg.network.banDuration * Second
        return cfg
    } catch (err: any) {
        throw new Error(`read config error: ${err.message!}`)
    }
}

const validate = (object: any, parent?: string): void => {
    const keys = Object.keys(object)
    for (const key of keys) {
        if (typeof object[key] === "object") {
            validate(object[key], key)
        }
        if (object[key] === undefined) {
            const msg = `validation error: field ${parent}.${key} is undefined`
            throw new Error(msg)
        }
    }
}

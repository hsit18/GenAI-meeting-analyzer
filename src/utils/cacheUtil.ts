import { join } from "path";

const storage = require('node-persist');


export const init = async () => {
    const uploadDir = join(process.cwd(), "public", "db");
    await storage.init({
        dir: uploadDir,
        expiredInterval: 60 * 60 * 1000, 
    });
}

export const setCache = async (key: string, value: any) => {
    return storage.setItem(key, value);
}

export const getCache = async (key: string) => {
    return storage.getItem(key);
}
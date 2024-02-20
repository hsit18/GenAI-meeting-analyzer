import { join } from "path";

const storage = require('node-persist');

const uploadDir = join(process.cwd(), "public", "db");

storage.init({
    dir: uploadDir,
    expiredInterval: 60 * 60 * 1000, 
});
// import NodeCache from 'node-cache';

// const myCache = new NodeCache( { stdTTL: 0 } );

export const setCache = async (key: string, value: any) => {
    return storage.setItem(key, value);
}

export const getCache = async (key: string) => {
    return storage.getItem(key);
}

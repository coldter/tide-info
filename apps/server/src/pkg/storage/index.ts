import { createStorage, type StorageValue } from "unstorage";
import vercelKVDriver from "unstorage/drivers/vercel-kv";
import memoryDriver from "./driver/meta-memory";

export function createCachedStorage<T extends StorageValue = StorageValue>(
  base: string,
  ttl: number
) {
  return createStorage<T>({
    driver: process.env.VERCEL
      ? vercelKVDriver({
          base,
          ttl,
        })
      : memoryDriver({
          base,
          ttl,
        }),
  });
}

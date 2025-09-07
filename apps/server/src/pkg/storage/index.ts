import { createStorage, type StorageValue } from "unstorage";
import vercelRuntimeCacheDriver from "unstorage/drivers/vercel-runtime-cache";
import memoryDriver from "./driver/meta-memory";

export function createCachedStorage<T extends StorageValue = StorageValue>(
  base: string,
  ttl: number
) {
  return createStorage<T>({
    driver: process.env.VERCEL
      ? vercelRuntimeCacheDriver({
          base,
          ttl,
        })
      : memoryDriver({
          base,
          ttl,
        }),
  });
}

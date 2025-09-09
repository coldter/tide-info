import type { Storage } from "unstorage";
import type { APIKey, KeyPoolStorage, KeyStatus } from "@/pkg/key-pooler/types";

export class KeyPoolStore implements KeyPoolStorage {
  private readonly storage: Storage<KeyStatus>;

  constructor(storage: Storage<KeyStatus>) {
    this.storage = storage;
  }
  async init(keys: APIKey[]): Promise<void> {
    await Promise.all(
      keys.map(async (key) => {
        const storageKey = this.buildStorageKey(key);
        const exists = await this.storage.hasItem(storageKey);
        if (!exists) {
          await this.storage.setItem(storageKey, this.createDefaultStatus(key));
        }
      })
    );
  }

  async getAllKeyStatuses(): Promise<KeyStatus[]> {
    const allKeys = await this.storage.getKeys();
    const ownKeys = allKeys.map((k) => k.split(":")[1] || k);
    const records = await Promise.all(
      ownKeys.map((k) => this.storage.getItem(k))
    );

    const statuses: KeyStatus[] = [];
    for (const record of records) {
      const rehydrated = this.rehydrate(record);
      if (rehydrated) {
        statuses.push(rehydrated);
      }
    }
    return statuses;
  }

  async getKeyStatus(key: APIKey): Promise<KeyStatus | null> {
    const item = await this.storage.getItem(this.buildStorageKey(key));
    return this.rehydrate(item);
  }

  async updateKeyStatus(
    key: APIKey,
    updates: Partial<Omit<KeyStatus, "key">>
  ): Promise<void> {
    const storageKey = this.buildStorageKey(key);
    const existing = this.rehydrate(await this.storage.getItem(storageKey));
    if (!existing) {
      return;
    }

    const next: KeyStatus = { ...existing, ...updates };
    await this.storage.setItem(storageKey, next);
  }

  async reset(): Promise<void> {
    const allKeys = await this.storage.getKeys();
    const ownKeys = allKeys.map((k) => k.split(":")[1] || k);
    await Promise.all(ownKeys.map((k) => this.storage.removeItem(k)));
  }

  private buildStorageKey(key: APIKey): string {
    return `${key}`;
  }

  private createDefaultStatus(key: APIKey): KeyStatus {
    return {
      key,
      usageCount: 0,
      isRateLimited: false,
      rateLimitedAt: null,
      lastUsedAt: null,
    };
  }

  private rehydrate(status: KeyStatus | null): KeyStatus | null {
    if (!status) {
      return null;
    }

    const toDate = (value: unknown): Date | null => {
      if (value === null || value === undefined) {
        return null;
      }
      return new Date(value as string | number | Date);
    };

    return {
      ...status,
      rateLimitedAt: toDate(status.rateLimitedAt),
      lastUsedAt: toDate(status.lastUsedAt),
    };
  }
}

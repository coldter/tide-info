import type {
  APIKey,
  KeyPoolOptions,
  KeyPoolStorage,
  KeyStatus,
} from "./types";

export class KeyPool {
  private readonly storage: KeyPoolStorage;
  private readonly options: KeyPoolOptions;

  constructor(storage: KeyPoolStorage, options?: Partial<KeyPoolOptions>) {
    this.storage = storage;
    this.options = {
      maxRequestsPerKey: 10,
      coolDownPeriodMs: 24 * 60 * 60 * 1000, // 24 hours
      ...options,
    };
  }

  async initialize(keys: APIKey[]): Promise<void> {
    await this.storage.init(keys);
  }

  private isKeyCooledDown(keyStatus: KeyStatus): boolean {
    if (!keyStatus.rateLimitedAt) {
      return false;
    }
    return (
      Date.now() - keyStatus.rateLimitedAt.getTime() >
      this.options.coolDownPeriodMs
    );
  }

  async getAvailableKey(): Promise<APIKey | null> {
    const allKeys = await this.storage.getAllKeyStatuses();

    // First, check and reset any keys that have cooled down
    for (const keyStatus of allKeys) {
      if (keyStatus.isRateLimited && this.isKeyCooledDown(keyStatus)) {
        await this.storage.updateKeyStatus(keyStatus.key, {
          usageCount: 0,
          isRateLimited: false,
          rateLimitedAt: null,
        });
      }
    }

    // Get updated key statuses after potential resets
    const updatedKeys = await this.storage.getAllKeyStatuses();

    // Find available key with lowest usage
    let selectedKey: APIKey | null = null;
    let minUsage = Number.POSITIVE_INFINITY;

    for (const keyStatus of updatedKeys) {
      if (!keyStatus.isRateLimited && keyStatus.usageCount < minUsage) {
        minUsage = keyStatus.usageCount;
        selectedKey = keyStatus.key;
      }
    }

    return selectedKey;
  }

  async recordSuccess(key: APIKey): Promise<void> {
    const keyStatus = await this.storage.getKeyStatus(key);
    if (!keyStatus) {
      throw new Error(`Key ${key} not found in pool`);
    }

    const newUsageCount = keyStatus.usageCount + 1;
    const updates: Partial<Omit<KeyStatus, "key">> = {
      usageCount: newUsageCount,
      lastUsedAt: new Date(),
    };

    if (newUsageCount >= this.options.maxRequestsPerKey) {
      updates.isRateLimited = true;
      updates.rateLimitedAt = new Date();
    }

    await this.storage.updateKeyStatus(key, updates);
  }

  async markRateLimited(key: APIKey): Promise<void> {
    await this.storage.updateKeyStatus(key, {
      isRateLimited: true,
      rateLimitedAt: new Date(),
      lastUsedAt: new Date(),
    });
  }

  async getStatus(): Promise<KeyStatus[]> {
    return this.storage.getAllKeyStatuses();
  }

  async resetKey(key: APIKey): Promise<void> {
    await this.storage.updateKeyStatus(key, {
      usageCount: 0,
      isRateLimited: false,
      rateLimitedAt: null,
    });
  }
}

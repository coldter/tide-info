export type APIKey = string;

export interface KeyStatus {
  key: APIKey;
  usageCount: number;
  isRateLimited: boolean;
  rateLimitedAt: Date | null;
  lastUsedAt: Date | null;
}

export interface KeyPoolStorage {
  // Initialize the storage with keys
  init(keys: APIKey[]): Promise<void>;

  // Get all key statuses
  getAllKeyStatuses(): Promise<KeyStatus[]>;

  // Get a specific key's status
  getKeyStatus(key: APIKey): Promise<KeyStatus | null>;

  // Update a key's status
  updateKeyStatus(
    key: APIKey,
    updates: Partial<Omit<KeyStatus, "key">>
  ): Promise<void>;

  // Reset all keys (for testing or maintenance)
  reset(): Promise<void>;
}

export interface KeyPoolOptions {
  // Maximum requests per key before rate limiting
  maxRequestsPerKey: number;
  // Cool-down period in milliseconds for rate-limited keys
  coolDownPeriodMs: number;
}

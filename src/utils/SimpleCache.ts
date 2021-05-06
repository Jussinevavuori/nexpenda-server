/**
 * Simple cache to store a single value in memory and use it until it becomes
 * stale after a specified timeout.
 */
export class SimpleCache<T> {
  /**
   * Current value, including the data that was stored in the cache
   * and a timestamp for when it was updated to the cache.
   */
  public value: undefined | { data: T; timestamp: number };

  /**
   * How long this cache contains the value until it is considered
   * stale.
   */
  public readonly staleTimeoutMs: number;

  constructor(staleTimeoutMs: number) {
    this.staleTimeoutMs = staleTimeoutMs;
  }

  /**
   * Get timestamp for when the current value becomes stale.
   */
  private getValueBecomesStaleAt() {
    if (!this.value) return 0;
    return this.value.timestamp + this.staleTimeoutMs;
  }

  /**
   * Is the current value stale?
   */
  get isDataStale() {
    if (!this.value) {
      return false;
    }

    return this.getValueBecomesStaleAt() < Date.now();
  }

  /**
   * Manually update the current data with fresh data
   */
  update(newData: T) {
    this.value = {
      data: newData,
      timestamp: Date.now(),
    };
  }

  /**
   * Drop the current value
   */
  drop() {
    this.value = undefined;
  }

  /**
   * Get the current value if it is fresh, else undefined.
   */
  getFresh(): T | undefined {
    if (!this.value) return undefined;
    if (this.isDataStale) return undefined;

    return this.value.data;
  }
}

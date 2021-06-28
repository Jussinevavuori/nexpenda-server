export type PubSubListener<T> = (event: T) => void | Promise<void>;

export class PubSub<T> {
  /**
   * All listener functions
   */
  listeners: PubSubListener<T>[];

  constructor() {
    this.listeners = [];
  }

  publish(event: T) {
    this.listeners.forEach((listener) => listener(event));
  }

  subscribe(listener: PubSubListener<T>): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}

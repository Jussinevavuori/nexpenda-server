export function createLogger(options?: { name?: string }) {
  const ops = {
    name: options?.name ?? "App",
  };

  return function (...args: any[]) {
    console.log(`[${ops.name}]:`, ...args);
  };
}

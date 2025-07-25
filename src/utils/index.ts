export function toPromise<T>(data: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), 0);
  });
}

export function promisify<T>(
  fn: (...args: any[]) => T
): (...args: any[]) => Promise<T> {
  return (...args: any[]): Promise<T> => {
    return new Promise((resolve) => {
      resolve(fn(...args));
    });
  };
}

export function errorPromise(error: Error): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(error), 0);
  });
}

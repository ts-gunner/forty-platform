/**
 * 并发限制工具函数
 * @param fn 需要限制并发的异步函数
 * @param maxConcurrency 最大并发数
 */
export function withConcurrencyLimit<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  maxConcurrency: number
) {
  let activeCount = 0;
  const queue: Array<{
    args: Args;
    resolve: (value: T) => void;
    reject: (reason?: any) => void;
  }> = [];

  const runNext = async () => {
    if (activeCount >= maxConcurrency || queue.length === 0) {
      return;
    }

    const { args, resolve, reject } = queue.shift()!;
    activeCount++;

    try {
      const result = await fn(...args);
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      activeCount--;
      runNext();
    }
  };

  return (...args: Args): Promise<T> => {
    return new Promise((resolve, reject) => {
      queue.push({ args, resolve, reject });
      runNext();
    });
  };
}

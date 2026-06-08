import { withRetry } from "../utils/retry.js";
import { semaphore } from "../utils/semaphore.js";
import { withTimeout } from "../utils/timeout.js";
import { circuitBreaker } from "../utils/circuitBreaker.js";

describe("withRetry", () => {

  test("should succeed on first try", async () => {
    const fn = jest.fn().mockResolvedValue("success");

    const result = await withRetry(fn, { baseDelay: 0 });

    expect(result).toBe("success");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test("should retry until success", async () => {
    const fn = jest.fn()
      .mockRejectedValueOnce("fail1")
      .mockRejectedValueOnce("fail2")
      .mockResolvedValue("success");

    const result = await withRetry(fn, { baseDelay: 0 });

    expect(result).toBe("success");
    expect(fn).toHaveBeenCalledTimes(3);
  });

  test("should stop after maxAttempts", async () => {
    const fn = jest.fn().mockRejectedValue("fail");

    await expect(
      withRetry(fn, { maxAttempts: 3, baseDelay: 0 })
    ).rejects.toBe("fail");

    expect(fn).toHaveBeenCalledTimes(3);
  });
});


describe("Semaphore", () => {

  test("should allow concurrency within limit", async () => {
    const sem = new semaphore(2);

    let running = 0;
    let max = 0;

    const task = async () => {
      running++;
      max = Math.max(max, running);

      await new Promise(r => setTimeout(r, 50));

      running--;
    };

    await Promise.all([
      sem.run(task),
      sem.run(task),
      sem.run(task),
    ]);

    expect(max).toBeLessThanOrEqual(2);
  });

  test("should queue excess tasks", async () => {
    const sem = new semaphore(1);

    let order = [];

    const task = async (id) => {
      order.push(`start-${id}`);

      await new Promise(r => setTimeout(r, 10));

      order.push(`end-${id}`);
    };

    await Promise.all([
      sem.run(() => task(1)),
      sem.run(() => task(2)),
    ]);

    expect(order).toEqual([
      "start-1",
      "end-1",
      "start-2",
      "end-2",
    ]);
  });
});


describe("withTimeout", () => {

  test("should resolve if fast enough", async () => {
    const promise = Promise.resolve("done");

    const result = await withTimeout(promise, 1000);

    expect(result).toBe("done");
  });

  test("should timeout if slow", async () => {
    const slowPromise = new Promise(resolve => {
      setTimeout(() => resolve("late"), 2000);
    });

    await expect(
      withTimeout(slowPromise, 100)
    ).rejects.toThrow("Operation timed out");
  });
});


describe("circuitBreaker", () => {

  test("should stay CLOSED on success", async () => {
    const cb = new circuitBreaker(2, 1000);

    const fn = jest.fn().mockResolvedValue("ok");

    const result = await cb.execute(fn);

    expect(result).toBe("ok");
    expect(cb.state).toBe("CLOSED");
  });

  test("should OPEN after threshold failures", async () => {
    const cb = new circuitBreaker(2, 1000);

    const fn = jest.fn().mockRejectedValue(new Error("fail"));

    await expect(cb.execute(fn)).rejects.toThrow();
    await expect(cb.execute(fn)).rejects.toThrow();

    expect(cb.state).toBe("OPEN");
  });

  test("should block calls when OPEN", async () => {
    const cb = new circuitBreaker(1, 1000);

    const fn = jest.fn().mockRejectedValue(new Error("fail"));

    await expect(cb.execute(fn)).rejects.toThrow();
    await expect(cb.execute(fn)).rejects.toThrow();
  });

  test("should move to HALF_OPEN after cooldown", async () => {
    const cb = new circuitBreaker(1, 50);

    const failFn = jest.fn().mockRejectedValue(new Error("fail"));

    await expect(cb.execute(failFn)).rejects.toThrow();

    await new Promise(r => setTimeout(r, 60));

    const successFn = jest.fn().mockResolvedValue("ok");

    const result = await cb.execute(successFn);

    expect(result).toBe("ok");
    expect(cb.state).toBe("CLOSED");
  });

  test("should reopen if HALF_OPEN fails", async () => {
    const cb = new circuitBreaker(1, 50);

    const failFn = jest.fn().mockRejectedValue(new Error("fail"));

    await expect(cb.execute(failFn)).rejects.toThrow();

    await new Promise(r => setTimeout(r, 60));

    await expect(cb.execute(failFn)).rejects.toThrow();

    expect(cb.state).toBe("OPEN");
  });
});
import * as React from "react";

export class PromiseUtils {
  /**
   * Throws an error inside a promise
   * @param error
   */
  public static Rethrow<T>(error: T) {
    return new Promise((resolve, reject) => {
      reject(error);
    });
  }

  /**
   * Given an import function (() => import()), will retry fetching multiple times before failing. Usually used to prevent chunk errors.
   * @param fn The import function (() => import("/my/component/path"))
   * @param retriesLeft The number of retries remaining. Defaults to 5. This will decrement each time it fails.
   * @param interval The period in between retries, defaults to 500 (ms)
   */
  public static retryImport = (
    fn,
    retriesLeft = 5,
    interval = 500
  ): Promise<{ default: React.ComponentType<any> }> => {
    return new Promise((resolve, reject) => {
      fn()
        .then(resolve)
        .catch((error) => {
          setTimeout(() => {
            if (retriesLeft === 1) {
              reject(error);

              return;
            }

            // Passing on "reject" is the important part
            PromiseUtils.retryImport(fn, retriesLeft - 1, interval).then(
              resolve,
              reject
            );
          }, interval);
        });
    });
  };
}

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function isPromiseLike(value: any): value is { then: Function, catch: Function } {
  return value instanceof MyPromise || Boolean(
    value && 
    typeof value === 'object' && 
    typeof value.then === 'function' &&
    typeof value.catch === 'function'
  );
}


class MyPromise<T> {
  #state: string = PENDING;
  #value: T | null = null;
  #error: any = null
  #thenCallbacks: Array<(value: T) => any> = [];
  #catchCallbacks: Array<(error: any) => any> = [];
  #finallyCallbacks: Array<() => any> = [];

  constructor(executor: (resolve: (value: T) => void, reject: (reason?: any) => void) => void) {
    try {
      executor(
        (value: T) => this.#resolve(value),
        (reason: any) => this.#reject(reason)
      );
    } catch (error) {
      this.#reject(error);
    }
  }

  #resolve(value: T): void {
    if (this.#state !== PENDING) return;

    this.#state = FULFILLED;
    this.#value = value;
    
    this.#thenCallbacks.forEach(callback => {
      queueMicrotask(() => callback(value));
    });
    
    this.#finallyCallbacks.forEach(callback => {
      queueMicrotask(() => callback());
    });
  }

  #reject(reason: any): void {
    if (this.#state !== PENDING) return;

    this.#state = REJECTED;
    this.#error = reason;
    
    this.#catchCallbacks.forEach(callback => {
      queueMicrotask(() => callback(reason));
    });
    
    this.#finallyCallbacks.forEach(callback => {
      queueMicrotask(() => callback());
    });
  }

  then<U>(onFulfilled?: (value: T) => U | MyPromise<U>, onRejected?: (error: any) => U | MyPromise<U>): MyPromise<U> {
    const promise = new MyPromise<U>((resolve, reject) => {
      const handleFulfilled = (value: T) => {
        if (!onFulfilled) {
          resolve(value as unknown as U);
          return;
        }
        
        try {
          const result = onFulfilled(value);
          if (isPromiseLike(result)) {
            result.then(resolve).catch(reject);
          } else {
            resolve(result);
          }
        } catch (error) {
          reject(error);
        }
      };

      if (this.#state === FULFILLED) {
        queueMicrotask(() => handleFulfilled(this.#value!)); // we can not add check for null, since the actual value itself can be null 
      } else if (this.#state === REJECTED) {
        queueMicrotask(() => reject(this.#error));
      } else {
        this.#thenCallbacks.push(handleFulfilled);
        this.#catchCallbacks.push(reject);
      }
    });

    if (onRejected) {
      return promise.catch(onRejected);
    }
    
    return promise;
  }

  catch<U>(onRejected?: (error: any) => U | MyPromise<U>): MyPromise<U> {
    return new MyPromise<U>((resolve, reject) => {
      const handleRejected = (error: any) => {
        if (!onRejected) {
          reject(error);
          return;
        }
        
        try {
          const result = onRejected(error);
          if (isPromiseLike(result)) {
            result.then(resolve).catch(reject);
          } else {
            resolve(result);
          }
        } catch (error) {
          reject(error);
        }
      };

      if (this.#state === REJECTED) {
        queueMicrotask(() => handleRejected(this.#error));
      } else if (this.#state === FULFILLED) {
        queueMicrotask(() => resolve(this.#value as unknown as U));
      } else {
        this.#catchCallbacks.push(handleRejected);
        this.#thenCallbacks.push((value) => resolve(value as unknown as U));
      }
    });
  }

  finally(onFinally?: () => void): MyPromise<T> {
    return new MyPromise<T>((resolve, reject) => {
      const handleFinally = () => {
        if (!onFinally) {
            if (this.#state === FULFILLED) {
                resolve(this.#value!);
            } else if (this.#state === REJECTED) {
                reject(this.#error);
            }
            return;
        }
        
        try {
          onFinally();
          if (this.#state === FULFILLED) { 
            resolve(this.#value!); // we can not add check for null, since the actual value itself can be null 
          } else if (this.#state === REJECTED) {
            reject(this.#error);
          }
        } catch (error) {
          reject(error);
        }
      };

      if (this.#state !== PENDING) {
        queueMicrotask(() => handleFinally());
      } else {
        this.#finallyCallbacks.push(handleFinally);
      }
    });
  }
}

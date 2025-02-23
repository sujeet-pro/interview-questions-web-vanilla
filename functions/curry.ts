/**
 * Creates a curried version of a function that can be partially applied.
 * Currying transforms a function that takes multiple arguments into a sequence
 * of functions that each take a single argument.
 *
 * @param callback - The function to curry
 * @param args - Initial arguments to partially apply
 * @returns A curried function that collects arguments until fully applied
 *
 * @example
 * // Basic currying
 * const add = (a: number, b: number, c: number) => a + b + c;
 * const curriedAdd = curry(add);
 * curriedAdd(1)(2)(3) // Returns 6
 * 
 * // Partial application
 * const addOne = curry(add, 1);
 * addOne(2)(3) // Returns 6
 * 
 * // Multiple arguments at once
 * const curriedAdd2 = curry(add);
 * curriedAdd2(1, 2)(3) // Returns 6
 */
export default function curry<T extends (...args: any[]) => any>(
    callback: T,
    ...initialArgs: Parameters<T>[number][]
): ((...args: Parameters<T>[number][]) => ReturnType<T> | ReturnType<typeof curry<T>>) {
    // Track total expected arguments based on callback function
    const expectedArgs = callback.length;
    
    // Store accumulated arguments
    const accumulatedArgs = [...initialArgs];

    // Return curried function that collects arguments
    return function curried(...newArgs: Parameters<T>[number][]): ReturnType<T> | ReturnType<typeof curry<T>> {
        // Add new arguments to accumulated args
        const args = [...accumulatedArgs, ...newArgs];

        // If we have all needed arguments, execute the callback
        if (args.length >= expectedArgs) {
            return callback.apply(this, args);
        }

        // Otherwise return curried function with accumulated args
        return curry(callback, ...args);
    };
}
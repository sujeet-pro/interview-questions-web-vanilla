
/**
 * Creates a curried version of a function that executes when called with no arguments.
 * Unlike curry() which requires a fixed number of arguments, lazyEval() collects arguments
 * until explicitly executed with an empty call.
 *
 * @param callback - The function to curry
 * @param args - Initial arguments to partially apply
 * @returns A curried function that collects arguments until called with no args
 *
 * @example
 * // Basic usage
 * const sum = (...nums: number[]) => nums.reduce((a, b) => a + b, 0);
 * const lazySum = lazyEval(sum);
 * lazySum(1)(2)(3)() // Returns 6
 * 
 * // Partial application
 * const addToOne = lazyEval(sum, 1);
 * addToOne(2)(3)() // Returns 6
 * 
 * // Multiple arguments at once
 * const lazySum2 = lazyEval(sum);
 * lazySum2(1, 2)(3)() // Returns 6
 */
export default function curryVarArgs<T extends (...args: any[]) => any>(
    callback: T,
    ...initialArgs: Parameters<T>[number][]
): ((...args: Parameters<T>[number][]) => ReturnType<T> | ReturnType<typeof curryVarArgs<T>>) {
    // Store accumulated arguments
    const accumulatedArgs = [...initialArgs];

    // Return curried function that collects arguments
    return function curried(...newArgs: Parameters<T>[number][]): ReturnType<T> | ReturnType<typeof curryVarArgs<T>> {
        // If called with no arguments, execute callback with accumulated args
        if (newArgs.length === 0) {
            return callback.apply(this, accumulatedArgs);
        }

        // Otherwise add new arguments and return new curried function
        return curryVarArgs(callback, ...accumulatedArgs, ...newArgs);
    };
}
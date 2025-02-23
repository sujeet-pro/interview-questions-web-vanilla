interface DebounceOptions {
    leading?: boolean;  // Whether to execute on the leading edge (first call)
    trailing?: boolean; // Whether to execute on the trailing edge (after wait)
    maxWait?: number;   // Maximum time to wait before forced execution
}

/**
 * Creates a debounced function that controls how often a function can be called.
 * Think of it like a cooldown period - after the function is called, it won't execute 
 * again until the wait time has passed.
 * 
 * Key concepts:
 * - Leading edge: Execute immediately on first call
 * - Trailing edge: Execute after wait period with most recent arguments
 * - MaxWait: Force execution after this time even if new calls keep coming
 *
 * @param func - The function to debounce
 * @param wait - How long to wait in milliseconds before executing
 * @param options - Configuration object with following properties:
 * @param options.leading - If true, execute on first call instead of waiting
 * @param options.trailing - If true, execute after wait period (default behavior)
 * @param options.maxWait - Maximum time to wait before forcing execution
 * @returns A debounced version of the function with cancel() and flush() methods
 *
 * @example
 * // Basic trailing edge debounce - waits 1s after last call
 * const debouncedSave = debounce(save, 1000);
 * 
 * // Leading edge - executes immediately, then waits
 * const debouncedSave = debounce(save, 1000, { leading: true });
 * 
 * // Both leading and trailing - executes on first call AND after wait
 * const debouncedSave = debounce(save, 1000, { leading: true, trailing: true });
 * 
 * // With maximum wait - forces execution after 5s
 * const debouncedSave = debounce(save, 1000, { maxWait: 5000 });
 * 
 * // Control methods
 * debouncedSave.cancel(); // Cancels any pending execution
 * debouncedSave.flush();  // Executes immediately if any call is pending
 */
export default function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number, 
    options: DebounceOptions = {}
): {
    (...args: Parameters<T>): ReturnType<T>;
    cancel: () => void;
    flush: () => ReturnType<T>;
} {
    // State variables to track execution context
    let lastArgs: Parameters<T> | undefined;     // Arguments from most recent call
    let lastThis: any;                           // 'this' context from most recent call
    let result: ReturnType<T>;                   // Return value from last execution
    let timerId: ReturnType<typeof setTimeout> | undefined;  // Current timer ID
    let lastCallTime: number | undefined;        // Timestamp of most recent call
    let lastInvokeTime = 0;                      // Timestamp of last actual execution

    // Validate input
    if (typeof func !== 'function') {
        throw new TypeError('Expected a function');
    }

    // Setup options with defaults
    wait = Number(wait) || 0;
    const { leading = false, trailing = true, maxWait = wait } = options;
    const hasMaxWait = Object.hasOwn(options, 'maxWait');

    // Core function that actually executes the target function
    function invoke(time: number): ReturnType<T> {
        const args = lastArgs;
        const thisArg = lastThis;
        
        // Clear state for next execution
        lastArgs = undefined;
        lastThis = undefined;
        lastInvokeTime = time;
        
        // Execute and store result
        result = func.apply(thisArg, args!);
        return result;
    }

    // Determines if function should be executed based on timing
    function shouldInvoke(time: number): boolean {
        const timeSinceLastCall = time - (lastCallTime || 0);
        const timeSinceLastInvoke = time - lastInvokeTime;

        return (
            !lastCallTime ||                     // First call ever
            timeSinceLastCall >= wait ||         // Wait period elapsed
            timeSinceLastCall < 0 ||             // System clock was adjusted
            (hasMaxWait && timeSinceLastInvoke >= maxWait)  // Max wait exceeded
        );
    }

    // Calculates how long to wait before next execution
    function getWaitTime(time: number): number {
        const timeSinceLastCall = time - (lastCallTime || 0);
        const timeSinceLastInvoke = time - lastInvokeTime;
        const timeWaiting = wait - timeSinceLastCall;

        // If maxWait is set, ensure we don't wait longer than that
        return hasMaxWait
            ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
            : timeWaiting;
    }

    // Handles execution on the leading edge (first call)
    function handleLeadingEdge(time: number): ReturnType<T> {
        lastInvokeTime = time;
        timerId = setTimeout(timerExpired, wait);
        return leading ? invoke(time) : result;
    }

    // Handles execution on the trailing edge (after wait)
    function handleTrailingEdge(time: number): ReturnType<T> {
        timerId = undefined;
        if (trailing && lastArgs) {
            return invoke(time);
        }
        lastArgs = lastThis = undefined;
        return result;
    }

    // Called when the wait timer expires
    function timerExpired(): ReturnType<T> | undefined {
        const time = Date.now();
        if (shouldInvoke(time)) {
            return handleTrailingEdge(time);
        }
        // If we shouldn't invoke yet, set up the next timer
        timerId = setTimeout(timerExpired, getWaitTime(time));
    }

    // Cancels any pending execution
    function cancel(): void {
        if (timerId) clearTimeout(timerId);
        lastInvokeTime = 0;
        lastArgs = lastThis = lastCallTime = timerId = undefined;
    }

    // Forces execution if there's a pending call
    function flush(): ReturnType<T> {
        return timerId === undefined ? result : handleTrailingEdge(Date.now());
    }

    // The main debounced function that wraps the original
    function debounced(this: any, ...args: Parameters<T>): ReturnType<T> {
        const time = Date.now();
        const isInvoking = shouldInvoke(time);

        // Save the most recent call context
        lastArgs = args;
        lastThis = this;
        lastCallTime = time;

        if (isInvoking) {
            if (!timerId) {
                return handleLeadingEdge(lastCallTime);
            }
            if (hasMaxWait) {
                // Reset the timer and execute immediately
                clearTimeout(timerId);
                timerId = setTimeout(timerExpired, wait);
                return invoke(lastCallTime);
            }
        }
        
        return result;
    }

    // Attach control methods
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
}

/*
Example Timeline:
Let's say we have a debounced function with:
- wait: 1000ms (1 second)
- leading: true
- trailing: true

Timeline of events:
0ms:     First call → Executes immediately (leading edge)
200ms:   Second call → Resets timer, no execution
600ms:   Third call → Resets timer, no execution
800ms:   Fourth call → Resets timer, no execution
1800ms:  No more calls → Executes with args from last call (trailing edge)

With maxWait: 2000ms:
0ms:     First call → Executes immediately (leading edge)
200ms:   Second call → Resets timer
600ms:   Third call → Resets timer
1200ms:  Fourth call → Resets timer
2000ms:  maxWait reached → Forces execution
2800ms:  No more calls → Executes final trailing call

This means:
1. First call executes immediately (leading: true)
2. Subsequent rapid calls just reset the timer
3. After 1 second of no calls, executes once more (trailing: true)
4. If maxWait is set, it will force execution after that time
*/
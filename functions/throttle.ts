interface ThrottleOptions {
    leading?: boolean;  // Whether to execute on the leading edge (first call)
    trailing?: boolean; // Whether to execute on the trailing edge (after wait)
}

/**
 * Creates a throttled function that only executes at most once per every wait milliseconds.
 * Unlike debounce which resets the timer on each call, throttle guarantees the function
 * is called at regular intervals, while still coordinating leading/trailing calls.
 *
 * @param func - The function to throttle
 * @param wait - The number of milliseconds to throttle invocations to
 * @param options - Configuration object
 * @param options.leading - If false, suppress leading edge call (default: true)
 * @param options.trailing - If false, suppress trailing edge call (default: true)
 * @returns A throttled version of the function with a cancel() method
 *
 * @example
 * // Basic throttle - max one call per second
 * const throttledScroll = throttle(onScroll, 1000);
 * 
 * // No leading edge call
 * const throttledScroll = throttle(onScroll, 1000, { leading: false });
 * 
 * // No trailing edge call
 * const throttledScroll = throttle(onScroll, 1000, { trailing: false });
 * 
 * // Cancel any pending execution
 * throttledScroll.cancel();
 */
export default function throttle<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    options: ThrottleOptions = {}
): {
    (...args: Parameters<T>): ReturnType<T>;
    cancel: () => void;
} {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    let context: any;
    let args: Parameters<T> | null = null;
    let result: ReturnType<T>;
    let previous = 0;

    // Function that executes on trailing edge after wait
    const later = function() {
        // Reset previous timestamp based on leading option
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        // Execute function with saved context/args
        result = func.apply(context, args as Parameters<T>);
        // Clean up context/args if no more pending executions
        if (!timeout) context = args = null;
    };

    // The main throttled function
    const throttled = function(this: any, ...params: Parameters<T>): ReturnType<T> {
        const _now = Date.now();
        // Handle first call when leading=false
        if (!previous && options.leading === false) previous = _now;
        
        // Calculate time remaining in wait period
        const remaining = wait - (_now - previous);
        
        // Save execution context
        context = this;
        args = params;

        // If we've waited long enough or clock moved backwards
        if (remaining <= 0 || remaining > wait) {
            // Clear any existing timeout
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            // Update timestamp and execute function
            previous = _now;
            result = func.apply(context, args);
            // Clean up if no pending timeout
            if (!timeout) context = args = null;
        } 
        // Set up trailing edge execution if enabled
        else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };

    // Method to cancel pending execution
    throttled.cancel = function(): void {
        if (timeout) clearTimeout(timeout);
        previous = 0;
        timeout = context = args = null;
    };

    return throttled;
}

/*
Example Timeline:
Let's say we have a throttled function with:
- wait: 1000ms (1 second)
- leading: true (default)
- trailing: true (default)

Timeline of events:
0ms:     First call → Executes immediately (leading edge)
200ms:   Second call → Ignored, too soon
600ms:   Third call → Ignored, too soon
800ms:   Fourth call → Ignored, too soon
1000ms:  Wait period ends → Previous call executes (trailing edge)
1200ms:  Fifth call → Executes immediately (new period starts)

With leading: false:
0ms:     First call → Starts timer, no execution
200ms:   Second call → Ignored
600ms:   Third call → Ignored
1000ms:  Wait period ends → Last call executes
1200ms:  Fourth call → Starts new timer

With trailing: false:
0ms:     First call → Executes immediately
200ms:   Second call → Ignored
600ms:   Third call → Ignored
1000ms:  Wait period ends → No trailing execution
1200ms:  Fourth call → Executes immediately

Key differences from debounce:
1. Throttle executes at regular intervals during continuous calls
2. Debounce resets timer on each call and only executes after calls stop
3. Throttle is ideal for regular sampling, debounce for completion events
*/
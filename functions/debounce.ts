/**
 * Creates a debounced function that delays invoking the target function until after
 * a specified wait time has elapsed since the last time it was invoked.
 * 
 * The function can be configured to execute at the beginning of the wait period
 * (immediate=true) or at the end (immediate=false).
 *
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay execution
 * @param immediate - If true, execute on the leading edge instead of trailing
 * @returns A debounced version of the function with a cancel() method
 *
 * @example
 * // Create a debounced save function that waits 1 second
 * const debouncedSave = debounce(save, 1000, false);
 * 
 * // Call it multiple times - only executes once after 1 second
 * debouncedSave(); 
 * debouncedSave(); // Gets cancelled
 * debouncedSave(); // Only this last call executes after 1s
 */
export default function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean
): {
  (...args: Parameters<T>): ReturnType<T>;
  cancel: () => void;
} {
  let timeout: ReturnType<typeof setTimeout> | null;
  let previous: number;
  let args: Parameters<T> | null;
  let result: ReturnType<T>;
  let context: any;

  // Called after the wait period to execute the function
  const later = function() {
    const passed = Date.now() - previous;
    if (wait > passed) {
      // If not enough time has passed, schedule another check
      timeout = setTimeout(later, wait - passed);
    } else {
      timeout = null;
      if (!immediate) {
        // Execute function on trailing edge
        result = func.apply(context, args as Parameters<T>);
      }
      // Clean up if no more pending executions
      if (!timeout) args = context = null;
    }
  };

  // The debounced function that wraps the original
  const debounced = function(this: any, ...params: Parameters<T>) {
    context = this;
    args = params;
    previous = Date.now();

    if (!timeout) {
      // Start the wait timer
      timeout = setTimeout(later, wait);
      if (immediate) {
        // Execute immediately on leading edge
        result = func.apply(context, args);
      }
    }
    return result;
  };

  // Method to cancel pending executions
  debounced.cancel = function() {
    if (timeout) clearTimeout(timeout);
    timeout = args = context = null;
  };

  return debounced;
}

/*
Example Timeline:
Let's say we have a debounced function with:
- wait: 1000ms (1 second)
- immediate: false (trailing edge)

Timeline for trailing edge (immediate = false):
0ms:     First call → Starts timer, no execution
200ms:   Second call → Cancels and restarts timer
600ms:   Third call → Cancels and restarts timer
1600ms:  Timer completes → Executes with latest args

Timeline for leading edge (immediate = true):
0ms:     First call → Executes immediately, starts timer
200ms:   Second call → Timer still running, no execution
600ms:   Third call → Timer still running, no execution
1000ms:  Timer completes → No execution (already ran at start)

This means:
1. With immediate=false: Function executes once after wait period
2. With immediate=true: Function executes immediately on first call
3. Rapid calls during wait period get ignored
4. Timer resets on each call during wait period
*/
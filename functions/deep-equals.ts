/**
 * Performs a deep equality comparison between two values of any type.
 * Handles primitive types, objects, arrays, and built-in objects like Date, RegExp, Set, and Map.
 * 
 * @param valueOne - First value to compare
 * @param valueTwo - Second value to compare
 * @returns boolean - True if values are deeply equal, false otherwise
 * 
 * @example
 * // Primitive comparisons
 * deepEquals(1, 1) // true
 * deepEquals("hello", "hello") // true
 * deepEquals(NaN, NaN) // true
 * 
 * // Object comparisons
 * deepEquals({a: 1, b: 2}, {a: 1, b: 2}) // true
 * deepEquals({a: {b: 1}}, {a: {b: 1}}) // true
 * 
 * // Array comparisons
 * deepEquals([1, 2, 3], [1, 2, 3]) // true
 * deepEquals([{a: 1}], [{a: 1}]) // true
 * 
 * // Built-in object comparisons
 * deepEquals(new Date("2023-01-01"), new Date("2023-01-01")) // true
 * deepEquals(new Set([1, 2]), new Set([1, 2])) // true
 * deepEquals(new Map([["a", 1]]), new Map([["a", 1]])) // true
 */
function deepEquals<T, U>(valueOne: T, valueTwo: U): boolean {
    const value1Type = typeof valueOne;
    const value2Type = typeof valueTwo;
    
    // Early return for identical values (including same object references)
    // This also handles undefined === undefined
    // Type casting needed because T and U have no overlap in types by default,
    // even though at runtime the values could be identical
    if(valueOne === valueTwo as unknown as T) return true;
    
    // Different types can't be equal (except for edge cases handled below)
    if(value1Type !== value2Type) return false;
    if(value1Type === "number") {
        // Special case: NaN is the only value not equal to itself
        // But two NaN values should be considered equal
        if(Number.isNaN(valueOne)) return Number.isNaN(valueTwo);
        // Type casting needed because T and U have no overlap in types by default,
        // even though at runtime the values could be identical
        return valueOne === valueTwo as unknown as T;
    }
  
    if(value1Type !== "object") {
        // Handle remaining primitives: string, bigint, boolean, undefined
        // Symbol is also handled here but symbols are always unique
        // Type casting needed because T and U have no overlap in types by default,
        // even though at runtime the values could be identical
        return valueOne === valueTwo as unknown as T;
    }
  
    // Handle null case first since typeof null is "object"
    // At this point we know they're not === so if either is null, they're not equal
    if(valueOne === null || valueTwo === null) {
        // Type casting needed because T and U have no overlap in types by default,
        // even though at runtime the values could be identical
        return valueOne === valueTwo as unknown as T;
    }

    // Handle built-in objects that need special comparison logic
    
    // Dates should be compared by their timestamp value
    if(valueOne instanceof Date) {
        return valueTwo instanceof Date && valueOne.getTime() === valueTwo.getTime();
    }

    // RegExp objects should compare their pattern and flags
    if(valueOne instanceof RegExp) {
        return valueTwo instanceof RegExp && 
            valueOne.source === valueTwo.source && 
            valueOne.flags === valueTwo.flags;
    }

    // Sets need to compare their elements recursively
    // Order doesn't matter for Sets
    if(valueOne instanceof Set) {
        if(!(valueTwo instanceof Set)) return false;
        if(valueOne.size !== valueTwo.size) return false;
        for(const item of valueOne) {
            let found = false;
            for(const item2 of valueTwo) {
                if(deepEquals(item, item2)) {
                    found = true;
                    break;
                }
            }
            if(!found) return false;
        }
        return true;
    }

    // Maps need to compare both keys and values recursively
    if(valueOne instanceof Map) {
        if(!(valueTwo instanceof Map)) return false;
        if(valueOne.size !== valueTwo.size) return false;
        for(const [key, value] of valueOne) {
            let found = false;
            for(const [key2, value2] of valueTwo) {
                if(deepEquals(key, key2) && deepEquals(value, value2)) {
                    found = true;
                    break;
                }
            }
            if(!found) return false;
        }
        return true;
    }
  
    // Arrays need to be compared element by element in order
    if(Array.isArray(valueOne)) {
        if(!Array.isArray(valueTwo)) return false;
        if(valueOne.length !== valueTwo.length) return false;
        return valueOne.every((elem, idx) => deepEquals(elem, valueTwo[idx]));
    }
  
    // For regular objects, compare all enumerable own properties
    const allKeys1 = Object.keys(valueOne as object);
    const allKeys2 = Object.keys(valueTwo as object);
    
    // Objects must have the same number of keys
    if(allKeys1.length !== allKeys2.length) return false;
    
    // Each key must exist in both objects and have deeply equal values
    // Using hasOwnProperty to handle cases where the key might exist in prototype chain
    return allKeys1.every(key => 
        Object.prototype.hasOwnProperty.call(valueTwo, key) && 
        deepEquals((valueOne as any)[key], (valueTwo as any)[key])
    );
}

// Do not edit the line below.
exports.deepEquals = deepEquals;

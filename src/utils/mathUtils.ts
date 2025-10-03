/**
 * MathUtils - Core mathematical utilities adapted from Khan Academy
 *
 * This module provides essential mathematical functions for creating
 * educational exercises and interactive components.
 *
 * Portions of this file were adapted from Khan Academy's khan-exercises
 * repository (https://github.com/Khan/khan-exercises)
 */

/**
 * Default tolerance used for floating point comparisons
 */
export const DEFAULT_TOLERANCE = 1e-9;
export const EPSILON = Math.pow(2, -42);

/**
 * Checks if a value is a valid number
 */
export function isNumber(x: any): boolean {
  return typeof x === "number" && !isNaN(x);
}

/**
 * Compares two numbers for equality within a tolerance
 */
export function equal(x: number, y: number, tolerance: number = DEFAULT_TOLERANCE): boolean {
  // Handling undefined values allows this to work nicely with vectors
  if (x == null || y == null) {
    return x === y;
  }
  return Math.abs(x - y) < tolerance;
}

/**
 * Returns the sign of a number
 */
export function sign(x: number, tolerance: number = DEFAULT_TOLERANCE): number {
  return equal(x, 0, tolerance) ? 0 : Math.abs(x) / x;
}

/**
 * Round a number to a certain number of decimal places
 */
export function round(num: number, precision: number): number {
  const factor = Math.pow(10, precision);
  return Math.round(num * factor) / factor;
}

/**
 * Round a number to the nearest multiple of increment
 */
export function roundTo(num: number, increment: number): number {
  return Math.round(num / increment) * increment;
}

/**
 * Floor a number to a certain number of decimal places
 */
export function floorTo(num: number, precision: number): number {
  const factor = Math.pow(10, precision).toFixed(5);
  return Math.floor((num * Number(factor)).toFixed(5)) / Number(factor);
}

/**
 * Ceiling a number to a certain number of decimal places
 */
export function ceilTo(num: number, precision: number): number {
  const factor = Math.pow(10, precision).toFixed(5);
  return Math.ceil((num * Number(factor)).toFixed(5)) / Number(factor);
}

/**
 * Checks if a number is an integer
 */
export function isInteger(num: number, tolerance: number = DEFAULT_TOLERANCE): boolean {
  return equal(Math.round(num), num, tolerance);
}

/**
 * Get the greatest common divisor of two or more integers
 */
export function getGCD(...args: number[]): number {
  if (args.length > 2) {
    const first = args[0];
    const rest = args.slice(1);
    return getGCD(first, getGCD(...rest));
  } else {
    let a = Math.abs(args[0]);
    let b = Math.abs(args[1]);

    // Euclid's algorithm doesn't handle non-integers well
    if (a !== Math.floor(a) || b !== Math.floor(b)) {
      return 1;
    }

    while (b) {
      const mod = a % b;
      a = b;
      b = mod;
    }

    return a;
  }
}

/**
 * Get the least common multiple of two or more integers
 */
export function getLCM(...args: number[]): number {
  if (args.length > 2) {
    const first = args[0];
    const rest = args.slice(1);
    return getLCM(first, getLCM(...rest));
  } else {
    return Math.abs(args[0] * args[1]) / getGCD(args[0], args[1]);
  }
}

/**
 * Returns an array of digits from a number
 * digits(376) = [6, 7, 3]
 */
export function digits(n: number): number[] {
  if (n === 0) {
    return [0];
  }

  const list: number[] = [];
  let num = Math.abs(n);

  while (num > 0) {
    list.push(num % 10);
    num = Math.floor(num / 10);
  }

  return list;
}

/**
 * Returns an array of digits in original order
 * integerToDigits(376) = [3, 7, 6]
 */
export function integerToDigits(n: number): number[] {
  return digits(n).reverse();
}

/**
 * Convert a number to a fraction representation [numerator, denominator]
 */
export function toFraction(decimal: number, tolerance: number = 1e-6): [number, number] {
  if (tolerance == null) {
    tolerance = Math.pow(2, -46);
  }

  if (decimal < 0 || decimal > 1) {
    const fract = decimal % 1;
    const fractAdjusted = fract < 0 ? fract + 1 : fract;
    const nd = toFraction(fractAdjusted, tolerance);
    nd[0] += Math.round(decimal - fractAdjusted) * nd[1];
    return nd;
  } else if (Math.abs(Math.round(decimal) - decimal) <= tolerance) {
    return [Math.round(decimal), 1];
  } else {
    let loN = 0,
      loD = 1,
      hiN = 1,
      hiD = 1,
      midN = 1,
      midD = 2;

    while (true) {
      if (Math.abs(midN / midD - decimal) <= tolerance) {
        return [midN, midD];
      } else if (midN / midD < decimal) {
        loN = midN;
        loD = midD;
      } else {
        hiN = midN;
        hiD = midD;
      }

      midN = loN + hiN;
      midD = loD + hiD;
    }
  }
}

/**
 * Returns whether a number is prime
 */
export function isPrime(n: number): boolean {
  const primes = [
    2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
  ];

  // First handle small numbers and known primes
  if (n <= 1) {
    return false;
  } else if (n < 101) {
    return primes.some((p) => Math.abs(p - n) <= 0.5);
  } else {
    if (n % 2 === 0) {
      return false;
    } else {
      for (let i = 3, sqrt = Math.sqrt(n); i <= sqrt; i += 2) {
        if (n % i === 0) {
          return false;
        }
      }
      return true;
    }
  }
}

/**
 * Factorial function
 */
export function factorial(x: number): number {
  if (x <= 1) {
    return x;
  }
  return x * factorial(x - 1);
}

/**
 * Shuffle an array using a Fischer-Yates shuffle
 */
export function shuffle<T>(array: T[], count?: number): T[] {
  array = [...array]; // Make a copy to avoid modifying the original
  const beginning = typeof count === "undefined" || count > array.length ? 0 : array.length - count;

  for (let top = array.length; top > beginning; top--) {
    const newEnd = Math.floor(Math.random() * top);
    const tmp = array[newEnd];
    array[newEnd] = array[top - 1];
    array[top - 1] = tmp;
  }

  return array.slice(beginning);
}

/**
 * Sort numbers numerically (not as strings)
 */
export function sortNumbers(array: number[]): number[] {
  return [...array].sort((a, b) => a - b);
}

/**
 * Truncate a number to a maximum number of decimal places
 */
export function truncateToMax(num: number, digits: number): number {
  return parseFloat(num.toFixed(digits));
}

/**
 * Common colors for consistent use in the application
 */
export const COLORS = {
  BLUE: "#6495ED",
  ORANGE: "#FFA500",
  PINK: "#FF00AF",
  GREEN: "#28AE7B",
  PURPLE: "#9D38BD",
  RED: "#DF0030",
  GRAY: "gray",
  BLACK: "black",
  LIGHT_BLUE: "#9AB8ED",
  LIGHT_ORANGE: "#EDD19B",
  LIGHT_PINK: "#ED9BD3",
  LIGHT_GREEN: "#9BEDCE",
  LIGHT_PURPLE: "#DA9BED",
  LIGHT_RED: "#ED9AAC",
  LIGHT_GRAY: "#ED9B9B",
  LIGHT_BLACK: "#ED9B9B",
  KA_BLUE: "#314453",
  KA_GREEN: "#71B307",
};

/**
 * Vector utilities
 */
export const vector = {
  /**
   * Add two or more vectors together
   */
  add(...vectors: number[][]): number[] {
    if (vectors.length === 0) return [];

    const result = new Array(vectors[0].length).fill(0);
    vectors.forEach((v) => {
      for (let i = 0; i < result.length; i++) {
        result[i] += v[i] || 0;
      }
    });

    return result;
  },

  /**
   * Scale a vector by a scalar
   */
  scale(v: number[], scalar: number): number[] {
    return v.map((x) => x * scalar);
  },

  /**
   * Get the length/magnitude of a vector
   */
  length(v: number[]): number {
    return Math.sqrt(v.reduce((sum, x) => sum + x * x, 0));
  },

  /**
   * Normalize a vector to a unit vector
   */
  normalize(v: number[]): number[] {
    const len = vector.length(v);
    return vector.scale(v, 1 / len);
  },

  /**
   * Dot product of two vectors
   */
  dot(a: number[], b: number[]): number {
    return a.reduce((sum, x, i) => sum + x * (b[i] || 0), 0);
  },
};

/**
 * Matrix utilities
 */
export const matrix = {
  /**
   * Deep zip with a function on arrays
   */
  deepZipWith(depth: number, fn: Function, ...arrays: any[][]): any {
    // If any array is null, return null
    if (arrays.some((arr) => arr === null)) {
      return null;
    }

    if (depth === 0) {
      return fn(...arrays);
    }

    return arrays[0].map((_, i) => {
      const items = arrays.map((arr) => arr[i]);
      return matrix.deepZipWith(depth - 1, fn, ...items);
    });
  },

  /**
   * Add two matrices
   */
  add(a: number[][], b: number[][]): number[][] {
    return matrix.deepZipWith(2, (x: number, y: number) => x + y, a, b);
  },

  /**
   * Multiply a matrix by a scalar
   */
  scalarMultiply(m: number[][], scalar: number): number[][] {
    return m.map((row) => row.map((x) => x * scalar));
  },
};

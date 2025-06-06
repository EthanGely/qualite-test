const { getMax, sum, isPalindrome, capitalize, divide, generateFibonacci } = require('./utils.js');

describe('sum', () => {
  test('adds two positive numbers', () => {
    expect(sum(2, 3)).toBe(5);
  });

  test('adds negative and positive number', () => {
    expect(sum(-2, 3)).toBe(1);
  });

  test('adds two negative numbers', () => {
    expect(sum(-2, -3)).toBe(-5);
  });

  test('adds zero to a number', () => {
    expect(sum(0, 5)).toBe(5);
    expect(sum(5, 0)).toBe(5);
  });

  test('adds floating point numbers', () => {
    expect(sum(0.1, 0.2)).toBeCloseTo(0.3);
  });

  test('uses strings', () => {
    expect(sum('a', 'b')).toBe('ab');
  });

  test('uses arrays', () => {
    expect(sum([1, 2], [3, 4])).toEqual([1, 2, 3, 4]);
  });
});

describe('isPalindrome', () => {
  test('returns true for a simple palindrome', () => {
    expect(isPalindrome('radar')).toBe(true);
  });

  test('returns true for palindrome with spaces and mixed case', () => {
    expect(isPalindrome('A Santa at NASA')).toBe(true);
  });

  test('returns false for non-palindrome', () => {
    expect(isPalindrome('hello')).toBe(false);
  });

    test('returns true for empty string', () => {
    expect(isPalindrome('')).toBe(true);
  });

  test('returns true for single character', () => {
    expect(isPalindrome('a')).toBe(true);
  });

  test('returns true for palindrome with spaces only', () => {
    expect(isPalindrome('   ')).toBe(true);
  });
});

describe('getMax', () => {
  test('returns the maximum value in a positive number array', () => {
    expect(getMax([1, 2, 3, 4, 5])).toBe(5);
  });

  test('returns the maximum value in a negative number array', () => {
    expect(getMax([-10, -2, -30, -4])).toBe(-2);
  });

  test('returns the maximum value in a mixed array', () => {
    expect(getMax([-1, 0, 5, 3])).toBe(5);
  });

  test('returns null for empty array', () => {
    expect(getMax([])).toBeNull();
  });

  test('returns null for non-array input', () => {
    expect(getMax('not an array')).toBeNull();
    expect(getMax(null)).toBeNull();
    expect(getMax(undefined)).toBeNull();
  });

  test('returns the only element for single-element array', () => {
    expect(getMax([42])).toBe(42);
  });

  test('returns null for array with only NaN', () => {
    expect(getMax([NaN])).toBeNaN();
  });
});

describe('capitalize', () => {
  test('capitalizes a lowercase word', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  test('capitalizes an uppercase word', () => {
    expect(capitalize('WORLD')).toBe('World');
  });

  test('returns empty string for empty input', () => {
    expect(capitalize('')).toBe('');
  });

  test('capitalizes a single character', () => {
    expect(capitalize('a')).toBe('A');
  });

  test('capitalizes string with mixed case', () => {
    expect(capitalize('hELLo')).toBe('Hello');
  });

  test('capitalizes string with spaces', () => {
    expect(capitalize(' hello')).toBe(' Hello');
  });

  test('capitalizes string with special characters', () => {
    expect(capitalize('éclair')).toBe('Éclair');
  });
});

describe('divide', () => {
  test('divides two positive numbers', () => {
    expect(divide(10, 2)).toBe(5);
  });

  test('divides negative by positive', () => {
    expect(divide(-10, 2)).toBe(-5);
  });

  test('throws error when dividing by zero', () => {
    expect(() => divide(10, 0)).toThrow('Division by zero');
  });

  test('divides by negative number', () => {
    expect(divide(10, -2)).toBe(-5);
  });

  test('divides zero by a number', () => {
    expect(divide(0, 5)).toBe(0);
  });

  test('divides two negative numbers', () => {
    expect(divide(-10, -2)).toBe(5);
  });

  test('Divide strings', () => {
    expect(() => divide('a', 'b')).toThrow(TypeError);
  });
});

describe('generateFibonacci', () => {
  test('returns empty array for n = 0', () => {
    expect(generateFibonacci(0)).toEqual([]);
  });

  test('returns [0] for n = 1', () => {
    expect(generateFibonacci(1)).toEqual([0]);
  });

  test('returns first 5 Fibonacci numbers', () => {
    expect(generateFibonacci(5)).toEqual([0, 1, 1, 2, 3]);
  });

  test('returns first 10 Fibonacci numbers', () => {
    expect(generateFibonacci(10)).toEqual([0, 1, 1, 2, 3, 5, 8, 13, 21, 34]);
  });

  test('returns null for negative n', () => {
    expect(generateFibonacci(-3)).toBeNull();
  });

  test('returns null for non-integer n', () => {
    expect(generateFibonacci(2.5)).toBeNull();
  });

  test('returns null for non-number input', () => {
    expect(generateFibonacci('5')).toBeNull();
    expect(generateFibonacci(null)).toBeNull();
    expect(generateFibonacci(undefined)).toBeNull();
    expect(generateFibonacci({})).toBeNull();
  });
});

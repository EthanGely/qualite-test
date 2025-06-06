function sum(a, b) {
  return a + b;
}

function isPalindrome(str) {
  // ignore la casse et les espaces
  const clean = str.toLowerCase().replace(/\s/g, '');
  return clean === clean.split('').reverse().join('');
}

function getMax(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return Math.max(...arr);
}

// Fonction corrigée pour capitaliser la première lettre d'une chaîne, même si elle commence par des espaces
function capitalize(str) {
  if (!str) return '';
  const match = str.match(/^(\s*)(\S?)(.*)$/);
  if (!match) return '';
  const [, spaces, firstChar, rest] = match;
  return spaces + (firstChar ? firstChar.toUpperCase() : '') + rest.toLowerCase();
}

function divide(a, b) {
  if (b === 0) throw new Error("Division by zero");
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError("Both arguments must be numbers");
  }
  if (isNaN(a) || isNaN(b)) {
    throw new TypeError("Arguments must be valid numbers");
  }
  if (!isFinite(a) || !isFinite(b)) {
    throw new TypeError("Arguments must be finite numbers");
  }
  return a / b;
}

function generateFibonacci(n) {
  if (typeof n !== 'number' || !Number.isInteger(n) || n < 0) return null;
  if (n === 0) return [];
  if (n === 1) return [0];
  const seq = [0, 1];
  for (let i = 2; i < n; i++) {
    seq.push(seq[i - 1] + seq[i - 2]);
  }
  return seq;
}


module.exports = { sum, isPalindrome, getMax, capitalize, divide, generateFibonacci };
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfills for Node.js environment (required for MSW)
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

// Add fetch and Response polyfills for MSW
if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    constructor(body, init) {
      this.body = body;
      this.status = init?.status || 200;
      this.statusText = init?.statusText || 'OK';
      this.headers = new Map(Object.entries(init?.headers || {}));
      // Add get method to headers - fix infinite recursion
      const originalGet = this.headers.get.bind(this.headers);
      this.headers.get = function(key) {
        return originalGet(key.toLowerCase()) || null;
      };
      // Set default content-type
      if (!this.headers.has('content-type')) {
        this.headers.set('content-type', 'application/json');
      }
    }
    
    json() {
      // If body is already an object, return it directly
      if (typeof this.body === 'object' && this.body !== null) {
        return Promise.resolve(this.body);
      }
      // If body is a string, try to parse it
      try {
        return Promise.resolve(JSON.parse(this.body));
      } catch {
        return Promise.resolve(this.body);
      }
    }
    
    text() {
      return Promise.resolve(String(this.body));
    }
  };
}

if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    constructor(url, init) {
      this.url = url;
      this.method = init?.method || 'GET';
      this.headers = new Map(Object.entries(init?.headers || {}));
    }
  };
}

if (typeof global.BroadcastChannel === 'undefined') {
  global.BroadcastChannel = class BroadcastChannel {
    constructor(name) {
      this.name = name;
    }
    
    postMessage() {
      // No-op for tests
    }
    
    close() {
      // No-op for tests
    }
    
    addEventListener() {
      // No-op for tests
    }
    
    removeEventListener() {
      // No-op for tests
    }
  };
}

// Mock MSW for tests
global.fetch = jest.fn();

// Mock console methods to avoid noise in tests
const originalError = console.error;
const originalWarn = console.warn;
const originalLog = console.log;

beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
  console.log = jest.fn();
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
  console.log = originalLog;
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});

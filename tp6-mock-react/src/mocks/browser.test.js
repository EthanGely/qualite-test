import { setupWorker } from 'msw/browser';
// eslint-disable-next-line no-unused-vars
import { worker } from './browser';
import { handlers } from './handlers';

// Mock MSW
jest.mock('msw/browser', () => ({
  setupWorker: jest.fn(),
}));

jest.mock('./handlers', () => ({
  handlers: ['mock-handler-1', 'mock-handler-2'],
}));

describe('MSW Browser Setup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Worker creation', () => {
    test('should create worker with setupWorker', () => {
      const mockWorker = { start: jest.fn(), stop: jest.fn() };
      setupWorker.mockReturnValue(mockWorker);

      // Re-import to trigger the module
      jest.isolateModules(() => {
        require('./browser');
      });

      expect(setupWorker).toHaveBeenCalledWith(...handlers);
    });

    test('should pass all handlers to setupWorker', () => {
      const mockWorker = { start: jest.fn(), stop: jest.fn() };
      setupWorker.mockReturnValue(mockWorker);

      // Re-import to trigger the module
      jest.isolateModules(() => {
        require('./browser');
      });

      expect(setupWorker).toHaveBeenCalledWith('mock-handler-1', 'mock-handler-2');
    });
  });

  describe('Module structure', () => {
    test('should have correct module exports', () => {
      const browserModule = require('./browser');
      
      expect(browserModule).toHaveProperty('worker');
      expect(Object.keys(browserModule)).toEqual(['worker']);
    });

    test('should import handlers correctly', () => {
      // This test verifies the import structure
      expect(handlers).toBeDefined();
      expect(Array.isArray(handlers)).toBe(true);
    });
  });

  describe('Error handling', () => {
    test('should handle setupWorker errors gracefully', () => {
      setupWorker.mockImplementation(() => {
        throw new Error('Setup failed');
      });

      expect(() => {
        jest.isolateModules(() => {
          require('./browser');
        });
      }).toThrow('Setup failed');
    });

    test('should handle missing handlers', () => {
      // Mock handlers as undefined
      jest.doMock('./handlers', () => ({
        handlers: undefined,
      }));

      setupWorker.mockReturnValue({ start: jest.fn() });

      expect(() => {
        jest.isolateModules(() => {
          require('./browser');
        });
      }).not.toThrow();
    });
  });
});

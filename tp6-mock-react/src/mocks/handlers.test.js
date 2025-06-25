import { handlers } from './handlers';
import { generateProducts } from '../utils/generateProducts';

// Mock the generateProducts function
jest.mock('../utils/generateProducts');

describe('MSW Handlers', () => {
  const mockGenerateProducts = generateProducts;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset console.log mock
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /api/products handler', () => {
    test('should be defined and export correctly', () => {
      expect(handlers).toBeDefined();
      expect(Array.isArray(handlers)).toBe(true);
      expect(handlers).toHaveLength(1);
    });

    test('should handle GET /api/products request', () => {
      const handler = handlers[0];
      
      expect(handler).toBeDefined();
      // Check if it's an MSW handler for the correct path
      expect(handler.info.method).toBe('GET');
      expect(handler.info.path).toBe('/api/products');
    });

    test('should call generateProducts with correct parameters', async () => {
      const mockProducts = [
        { id: '1', name: 'Test Product', price: '99.99' }
      ];
      mockGenerateProducts.mockReturnValue(mockProducts);

      const handler = handlers[0];
      const mockRequest = new Request('/api/products');
      
      // Execute the handler resolver
      const response = await handler.resolver({
        request: mockRequest,
        params: {},
        cookies: {},
      });

      expect(mockGenerateProducts).toHaveBeenCalledWith(42);
      expect(response.status).toBe(200);
    });

    test('should return JSON response with generated products', async () => {
      const mockProducts = [
        { id: '1', name: 'Product 1', price: '50.00' },
        { id: '2', name: 'Product 2', price: '75.00' },
      ];
      mockGenerateProducts.mockReturnValue(mockProducts);

      const handler = handlers[0];
      const mockRequest = new Request('/api/products');
      
      const response = await handler.resolver({
        request: mockRequest,
        params: {},
        cookies: {},
      });

      const responseData = await response.json();
      
      expect(response.status).toBe(200);
      expect(responseData).toEqual(mockProducts);
    });

    test('should log handling message', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      mockGenerateProducts.mockReturnValue([]);

      const handler = handlers[0];
      const mockRequest = new Request('/api/products');
      
      await handler.resolver({
        request: mockRequest,
        params: {},
        cookies: {},
      });

      expect(consoleSpy).toHaveBeenCalledWith('Handling GET /api/products request');
    });

    test('should handle empty products array', async () => {
      mockGenerateProducts.mockReturnValue([]);

      const handler = handlers[0];
      const mockRequest = new Request('/api/products');
      
      const response = await handler.resolver({
        request: mockRequest,
        params: {},
        cookies: {},
      });

      const responseData = await response.json();
      
      expect(response.status).toBe(200);
      expect(responseData).toEqual([]);
    });

    test('should handle large products array', async () => {
      const largeProductsArray = Array.from({ length: 100 }, (_, i) => ({
        id: `product-${i}`,
        name: `Product ${i}`,
        price: `${i * 10}.00`,
      }));
      mockGenerateProducts.mockReturnValue(largeProductsArray);

      const handler = handlers[0];
      const mockRequest = new Request('/api/products');
      
      const response = await handler.resolver({
        request: mockRequest,
        params: {},
        cookies: {},
      });

      const responseData = await response.json();
      
      expect(response.status).toBe(200);
      expect(responseData).toHaveLength(100);
      expect(responseData).toEqual(largeProductsArray);
    });
  });

  describe('Handler integration', () => {
    test('should maintain consistent seed usage', async () => {
      mockGenerateProducts.mockReturnValue([
        { id: '1', name: 'Consistent Product', price: '42.00' }
      ]);

      const handler = handlers[0];
      const mockRequest = new Request('/api/products');
      
      // Call handler multiple times
      await handler.resolver({ request: mockRequest, params: {}, cookies: {} });
      await handler.resolver({ request: mockRequest, params: {}, cookies: {} });
      await handler.resolver({ request: mockRequest, params: {}, cookies: {} });

      // Should call generateProducts with same seed (42) each time
      expect(mockGenerateProducts).toHaveBeenCalledTimes(3);
      mockGenerateProducts.mock.calls.forEach(call => {
        expect(call[0]).toBe(42);
      });
    });

    test('should work with MSW http utility', () => {
      // Test that handlers are compatible with MSW structure
      expect(handlers[0]).toMatchObject({
        info: expect.objectContaining({
          method: 'GET',
          path: '/api/products'
        }),
        resolver: expect.any(Function)
      });
    });
  });

  describe('Error handling', () => {
    test('should handle generateProducts throwing an error', async () => {
      mockGenerateProducts.mockImplementation(() => {
        throw new Error('Generation failed');
      });

      const handler = handlers[0];
      const mockRequest = new Request('/api/products');
      
      // The handler should handle the error gracefully and return a response
      // Since the current implementation doesn't have try-catch, it will throw
      // But we can test that the error is thrown from generateProducts
      expect(() => {
        handler.resolver({
          request: mockRequest,
          params: {},
          cookies: {},
        });
      }).toThrow('Generation failed');
    });

    test('should handle generateProducts returning null', async () => {
      mockGenerateProducts.mockReturnValue(null);

      const handler = handlers[0];
      const mockRequest = new Request('/api/products');
      
      const response = await handler.resolver({
        request: mockRequest,
        params: {},
        cookies: {},
      });

      const responseData = await response.json();
      
      expect(response.status).toBe(200);
      expect(responseData).toBe(null);
    });
  });

  describe('Response format validation', () => {
    test('should return valid HTTP response', async () => {
      mockGenerateProducts.mockReturnValue([]);

      const handler = handlers[0];
      const mockRequest = new Request('/api/products');
      
      const response = await handler.resolver({
        request: mockRequest,
        params: {},
        cookies: {},
      });

      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('application/json');
    });

    test('should return serializable JSON', async () => {
      const mockProducts = [
        { id: '1', name: 'JSON Test Product', price: '25.99' }
      ];
      mockGenerateProducts.mockReturnValue(mockProducts);

      const handler = handlers[0];
      const mockRequest = new Request('/api/products');
      
      const response = await handler.resolver({
        request: mockRequest,
        params: {},
        cookies: {},
      });

      // Should not throw when parsing JSON
      const responseData = await response.json();
      expect(JSON.stringify(responseData)).toBe(JSON.stringify(mockProducts));
    });
  });
});

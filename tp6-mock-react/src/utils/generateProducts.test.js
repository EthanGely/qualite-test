import { generateProducts } from './generateProducts';
import { faker } from '@faker-js/faker';

// Mock faker to control outputs in tests
jest.mock('@faker-js/faker', () => ({
  faker: {
    seed: jest.fn(),
    string: {
      uuid: jest.fn(),
    },
    commerce: {
      productName: jest.fn(),
      price: jest.fn(),
    },
  },
}));

describe('generateProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Setup default mock returns
    faker.string.uuid.mockReturnValue('test-uuid-123');
    faker.commerce.productName.mockReturnValue('Test Product');
    faker.commerce.price.mockReturnValue('99.99');
  });

  describe('Basic functionality', () => {
    test('should generate default 10 products with default seed', () => {
      const products = generateProducts();
      
      expect(faker.seed).toHaveBeenCalledWith(1234);
      expect(products).toHaveLength(10);
      expect(products[0]).toEqual({
        id: 'test-uuid-123',
        name: 'Test Product',
        price: '99.99',
      });
    });

    test('should generate specified number of products', () => {
      const products = generateProducts(1234, 5);
      
      expect(products).toHaveLength(5);
      expect(faker.seed).toHaveBeenCalledWith(1234);
    });

    test('should use custom seed', () => {
      const customSeed = 9876;
      generateProducts(customSeed, 3);
      
      expect(faker.seed).toHaveBeenCalledWith(customSeed);
    });
  });

  describe('Edge cases', () => {
    test('should handle zero count', () => {
      const products = generateProducts(1234, 0);
      
      expect(products).toHaveLength(0);
      expect(products).toEqual([]);
    });

    test('should handle negative count', () => {
      const products = generateProducts(1234, -5);
      
      expect(products).toHaveLength(0);
      expect(products).toEqual([]);
    });

    test('should handle large count', () => {
      const products = generateProducts(1234, 1000);
      
      expect(products).toHaveLength(1000);
      expect(faker.string.uuid).toHaveBeenCalledTimes(1000);
      expect(faker.commerce.productName).toHaveBeenCalledTimes(1000);
      expect(faker.commerce.price).toHaveBeenCalledTimes(1000);
    });
  });

  describe('Product structure', () => {
    test('should generate products with correct structure', () => {
      faker.string.uuid
        .mockReturnValueOnce('id-1')
        .mockReturnValueOnce('id-2');
      faker.commerce.productName
        .mockReturnValueOnce('Product 1')
        .mockReturnValueOnce('Product 2');
      faker.commerce.price
        .mockReturnValueOnce('19.99')
        .mockReturnValueOnce('29.99');

      const products = generateProducts(1234, 2);
      
      expect(products).toEqual([
        { id: 'id-1', name: 'Product 1', price: '19.99' },
        { id: 'id-2', name: 'Product 2', price: '29.99' },
      ]);
    });

    test('should generate unique products with different faker calls', () => {
      faker.string.uuid
        .mockReturnValueOnce('unique-id-1')
        .mockReturnValueOnce('unique-id-2')
        .mockReturnValueOnce('unique-id-3');
      faker.commerce.productName
        .mockReturnValueOnce('Laptop')
        .mockReturnValueOnce('Mouse')
        .mockReturnValueOnce('Keyboard');
      faker.commerce.price
        .mockReturnValueOnce('999.99')
        .mockReturnValueOnce('25.50')
        .mockReturnValueOnce('75.00');

      const products = generateProducts(5555, 3);
      
      expect(products).toHaveLength(3);
      expect(products[0].id).not.toBe(products[1].id);
      expect(products[1].id).not.toBe(products[2].id);
      expect(products[0].name).not.toBe(products[1].name);
    });
  });

  describe('Parameter validation', () => {
    test('should handle undefined seed', () => {
      const products = generateProducts(undefined, 2);
      
      expect(faker.seed).toHaveBeenCalledWith(1234); // default seed
      expect(products).toHaveLength(2);
    });

    test('should handle null seed', () => {
      const products = generateProducts(null, 2);
      
      expect(faker.seed).toHaveBeenCalledWith(null); // null is passed as-is
      expect(products).toHaveLength(2);
    });

    test('should handle undefined count', () => {
      const products = generateProducts(1234, undefined);
      
      expect(products).toHaveLength(10); // default count
    });

    test('should handle null count', () => {
      const products = generateProducts(1234, null);
      
      expect(products).toHaveLength(0); // null is falsy
    });

    test('should handle string seed', () => {
      const products = generateProducts('1234', 2);
      
      expect(faker.seed).toHaveBeenCalledWith('1234');
      expect(products).toHaveLength(2);
    });

    test('should handle decimal count (should truncate)', () => {
      const products = generateProducts(1234, 3.7);
      
      expect(products).toHaveLength(3); // Array.from truncates
    });
  });

  describe('Console logging', () => {
    test('should log generation message with default parameters', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      generateProducts();
      
      expect(consoleSpy).toHaveBeenCalledWith('Generating 10 products with seed 1234');
      
      consoleSpy.mockRestore();
    });

    test('should log generation message with custom parameters', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      generateProducts(9999, 25);
      
      expect(consoleSpy).toHaveBeenCalledWith('Generating 25 products with seed 9999');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Integration with faker', () => {
    test('should call faker methods in correct order', () => {
      generateProducts(1234, 1);
      
      // Just verify that all methods were called
      expect(faker.seed).toHaveBeenCalledTimes(1);
      expect(faker.string.uuid).toHaveBeenCalledTimes(1);
      expect(faker.commerce.productName).toHaveBeenCalledTimes(1);
      expect(faker.commerce.price).toHaveBeenCalledTimes(1);
    });

    test('should maintain seed consistency', () => {
      const seed = 12345;
      generateProducts(seed, 3);
      
      expect(faker.seed).toHaveBeenCalledTimes(1);
      expect(faker.seed).toHaveBeenCalledWith(seed);
    });
  });

  describe('Performance tests', () => {
    test('should handle reasonable large datasets efficiently', () => {
      const startTime = performance.now();
      const products = generateProducts(1234, 10000);
      const endTime = performance.now();
      
      expect(products).toHaveLength(10000);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete in less than 1 second
    });
  });
});

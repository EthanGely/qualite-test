import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mock fetch globally
global.fetch = jest.fn();

// Helper function to match text across split DOM elements (unused but kept for reference)
// eslint-disable-next-line no-unused-vars
const findByTextContent = (textMatch, container = document) => {
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    textNodes.push(node);
  }

  for (let element of container.querySelectorAll('*')) {
    const text = element.textContent;
    if (text && text.includes(textMatch)) {
      return element;
    }
  }
  
  return null;
};

// Custom matcher for product items
const getProductItem = (name, price) => {
  return screen.getByText((content, element) => {
    if (!element || element.tagName.toLowerCase() !== 'li') return false;
    const text = element.textContent || '';
    return text.includes(name) && text.includes(price) && text.includes('€');
  });
};

// Mock fetch globally
global.fetch = jest.fn();

describe('App Component', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    describe('Initial render', () => {
        test('should render the main heading', () => {
            fetch.mockResolvedValueOnce({
                json: async () => [],
            });

            render(<App />);
            
            expect(screen.getByRole('heading', { name: /catalogue produits/i })).toBeInTheDocument();
        });

        test('should render empty list initially', () => {
            fetch.mockResolvedValueOnce({
                json: async () => [],
            });

            render(<App />);
            
            const list = screen.getByRole('list');
            expect(list).toBeInTheDocument();
            expect(list).toBeEmptyDOMElement();
        });
    });

    describe('API Integration', () => {
        test('should fetch products on mount', () => {
            fetch.mockResolvedValueOnce({
                json: async () => [],
            });

            render(<App />);
            
            expect(fetch).toHaveBeenCalledTimes(1);
            expect(fetch).toHaveBeenCalledWith('/api/products');
        });

        test('should display products after successful fetch', async () => {
            const mockProducts = [
                { id: '1', name: 'Laptop', price: '999.99' },
                { id: '2', name: 'Mouse', price: '25.50' },
            ];

            fetch.mockResolvedValueOnce({
                json: async () => mockProducts,
            });

            render(<App />);
            
            await waitFor(() => {
                expect(screen.getByText((content, element) => 
                    element.tagName.toLowerCase() === 'li' && content.includes('Laptop')
                )).toBeInTheDocument();
                expect(screen.getByText((content, element) => 
                    element.tagName.toLowerCase() === 'span' && content.includes('999.99')
                )).toBeInTheDocument();
                expect(screen.getByText((content, element) => 
                    element.tagName.toLowerCase() === 'li' && content.includes('Mouse')
                )).toBeInTheDocument();
                expect(screen.getByText((content, element) => 
                    element.tagName.toLowerCase() === 'span' && content.includes('25.50')
                )).toBeInTheDocument();
            });
        });

        test('should display single product correctly', async () => {
            const mockProducts = [
                { id: '1', name: 'Keyboard', price: '75.00' },
            ];

            fetch.mockResolvedValueOnce({
                json: async () => mockProducts,
            });

            render(<App />);
            
            await waitFor(() => {
                expect(getProductItem('Keyboard', '75.00')).toBeInTheDocument();
            });
            
            expect(screen.getAllByRole('listitem')).toHaveLength(1);
        });

        test('should handle multiple products with various prices', async () => {
            const mockProducts = [
                { id: '1', name: 'Expensive Item', price: '1999.99' },
                { id: '2', name: 'Cheap Item', price: '1.00' },
                { id: '3', name: 'Free Item', price: '0.00' },
            ];

            fetch.mockResolvedValueOnce({
                json: async () => mockProducts,
            });

            render(<App />);
            
            await waitFor(() => {
                expect(getProductItem('Expensive Item', '1999.99')).toBeInTheDocument();
                expect(getProductItem('Cheap Item', '1.00')).toBeInTheDocument();
                expect(getProductItem('Free Item', '0.00')).toBeInTheDocument();
            });
            
            expect(screen.getAllByRole('listitem')).toHaveLength(3);
        });
    });

    describe('Error Handling', () => {
        test('should handle fetch errors gracefully', async () => {
            fetch.mockRejectedValueOnce(new Error('Network error'));

            render(<App />);
            
            await waitFor(() => {
                expect(fetch).toHaveBeenCalledTimes(1);
            });
            
            // Should still render the heading even with errors
            expect(screen.getByRole('heading', { name: /catalogue produits/i })).toBeInTheDocument();
            // List should remain empty
            expect(screen.getByRole('list')).toBeEmptyDOMElement();
        });

        test('should handle invalid JSON response', async () => {
            fetch.mockResolvedValueOnce({
                json: async () => {
                    throw new Error('Invalid JSON');
                },
            });

            render(<App />);
            
            await waitFor(() => {
                expect(fetch).toHaveBeenCalledTimes(1);
            });
            
            expect(screen.getByRole('heading', { name: /catalogue produits/i })).toBeInTheDocument();
            expect(screen.getByRole('list')).toBeEmptyDOMElement();
        });

        test('should handle malformed product data', async () => {
            const mockProducts = [
                { id: '1', name: 'Valid Product', price: '99.99' },
                { id: '2' }, // Missing name and price
                { name: 'No ID Product', price: '49.99' }, // Missing id
                null, // Null product
            ];

            fetch.mockResolvedValueOnce({
                json: async () => mockProducts,
            });

            render(<App />);
            
            await waitFor(() => {
                expect(getProductItem('Valid Product', '99.99')).toBeInTheDocument();
            });
            
            // Component should only render valid products, filtering out malformed ones
            const listItems = screen.getAllByRole('listitem');
            expect(listItems).toHaveLength(1); // Only one valid product
        });
    });

    describe('Component Structure', () => {
        test('should render with correct semantic HTML structure', async () => {
            const mockProducts = [
                { id: '1', name: 'Test Product', price: '50.00' },
            ];

            fetch.mockResolvedValueOnce({
                json: async () => mockProducts,
            });

            render(<App />);
            
            await waitFor(() => {
                expect(getProductItem('Test Product', '50.00')).toBeInTheDocument();
            });
            
            // Check for proper HTML structure
            expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
            expect(screen.getByRole('list')).toBeInTheDocument();
            expect(screen.getByRole('listitem')).toBeInTheDocument();
        });

        test('should use React Fragment as root element', () => {
            fetch.mockResolvedValueOnce({
                json: async () => [],
            });

            const { container } = render(<App />);
            
            // The component should not add extra wrapper divs
            expect(container.firstChild.tagName).toBe('H1');
        });
    });

    describe('Product Rendering', () => {
        test('should render product name and price with correct formatting', async () => {
            const mockProducts = [
                { id: '1', name: 'Gaming Mouse', price: '89.99' },
            ];

            fetch.mockResolvedValueOnce({
                json: async () => mockProducts,
            });

            render(<App />);
            
            await waitFor(() => {
                const productElement = getProductItem('Gaming Mouse', '89.99');
                expect(productElement).toBeInTheDocument();
                
                // Check that price is wrapped in a span
                const priceSpan = screen.getByText((content, element) => 
                    element.tagName.toLowerCase() === 'span' && content.includes('89.99')
                );
                expect(priceSpan.tagName).toBe('SPAN');
            });
        });

        test('should handle products with special characters in names', async () => {
            const mockProducts = [
                { id: '1', name: 'Café & Thé Set', price: '45.50' },
                { id: '2', name: 'Ñoño\'s Special Item', price: '12.99' },
            ];

            fetch.mockResolvedValueOnce({
                json: async () => mockProducts,
            });

            render(<App />);
            
            await waitFor(() => {
                expect(getProductItem('Café & Thé Set', '45.50')).toBeInTheDocument();
                expect(getProductItem('Ñoño\'s Special Item', '12.99')).toBeInTheDocument();
            });
        });

        test('should handle long product names', async () => {
            const mockProducts = [
                { 
                    id: '1', 
                    name: 'This is a very long product name that might cause layout issues if not handled properly', 
                    price: '199.99' 
                },
            ];

            fetch.mockResolvedValueOnce({
                json: async () => mockProducts,
            });

            render(<App />);
            
            await waitFor(() => {
                expect(screen.getByText((content, element) => 
                    element.tagName.toLowerCase() === 'li' && content.includes('This is a very long product name')
                )).toBeInTheDocument();
            });
        });
    });

    describe('State Management', () => {
        test('should update state correctly when products are fetched', async () => {
            const mockProducts = [
                { id: '1', name: 'Product 1', price: '10.00' },
                { id: '2', name: 'Product 2', price: '20.00' },
            ];

            fetch.mockResolvedValueOnce({
                json: async () => mockProducts,
            });

            render(<App />);
            
            // Initially empty
            expect(screen.getByRole('list')).toBeEmptyDOMElement();
            
            // After fetch
            await waitFor(() => {
                expect(screen.getAllByRole('listitem')).toHaveLength(2);
            });
        });

        test('should handle empty product array', async () => {
            fetch.mockResolvedValueOnce({
                json: async () => [],
            });

            render(<App />);
            
            await waitFor(() => {
                expect(fetch).toHaveBeenCalledTimes(1);
            });
            
            expect(screen.getByRole('list')).toBeEmptyDOMElement();
        });
    });

    describe('Edge Cases', () => {
        test('should handle very large number of products', async () => {
            const mockProducts = Array.from({ length: 1000 }, (_, i) => ({
                id: `product-${i}`,
                name: `Product ${i}`,
                price: `${(i * 10).toFixed(2)}`,
            }));

            fetch.mockResolvedValueOnce({
                json: async () => mockProducts,
            });

            render(<App />);
            
            await waitFor(() => {
                expect(screen.getAllByRole('listitem')).toHaveLength(1000);
            });
        });

        test('should handle products with numeric prices', async () => {
            const mockProducts = [
                { id: '1', name: 'Numeric Price', price: 99.99 }, // Number instead of string
            ];

            fetch.mockResolvedValueOnce({
                json: async () => mockProducts,
            });

            render(<App />);
            
            await waitFor(() => {
                expect(getProductItem('Numeric Price', '99.99')).toBeInTheDocument();
            });
        });
    });
});

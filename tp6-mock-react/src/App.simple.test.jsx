import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mock fetch globally
global.fetch = jest.fn();

describe('App Component - Core Functionality', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

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
  });

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
      { id: '1', name: 'Laptop', price: '999.99' }
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
    
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  test('should render price in span element', async () => {
    const mockProducts = [
      { id: '1', name: 'Gaming Mouse', price: '89.99' },
    ];

    fetch.mockResolvedValueOnce({
      json: async () => mockProducts,
    });

    render(<App />);
    
    await waitFor(() => {
      const priceSpan = screen.getByText('89.99');
      expect(priceSpan.tagName).toBe('SPAN');
    });
  });
});

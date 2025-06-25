
import { useEffect, useState } from 'react';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        // Filter out invalid products
        const validProducts = (data || []).filter(p => 
          p && typeof p === 'object' && p.id && p.name && p.price !== undefined
        );
        setProducts(validProducts);
      })
      .catch(error => {
        console.error('Failed to fetch products:', error);
        setProducts([]);
      });
  }, []);

  return (
    <><h1>Catalogue produits</h1>
      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.name} — <span>{p.price}</span>€
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;


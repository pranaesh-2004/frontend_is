import React, { useEffect, useState } from 'react';
import { getAll } from '../../services/foodService';
import Thumbnails from '../../components/Thumbnails/Thumbnails';
import NotFound from '../../components/NotFound/NotFound';

export default function ProductPage() {
  const [foods, setFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    getAll().then(setFoods);
  }, []);

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category ? food.category === category : true;
    return matchesSearch && matchesCategory;
  });

  // Optional: Dynamically extract unique categories
  const categories = [...new Set(foods.map(f => f.category).filter(Boolean))];

  return (
    <div className="product-page container">
      <h2 className="section-title">Our Products</h2>

      {/* 🔍 Search and 🧾 Category Filter */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search for a product..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={{ padding: '8px' }}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* 📦 Product List */}
      {filteredFoods.length === 0 ? (
        <NotFound linkText="Back to Home" />
      ) : (
        <Thumbnails foods={filteredFoods} />
      )}
    </div>
  );
}

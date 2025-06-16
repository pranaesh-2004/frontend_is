import React, { useEffect, useState } from 'react';
import axios from 'axios'; // ✅ Add this
import { getAll } from '../../services/foodService';
import Thumbnails from '../../components/Thumbnails/Thumbnails';
import NotFound from '../../components/NotFound/NotFound';
import Loading from '../../components/Loading/Loading';

export default function ProductPage() {
  const [foods, setFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bgColor, setBgColor] = useState('#ffffff'); // ✅ default background color

  useEffect(() => {
    axios.get('http://localhost:2000/colorprofile')
      .then(res => setBgColor(res.data.color))
      .catch(err => console.error('Error fetching background color:', err));
  }, []);

  useEffect(() => {
    let isMounted = true;

    const cachedFoods = sessionStorage.getItem('foods');
    if (cachedFoods) {
      setFoods(JSON.parse(cachedFoods));
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        const data = await getAll();
        if (isMounted) {
          setFoods(data);
          sessionStorage.setItem('foods', JSON.stringify(data));
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to fetch products.');
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredFoods = foods.filter((food) => {
    const nameMatch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = category ? food.category === category : true;
    return nameMatch && categoryMatch;
  });

  const categories = [...new Set(foods.map((f) => f.category).filter(Boolean))];

  return (
    <div className="product-page container" style={{ backgroundColor: bgColor }}>
      <h2 className="section-title">Our Products</h2>

      {/* 🔍 Search & 🧾 Category Filter */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search for a product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: '8px' }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* 📦 Products Display */}
      {loading ? (
        <Loading />
      ) : error ? (
        <NotFound linkText="Try Again" message={error} />
      ) : filteredFoods.length === 0 ? (
        <NotFound linkText="Back to Home" message="No products found." />
      ) : (
        <Thumbnails foods={filteredFoods} />
      )}
    </div>
  );
}

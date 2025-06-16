import React, { useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router-dom';
import Search from '../../components/Search/Search';
import Tags from '../../components/Tags/Tags';
import Thumbnails from '../../components/Thumbnails/Thumbnails';
import {
  getAll,
  getAllByTag,
  getAllTags,
  search,
} from '../../services/foodService';
import NotFound from '../../components/NotFound/NotFound';
import Loading from '../../components/Loading/Loading';
import './HomePage.css';
import aboutImage from '../../components/assets/images/about.png';
import axios from 'axios';

const initialState = {
  foods: [],
  tags: [],
  loading: true,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'TAGS_LOADED':
      return { ...state, tags: action.payload };
    case 'FOODS_LOADED':
      return { ...state, foods: action.payload, loading: false };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function HomePage() {
  const [{ foods, tags, loading, error }, dispatch] = useReducer(reducer, initialState);
  const { searchTerm, tag } = useParams();

  const [bannerImages, setBannerImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bgColor, setBgColor] = useState('#000000'); // default dark background

  // Fetch banner images and background color
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const [imagesRes, colorRes] = await Promise.all([
          axios.get('http://localhost:2000/images'),
          axios.get('http://localhost:2000/colorhome'),
        ]);

        if (Array.isArray(imagesRes.data) && imagesRes.data.length > 0) {
          setBannerImages(imagesRes.data.map(img => img.imageUrl));
        }

        if (colorRes.data && colorRes.data.color) {
          setBgColor(colorRes.data.color);
        }
      } catch (err) {
        console.error('Error loading banner or color:', err);
      }
    };

    fetchAssets();
  }, []);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % bannerImages.length);
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [bannerImages]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      dispatch({ type: 'FETCH_START' });
      try {
        const [tagsData, foodsData] = await Promise.all([
          getAllTags(),
          tag ? getAllByTag(tag) : searchTerm ? search(searchTerm) : getAll(),
        ]);
        if (isMounted) {
          dispatch({ type: 'TAGS_LOADED', payload: tagsData });
          dispatch({ type: 'FOODS_LOADED', payload: foodsData });
        }
      } catch (err) {
        if (isMounted) {
          dispatch({ type: 'FETCH_ERROR', payload: err.message || 'Failed to load data.' });
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [searchTerm, tag]);

  return (
    <div className="home-page" style={{ backgroundColor: bgColor, transition: 'background-color 1s ease-in-out' }}>
      
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          backgroundImage:
            bannerImages.length > 0
              ? `url(${bannerImages[currentImageIndex]})`
              : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '60vh',
          transition: 'background-image 1s ease-in-out, background-color 1s ease-in-out',
        }}
      >
        <div className="hero-content animated fadeInDown">
          <h1 className="hero-title">WELCOME TO ISVARYAM</h1>
          <p className="hero-subtitle">HEALTHY HEART BETTER LIFE</p>
          <div className="search-container">
            <Search />
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section className="products-section container fadeInUp">
        <h2 className="section-title"><br />Fresh From Our Farms</h2>
        <div className="filter-container">
          <Tags tags={tags} />
        </div>

        {loading ? (
          <Loading />
        ) : error ? (
          <NotFound linkText="Try Again" message={error} />
        ) : foods.length === 0 ? (
          <NotFound linkText="Reset Search" message="No items found." />
        ) : (
          <Thumbnails foods={foods} />
        )}
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-section fadeInUp">
        <div className="container">
          <h2 className="section-title"><br />Why Choose Us</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🌱</div>
              <h3>100% Organic</h3>
              <p>Chemical-free farming practices for healthier living</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🚚</div>
              <h3>Farm to Table</h3>
              <p>Directly from our farms to your home within 24 hours</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🌍</div>
              <h3>Sustainable</h3>
              <p>Eco-friendly packaging & sustainable farming practices</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-us-section fadeInUp" style={{ backgroundColor: bgColor, transition: 'background-color 1s ease-in-out' }}>
        <div className="container">
          <h2 className="section-title"><br />About Us</h2>
          <div className="about-us-content">
            <img src={aboutImage} alt="Our Farm" className="about-image" />
            <div className="about-text">
              <p>
                At Isvaryam, we are committed to delivering nature’s best straight
                from our farms to your home. Our journey began with a mission to
                promote healthier lifestyles through organic, sustainable, and
                chemical-free food. Transparency and tradition drive us—every
                product reflects our values. Experience nature’s true taste.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section fadeInUp">
        <div className="container">
          <h2 className="section-title"><br />What Our Customers Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p>"The cold-pressed coconut oil is the best I’ve ever used! Natural, pure, and fragrant."</p>
              <h4>- Priya R.</h4>
            </div>
            <div className="testimonial-card">
              <p>"Fresh and chemical-free vegetables delivered fast. My family loves them!"</p>
              <h4>- Suresh K.</h4>
            </div>
            <div className="testimonial-card">
              <p>"Great quality jaggery and spices. I appreciate their eco-friendly practices."</p>
              <h4>- Anjali M.</h4>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

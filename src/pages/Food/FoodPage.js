import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import Price from '../../components/Price/Price';
import StarRating from '../../components/StarRating/StarRating';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/usewishlist';
import { getById } from '../../services/foodService';
import NotFound from '../../components/NotFound/NotFound';
import classes from './foodPage.module.css';

export default function FoodPage() {
  const [food, setFood] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [hoveredImageIndex, setHoveredImageIndex] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewImage, setReviewImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const [ratingStats, setRatingStats] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId") || "mockCustomerId";

  useEffect(() => {
    getById(id).then(data => {
      if (data) {
        setFood(data);
        setSelectedImage(0);
        setSelectedSize(data.quantities?.[0]?.size || '');
      } else {
        setFood(null);
      }
    });
  }, [id]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`/api/reviews/product/${id}`);
      const fetchedReviews = res.data;
      setReviews(fetchedReviews);

      const total = fetchedReviews.reduce((sum, r) => sum + r.rating, 0);
      const average = fetchedReviews.length ? total / fetchedReviews.length : 0;
      setAvgRating(average);

      const stats = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      fetchedReviews.forEach(r => {
        const star = Math.floor(r.rating);
        stats[star] = (stats[star] || 0) + 1;
      });
      setRatingStats(stats);
    } catch {
      setReviews([]);
      setAvgRating(0);
      setRatingStats({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const handleAddToCart = () => {
    if (food && selectedSize) {
      addToCart(food, selectedSize);
      navigate('/cart');
    }
  };

  const getDiscountedPrice = (price, discount) =>
    discount ? price - (price * discount) / 100 : price;

  const isFavorite = isInWishlist(food?.id);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmitReview = async () => {
    if (!rating || !reviewText || !reviewImage) {
      alert('All fields are required: rating, review text, and image.');
      return;
    }

    const userReviewCount = reviews.filter(r => r.CustomerId === userId).length;
    if (userReviewCount >= 2) {
      alert("You have already submitted 2 reviews for this product.");
      return;
    }

    try {
      setSubmitting(true);
      const base64Image = await convertToBase64(reviewImage);

      const reviewData = {
        productId: id,
        rating,
        review: reviewText,
        image: base64Image,
        CustomerId: userId
      };

      await axios.post('/api/reviews', reviewData);
      alert('Review submitted!');
      setShowDialog(false);
      setReviewText('');
      setRating(0);
      setReviewImage(null);
      await fetchReviews();
    } catch (err) {
      console.error(err);
      alert('Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  if (!food) return <NotFound message="Food Not Found!" linkText="Back To Homepage" />;

  const selectedQuantity = food.quantities.find(q => q.size === selectedSize);
  const originalPrice = selectedQuantity?.price || 0;
  const discountedPrice = getDiscountedPrice(originalPrice, food.discount);
  const totalReviews = reviews.length;

  return (
    <div className={classes.container}>
      {/* === Image Gallery === */}
      <div className={classes.imageGallery}>
        <div className={classes.imageWrapper}>
          <img
            className={classes.image}
            src={food.images?.[hoveredImageIndex ?? selectedImage] || food.imageUrl}
            alt={food.name}
          />
          <button
            className={`${classes.favoriteButton} ${isFavorite ? classes.active : ''}`}
            onClick={() => toggleWishlist(food)}
          >
            {isFavorite ? '❤' : '♡'}
          </button>
        </div>
        {food.images?.length > 1 && (
          <div className={classes.thumbnailContainer}>
            {food.images.map((img, idx) => (
              <div
                key={idx}
                className={`${classes.thumbnail} ${idx === selectedImage ? classes.active : ''}`}
                onClick={() => setSelectedImage(idx)}
                onMouseEnter={() => setHoveredImageIndex(idx)}
                onMouseLeave={() => setHoveredImageIndex(null)}
              >
                <img src={img} alt={`Thumb ${idx}`} className={classes.thumbImg} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* === Food Details === */}
      <div className={classes.details}>
        <h1>{food.name}</h1>

        <div>
          {food.discount ? (
            <>
              <span style={{ textDecoration: 'line-through', color: 'gray' }}>₹{originalPrice}</span>{' '}
              <strong style={{ color: 'green' }}>
                ₹{discountedPrice.toFixed(2)} ({food.discount}% OFF)
              </strong>
            </>
          ) : (
            <strong>₹{originalPrice}</strong>
          )}
        </div>

        <p>{food.description}</p>

        <select value={selectedSize} onChange={e => setSelectedSize(e.target.value)}>
          {food.quantities.map(q => (
            <option key={q.size} value={q.size}>{q.size} - ₹{q.price}</option>
          ))}
        </select>

        <button onClick={handleAddToCart} className={classes.addToCartBtn}>Add to Cart 🛒</button>
        <button onClick={() => setShowDialog(true)} className={classes.reviewBtn}>Write a Review ✍️</button>

        {/* === Rating Summary === */}
        <div style={{ margin: '20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <StarRating stars={avgRating} size={25} />
            <span>{avgRating.toFixed(1)} out of 5 ({totalReviews} reviews)</span>
          </div>
          {[5, 4, 3, 2, 1].map(star => {
            const count = ratingStats[star];
            const percent = totalReviews ? Math.round((count / totalReviews) * 100) : 0;
            return (
              <div key={star} style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
                <span style={{ width: 60 }}>{star} star</span>
                <div style={{ background: '#eee', flex: 1, margin: '0 10px', borderRadius: 4 }}>
                  <div style={{
                    width: `${percent}%`,
                    backgroundColor: '#4caf50',
                    height: '8px',
                    borderRadius: 4
                  }} />
                </div>
                <span>{percent}%</span>
              </div>
            );
          })}
        </div>

        {/* === Review Dialog === */}
        {showDialog && (
          <div className={classes.reviewDialog}>
            <h3>Write a Review</h3>
            <label>Rating:</label>
            <StarRating stars={rating} size={30} onRate={setRating} editable />
            <label>Review:</label>
            <textarea
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              rows={4}
              placeholder="Your review here..."
            />
            <label>Upload Product Photo:</label>
            <input type="file" accept="image/*" onChange={e => setReviewImage(e.target.files[0])} />
            <div className={classes.dialogActions}>
              <button onClick={handleSubmitReview} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
              <button onClick={() => setShowDialog(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* === Reviews === */}
        <div className={classes.reviewSection}>
          <h3>Customer Reviews</h3>
          {reviews.length === 0 ? <p>No reviews yet.</p> : (
            reviews.map(rev => (
              <div key={rev._id} className={classes.reviewCard}>
                <div className={classes.reviewHeader}>
                  <strong>{rev.CustomerId?.name || 'Anonymous'}</strong>
                  <span>{format(new Date(rev.createdAt), 'dd MMM yyyy, hh:mm a')}</span>
                </div>
                <StarRating stars={rev.rating} size={20} />
                <p>{rev.review}</p>
                {rev.image && <img src={rev.image} alt="review" className={classes.reviewImg} />}
                {rev.replies?.length > 0 && (
                  <div className={classes.replies}>
                    <strong>Admin Replies:</strong>
                    <ul>
                      {rev.replies.map(rep => (
                        <li key={rep._id}>
                          {rep.text} — <small>{format(new Date(rep.createdAt), 'dd MMM yyyy')}</small>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

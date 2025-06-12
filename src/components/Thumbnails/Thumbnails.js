import React from 'react';
import { useNavigate } from 'react-router-dom';
import Price from '../Price/Price';
import StarRating from '../StarRating/StarRating';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/usewishlist';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import classes from './thumbnails.module.css';

export default function Thumbnails({ foods }) {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const [selectedSizes, setSelectedSizes] = React.useState({});
  const [dialog, setDialog] = React.useState({ open: false, message: '' });

  const handleSizeChange = (foodId, size) => {
    setSelectedSizes(prev => ({ ...prev, [foodId]: size }));
  };

  const handleAddToCart = (food, e) => {
    e.stopPropagation();
    const size = selectedSizes[food._id] || food.quantities[0].size;
    addToCart(food, size);
    navigate('/cart');
  };

  const handleCardClick = (food) => {
    navigate(`/food/${food._id}`);
  };

  const handleWishlist = async (food, e) => {
    e.stopPropagation();
    const alreadyWishlisted = isInWishlist(food._id);
    await toggleWishlist(food);
    setDialog({
      open: true,
      message: alreadyWishlisted
        ? `"${food.name}" removed from wishlist!`
        : `"${food.name}" added to wishlist!`
    });
    setTimeout(() => setDialog({ open: false, message: '' }), 1500);
  };

  return (
    <>
      {/* Dialog Box */}
      {dialog.open && (
        <div className={classes.centerDialogBox}>
          {dialog.message}
        </div>
      )}
      <div className={classes.productsGrid}>
        {foods
          .filter(food => Array.isArray(food.quantities) && food.quantities.length > 0)
          .map(food => (
            <div
              key={food._id}
              className={classes.productCard}
              onClick={() => handleCardClick(food)}
              style={{ cursor: 'pointer' }}
            >
              <div className={classes.imageContainer}>
                <img
                  className={classes.productImage}
                  src={food.images?.[0]}
                  alt={food.name}
                />
                <div className={classes.organicBadge}>
                  <span>Organic</span>
                </div>
                {/* Wishlist Heart Icon */}
                <div
                  className={classes.wishlistIcon}
                  onClick={e => handleWishlist(food, e)}
                  title={isInWishlist(food._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                  style={{
                    background: isInWishlist(food._id) ? '#fff0f0' : 'rgba(255,255,255,0.85)',
                    color: isInWishlist(food._id) ? '#e53935' : '#e53935',
                    border: isInWishlist(food._id) ? '1.5px solid #e53935' : 'none',
                    transition: 'background 0.2s, color 0.2s'
                  }}
                >
                  {isInWishlist(food._id) ? (
                    <AiFillHeart size={26} color="#e53935" />
                  ) : (
                    <AiOutlineHeart size={26} color="#e53935" />
                  )}
                </div>
              </div>

              <div className={classes.productInfo}>
                <div className={classes.name}>{food.name}</div>
                <div className={classes.productFooter}>
                  <div className={classes.stars}>
                    <StarRating stars={food.stars} />
                  </div>
                  <div className={classes.price}>
                    <Price price={
                      food.quantities.find(q => q.size === (selectedSizes[food._id] || food.quantities[0].size))?.price
                    } />
                  </div>
                </div>

                <select
                  value={selectedSizes[food._id] || food.quantities[0].size}
                  onClick={e => e.stopPropagation()}
                  onChange={e => handleSizeChange(food._id, e.target.value)}
                >
                  {food.quantities.map(q => (
                    <option key={q.size} value={q.size}>
                      {q.size} - ₹{q.price}
                    </option>
                  ))}
                </select>

                <div className={classes.buttonGroup}>
                  <button
                    className={classes.addToCart}
                    onClick={(e) => handleAddToCart(food, e)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
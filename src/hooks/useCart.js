import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const CartContext = createContext(null);
const EMPTY_CART = {
  items: [],
  totalPrice: 0,
  totalCount: 0,
};

export default function CartProvider({ children }) {
  const { user, loading } = useAuth();
  const CART_KEY = user ? `cart_${user.id}` : 'cart_guest';
  // Always get cart from the correct key
  function getCartFromLocalStorage(key) {
    const storedCart = localStorage.getItem(key);
    return storedCart ? JSON.parse(storedCart) : EMPTY_CART;
  }

  // State
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [cartReady, setCartReady] = useState(false);

  // On user change, load the correct cart and clear guest cart if needed
  useEffect(() => {
    if (user) {
      localStorage.removeItem('cart_guest');
    }
    const initCart = getCartFromLocalStorage(CART_KEY);
    setCartItems(initCart.items);
    setTotalPrice(initCart.totalPrice);
    setTotalCount(initCart.totalCount);
    setCartReady(true);
    // eslint-disable-next-line
  }, [CART_KEY, user && user._id]);

  // Save cart to localStorage on change
  useEffect(() => {
    if (!cartReady) return;
    localStorage.setItem(
      CART_KEY,
      JSON.stringify({
        items: cartItems,
        totalPrice,
        totalCount,
      })
    );
  }, [cartItems, totalPrice, totalCount, CART_KEY, cartReady]);

  // Utility
  const sum = items => items.reduce((prev, cur) => prev + cur, 0);

  // Cart actions
  function removeFromCart(foodId, size) {
    setCartItems(prevCartItems =>
      prevCartItems.filter(
        item => !(item.food._id === foodId && item.size === size)
      )
    );
  }

  const changeQuantity = (cartItem, newQuantity) => {
    const { food } = cartItem;
    const changedCartItem = {
      ...cartItem,
      quantity: newQuantity,
      price: food.quantities
        ? (food.quantities.find(q => q.size === cartItem.size)?.price || 0) * newQuantity
        : food.price * newQuantity,
    };

    setCartItems(
      cartItems.map(item =>
        item.food._id === food._id && item.size === cartItem.size
          ? changedCartItem
          : item
      )
    );
  };

  function addToCart(food, size) {
    setCartItems(prevCartItems => {
      const existingIndex = prevCartItems.findIndex(
        item => item.food._id === food._id && item.size === size
      );
      if (existingIndex !== -1) {
        // Item exists, increase quantity
        const updatedItems = [...prevCartItems];
        updatedItems[existingIndex].quantity += 1;
        return updatedItems;
      } else {
        // New item
        return [
          ...prevCartItems,
          {
            food,
            size,
            price: food.quantities
              ? food.quantities.find(q => q.size === size)?.price || 0
              : food.price || 0,
            quantity: 1,
          },
        ];
      }
    });
  }

  const clearCart = () => {
    localStorage.removeItem(CART_KEY);
    setCartItems([]);
    setTotalPrice(0);
    setTotalCount(0);
  };

  // Update totalPrice and totalCount when cartItems change
  useEffect(() => {
    setTotalPrice(sum(cartItems.map(item => item.price)));
    setTotalCount(sum(cartItems.map(item => item.quantity)));
  }, [cartItems]);

  // Only render children when cart is ready (prevents flicker)
  if (!cartReady) return null;

  console.log('CartProvider: user._id:', user && user._id, 'CART_KEY:', CART_KEY);

  return (
    <CartContext.Provider
      value={{
        cart: { items: cartItems, totalPrice, totalCount },
        removeFromCart,
        changeQuantity,
        addToCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

// src/utils/fetchPageColor.js
import axios from 'axios';

export const fetchPageColor = async (pageName) => {
  try {
    const res = await axios.get(`http://localhost:2000/color/${pageName}`);
    return res.data?.color || '#ffffff';
  } catch (error) {
    console.error(`Error fetching color for ${pageName}:`, error);
    return '#ffffff';
  }
};

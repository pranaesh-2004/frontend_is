import axios from 'axios';

axios.defaults.baseURL =
  process.env.NODE_ENV !== 'production' ? 'https://isvaryam-backend.onrender.com' : '/';

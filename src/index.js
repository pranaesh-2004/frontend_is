import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import CartProvider from './hooks/useCart';
import './axiosConfig';
import { AuthProvider } from './hooks/useAuth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoadingProvider } from './hooks/useLoading';
import './interceptors/authInterceptor';

<<<<<<< HEAD
// Google Fonts (move this to index.html instead)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode> // REMOVE THIS LINE TO PREVENT DOUBLE RENDER IN DEV
=======
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet"></link>

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
>>>>>>> 4228c54e0c651cc8601ee0dcbc07ab673a979434
    <BrowserRouter>
      <LoadingProvider>
        <AuthProvider>
          <CartProvider>
            <App />
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </CartProvider>
        </AuthProvider>
      </LoadingProvider>
    </BrowserRouter>
<<<<<<< HEAD
  // </React.StrictMode> // REMOVE THIS LINE TOO
);

=======
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
>>>>>>> 4228c54e0c651cc8601ee0dcbc07ab673a979434
reportWebVitals();

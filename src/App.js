import { useEffect, useState } from 'react';
import AppRoutes from './AppRoutes';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Loading from './components/Loading/Loading';
import { useLoading } from './hooks/useLoading';
import { setLoadingInterceptor } from './interceptors/loadingInterceptor';

import './App.css'; // Global styles

function App() {
  const { showLoading, hideLoading } = useLoading();
  const [showChatbot, setShowChatbot] = useState(false); // Toggle state

  useEffect(() => {
    setLoadingInterceptor({ showLoading, hideLoading });
  }, [showLoading, hideLoading]);

  const toggleChatbot = () => {
    setShowChatbot(prev => !prev);
  };

  return (
    <div className="app-container">
      <Loading />
      <Header />
      <main className="main-content">

        <AppRoutes />
      </main>
      <Footer />

      {/* Floating chatbot toggle button */}
      <button
        onClick={toggleChatbot}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1100,
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          fontSize: '28px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
          cursor: 'pointer'
        }}
      >
        💬
      </button>

      {/* Chatbot iframe popup */}
      {showChatbot && (
        <iframe
          src="https://app.fastbots.ai/embed/cmazgeraw003hoelu7up9cu08"
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            width: '350px',
            height: '500px',
            border: 'none',
            zIndex: 1000,
            borderRadius: '12px',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
          }}
          allow="microphone; camera"
          title="Chatbot"
        />
      )}
    </div>
  );
}

export default App;

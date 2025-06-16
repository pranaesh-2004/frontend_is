<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import './ContactPage.css';

export default function ContactPage() {
  const [bgColor, setBgColor] = useState('#fff'); // Default fallback color

  useEffect(() => {
    fetch('http://localhost:2000/colorcontact')
      .then(res => res.json())
      .then(data => {
        if (data.color) setBgColor(data.color);
      })
      .catch(err => console.error('Failed to load contact background color:', err));
  }, []);

  return (
    <div className="contact-page" style={{ backgroundColor: bgColor }}>
=======
import React from 'react';
import './ContactPage.css';

export default function ContactPage() {
  return (
    <div className="contact-page">
>>>>>>> 4228c54e0c651cc8601ee0dcbc07ab673a979434
      <section className="contact-header">
        <div className="contact-header-left">
          <h2>Contact Us</h2>
          <p>We'd love to hear from you!</p>
          <ul>
            <li><strong>📍 Address:</strong> 10 E, Ondipudur-Irugur Rd, Coimbatore, Tamil Nadu 641103</li>
            <li><strong>📞 Phone:</strong> +91 98765 43210</li>
            <li><strong>✉️ Email:</strong> support@isvaryam.com</li>
          </ul>
        </div>

        <div className="contact-header-right">
          <iframe
            title="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3912.074969508015!2d77.03662587503193!3d11.004505054507975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859f0c4f69c0f%3A0x5ff80f5f5b5ad478!2s10%20E%2C%20Ondipudur-Irugur%20Rd%2C%20Coimbatore%2C%20Tamil%20Nadu%20641103!5e0!3m2!1sen!2sin!4v1718272720002!5m2!1sen!2sin"
            loading="lazy"
            allowFullScreen=""
          ></iframe>
        </div>
      </section>

      <section className="contact-form-section">
        <h2>Send a Message</h2>
        <form className="contact-form">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea rows="5" placeholder="Your Message" required></textarea>
          <button type="submit">Submit</button>
        </form>
      </section>
    </div>
  );
}

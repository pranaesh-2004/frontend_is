import React, { useEffect, useState } from 'react';
import './AboutUs.css';

export default function AboutUs() {
  const [bgColor, setBgColor] = useState('#fffefc'); // default background

  useEffect(() => {
    // Fetch background color for AboutUs section from server
    fetch('http://localhost:2000/colorabout')
      .then(res => res.json())
      .then(data => {
        if (data.color) setBgColor(data.color);
      })
      .catch(err => console.error('Failed to load About Us background color:', err));
  }, []);

  return (
    <div className="about-section" style={{ backgroundColor: bgColor }}>
      <div className="about-container">
        <h2 className="about-heading">
          <span className="heading-line">About Us</span>
        </h2>
        
        <div className="about-grid">
          <div className="about-card">
            <div className="card-icon">🌱</div>
            <h3>Our Passion for Purity</h3>
            <p>
              At Isvaryam, we believe that food is more than just sustenance — it's a reflection of our values.
              That's why we're committed to delivering only the purest, chemical-free, and nutrient-rich organic
              products.
            </p>
            <div className="card-hover-content">
              <p>Today, we proudly serve thousands who care about what goes into their bodies.</p>
            </div>
          </div>

          <div className="about-card">
            <div className="card-icon">🤝</div>
            <h3>Sourcing with Integrity</h3>
            <p>
              Our ingredients are ethically sourced from handpicked farms that follow sustainable agricultural
              practices. We partner only with farmers who respect the earth and nurture their crops with care.
            </p>
            <div className="card-hover-content">
              <p>Fair Trade certified, supporting clean food and fairer farming communities.</p>
            </div>
          </div>

          <div className="about-card">
            <div className="card-icon">⚗️</div>
            <h3>Crafting with Tradition</h3>
            <p>
              Cold-pressed oils are at the heart of what we do. Our team brings over 15 years of expertise in
              traditional oil extraction techniques — free from heat, chemicals, and additives.
            </p>
            <div className="card-hover-content">
              <p>This ancient method retains natural aroma, nutrients, and flavor for true wellness.</p>
            </div>
          </div>

          <div className="about-card">
            <div className="card-icon">🌿</div>
            <h3>Living the Isvaryam Way</h3>
            <p>
              At Isvaryam, we're not just selling oils — we're promoting a lifestyle. Our products are made for
              people who want to live intentionally, eat consciously, and stay rooted in tradition.
            </p>
            <div className="card-hover-content">
              <p>Free from harmful contaminants, honoring your health and values.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

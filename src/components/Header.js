import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
                            <img src="/logo.png" alt="TROPICAL PERSPECTIVE" className="logo-image" />
          </Link>
          
          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <a 
              href="#newsletter" 
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                setIsMenuOpen(false);
                
                // Function to scroll to newsletter
                const scrollToNewsletter = () => {
                  const newsletterSection = document.getElementById('newsletter');
                  if (newsletterSection) {
                    newsletterSection.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  } else {
                    // Fallback: scroll to bottom
                    window.scrollTo({
                      top: document.body.scrollHeight,
                      behavior: 'smooth'
                    });
                  }
                };
                
                // Try immediately, then with a delay if needed
                scrollToNewsletter();
                setTimeout(scrollToNewsletter, 200);
              }}
            >
              Newsletter
            </a>
          </nav>

          <button 
            className={`hamburger ${isMenuOpen ? 'hamburger-open' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 
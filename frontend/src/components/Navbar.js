// frontend/src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { FaMoon, FaSun, FaGithub } from 'react-icons/fa';

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  };

  return (
    <nav className="navbar navbar-dark sticky-top">
      <div className="container">
        <div className="d-flex align-items-center">
          <span className="navbar-brand h1 mb-0">
            🎓 CourseFinder AI
          </span>
          <span className="ms-3 badge" style={{ 
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            padding: '5px 10px',
            borderRadius: '20px',
            fontSize: '0.7rem'
          }}>
            Powered by AI
          </span>
        </div>
        
        <div className="d-flex align-items-center gap-3">
          <div className="text-white-50 d-none d-md-block">
            <small>OpenAI + YouTube API</small>
          </div>
          
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white-50"
            style={{ transition: 'color 0.3s' }}
            onMouseEnter={e => e.target.style.color = '#6366f1'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}
          >
            <FaGithub size={20} />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
// src/components/Navbar.js
import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar navbar-dark" style={{ background: 'rgba(0,0,0,0.8)' }}>
      <div className="container">
        <span className="navbar-brand h1 mb-0">
          🎓 CourseFinder AI
        </span>
        <div className="text-white">
          <small>Powered by OpenAI + YouTube API</small>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
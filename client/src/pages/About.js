// components/Header.js

import React from 'react';
import '../styles/Header.css'; // You can define your CSS styles for the header here

const Header = ({ setCurrentPage }) => {
  const handleNavClick = (page) => {
    setCurrentPage(page); // This function will be passed from App.js
  };

  return (
    <div className="Header">
      <nav>
        <ul>
          <li onClick={() => handleNavClick('mpesa')}>Mpesa</li>
          <li onClick={() => handleNavClick('about')}>About</li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;

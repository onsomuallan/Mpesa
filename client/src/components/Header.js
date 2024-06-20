import React from 'react';
import '../styles/Header.css'; // You can define your CSS styles for the header here

const Header = ({ navigate }) => {
  return (
    <div className="Header">
      <nav>
        <ul>
          <li onClick={() => navigate('mpesa')}>Home</li>
          <li onClick={() => navigate('status')}>Status</li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;

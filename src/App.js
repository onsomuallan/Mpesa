// App.js

import React, { useState } from 'react';
import './App.css';
import Mpesa from './pages/Home';
import Status from './pages/Status';
import Header from './components/Header';

const App = () => {
  const [currentPage, setCurrentPage] = useState('mpesa'); // Default to 'mpesa' page

  const renderPage = () => {
    switch (currentPage) {
      case 'mpesa':
        return <Mpesa />;
      case 'status':
        return <Status />;
      default:
        return <Mpesa />;
    }
  };

  return (
    <div className="App">
      <Header setCurrentPage={setCurrentPage} />
      {renderPage()}
    </div>
  );
};

export default App;

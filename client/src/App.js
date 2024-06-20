import React, { useState, useEffect } from 'react';
import './App.css';
import Mpesa from './pages/Home';
import Status from './pages/CheckStatus';
import Header from './components/Header';

const App = () => {
  const [currentPage, setCurrentPage] = useState('');

  useEffect(() => {
    // Get the current URL path
    const path = window.location.pathname;

    // Update the state based on the current path
    switch (path) {
      case '/status':
        setCurrentPage('status');
        break;
      case '/':
      default:
        setCurrentPage('mpesa');
        break;
    }
  }, []);

  const navigate = (page) => {
    // Update the URL without reloading the page
    window.history.pushState({}, '', page === 'mpesa' ? '/' : `/${page}`);
    // Update the state to render the correct page
    setCurrentPage(page);
  };

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
      <Header navigate={navigate} />
      {renderPage()}
    </div>
  );
};

export default App;

// src/App.js
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import CategoryInput from './components/CategoryInput';
import PlaylistsGrid from './components/PlaylistsGrid';
import Navbar from './components/Navbar';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFetchComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="App">
      <Navbar />
      <div className="container mt-4">
        <CategoryInput onFetchComplete={handleFetchComplete} />
        <PlaylistsGrid refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}

export default App;
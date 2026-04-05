// src/components/PlaylistsGrid.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaYoutube, FaPlayCircle } from 'react-icons/fa';

const PlaylistsGrid = ({ refreshTrigger }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const API_URL = 'http://localhost:8000';

  useEffect(() => {
    fetchPlaylists();
    fetchCategories();
  }, [refreshTrigger, selectedCategory]);

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const url = selectedCategory 
        ? `${API_URL}/playlists?category=${encodeURIComponent(selectedCategory)}`
        : `${API_URL}/playlists`;
      
      const response = await axios.get(url);
      if (response.data.success) {
        setPlaylists(response.data.data.data);
      }
    } catch (error) {
      console.error('Error fetching playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="loader mx-auto"></div>
        <p className="mt-3 text-white">Loading courses...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-white mb-0">
          🎯 Available Courses ({playlists.length})
        </h3>
        
        {categories.length > 0 && (
          <select
            className="form-select w-auto"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ background: 'white', borderRadius: '50px' }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        )}
      </div>
      
      {playlists.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <FaPlayCircle size={50} color="#6366f1" />
            <h4 className="mt-3">No courses yet</h4>
            <p className="text-muted">
              Enter some categories above and click "Start Fetching" to find courses!
            </p>
          </div>
        </div>
      ) : (
        <div className="row">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="col-md-6 col-lg-4 col-xl-3 mb-4">
              <div className="playlist-card">
                <img 
                  src={playlist.thumbnail} 
                  alt={playlist.title}
                  className="playlist-thumbnail"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Thumbnail';
                  }}
                />
                <div className="playlist-info">
                  <h5 className="playlist-title" title={playlist.title}>
                    {playlist.title.length > 60 
                      ? playlist.title.substring(0, 60) + '...' 
                      : playlist.title}
                  </h5>
                  <p className="channel-name">
                    <FaYoutube style={{ color: '#FF0000', marginRight: '5px' }} />
                    {playlist.channel_name}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="category-badge">
                      {playlist.category}
                    </span>
                    <a
                      href={`https://www.youtube.com/playlist?list=${playlist.playlist_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-danger"
                    >
                      Watch
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaylistsGrid;
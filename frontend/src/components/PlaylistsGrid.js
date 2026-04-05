// frontend/src/components/PlaylistsGrid.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaYoutube, FaPlayCircle, FaFilter, FaGraduationCap } from 'react-icons/fa';

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
        <p className="mt-3 text-muted">Loading courses...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div className="d-flex align-items-center gap-2">
          <FaGraduationCap size={28} style={{ color: '#6366f1' }} />
          <h3 className="text-white mb-0">
            Available Courses 
            <span className="ms-2 badge" style={{ 
              background: 'var(--card-bg)',
              color: 'var(--primary-color)',
              fontSize: '0.9rem'
            }}>
              {playlists.length}
            </span>
          </h3>
        </div>
        
        {categories.length > 0 && (
          <div className="d-flex align-items-center gap-2">
            <FaFilter style={{ color: 'var(--text-secondary)' }} />
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      
      {playlists.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <FaPlayCircle size={60} style={{ color: '#6366f1', opacity: 0.5 }} />
            <h4 className="mt-3">No courses yet</h4>
            <p className="text-muted">
              Enter some categories above and click "Start Fetching" to discover amazing courses!
            </p>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {playlists.map((playlist, index) => (
            <div key={playlist.id} className="col-md-6 col-lg-4 col-xl-3">
              <div className="playlist-card" style={{ animationDelay: `${index * 0.05}s` }}>
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <img 
                    src={playlist.thumbnail} 
                    alt={playlist.title}
                    className="playlist-thumbnail"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=No+Thumbnail';
                    }}
                  />
                  <div className="position-absolute top-0 end-0 m-2">
                    <span className="category-badge">
                      {playlist.category}
                    </span>
                  </div>
                </div>
                
                <div className="playlist-info">
                  <h5 className="playlist-title" title={playlist.title}>
                    {playlist.title.length > 60 
                      ? playlist.title.substring(0, 60) + '...' 
                      : playlist.title}
                  </h5>
                  
                  <p className="channel-name">
                    <FaYoutube style={{ color: '#FF0000' }} />
                    {playlist.channel_name}
                  </p>
                  
                  {playlist.description && (
                    <p className="text-muted small mb-3" style={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {playlist.description.substring(0, 100)}...
                    </p>
                  )}
                  
                  <a
                    href={`https://www.youtube.com/playlist?list=${playlist.playlist_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-danger w-100"
                  >
                    <FaYoutube style={{ marginRight: '8px' }} />
                    Watch Playlist
                  </a>
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
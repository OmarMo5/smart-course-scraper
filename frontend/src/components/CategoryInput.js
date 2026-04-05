// frontend/src/components/CategoryInput.js
import React, { useState } from "react";
import axios from "axios";
import { FaPlay, FaSpinner, FaMagic, FaCheckCircle } from "react-icons/fa";

const CategoryInput = ({ onFetchComplete }) => {
  const [categories, setCategories] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const API_URL = "http://localhost:8000";

  const handleFetch = async () => {
    const categoryList = categories
      .split("\n")
      .filter((cat) => cat.trim().length > 0);

    if (categoryList.length === 0) {
      alert("⚠️ Please enter at least one category");
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        withCredentials: false,
      };

      const response = await axios.post(
        `${API_URL}/fetch-courses`,
        { categories: categoryList },
        axiosConfig
      );

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        alert(`✨ Successfully fetched courses for ${categoryList.length} categories!`);
        onFetchComplete();
        setCategories("");
      }
    } catch (error) {
      console.error("Error details:", error.response);
      alert(`❌ Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="d-flex align-items-center mb-3">
          <FaMagic size={24} style={{ color: "#6366f1", marginRight: "12px" }} />
          <h3 className="card-title mb-0">Generate Courses with AI</h3>
        </div>
        
        <p className="text-muted mb-4">
          Enter one category per line. Our AI will generate course titles and find the best YouTube playlists for you.
        </p>
        
        <textarea
          className="form-control mb-3"
          rows="6"
          placeholder="🎨 Marketing&#10;💻 Programming&#10;🎨 Graphic Design&#10;📊 Business&#10;🔧 Engineering"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
          disabled={loading}
          style={{ 
            fontSize: "14px", 
            fontFamily: "monospace",
            resize: "vertical"
          }}
        />
        
        <button
          className="btn-gradient"
          onClick={handleFetch}
          disabled={loading}
          style={{ position: "relative", width: "auto" }}
        >
          {loading ? (
            <>
              <FaSpinner style={{ animation: "spin 1s linear infinite", marginRight: "8px" }} />
              Generating Courses...
            </>
          ) : success ? (
            <>
              <FaCheckCircle style={{ marginRight: "8px" }} />
              Success!
            </>
          ) : (
            <>
              <FaPlay style={{ marginRight: "8px" }} />
              Start Fetching
            </>
          )}
        </button>
        
        {loading && (
          <div className="mt-4">
            <div className="progress">
              <div 
                className="progress-bar" 
                style={{ width: "100%" }}
              ></div>
            </div>
            <small className="text-muted mt-2 d-block text-center">
              🤖 AI is generating course titles and searching YouTube...
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryInput;
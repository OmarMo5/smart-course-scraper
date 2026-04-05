// src/components/CategoryInput.js
import React, { useState } from "react";
import axios from "axios";
import { FaPlay, FaSpinner } from "react-icons/fa";

const CategoryInput = ({ onFetchComplete }) => {
  const [categories, setCategories] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);

  const API_URL = "http://localhost:8000";

  const handleFetch = async () => {
    const categoryList = categories
      .split("\n")
      .filter((cat) => cat.trim().length > 0);

    if (categoryList.length === 0) {
      alert("Please enter at least one category");
      return;
    }

    setLoading(true);

    try {
      // أضف هذه الإعدادات لـ axios
      const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        withCredentials: false, // مهم: لا ترسل cookies
      };

      const response = await axios.post(
        "http://localhost:8000/fetch-courses",
        { categories: categoryList },
        axiosConfig,
      );

      if (response.data.success) {
        alert(
          `Successfully fetched courses for ${categoryList.length} categories!`,
        );
        onFetchComplete();
        setCategories("");
      }
    } catch (error) {
      console.error("Error details:", error.response);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h3 className="card-title mb-3">📚 Enter Categories</h3>
        <p className="text-muted">
          Enter one category per line. We'll generate course titles using AI and
          find relevant YouTube playlists.
        </p>

        <textarea
          className="form-control mb-3"
          rows="6"
          placeholder="Marketing&#10;Programming&#10;Graphic Design&#10;Business&#10;Engineering"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
          disabled={loading}
          style={{ fontSize: "14px", fontFamily: "monospace" }}
        />

        <button
          className="btn-gradient"
          onClick={handleFetch}
          disabled={loading}
        >
          {loading ? (
            <>
              <FaSpinner
                className="spinner"
                style={{
                  animation: "spin 1s linear infinite",
                  marginRight: "8px",
                }}
              />
              Fetching Courses...
            </>
          ) : (
            <>
              <FaPlay style={{ marginRight: "8px" }} />
              Start Fetching
            </>
          )}
        </button>

        {progress && (
          <div className="mt-3">
            <div className="progress">
              <div
                className="progress-bar bg-gradient"
                style={{
                  width: `${(progress.current / progress.total) * 100}%`,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                {progress.current}/{progress.total}
              </div>
            </div>
            <small className="text-muted mt-2 d-block">
              Processing categories... This may take a few minutes.
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryInput;

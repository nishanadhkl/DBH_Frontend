import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserCheck, FaBook, FaTags, FaStar, FaUsers } from "react-icons/fa";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/stats");
      setStats(res.data);
      setError(null);
    } catch (err) {
      console.error("Failed to load admin stats", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <h2 className="admin-heading">Admin Dashboard</h2>
        <div className="loading">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <h2 className="admin-heading">Admin Dashboard</h2>
        <div className="error">{error}</div>
        <button onClick={fetchAdminStats} className="retry-btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2 className="admin-heading">Admin Dashboard</h2>
      </div>

      {/* Stats Cards Section */}
      <div className="stats-section">
        <h3 className="section-title">Platform Statistics</h3>
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <FaUserCheck className="dashboard-icon" />
            <h3>Total Subscriptions</h3>
            <p className="stat-number">{stats?.totalSubscriptions || 0}</p>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-icon revenue-icon">Rs.</div>
            <h3>Total Revenue</h3>
            <p className="stat-number">Rs. {(stats?.totalRevenue || 0).toLocaleString()}</p>
          </div>
          <div className="dashboard-card">
            <FaBook className="dashboard-icon" />
            <h3>Total Books</h3>
            <p className="stat-number">{stats?.totalBooks || 0}</p>
          </div>
          <div className="dashboard-card">
            <FaTags className="dashboard-icon" />
            <h3>Total Genres</h3>
            <p className="stat-number">{stats?.totalGenres || 0}</p>
          </div>
          <div className="dashboard-card">
            <FaUsers className="dashboard-icon" />
            <h3>Total Users</h3>
            <p className="stat-number">{stats?.totalUsers || 0}</p>
          </div>
        </div>
      </div>

      {/* Popular Books Section */}
      <div className="popular-books-section">
        <h3 className="section-title">Top Popular Books</h3>
        <div className="popular-books-card">
          {stats?.popularBooks && stats.popularBooks.length > 0 ? (
            <div className="popular-books-list">
              {stats.popularBooks.map((book, index) => (
                <div key={index} className="popular-book-item">
                  <div className="book-rank">#{index + 1}</div>
                  <div className="book-info">
                    <h4 className="book-title">{book.title}</h4>
                    <p className="book-author">by {book.author}</p>
                    <div className="book-rating">
                      <span className="stars">{"⭐".repeat(Math.round(book.averageRating))}</span>
                      <span className="rating-text">{book.averageRating} ({book.ratingCount} ratings)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-books">
              <FaBook className="no-books-icon" />
              <p>No popular books available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserCheck, FaRupeeSign, FaBook, FaTags, FaStar } from "react-icons/fa";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
    fetchSummary();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/subscriptions");
      setSubscriptions(res.data);
      const revenue = res.data.reduce((sum, sub) => sum + (sub.amount || 0), 0);
      setTotalRevenue(revenue);
    } catch (err) {
      console.error("Failed to load subscriptions", err);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/stats");
      setSummary(res.data);
    } catch (err) {
      console.error("Failed to load book summary", err);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2 className="admin-heading">📊 Admin Dashboard</h2>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <FaUserCheck className="dashboard-icon" />
          <h3>Total Subscriptions</h3>
          <p>{subscriptions.length}</p>
        </div>
        <div className="dashboard-card">
          <FaRupeeSign className="dashboard-icon" />
          <h3>Total Revenue</h3>
          <p>Rs. {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="dashboard-card">
          <FaBook className="dashboard-icon" />
          <h3>Total Books</h3>
          <p>{summary ? summary.totalBooks : "Loading..."}</p>
        </div>
        <div className="dashboard-card">
          <FaTags className="dashboard-icon" />
          <h3>Total Genres</h3>
          <p>{summary ? summary.totalGenres : "Loading..."}</p>
        </div>
        <div className="dashboard-card">
          <FaStar className="dashboard-icon" />
          <h3>Most Popular Book</h3>
          {summary && summary.mostPopularBook ? (
            <>
              <p><strong>{summary.mostPopularBook.title}</strong></p>
              <p>{summary.mostPopularBook.author}</p>
              <p>⭐ {summary.mostPopularBook.rating}</p>
            </>
          ) : (
            <p>No popular book available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

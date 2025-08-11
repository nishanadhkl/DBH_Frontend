import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AdminSidebar.css"; // New sidebar styles

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    toast.info("Logged out successfully", {
      position: "top-center",
      autoClose: 1500,
    });
    setTimeout(() => {
      navigate("/admin-login");
    }, 1500);
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">Admin Panel</div>
        <nav className="sidebar-menu">
          <Link to="/admin" className="sidebar-link">Dashboard</Link>
          <Link to="/admin/manage-books" className="sidebar-link">Manage Books</Link>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </nav>
      </aside>

      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

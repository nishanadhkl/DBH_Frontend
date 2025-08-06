import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Home from "./pages/Home";
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from "./pages/AdminLayout";
import ManageBooks from "./pages/ManageBooks";
import ProtectedRoute from "./components/ProtectedRoute";
import Subscribe from "./pages/Subscribe";
import RecommendedBooks from "./pages/RecommendedBooks";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import About from "./pages/About";
import Contact from "./pages/Contact";

const Layout = ({ children }) => {
  const location = useLocation();

  // Routes where Navbar and Footer should be hidden
  const hiddenLayoutRoutes = [
    "/admin",
    "/admin/manage-books",
    "/admin-login",
    "/login",
    "/register",
  ];

  const hideLayout = hiddenLayoutRoutes.includes(location.pathname);

  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}

      {/* Global Toast configuration */}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/recommended" element={<RecommendedBooks />} />
          <Route path="/about" element={<About/>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />


          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="manage-books" element={<ManageBooks />} />
          </Route>
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;

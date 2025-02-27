import React from "react";
import { Link } from "react-router-dom";
import "../styles/global.css";


const Navbar = () => {
    return (
        <nav className="navbar">

            <h2> 
            <img src="/DBH logo.png" alt="Digital Book Haven Logo" className="navbar-logo" />

                Digital Book Haven
                </h2>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/books">Books</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;

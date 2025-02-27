import React from "react";
import Footer from "../components/Footer";
import "../styles/global.css"; 

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero-section">
        <h1>Welcome to Digital Book Haven</h1>
        <p>Read, explore, and enjoy books online.</p>
      </section>

      <section className="about-section">
        <h2>About Us</h2>
        <p>
          Digital Book Haven is an online book-reading platform that allows users
          to explore and read books conveniently. We offer a subscription-based 
          model with a variety of books across different genres.
        </p>
      </section>

      <Footer />
    </div>
  );
};

export default Home;


import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaBook, FaSearch, FaHeart, FaUsers, FaGlobe, FaStar } from "react-icons/fa";
import "./About.css";

const About = () => {
  const features = [
    {
      icon: <FaBook className="feature-icon" />,
      title: "Premium Books",
      description: "Access to thousands of high-quality books across all genres"
    },
    {
      icon: <FaSearch className="feature-icon" />,
      title: "Smart Search",
      description: "Find your next favorite book with our intelligent search system"
    },
    {
      icon: <FaHeart className="feature-icon" />,
      title: "Personalized",
      description: "Get book recommendations tailored to your reading preferences"
    },
    {
      icon: <FaUsers className="feature-icon" />,
      title: "Community",
      description: "Connect with fellow readers and share your reading journey"
    },
    {
      icon: <FaGlobe className="feature-icon" />,
      title: "Global Access",
      description: "Read anywhere, anytime with our cloud-based platform"
    },
    {
      icon: <FaStar className="feature-icon" />,
      title: "Premium Features",
      description: "Unlock advanced features with our subscription plans"
    }
  ];

  const stats = [
    { number: "1000+", label: "Books Available" },
    { number: "50+", label: "Genres" },
    { number: "24/7", label: "Access" },
    { number: "100%", label: "Secure" }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="hero-title">Welcome to Digital Book Haven</h1>
              <p className="hero-subtitle">
                Your gateway to a world of knowledge, imagination, and endless stories
              </p>
              <div className="hero-stats">
                <Row>
                  {stats.map((stat, index) => (
                    <Col key={index} xs={6} md={3}>
                      <div className="stat-item">
                        <div className="stat-number">{stat.number}</div>
                        <div className="stat-label">{stat.label}</div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              <div className="mission-content">
                <h2 className="section-title">Our Mission</h2>
                <p className="mission-text">
                  At Digital Book Haven, we believe that knowledge should be accessible to everyone. 
                  Our mission is to create a digital sanctuary where readers can explore, discover, 
                  and immerse themselves in the world of literature. We're committed to promoting 
                  reading habits and providing a seamless digital reading experience to users in 
                  Nepal and beyond.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Container>
          <h2 className="section-title text-center mb-5">Why Choose Digital Book Haven?</h2>
          <Row>
            {features.map((feature, index) => (
              <Col key={index} lg={4} md={6} className="mb-4">
                <Card className="feature-card">
                  <Card.Body className="text-center">
                    <div className="feature-icon-wrapper">
                      {feature.icon}
                    </div>
                    <Card.Title className="feature-title">{feature.title}</Card.Title>
                    <Card.Text className="feature-description">
                      {feature.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <div className="story-content">
                <h2 className="section-title">Our Story</h2>
                <p className="story-text">
                  Digital Book Haven was born from a simple yet powerful idea: to make quality 
                  literature accessible to everyone, regardless of their location or circumstances. 
                  What started as a small project has grown into a comprehensive digital library 
                  serving readers across Nepal and beyond.
                </p>
                <p className="story-text">
                  We understand the transformative power of reading and are dedicated to creating 
                  an environment where every reader can find their perfect book, discover new 
                  authors, and embark on countless literary adventures.
                </p>
              </div>
            </Col>
            <Col lg={6}>
              <div className="story-image">
                <div className="image-placeholder">
                  <FaBook className="placeholder-icon" />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <Container>
          <h2 className="section-title text-center mb-5">Our Values</h2>
          <Row>
            <Col md={4} className="mb-4">
              <div className="value-card">
                <h3>Accessibility</h3>
                <p>Making quality literature available to everyone, everywhere</p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="value-card">
                <h3>Quality</h3>
                <p>Curating the best books and providing an excellent reading experience</p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="value-card">
                <h3>Community</h3>
                <p>Building a vibrant community of readers and book lovers</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default About;

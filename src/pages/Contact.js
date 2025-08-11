import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import "./Contact.css";

const Contact = () => {
  const contactInfo = [
    {
      icon: <FaEnvelope className="contact-icon" />,
      title: "Email Us",
      details: "support@digitalbookhaven.com",
      description: "Send us an email anytime"
    },
    {
      icon: <FaPhone className="contact-icon" />,
      title: "Call Us",
      details: "+977-9841764128",
      description: "Available 24/7 for support"
    },
    {
      icon: <FaMapMarkerAlt className="contact-icon" />,
      title: "Our Location",
      details: "Banepa, Kavrepalanchok, Nepal",
      description: "Digital Book Haven Headquarters"
    }
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-overlay"></div>
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="hero-title">Get in Touch</h1>
              <p className="hero-subtitle">
                Have questions or need support? We're here to help you 24/7!
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Information Section */}
      <section className="contact-info-section">
        <Container>
          <Row>
            {contactInfo.map((info, index) => (
              <Col key={index} lg={4} md={6} className="mb-4">
                <Card className="contact-info-card">
                  <Card.Body className="text-center">
                    <div className="icon-wrapper">
                      {info.icon}
                    </div>
                    <Card.Title className="info-title">{info.title}</Card.Title>
                    <Card.Text className="info-details">{info.details}</Card.Text>
                    <Card.Text className="info-description">{info.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              <div className="map-container">
                <h2 className="section-title text-center mb-5">Find Us</h2>
                <div className="map-placeholder">
                  <div className="map-content">
                    <FaMapMarkerAlt className="map-icon" />
                    <h3>Banepa, Kavrepalanchok, Nepal</h3>
                    <p>Digital Book Haven - Your Gateway to Digital Reading</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Contact;
 
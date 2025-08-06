import React from "react";
import { Container } from "react-bootstrap";

const About = () => {
  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">About Digital Book Haven</h2>
      <p style={{ fontSize: "18px", lineHeight: "1.8" }}>
        Digital Book Haven is an online platform for exploring, reading, and
        managing books. It brings a wide variety of books to readers in a
        user-friendly way.
      </p>
      <p style={{ fontSize: "18px", lineHeight: "1.8" }}>
        Key features of Digital Book Haven:
      </p>
      <ul style={{ fontSize: "18px", lineHeight: "1.8" }}>
        <li>Read premium books online anytime, anywhere</li>
        <li>Personalized book recommendations</li>
        <li>Book categorization and easy search</li>
        <li>Subscription-based access to premium features</li>
      </ul>
      <p style={{ fontSize: "18px", lineHeight: "1.8" }}>
        Our aim is to promote reading habits and provide a seamless digital
        reading experience to users in Nepal and beyond.
      </p>
    </Container>
  );
};

export default About;

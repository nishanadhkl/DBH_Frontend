import React from "react";
import { Container } from "react-bootstrap";

const Contact = () => {
  return (
    <Container className="py-5" style={{ maxWidth: "700px" }}>
      <h2 className="text-center mb-4">Contact Us</h2>
      <p style={{ fontSize: "18px", lineHeight: "1.8" }}>
        Have any questions, suggestions, or feedback?  
        You can reach out to us through the following contact details:
      </p>

      <div style={{ fontSize: "18px", lineHeight: "2" }}>
        <p><strong>Email:</strong> support@digitalbookhaven.com</p>
        <p><strong>Phone:</strong> +977-9800000000</p>
        <p><strong>Address:</strong> Panauti, Kavrepalanchok, Nepal</p>
      </div>

      <p style={{ fontSize: "18px", marginTop: "20px" }}>
        We look forward to hearing from you!
      </p>
    </Container>
  );
};

export default Contact;
 
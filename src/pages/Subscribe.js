import React from "react";
import { Container, Card, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";


const Subscribe = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const bookId = params.get("bookId"); // bookId passed as a query parameter

  const redirectToPdf = async () => {
    if (bookId) {
      try {
        const bookRes = await fetch(`http://localhost:5000/api/books/${bookId}`);
        const bookData = await bookRes.json();
        if (bookData && bookData.pdfPath) {
          window.location.href = `http://localhost:5000${bookData.pdfPath}`;
          return true;
        }
      } catch (err) {
        console.error("Failed to fetch book details:", err);
      }
    }
    return false;
  };

  const handleSubscribe = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      alert("Please log in to subscribe.");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId }),
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonError) {
        console.error("Failed to parse JSON:", jsonError);
        throw new Error("Invalid response from server");
      }

      if (res.ok) {
       toast.success("Subscription successful!");

        // After subscription, redirect to PDF if bookId is present
        const redirected = await redirectToPdf();
        if (!redirected) navigate("/books");
      } else {
        // If user already subscribed, redirect directly to full pdf
        if (data.message && data.message.includes("Already subscribed")) {
          const redirected = await redirectToPdf();
          if (redirected) return; // Redirected, so stop further execution
        }

        toast.info(data.message || "Failed to subscribe");

      }
    } catch (error) {
      console.error("Subscription failed:", error);
      alert("Subscription failed. Try again.");
    }
  };

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow text-center">
        <h2>Subscribe to Digital Book Haven</h2>
        <p className="mt-3">
          Unlock access to full books, premium features, and exclusive titles.
        </p>

        <Button variant="success" onClick={handleSubscribe} className="mt-3">
          Subscribe for Rs. 299/month
        </Button>
      </Card>
    </Container>
  );
};

export default Subscribe;

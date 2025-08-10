
import React, { useEffect, useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Subscribe = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const bookId = params.get("bookId");
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      if (!bookId) return;
      try {
        const res = await fetch(`http://localhost:5000/api/books/${bookId}`);
        const data = await res.json();
        setBook(data);
      } catch (err) {
        setBook(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [bookId]);

  const redirectToPdf = async () => {
    if (book && book.pdfPath) {
      window.location.href = `http://localhost:5000${book.pdfPath}`;
      return true;
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
        setTimeout(async () => {
          const redirected = await redirectToPdf();
          if (!redirected) navigate("/books");
        }, 1500); // 1.5 seconds delay for toast visibility
      } else {
        if (data.message && data.message.includes("Already subscribed")) {
          const redirected = await redirectToPdf();
          if (redirected) return;
        }
        toast.info(data.message || "Failed to subscribe");
      }
    } catch (error) {
      console.error("Subscription failed:", error);
      alert("Subscription failed. Try again.");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (!book) return <p className="text-center mt-5">Book not found.</p>;

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow text-center">
        <h2>Subscribe to Read Full Book</h2>
        <p className="mt-3">
          <strong>{book.title}</strong> by {book.author}
        </p>
        <h4 className="mb-3">Price: <span className="text-success">Rs. {book.price}</span></h4>
        <div className="text-center mb-3">
          <img
            src="/khalti.png"
            alt="Khalti"
            style={{ width: "180px", borderRadius: "8px" }}
          />
        </div>
        <Button variant="success" onClick={handleSubscribe} className="mt-3">
          Subscribe Now
        </Button>
      </Card>
    </Container>
  );
};

export default Subscribe;

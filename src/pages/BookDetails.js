import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Container, Card, Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchBook();
  }, []);

  const fetchBook = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/books/${id}`);
      setBook(res.data);
    } catch (error) {
      console.error("Failed to fetch book:", error);
    }
  };

  const handleReadMore = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("You are not logged in. Please log in to read the full book.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } else {
      // Always open subscription modal, no direct PDF here
      setShowSubscriptionModal(true);
    }
  };

  const handleRating = async (value) => {
    if (!userId) {
      toast.info("Please log in to rate books.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      return;
    }

    setRating(value);

    try {
      console.log("Sending rating:", { id, userId, rating: value });
      await axios.post(`http://localhost:5000/api/books/${id}/rate`, {
        userId,
        rating: value,
      });
      toast.success("Rating saved!");
      fetchBook();
    } catch (error) {
      console.error("Error rating book:", error);
      toast.error("Failed to save rating");
    }
  };

  const handleCloseModal = () => setShowSubscriptionModal(false);

  if (!book) return <p className="text-center mt-5">Loading book details...</p>;

  return (
    <Container className="mt-5">
      <Card className="shadow p-4">
        <div className="d-flex flex-column flex-md-row align-items-center">
          <img
            src={`http://localhost:5000${book.image}`}
            alt={book.title}
            style={{
              width: "250px",
              height: "350px",
              objectFit: "cover",
              marginRight: "30px",
            }}
            className="mb-3 mb-md-0"
          />
          <div>
            <h2>{book.title}</h2>
            <p>
              <strong>Author:</strong> {book.author}
            </p>
            <p>
              <strong>Genre:</strong> {book.genre}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {book.description || "No description available."}
            </p>
            {book.featured && <span className="badge bg-success">Featured</span>}

            {/* Rating Section */}
            <div className="mt-3">
              <h5>Rate this book:</h5>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{
                    fontSize: "2rem",
                    color: (hover || rating) >= star ? "gold" : "gray",
                    cursor: "pointer",
                  }}
                  onClick={() => handleRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(rating)}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Preview Section */}
            <div className="mt-4">
              <h5>Preview</h5>
              {book.previewPdfPath ? (
                <iframe
                  src={`http://localhost:5000${book.previewPdfPath}#page=1&toolbar=0&navpanes=0`}
                  width="100%"
                  height="400px"
                  title="PDF Preview"
                  style={{ border: "1px solid #ccc", borderRadius: "8px" }}
                />
              ) : (
                <p>No preview available.</p>
              )}
            </div>

            {/* Full Book Section */}
            <div className="mt-4">
              <Button
                variant="primary"
                onClick={handleReadMore}
                className="me-2"
              >
                Read Full Book
              </Button>
              <Link to="/books">
                <Button variant="secondary">Back to Books</Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>

      {/* Subscription Modal */}
      <Modal show={showSubscriptionModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Subscribe to Read More</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p className="mb-4">
            To access the full book, please subscribe to our premium plan.
          </p>
          <img
            src="/khalti.png"
            alt="Subscribe"
            style={{ width: "100%", borderRadius: "8px" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Link to={`/subscribe?bookId=${id}`}>
            <Button variant="success">Subscribe Now</Button>
          </Link>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BookDetails;

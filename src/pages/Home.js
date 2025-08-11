import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import BookCarousel from "../components/BookCarousel";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/global.css";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [recommendationType, setRecommendationType] = useState("");
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      let res;
      if (userId) {
        // If logged in, fetch recommendations
        res = await axios.get(`http://localhost:5000/api/books/recommendations/${userId}`);
        setRecommendationType("personalized");
      } else {
        // If not logged in, fetch normal books
        res = await axios.get("http://localhost:5000/api/books");
        // Only keep featured books for guests
        res.data = res.data.filter((book) => book.featured);
        setRecommendationType("featured");
      }
      setBooks(res.data);
    } catch (error) {
      console.error("Failed to fetch books:", error);
      setRecommendationType("error");
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationTitle = () => {
    if (!userId) return "Featured Books";
    
    switch (recommendationType) {
      case "personalized":
        return "Recommended For You";
      case "featured":
        return "Featured Books";
      case "error":
        return "Popular Books";
      default:
        return "Recommended For You";
    }
  };

  const getRecommendationSubtitle = () => {
    if (!userId) return "Handpicked books for everyone";
    
    switch (recommendationType) {
      case "personalized":
        return "Based on your reading preferences";
      case "featured":
        return "Handpicked books for everyone";
      case "error":
        return "Most loved books by our community";
      default:
        return "Based on your reading preferences";
    }
  };

  const getRecommendationBadge = () => {
    if (!userId) return null;
    
    switch (recommendationType) {
      case "personalized":
        return null;
      case "featured":
        return <Badge bg="warning" className="mb-2">Featured</Badge>;
      default:
        return null;
    }
  };

  return (
    <Container className="text-center mt-4">
      <h2>Welcome to Digital Book Haven</h2>
      <p>Read, explore, and enjoy books online.</p>
      <BookCarousel />

      <div className="mt-5">
        <h2>{getRecommendationTitle()}</h2>
        {getRecommendationBadge()}
        <p className="text-muted mb-4">{getRecommendationSubtitle()}</p>
        

      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading recommendations...</p>
        </div>
      ) : (
        <Row className="justify-content-center popular-books">
          {books.length > 0 ? (
            books.map((book) => (
              <Col key={book._id} md={3} sm={4} xs={6} className="mb-3">
                <Card className="book-card">
                  <Card.Img
                    variant="top"
                    src={`http://localhost:5000${book.image}`}
                    alt={book.title}
                    className="book-image"
                  />
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <Card.Text>
                      <strong>Author:</strong> {book.author} <br />
                      <strong>Genre:</strong> {book.genre}
                      {book.featured && (
                        <Badge bg="warning" text="dark" className="ms-2">
                          ⭐ Featured
                        </Badge>
                      )}
                    </Card.Text>
                    <Link to={`/books/${book._id}`}>
                      <Button variant="primary">View Details</Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-muted">No books available.</p>
          )}
        </Row>
      )}
    </Container>
  );
};

export default Home;

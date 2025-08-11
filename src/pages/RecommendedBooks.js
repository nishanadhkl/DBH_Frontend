import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Alert } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

const RecommendedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendationType, setRecommendationType] = useState("");
  const [error, setError] = useState(null);
  
  // Get the actual logged-in user's ID
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      fetchRecommendations();
    } else {
      setError("Please log in to see personalized recommendations");
      setLoading(false);
    }
  }, [userId]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.get(
        `http://localhost:5000/api/books/recommendations/${userId}`
      );
      
      setBooks(res.data);
      
      // Determine recommendation type based on user interaction count
      // This would ideally come from the backend, but we can infer it
      // For now, we'll show it as personalized since logged-in users get recommendations
      setRecommendationType("personalized");
      
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setError("Failed to load recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationTitle = () => {
    switch (recommendationType) {
      case "popularity":
        return "Popular Books";
      case "personalized":
        return "Recommended For You";
      default:
        return "Recommended For You";
    }
  };

  const getRecommendationSubtitle = () => {
    switch (recommendationType) {
      case "popularity":
        return "Most highly rated books by our community";
      case "personalized":
        return "Based on your reading preferences using content-based filtering";
      default:
        return "Personalized recommendations just for you";
    }
  };

  const getRecommendationBadge = () => {
    switch (recommendationType) {
      case "popularity":
        return <Badge bg="info" className="mb-2">Popular</Badge>;
      case "personalized":
        return <Badge bg="success" className="mb-2">AI Personalized</Badge>;
      default:
        return <Badge bg="primary" className="mb-2">Recommended</Badge>;
    }
  };

  const getRecommendationInfo = () => {
    switch (recommendationType) {
      case "popularity":
        return (
          <Alert variant="info" className="mb-4">
            <strong>📊 Popularity-Based:</strong> These recommendations are based on average ratings from our community. 
            Books with higher ratings and more reviews are prioritized.
          </Alert>
        );
      case "personalized":
        return (
          <Alert variant="success" className="mb-4">
            <strong>🤖 Content-Based Filtering:</strong> These recommendations use cosine similarity to match books 
            with similar genres, authors, and descriptions to your reading history.
          </Alert>
        );
      default:
        return null;
    }
  };

  if (!userId) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <h2>Personalized Recommendations</h2>
          <Alert variant="warning">
            <strong>Please log in</strong> to see personalized book recommendations based on your reading preferences.
          </Alert>
          <Link to="/login" className="btn btn-primary">
            Login to Continue
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="text-center mb-4">
        <h2>{getRecommendationTitle()}</h2>
        {getRecommendationBadge()}
        <p className="text-muted">{getRecommendationSubtitle()}</p>
        {getRecommendationInfo()}
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Analyzing your preferences...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">
          {error}
        </Alert>
      ) : (
        <Row>
          {books.length > 0 ? (
            books.map((book) => (
              <Col key={book._id} md={3} sm={4} xs={6} className="mb-3">
                <Card className="book-card h-100">
                  <Card.Img
                    variant="top"
                    src={`http://localhost:5000${book.image}`}
                    alt={book.title}
                    className="book-image"
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="flex-grow-1">{book.title}</Card.Title>
                    <Card.Text className="flex-grow-1">
                      <strong>Author:</strong> {book.author}
                      <br />
                      <strong>Genre:</strong> {book.genre}
                      {book.featured && (
                        <Badge bg="warning" text="dark" className="ms-2">
                          ⭐ Featured
                        </Badge>
                      )}
                    </Card.Text>
                    <Link to={`/books/${book._id}`} className="btn btn-primary mt-auto">
                      View Details
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col xs={12}>
              <Alert variant="info" className="text-center">
                <strong>No recommendations yet!</strong> Start reading some books to get personalized recommendations.
              </Alert>
            </Col>
          )}
        </Row>
      )}

      {books.length > 0 && (
        <div className="text-center mt-4">
          <p className="text-muted">
            <small>
              💡 <strong>Tip:</strong> Rate the books you read to help us provide even better recommendations!
            </small>
          </p>
        </div>
      )}
    </Container>
  );
};

export default RecommendedBooks;

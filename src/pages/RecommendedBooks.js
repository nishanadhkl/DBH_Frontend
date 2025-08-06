import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

const RecommendedBooks = () => {
  const [books, setBooks] = useState([]);
  // TODO: replace with logged-in user's id
  const userId = "680a1521d0c8f445c6c71d2c";

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/books/recommendations/${userId}`
      );
      setBooks(res.data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Recommended For You</h2>
      <Row>
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
                    <strong>Author:</strong> {book.author}
                    <br />
                    <strong>Genre:</strong> {book.genre}
                  </Card.Text>
                  <Link to={`/books/${book._id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center">No recommendations available.</p>
        )}
      </Row>
    </Container>
  );
};

export default RecommendedBooks;

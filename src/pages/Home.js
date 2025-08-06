import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import BookCarousel from "../components/BookCarousel";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/global.css";

const Home = () => {
  const [books, setBooks] = useState([]);

  const userId = localStorage.getItem("userId"); // <-- retrieve logged in userId

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      let res;
      if (userId) {
        // If logged in, fetch recommendations
        res = await axios.get(`http://localhost:5000/api/books/recommendations/${userId}`);
      } else {
        // If not logged in, fetch normal books
        res = await axios.get("http://localhost:5000/api/books");
        // Only keep featured books for guests
        res.data = res.data.filter((book) => book.featured);
      }
      setBooks(res.data);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
  };

  return (
    <Container className="text-center mt-4">
      <h2>Welcome to Digital Book Haven</h2>
      <p>Read, explore, and enjoy books online.</p>
      <BookCarousel />

      <h2 className="mt-5">
        {userId ? "Recommended For You" : "Popular Books"}
      </h2>

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
    </Container>
  );
};

export default Home;

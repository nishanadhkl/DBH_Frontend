import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const BookCard = ({ book }) => {
  return (
    <Card className="book-card">
    <Card.Img variant="top" src={`http://localhost:5000${book.image}`} />

      <Card.Body>
        <Card.Title>{book.title}</Card.Title>
        <Card.Text>
          <strong>Author:</strong> {book.author} <br />
          <strong>Genre:</strong> {book.genre}
        </Card.Text>

        {/* Link to book details */}
        <Link to={`/books/${book._id}`}>
          <Button variant="primary">View Details</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default BookCard;

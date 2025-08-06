import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import BookCard from "../components/BookCard";
import axios from "axios";
import { useLocation } from "react-router-dom"; // NEW IMPORT
import "../styles/global.css";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("");

  const location = useLocation(); // NEW

  // Function to get genre from query parameter
  const getGenreFromQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("genre");
  };

  useEffect(() => {
    fetchBooks();
  }, [location.search]); // re-run whenever the query changes

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/books");
      let allBooks = res.data;

      // If a genre query parameter exists, filter books by that genre
      const genre = getGenreFromQuery();
      if (genre) {
        allBooks = allBooks.filter(
          (book) =>
            book.genre &&
            book.genre.toLowerCase() === genre.toLowerCase()
        );
      }

      setBooks(allBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Apply search filter
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Apply sorting
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortType === "title") return a.title.localeCompare(b.title);
    if (sortType === "author") return a.author.localeCompare(b.author);
    if (sortType === "genre") return a.genre.localeCompare(b.genre);
    return 0;
  });

  return (
    <Container>
      <h2 className="text-center mt-4">Explore Books</h2>

      <Row className="my-3">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search by title, author, or genre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select onChange={(e) => setSortType(e.target.value)}>
            <option value="">Sort By</option>
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="genre">Genre</option>
          </Form.Select>
        </Col>
      </Row>

      <Row>
        {sortedBooks.length > 0 ? (
          sortedBooks.map((book) => (
            <Col key={book._id} md={4} className="mb-3">
              <BookCard book={book} />
            </Col>
          ))
        ) : (
          <p className="text-center">
            {getGenreFromQuery()
              ? `No books found for "${getGenreFromQuery()}" genre.`
              : "No books found."}
          </p>
        )}
      </Row>
    </Container>
  );
};

export default Books;

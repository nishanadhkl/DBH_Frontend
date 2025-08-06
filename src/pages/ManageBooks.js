import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import "../pages/ManageBooks.css";
import { GENRES } from "../constants/genres";


const ManageBooks = () => {
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    featured: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [previewPdfFile, setPreviewPdfFile] = useState(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [books, setBooks] = useState([]);
  const [editingBookId, setEditingBookId] = useState(null);

  const [imageError, setImageError] = useState(""); // Added state for image validation errors

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/books");
      setBooks(res.data);
    } catch (err) {
      toast.error("Failed to fetch books.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If there is an image error, stop submission
    if (imageError) {
      toast.error("Please fix image issues before submitting");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("author", form.author);
    formData.append("genre", form.genre);
    formData.append("description", form.description);
    formData.append("featured", form.featured);
    if (imageFile) formData.append("image", imageFile);
    if (pdfFile) formData.append("pdf", pdfFile);
    if (previewPdfFile) formData.append("previewPdf", previewPdfFile);

    try {
      if (editingBookId) {
        await axios.put(
          `http://localhost:5000/api/books/${editingBookId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        toast.success("Book updated successfully");
        setEditingBookId(null);
      } else {
        await axios.post("http://localhost:5000/api/books", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Book added successfully");
      }
      setForm({
        title: "",
        author: "",
        genre: "",
        description: "",
        featured: false,
      });
      setImageFile(null);
      setPdfFile(null);
      setPreviewPdfFile(null);
      setPdfPreviewUrl(null);
      fetchBooks();
    } catch (err) {
      toast.error("Failed to save book");
    }
  };

  const handleEdit = (book) => {
    setForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      description: book.description,
      featured: book.featured,
    });
    setEditingBookId(book._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
     const confirmDelete = window.confirm("Are you sure you want to delete this book?");
  if (!confirmDelete) return;
      try {
        await axios.delete(`http://localhost:5000/api/books/${id}`);
        toast.success("Book deleted successfully");
        fetchBooks();
      } catch (err) {
        toast.error("Failed to delete book");
      }
    };

  return (
    <div className="manage-books-container">
      <Container className="manage-books">
        <h2 className="section-title">
          {editingBookId ? "Edit Book" : "Add New Book"}
        </h2>
        <Form onSubmit={handleSubmit} className="book-form">
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Author</Form.Label>
                <Form.Control
                  type="text"
                  value={form.author}
                  onChange={(e) =>
                    setForm({ ...form, author: e.target.value })
                  }
                  required
                />
              </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Genre</Form.Label>
            <Form.Select
              value={form.genre}
              onChange={(e) => setForm({ ...form, genre: e.target.value })}
              required
            >
              <option value="">Select Genre</option>
              {GENRES.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
             </Form.Select>
            </Form.Group>

            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </Form.Group>

              {/* Upload Image with validation */}
              <Form.Group className="mb-3">
                <Form.Label>Upload Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const allowedTypes = [
                        "image/jpeg",
                        "image/png",
                        "image/jpg",
                        "image/gif",
                      ];

                      // Check file type
                      if (!allowedTypes.includes(file.type)) {
                        setImageError(
                          "Only JPG, JPEG, PNG, or GIF images are allowed"
                        );
                        e.target.value = "";
                        return;
                      }

                      // Check file size (2 MB)
                      if (file.size > 2 * 1024 * 1024) {
                        setImageError("Image size must be less than 2 MB");
                        e.target.value = "";
                        return;
                      }

                      setImageError("");
                      setImageFile(file);
                    }
                  }}
                />
                {imageError && (
                  <small className="text-danger">{imageError}</small>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Upload PDF</Form.Label>
                <Form.Control
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setPdfFile(file);
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setPdfPreviewUrl(url);
                    } else {
                      setPdfPreviewUrl(null);
                    }
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Upload Preview PDF (1–3 pages)</Form.Label>
                <Form.Control
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setPreviewPdfFile(e.target.files[0])}
                />
              </Form.Group>

              {pdfPreviewUrl && (
                <div className="mt-3">
                  <strong>Preview PDF:</strong>
                  <iframe
                    src={pdfPreviewUrl}
                    title="PDF Preview"
                    width="100%"
                    height="300px"
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                    }}
                  />
                </div>
              )}
              <Form.Check
                type="checkbox"
                label="Feature this book"
                checked={form.featured}
                onChange={(e) =>
                  setForm({ ...form, featured: e.target.checked })
                }
              />
            </Col>
          </Row>
          <Button type="submit" className="mt-3 btn-submit">
            {editingBookId ? "Update Book" : "Add Book"}
          </Button>
        </Form>

        <h3 className="section-title mt-5">Existing Books</h3>
        <Row>
          {books.map((book) => (
            <Col md={4} className="mb-4" key={book._id}>
              <Card className="book-card">
                <Card.Img
                  variant="top"
                  src={`http://localhost:5000${book.image}`}
                  className="book-image"
                />
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <Card.Text>
                    <strong>Author:</strong> {book.author}
                    <br />
                    <strong>Genre:</strong> {book.genre}
                    <br />
                    {book.featured && (
                      <span className="badge bg-warning text-dark">
                        ⭐ Featured
                      </span>
                    )}
                  </Card.Text>
                  <div className="d-flex justify-content-between mt-3">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEdit(book)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(book._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default ManageBooks;

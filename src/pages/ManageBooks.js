import React, { useEffect, useState, useRef } from "react";
import { Modal } from "react-bootstrap";
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
    price: "",
    featured: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [previewPdfFile, setPreviewPdfFile] = useState(null);
  // Refs for file inputs
  const imageInputRef = useRef();
  const pdfInputRef = useRef();
  const previewPdfInputRef = useRef();
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [books, setBooks] = useState([]);
  const [editingBookId, setEditingBookId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookIdToDelete, setBookIdToDelete] = useState(null);

  const [imageError, setImageError] = useState(""); 

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

    // Frontend validation for required fields
    if (!form.title.trim() || !form.author.trim() || !form.genre.trim() || !form.description.trim() || !form.price.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (isNaN(Number(form.price)) || Number(form.price) < 0) {
      toast.error("Price must be a non-negative number.");
      return;
    }

    if (imageError) {
      toast.error("Please fix image issues before submitting");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("author", form.author);
    formData.append("genre", form.genre);
    formData.append("description", form.description);
    formData.append("price", form.price);
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
        price: "",
        featured: false,
      });
      setImageFile(null);
      setPdfFile(null);
      setPreviewPdfFile(null);
      setPdfPreviewUrl(null);
      // Clear file input values visually
      if (imageInputRef.current) imageInputRef.current.value = "";
      if (pdfInputRef.current) pdfInputRef.current.value = "";
      if (previewPdfInputRef.current) previewPdfInputRef.current.value = "";
      fetchBooks();
    } catch (err) {
      let errorMsg = "Failed to save book";
      if (err.response && err.response.data && err.response.data.message) {
        errorMsg = err.response.data.message;
      } else if (err.response && err.response.data) {
        errorMsg = JSON.stringify(err.response.data);
      } else if (err.message) {
        errorMsg = err.message;
      }
      toast.error(errorMsg);
      // Log full error for debugging
      console.error("Book save error:", err);
    }
  };

  const handleEdit = (book) => {
    setForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      description: book.description,
      price: book.price || "",
      featured: book.featured,
    });
    setEditingBookId(book._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    setBookIdToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);
    if (!bookIdToDelete) return;
    try {
      await axios.delete(`http://localhost:5000/api/books/${bookIdToDelete}`);
      toast.success("Book deleted successfully");
      fetchBooks();
    } catch (err) {
      toast.error("Failed to delete book");
    }
    setBookIdToDelete(null);
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
                />
              </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Genre</Form.Label>
            <Form.Select
              value={form.genre}
              onChange={(e) => setForm({ ...form, genre: e.target.value })}
            >
              <option value="">Select Genre</option>
              {GENRES.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
             </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
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
                  ref={imageInputRef}
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
                  ref={pdfInputRef}
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
                  ref={previewPdfInputRef}
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
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this book?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageBooks;

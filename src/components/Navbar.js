import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import "../styles/global.css";
import { GENRES } from "../constants/genres";

const NavigationBar = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("name");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    navigate("/");
  };

  return (
    <Navbar expand="lg" bg="dark" variant="dark" className="px-3 shadow">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src="/DBH-logo.png"
            alt="Digital Book Haven"
            className="navbar-logo me-2"
          />
          <span className="fw-bold">Digital Book Haven</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarNavDropdown" />
        <Navbar.Collapse id="navbarNavDropdown">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/books">Books</Nav.Link>
                    <NavDropdown title="Genres" id="navbarGenres">
              {GENRES.map((genre) => (
                <NavDropdown.Item
                  as={Link}
                  to={`/books?genre=${encodeURIComponent(genre)}`}
                  key={genre}
                >
                  {genre}
                </NavDropdown.Item>
              ))}
            </NavDropdown>

            <NavDropdown title="More" id="navbarDropdownMenuLink">
              <NavDropdown.Item as={Link} to="/about">About Us</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/contact">Contact</NavDropdown.Item>
            </NavDropdown>

                {userId ? (
                <div className="d-flex align-items-center ms-3">
                <span className="text-white me-1" style={{ fontWeight: "500" }}>
                  Hello, {userName.split(" ")[0]}!
                </span>
                <i
                  className="bi bi-box-arrow-right"
                  style={{
                    cursor: "pointer",
                    fontSize: "1.1rem",
                    color: "#ffc107", 
                    marginTop: "2px"
                  }}
                  title="Logout"
                  onClick={handleLogout}
                />

                </div>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login" className="ms-3">
                    Login
                  </Nav.Link>
                  <Nav.Link as={Link} to="/register">Register</Nav.Link>
                </>
              )}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;

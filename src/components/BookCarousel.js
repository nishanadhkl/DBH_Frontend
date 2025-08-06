import React from "react";
import { Carousel } from "react-bootstrap";
import "../styles/global.css";

const BookCarousel = () => {
  const books = [
    {
      id: 1,
      title: "Harry Potter",
      description: "A magical journey of a young wizard at Hogwarts.",
      image: "/HP.jpg",
    },
    {
      id: 2,
      title: "Get a Life, Chloe Brown",
      description: "A witty and modern love story.",
      image: "/book2.jpg",
    },
    {
      id: 3,
      title: "Hobbit",
      description: "A timeless adventure of Bilbo Baggins in Middle-earth.",
      image: "/hb.jpg",
    },
  ];

  return (
    <Carousel fade interval={3000} className="book-carousel">
      {books.map((book) => (
        <Carousel.Item key={book.id}>
          <img className="d-block w-100 carousel-image" src={book.image} alt={book.title} />
          <Carousel.Caption>
            <h3>{book.title}</h3>
            <p>{book.description}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default BookCarousel;

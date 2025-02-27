import React from "react";
import "../styles/global.css"; // Import the CSS file

const BookCard = ({ book }) => {
    return (
        <div className="book-card">
            <h3>{book.title}</h3>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Genre:</strong> {book.genre}</p>
        </div>
    );
};

export default BookCard;


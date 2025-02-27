import React, { useState } from "react";
import BookCard from "../components/BookCard";
import "../styles/global.css";

const Books = () => {
    // Sample book data
    const bookList = [
        { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Classic" },
        { id: 2, title: "1984", author: "George Orwell", genre: "Dystopian" },
        { id: 3, title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction" },
        { id: 4, title: "Pride and Prejudice", author: "Jane Austen", genre: "Romance" }
    ];

    // State to store the search query
    const [searchQuery, setSearchQuery] = useState("");

    // Function to filter books based on the search query
    const filteredBooks = bookList.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <h1>Book List</h1>
            
            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search books by title, author, or genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: "8px", width: "80%", marginBottom: "20px" }}
            />
            
            {/* Display Books */}
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {filteredBooks.length > 0 ? (
                    filteredBooks.map(book => <BookCard key={book.id} book={book} />)
                ) : (
                    <p>No books found.</p>
                )}
            </div>
        </div>
    );
};

export default Books;



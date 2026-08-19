const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// JSON database location
const databasePath = path.join(__dirname, "data", "books.json");

// Read books from JSON file
function getBooks() {
  try {
    const data = fs.readFileSync(databasePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Save books to JSON file
function saveBooks(books) {
  fs.writeFileSync(
    databasePath,
    JSON.stringify(books, null, 2),
    "utf8"
  );
}

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Book Management API is running"
  });
});

// ==========================================
// GET ALL BOOKS
// ==========================================
app.get("/api/books", (req, res) => {
  const books = getBooks();

  res.json(books);
});

// ==========================================
// GET SINGLE BOOK
// ==========================================
app.get("/api/books/:id", (req, res) => {
  const books = getBooks();

  const id = Number(req.params.id);

  const book = books.find((book) => book.id === id);

  if (!book) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  res.json(book);
});

// ==========================================
// ADD BOOK
// ==========================================
app.post("/api/books", (req, res) => {
  const books = getBooks();

  const {
    title,
    author,
    category,
    price,
    quantity
  } = req.body;

  // Validation
  if (!title || !author || !category || price === undefined || quantity === undefined) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  const newBook = {
    id: books.length > 0
      ? Math.max(...books.map((book) => book.id)) + 1
      : 1,

    title: title.trim(),
    author: author.trim(),
    category: category.trim(),
    price: Number(price),
    quantity: Number(quantity)
  };

  books.push(newBook);

  saveBooks(books);

  res.status(201).json({
    message: "Book added successfully",
    book: newBook
  });
});

// ==========================================
// UPDATE BOOK
// ==========================================
app.put("/api/books/:id", (req, res) => {
  const books = getBooks();

  const id = Number(req.params.id);

  const bookIndex = books.findIndex(
    (book) => book.id === id
  );

  if (bookIndex === -1) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  const {
    title,
    author,
    category,
    price,
    quantity
  } = req.body;

  if (!title || !author || !category || price === undefined || quantity === undefined) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  books[bookIndex] = {
    id: id,
    title: title.trim(),
    author: author.trim(),
    category: category.trim(),
    price: Number(price),
    quantity: Number(quantity)
  };

  saveBooks(books);

  res.json({
    message: "Book updated successfully",
    book: books[bookIndex]
  });
});

// ==========================================
// DELETE BOOK
// ==========================================
app.delete("/api/books/:id", (req, res) => {
  const books = getBooks();

  const id = Number(req.params.id);

  const bookIndex = books.findIndex(
    (book) => book.id === id
  );

  if (bookIndex === -1) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  const deletedBook = books[bookIndex];

  books.splice(bookIndex, 1);

  saveBooks(books);

  res.json({
    message: "Book deleted successfully",
    book: deletedBook
  });
});

// ==========================================
// SEARCH BOOKS
// ==========================================
app.get("/api/search", (req, res) => {
  const books = getBooks();

  const search = (req.query.q || "").toLowerCase();

  const filteredBooks = books.filter((book) => {
    return (
      book.title.toLowerCase().includes(search) ||
      book.author.toLowerCase().includes(search) ||
      book.category.toLowerCase().includes(search)
    );
  });

  res.json(filteredBooks);
});

// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

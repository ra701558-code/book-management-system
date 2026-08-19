import { useEffect, useState } from "react";
import BookForm from "./components/BookForm";
import BookList from "./components/BookList";
import "./App.css";

const API_URL = "https://book-management-system-vris.onrender.com";

function App() {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // GET BOOKS
  // ==========================================
  async function fetchBooks() {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }

      const data = await response.json();

      setBooks(data);
    } catch (error) {
      console.error(error);
      alert("Unable to load books");
    } finally {
      setLoading(false);
    }
  }

  // Load books when component starts
  useEffect(() => {
    fetchBooks();
  }, []);

  // ==========================================
  // DELETE BOOK
  // ==========================================
  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete book"
        );
      }

      alert("Book deleted successfully");

      fetchBooks();
    } catch (error) {
      alert(error.message);
    }
  }

  // ==========================================
  // EDIT BOOK
  // ==========================================
  function handleEdit(book) {
    setEditingBook(book);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  // ==========================================
  // BOOK SAVED
  // ==========================================
  function handleBookSaved() {
    setEditingBook(null);
    fetchBooks();
  }

  // ==========================================
  // CANCEL EDIT
  // ==========================================
  function handleCancelEdit() {
    setEditingBook(null);
  }

  // ==========================================
  // SEARCH
  // ==========================================
  const filteredBooks = books.filter((book) => {
    const search = searchTerm.toLowerCase();

    return (
      book.title.toLowerCase().includes(search) ||
      book.author.toLowerCase().includes(search) ||
      book.category.toLowerCase().includes(search)
    );
  });

  // ==========================================
  // STATISTICS
  // ==========================================
  const totalBooks = books.length;

  const totalQuantity = books.reduce(
    (total, book) => total + Number(book.quantity),
    0
  );

  const totalValue = books.reduce(
    (total, book) =>
      total +
      Number(book.price) *
        Number(book.quantity),
    0
  );

  return (
  <div className="app">

    {/* ================= HEADER ================= */}
    <header className="header">
      <div className="header-content">

        <div className="brand">
          <div className="brand-icon">
            📚
          </div>

          <div>
            <h1>Book Management System</h1>
            <p>Manage your library collection easily</p>
          </div>
        </div>

        <div className="header-badge">
          <span className="status-dot"></span>
          Library Dashboard
        </div>

      </div>
    </header>


    {/* ================= MAIN ================= */}
    <main className="container">

      {/* ================= WELCOME ================= */}
      <section className="welcome-section">

        <div>
          <span className="welcome-label">
            LIBRARY OVERVIEW
          </span>

          <h2>
            Your Books at a Glance
          </h2>

          <p>
            Track your books, quantities and total collection value
            from one place.
          </p>
        </div>

        <div className="welcome-icon">
          📖
        </div>

      </section>


      {/* ================= STATISTICS ================= */}
      <section className="stats">

        <div className="stat-card stat-primary">

          <div className="stat-top">
            <div className="stat-icon">
              📚
            </div>

            <span className="stat-label">
              TITLES
            </span>
          </div>

          <div className="stat-content">
            <h3>Total Titles</h3>

            <p>{totalBooks}</p>
          </div>

          <div className="stat-footer">
            <span>Unique books</span>
            <span>→</span>
          </div>

        </div>


        <div className="stat-card stat-cyan">

          <div className="stat-top">
            <div className="stat-icon">
              📦
            </div>

            <span className="stat-label">
              STOCK
            </span>
          </div>

          <div className="stat-content">
            <h3>Total Quantity</h3>

            <p>{totalQuantity}</p>
          </div>

          <div className="stat-footer">
            <span>Books available</span>
            <span>→</span>
          </div>

        </div>


        <div className="stat-card stat-green">

          <div className="stat-top">
            <div className="stat-icon">
              ₹
            </div>

            <span className="stat-label">
              VALUE
            </span>
          </div>

          <div className="stat-content">
            <h3>Total Value</h3>

            <p>₹{totalValue}</p>
          </div>

          <div className="stat-footer">
            <span>Collection worth</span>
            <span>→</span>
          </div>

        </div>

      </section>


      {/* ================= ADD / EDIT BOOK ================= */}
      <section className="management-section">

        <div className="section-heading">

          <div className="section-heading-icon">
            ➕
          </div>

          <div>
            <h2>
              Manage Books
            </h2>

            <p>
              Add a new book or update an existing book.
            </p>
          </div>

        </div>

        <BookForm
          onBookSaved={handleBookSaved}
          editingBook={editingBook}
          onCancelEdit={handleCancelEdit}
        />

      </section>


      {/* ================= SEARCH ================= */}
      <section className="search-section">

        <div className="search-heading">

          <div>
            <h2>
              Find a Book
            </h2>

            <p>
              Search by title, author or category
            </p>
          </div>

          <div className="search-count">
            {filteredBooks.length}
          </div>

        </div>

        <div className="search-box">

          <span className="search-icon">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />

          {searchTerm && (
            <span className="search-active">
              Searching
            </span>
          )}

        </div>

      </section>


      {/* ================= BOOKS ================= */}
      <section className="books-section">

        <div className="books-header">

          <div className="books-title">

            <div className="books-icon">
              📚
            </div>

            <div>
              <h2>
                Your Books
              </h2>

              <p>
                Manage your complete collection
              </p>
            </div>

          </div>


          <div className="books-count">

            <strong>
              {filteredBooks.length}
            </strong>

            <span>
              {filteredBooks.length === 1
                ? "Book"
                : "Books"}
            </span>

          </div>

        </div>


        {/* ================= BOOK LIST ================= */}

        {loading ? (

          <div className="loading">

            <div className="loading-spinner"></div>

            <h3>
              Loading your books
            </h3>

            <p>
              Please wait while we fetch your collection...
            </p>

          </div>

        ) : (

          <BookList
            books={filteredBooks}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

        )}

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="app-footer">

        <div>
          <span className="footer-logo">
            📚
          </span>

          <strong>
            Book Management System
          </strong>
        </div>

        <span>
          Manage • Organize • Discover
        </span>

      </footer>

    </main>
  </div>
);
}

export default App;

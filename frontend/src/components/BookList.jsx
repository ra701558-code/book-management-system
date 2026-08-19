import BookItem from "./BookItem";

function BookList({ books, onEdit, onDelete }) {
  if (books.length === 0) {
    return (
      <div className="no-books">
        <p>No books found.</p>
      </div>
    );
  }

  return (
    <div className="book-list">
      {books.map((book) => (
        <BookItem
          key={book.id}
          book={book}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default BookList;

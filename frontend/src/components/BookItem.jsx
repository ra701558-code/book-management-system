function BookItem({ book, onEdit, onDelete }) {
  return (
    <div className="book-card">
      <div className="book-info">
        <h3>{book.title}</h3>

        <p>
          <strong>Author:</strong> {book.author}
        </p>

        <p>
          <strong>Category:</strong> {book.category}
        </p>

        <p>
          <strong>Price:</strong> ₹{book.price}
        </p>

        <p>
          <strong>Quantity:</strong> {book.quantity}
        </p>
      </div>

      <div className="book-actions">
        <button
          className="btn-edit"
          onClick={() => onEdit(book)}
        >
          Edit
        </button>

        <button
          className="btn-delete"
          onClick={() => onDelete(book.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default BookItem;

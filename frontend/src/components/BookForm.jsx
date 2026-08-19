import { useEffect, useState } from "react";

const API_URL = "https://book-management-system-vris.onrender.com/api/books";

function BookForm({ onBookSaved, editingBook, onCancelEdit }) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    price: "",
    quantity: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title,
        author: editingBook.author,
        category: editingBook.category,
        price: editingBook.price,
        quantity: editingBook.quantity
      });
    } else {
      setFormData({
        title: "",
        author: "",
        category: "",
        price: "",
        quantity: ""
      });
    }
  }, [editingBook]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !formData.title ||
      !formData.author ||
      !formData.category ||
      formData.price === "" ||
      formData.quantity === ""
    ) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      const url = editingBook
        ? `${API_URL}/${editingBook.id}`
        : API_URL;

      const method = editingBook ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: formData.title,
          author: formData.author,
          category: formData.category,
          price: Number(formData.price),
          quantity: Number(formData.quantity)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      alert(
        editingBook
          ? "Book updated successfully"
          : "Book added successfully"
      );

      setFormData({
        title: "",
        author: "",
        category: "",
        price: "",
        quantity: ""
      });

      onBookSaved();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-container">
      <h2>
        {editingBook ? "Edit Book" : "Add New Book"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Book Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter book title"
          />
        </div>

        <div className="form-group">
          <label>Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Enter author name"
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Enter category"
          />
        </div>

        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Enter quantity"
            min="0"
          />
        </div>

        <div className="button-group">
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : editingBook
              ? "Update Book"
              : "Add Book"}
          </button>

          {editingBook && (
            <button
              type="button"
              className="btn-secondary"
              onClick={onCancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default BookForm;

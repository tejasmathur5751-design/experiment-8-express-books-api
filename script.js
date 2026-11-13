var bookForm = document.getElementById("bookForm");
var bookIdInput = document.getElementById("bookId");
var titleInput = document.getElementById("title");
var authorInput = document.getElementById("author");
var yearInput = document.getElementById("year");
var submitBtn = document.getElementById("submitBtn");
var cancelBtn = document.getElementById("cancelBtn");
var formTitle = document.getElementById("formTitle");
var bookList = document.getElementById("bookList");
var searchInput = document.getElementById("searchInput");

// Default book data for the collection
var defaultBooks = [
 { id: 1, title: "Introduction to Algorithms", author: "Thomas H. Cormen", year: 2022 },
 { id: 2, title: "Clean Code", author: "Robert C. Martin", year: 2008 },
 { id: 3, title: "Web Technologies", author: "Gaurav Bisht", year: 2024 },
 { id: 4, title: "Database System Concepts", author: "Abraham Silberschatz", year: 2019 }
];

var books = JSON.parse(localStorage.getItem("book_collection")) || defaultBooks;

function saveBooks() {
 localStorage.setItem("book_collection", JSON.stringify(books));
}

function renderBooks() {
 var search = searchInput.value.toLowerCase().trim();
 var filtered = books.filter(function (b) {
  return b.title.toLowerCase().includes(search) || b.author.toLowerCase().includes(search);
 });

 bookList.innerHTML = "";

 if (filtered.length === 0) {
  bookList.innerHTML = "<p style='color:#aaa;text-align:center;'>No books found.</p>";
  return;
 }

 filtered.forEach(function (book) {
  var card = document.createElement("div");
  card.className = "book-card";

  card.innerHTML =
   '<div class="book-info">' +
    '<h4>' + book.title + '</h4>' +
    '<p>by ' + book.author + (book.year ? ' (' + book.year + ')' : '') + '</p>' +
   '</div>' +
   '<div class="book-actions">' +
    '<button class="btn-edit" onclick="editBook(' + book.id + ')">Edit</button>' +
    '<button class="btn-delete" onclick="deleteBook(' + book.id + ')">Delete</button>' +
   '</div>';

  bookList.appendChild(card);
 });
}

// Add or update book
bookForm.addEventListener("submit", function (e) {
 e.preventDefault();

 var title = titleInput.value.trim();
 var author = authorInput.value.trim();
 var year = yearInput.value ? parseInt(yearInput.value) : "";
 var id = bookIdInput.value;

 if (!title || !author) {
  alert("Please enter title and author.");
  return;
 }

 if (id) {
  var numId = parseInt(id);
  books = books.map(function (b) {
   return b.id === numId ? { id: numId, title: title, author: author, year: year } : b;
  });
 } else {
  var newId = books.length > 0 ? Math.max.apply(null, books.map(function (b) { return b.id; })) + 1 : 1;
  books.unshift({ id: newId, title: title, author: author, year: year });
 }

 saveBooks();
 renderBooks();
 resetForm();
});

// Edit a book — fill form fields
window.editBook = function (id) {
 var book = books.find(function (b) { return b.id === id; });
 if (!book) return;

 bookIdInput.value = book.id;
 titleInput.value = book.title;
 authorInput.value = book.author;
 yearInput.value = book.year || "";

 formTitle.textContent = "Edit Book";
 submitBtn.textContent = "Update Book";
 cancelBtn.style.display = "inline-block";
};

// Delete a book
window.deleteBook = function (id) {
 if (confirm("Delete this book from the collection?")) {
  books = books.filter(function (b) { return b.id !== id; });
  saveBooks();
  renderBooks();
 }
};

cancelBtn.addEventListener("click", resetForm);

function resetForm() {
 bookIdInput.value = "";
 titleInput.value = "";
 authorInput.value = "";
 yearInput.value = "";
 formTitle.textContent = "Add a Book";
 submitBtn.textContent = "Add Book";
 cancelBtn.style.display = "none";
}

searchInput.addEventListener("input", renderBooks);

// Initial render
renderBooks();

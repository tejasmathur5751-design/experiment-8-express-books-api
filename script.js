// DOM Elements
var bookForm = document.getElementById("bookForm");
var bookIdInput = document.getElementById("bookId");
var titleInput = document.getElementById("title");
var authorInput = document.getElementById("author");
var categorySelect = document.getElementById("category");
var yearInput = document.getElementById("year");
var submitBtn = document.getElementById("submitBtn");
var cancelBtn = document.getElementById("cancelBtn");
var formTitle = document.getElementById("formTitle");
var bookList = document.getElementById("bookList");
var searchInput = document.getElementById("searchInput");
var totalBooksCount = document.getElementById("totalBooksCount");
var deptFilterButtons = document.querySelectorAll("#deptFilters .filter-btn");

// Console elements
var jsonOutput = document.getElementById("jsonOutput");
var responseStatusBadge = document.getElementById("responseStatusBadge");
var responseEndpointLabel = document.getElementById("responseEndpointLabel");
var testButtons = document.querySelectorAll(".test-btn");

// Initial College Library Book Collection
var defaultBooks = [
  {
    id: 1,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen, Charles E. Leiserson",
    category: "Computer Science",
    year: 2022,
    status: "Available"
  },
  {
    id: 2,
    title: "Web Technologies & Design",
    author: "Gaurav Bisht & Faculty",
    category: "Data Science",
    year: 2024,
    status: "Available"
  },
  {
    id: 3,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Software Engineering",
    year: 2008,
    status: "Available"
  },
  {
    id: 4,
    title: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell, Peter Norvig",
    category: "AI & Machine Learning",
    year: 2020,
    status: "Available"
  },
  {
    id: 5,
    title: "Database System Concepts",
    author: "Abraham Silberschatz, Henry F. Korth",
    category: "Data Science",
    year: 2019,
    status: "Available"
  }
];

// Persistent state
var books = JSON.parse(localStorage.getItem("university_library_books")) || defaultBooks;
var selectedDept = "All";

function saveBooks() {
  localStorage.setItem("university_library_books", JSON.stringify(books));
}

// Render Book Cards
function renderBooks() {
  var search = searchInput.value.toLowerCase().trim();

  var filtered = books.filter(function (book) {
    var matchesDept = selectedDept === "All" || book.category === selectedDept;
    var matchesSearch =
      book.title.toLowerCase().includes(search) ||
      book.author.toLowerCase().includes(search) ||
      book.category.toLowerCase().includes(search);
    return matchesDept && matchesSearch;
  });

  totalBooksCount.textContent = books.length;
  bookList.innerHTML = "";

  if (filtered.length === 0) {
    bookList.innerHTML = '<p class="empty-state">No books found matching criteria.</p>';
    return;
  }

  filtered.forEach(function (book) {
    var card = document.createElement("div");
    var deptSlug = book.category.replace(/[^a-zA-Z0-9]/g, "-");
    card.className = "book-card dept-" + deptSlug;

    card.innerHTML =
      '<div class="book-info">' +
        '<h4>' + book.title + '</h4>' +
        '<p class="book-author">by <strong>' + book.author + '</strong></p>' +
        '<div class="book-meta">' +
          '<span class="badge badge-dept">' + book.category + '</span>' +
          (book.year ? '<span class="badge badge-year">' + book.year + '</span>' : '') +
          '<span class="badge badge-status">' + (book.status || "Available") + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="book-actions">' +
        '<button class="btn-sm btn-edit" onclick="editBook(' + book.id + ')">Edit</button>' +
        '<button class="btn-sm btn-delete" onclick="deleteBook(' + book.id + ')">Delete</button>' +
      '</div>';

    bookList.appendChild(card);
  });
}

// Add or Update Book
bookForm.addEventListener("submit", function (e) {
  e.preventDefault();

  var title = titleInput.value.trim();
  var author = authorInput.value.trim();
  var category = categorySelect.value;
  var year = yearInput.value.trim() ? parseInt(yearInput.value) : new Date().getFullYear();
  var id = bookIdInput.value;

  if (!title || !author) {
    alert("Please enter title and author!");
    return;
  }

  if (id) {
    // Update existing book
    var numId = parseInt(id);
    books = books.map(function (b) {
      if (b.id === numId) {
        return { id: numId, title: title, author: author, category: category, year: year, status: b.status || "Available" };
      }
      return b;
    });
    resetForm();
  } else {
    // Add new book
    var newId = books.length > 0 ? Math.max.apply(null, books.map(function (b) { return b.id; })) + 1 : 1;
    books.unshift({
      id: newId,
      title: title,
      author: author,
      category: category,
      year: year,
      status: "Available"
    });
    resetForm();
  }

  saveBooks();
  renderBooks();
});

// Edit Mode
window.editBook = function (id) {
  var book = books.find(function (b) { return b.id === id; });
  if (!book) return;

  bookIdInput.value = book.id;
  titleInput.value = book.title;
  authorInput.value = book.author;
  categorySelect.value = book.category;
  yearInput.value = book.year || "";

  formTitle.textContent = "Edit Book Details";
  submitBtn.textContent = "Update Book";
  cancelBtn.style.display = "inline-block";

  document.getElementById("form-section").scrollIntoView({ behavior: "smooth" });
};

// Reset Form
cancelBtn.addEventListener("click", resetForm);

function resetForm() {
  bookIdInput.value = "";
  titleInput.value = "";
  authorInput.value = "";
  yearInput.value = "";
  categorySelect.value = "Computer Science";

  formTitle.textContent = "Add Book to Catalog";
  submitBtn.textContent = "+ Add Book";
  cancelBtn.style.display = "none";
}

// Delete Book
window.deleteBook = function (id) {
  if (confirm("Are you sure you want to remove this book from the catalog?")) {
    books = books.filter(function (b) { return b.id !== id; });
    saveBooks();
    renderBooks();
  }
};

// Search Listener
searchInput.addEventListener("input", renderBooks);

// Department Filter Tabs
deptFilterButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    deptFilterButtons.forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");
    selectedDept = btn.getAttribute("data-dept");
    renderBooks();
  });
});

// Interactive REST API Console Runner
testButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    var action = btn.getAttribute("data-action");
    if (action === "getAll") {
      responseStatusBadge.className = "http-badge get";
      responseStatusBadge.textContent = "STATUS: 200 OK";
      responseEndpointLabel.textContent = "ENDPOINT: GET /books";
      jsonOutput.textContent = JSON.stringify(books, null, 2);
    } else if (action === "getOne") {
      var sample = books[0] || { message: "No books found" };
      responseStatusBadge.className = "http-badge get";
      responseStatusBadge.textContent = "STATUS: 200 OK";
      responseEndpointLabel.textContent = "ENDPOINT: GET /books/" + (sample.id || 1);
      jsonOutput.textContent = JSON.stringify(sample, null, 2);
    } else if (action === "samplePost") {
      var newSample = {
        id: 99,
        title: "Deep Learning Foundations",
        author: "Ian Goodfellow & Yoshua Bengio",
        category: "AI & Machine Learning",
        year: 2026,
        status: "Available"
      };
      responseStatusBadge.className = "http-badge post";
      responseStatusBadge.textContent = "STATUS: 201 CREATED";
      responseEndpointLabel.textContent = "ENDPOINT: POST /books";
      jsonOutput.textContent = JSON.stringify(newSample, null, 2);
    } else if (action === "sampleDelete") {
      responseStatusBadge.className = "http-badge delete";
      responseStatusBadge.textContent = "STATUS: 200 OK";
      responseEndpointLabel.textContent = "ENDPOINT: DELETE /books/5";
      jsonOutput.textContent = JSON.stringify({ message: "Book ID 5 successfully deleted from catalog", deletedId: 5 }, null, 2);
    }
  });
});

// Initial Render
renderBooks();

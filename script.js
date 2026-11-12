const bookForm = document.getElementById('bookForm');
const bookIdInput = document.getElementById('bookId');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const yearInput = document.getElementById('year');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const formTitle = document.getElementById('formTitle');
const bookList = document.getElementById('bookList');

let defaultBooks = [
    { id: 1, title: 'Clean Code', author: 'Robert C. Martin', year: 2008 },
    { id: 2, title: 'The Pragmatic Programmer', author: 'Andrew Hunt & David Thomas', year: 1999 },
    { id: 3, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', year: 2009 }
];

let localBooks = JSON.parse(localStorage.getItem('bookCollection')) || defaultBooks;

async function fetchBooks() {
    try {
        const response = await fetch('/books');
        if (response.ok) {
            const data = await response.json();
            renderBooks(data);
            return;
        }
    } catch (err) {}

    renderBooks(localBooks);
}

function renderBooks(books) {
    bookList.innerHTML = '';

    if (!books || books.length === 0) {
        bookList.innerHTML = '<p>No books in the collection yet. Add one above!</p>';
        return;
    }

    books.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `
            <div class="book-info">
                <h3>${book.title}</h3>
                <p>by <strong>${book.author}</strong> ${book.year ? '(' + book.year + ')' : ''}</p>
            </div>
            <div class="book-actions">
                <button class="btn-sm btn-edit" onclick="startEdit(${book.id})">Edit</button>
                <button class="btn-sm btn-delete" onclick="deleteBook(${book.id})">Delete</button>
            </div>
        `;
        bookList.appendChild(card);
    });
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const id = bookIdInput.value;
    const bookData = {
        title: titleInput.value.trim(),
        author: authorInput.value.trim(),
        year: yearInput.value ? parseInt(yearInput.value) : ''
    };

    if (!bookData.title || !bookData.author) return;

    let apiWorked = false;
    try {
        if (id) {
            const res = await fetch(`/books/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookData)
            });
            if (res.ok) apiWorked = true;
        } else {
            const res = await fetch('/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookData)
            });
            if (res.ok) apiWorked = true;
        }
    } catch (err) {}

    if (!apiWorked) {
        if (id) {
            localBooks = localBooks.map(b => b.id === parseInt(id) ? { ...b, ...bookData } : b);
        } else {
            const newId = localBooks.length > 0 ? Math.max(...localBooks.map(b => b.id)) + 1 : 1;
            localBooks.push({ id: newId, ...bookData });
        }
        localStorage.setItem('bookCollection', JSON.stringify(localBooks));
    }

    resetForm();
    fetchBooks();
}

function startEdit(id) {
    const book = localBooks.find(b => b.id === id);
    if (!book) return;

    bookIdInput.value = book.id;
    titleInput.value = book.title;
    authorInput.value = book.author;
    yearInput.value = book.year || '';

    formTitle.textContent = 'Edit Book';
    submitBtn.textContent = 'Update Book';
    cancelBtn.style.display = 'inline-block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteBook(id) {
    if (!confirm('Are you sure you want to delete this book?')) return;

    let apiWorked = false;
    try {
        const res = await fetch(`/books/${id}`, { method: 'DELETE' });
        if (res.ok) apiWorked = true;
    } catch (err) {}

    if (!apiWorked) {
        localBooks = localBooks.filter(b => b.id !== id);
        localStorage.setItem('bookCollection', JSON.stringify(localBooks));
    }

    fetchBooks();
}

function resetForm() {
    bookForm.reset();
    bookIdInput.value = '';
    formTitle.textContent = 'Add a Book';
    submitBtn.textContent = 'Add Book';
    cancelBtn.style.display = 'none';
}

bookForm.addEventListener('submit', handleFormSubmit);
cancelBtn.addEventListener('click', resetForm);

fetchBooks();

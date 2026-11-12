const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

let books = [
    { id: 1, title: 'Clean Code', author: 'Robert C. Martin', year: 2008 },
    { id: 2, title: 'The Pragmatic Programmer', author: 'Andrew Hunt & David Thomas', year: 1999 },
    { id: 3, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', year: 2009 }
];

app.get('/books', (req, res) => {
    res.json(books);
});

app.get('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = books.find(b => b.id === bookId);

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
});

app.post('/books', (req, res) => {
    const { title, author, year } = req.body;

    if (!title || !author) {
        return res.status(400).json({ message: 'Title and author are required' });
    }

    const newBook = {
        id: books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1,
        title,
        author,
        year: year ? parseInt(year) : ''
    };

    books.push(newBook);
    res.status(201).json(newBook);
});

app.put('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const index = books.findIndex(b => b.id === bookId);

    if (index === -1) {
        return res.status(404).json({ message: 'Book not found' });
    }

    const { title, author, year } = req.body;

    books[index] = {
        ...books[index],
        title: title || books[index].title,
        author: author || books[index].author,
        year: year ? parseInt(year) : books[index].year
    };

    res.json(books[index]);
});

app.delete('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const index = books.findIndex(b => b.id === bookId);

    if (index === -1) {
        return res.status(404).json({ message: 'Book not found' });
    }

    books.splice(index, 1);
    res.json({ message: 'Book deleted successfully' });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

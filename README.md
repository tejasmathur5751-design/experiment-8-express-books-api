# Experiment 8: Books Collection RESTful API

A web application and RESTful API built with Node.js and Express.js for managing a book collection with full CRUD operations.

## Features
- Interactive Book Collection interface (`index.html`) to view, add, edit, and delete books
- RESTful API endpoints for managing the book collection

## Endpoints
- `GET /books` - Retrieve all books in the collection
- `GET /books/:id` - Retrieve a single book by ID
- `POST /books` - Add a new book (JSON body: `title`, `author`, `year`)
- `PUT /books/:id` - Update a book by ID (JSON body: `title`, `author`, `year`)
- `DELETE /books/:id` - Delete a book by ID

## How to Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the Express server:
   ```bash
   npm start
   ```
3. Open `http://localhost:3000` in your web browser. You can also view `index.html` directly.

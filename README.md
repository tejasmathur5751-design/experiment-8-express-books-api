# Experiment 8: Books Collection RESTful API

A simple RESTful API built with Node.js and Express.js for managing a book collection with CRUD operations.

## Endpoints
- `GET /books` - Retrieve all books
- `GET /books/:id` - Retrieve a single book by ID
- `POST /books` - Add a new book (JSON body: `title`, `author`)
- `PUT /books/:id` - Update a book by ID (JSON body: `title`, `author`)
- `DELETE /books/:id` - Delete a book by ID

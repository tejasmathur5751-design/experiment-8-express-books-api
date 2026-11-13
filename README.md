# Web Design Experiment 8: Central Library Book REST API

A full-stack RESTful API and interactive client application built with Node.js and Express.js for managing a college departmental book collection with CRUD operations.

## Features
- **Semantic Project Layout**: Responsive top navigation bar, header banner, quick stats bar, department filters, and footer.
- **RESTful Endpoints Supported**:
  - `GET /books`: Retrieve full collection of library books
  - `GET /books/:id`: Fetch specific book record by numeric ID
  - `POST /books`: Register a new book with JSON request body (`title`, `author`, `category`, `year`)
  - `PUT /books/:id`: Update book details by ID
  - `DELETE /books/:id`: Remove a book from the catalog
- **Interactive REST API Console**: In-browser test suite for testing `GET`, `POST`, and `DELETE` requests with live formatted JSON responses.
- **Client Catalog**: Real-time search, department filtering, and persistent storage via `localStorage`.

## Files
- `index.html` - Complete library portal layout, documentation table, and interactive API console
- `style.css` - Clean student-style CSS with HTTP method badges and code console
- `script.js` - Client-side state manager and REST API simulation runner
- `server.js` - Node.js Express.js backend server implementing all RESTful routes
- `package.json` - Node.js project configuration and dependencies

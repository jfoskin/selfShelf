# SelfShelf

SelfShelf is a full-stack reading tracker built with Express, EJS, MongoDB, and Mongoose. It lets you create, view, update, and delete books, plus register and log in with username/password authentication.

## Features

- Browse all books in a library view
- Add new books
- Edit and delete books
- Register and log in with JWT authentication
- View a profile page with the current book being read
- Password validation on registration

## Tech Stack

- Node.js
- Express
- EJS
- MongoDB
- Mongoose
- JWT
- bcrypt
- method-override

## Prerequisites

- Node.js installed
- MongoDB running locally or a MongoDB Atlas connection string

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root with the required variables:

```env
PORT=3000
DATABASEURL=your_mongodb_connection_string
JWTSECRET=your_jwt_secret
EXPIRE=1d
```

3. Start the app:

```bash
npm start
```

## Available Routes

### Page routes

- `GET /` - Home page
- `GET /books` - List all books
- `GET /books/new` - New book form
- `GET /books/:id` - Show one book
- `GET /books/:id/edit` - Edit book form
- `GET /register` - Register page
- `GET /login` - Login page
- `GET /profile` - Profile page

### API routes

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Log in and receive a JWT
- `GET /api/profile` - Return the logged-in user's profile data

### Book actions

- `POST /books` - Create a book
- `PUT /books/:id` - Update a book
- `DELETE /books/:id` - Delete a book

## Authentication Flow

- Users register with a username and password.
- Passwords are hashed with bcrypt before saving.
- Login returns a JWT token.
- The token is stored in `localStorage` and used to load the profile page.

## Notes

- Registration requires a password with at least 10 characters, including at least one letter and one number.
- The profile page currently displays the latest unfinished book as the current book being read.
- Error responses for auth routes use JSON so the frontend can display messages consistently.

## Project Structure

```text
models/
public/
views/
server.js
```

## License

ISC

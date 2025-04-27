const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (users.find((user) => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) return res.json(books[isbn]);
  return res.status(404).json({ message: "Book not found" });
});

public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const authorBooks = [];
  for (const book in books) {
    if (books[book].author === author) {
      authorBooks.push(books[book]);
    }
  }
  if (authorBooks.length > 0) {
    res.send(authorBooks);
  } else {
    res.status(404).send('No books found for author');
  }
});

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title));

  if (filteredBooks.length > 0) return res.status(200).json(filteredBooks);
  return res.status(404).json({ message: "Book not found" });
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const reviews = books[isbn].reviews;

  if (!books[isbn]) return res.status(404).json({ message: "Book not found" });
  return res.status(200).json({ reviews: reviews });
});

module.exports.general = public_users;

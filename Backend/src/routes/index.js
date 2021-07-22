import { Router } from 'express';
import { addBook, getOneBook, getBooks, editBook, deleteBook } from '../controllers/book_controllers.js';
import { registerUser, login, deleteUser, getAllUsers } from '../controllers/user_controller.js';
import { authenticate } from '../middlewares/verify_token.js';
import { verify_role } from '../middlewares/verify_role.js';

const router = Router();

// <<---- USER ROUTES ---->>

// Registration route
router.post('/signup', registerUser);

// Login route
router.post('/login', login);


// <<---- OWNER ONLY CAN ACCESS ---->>

// Get all users
router.get('/users', authenticate, verify_role, getAllUsers);

// Delete user
router.delete('/users/delete-user/:id', authenticate, verify_role, deleteUser);



// <<---- BOOK ROUTES ---->>

// Endpoint: Get all books
router.get("/books", authenticate, getBooks);

// Endpoint: Get a book by id
router.get("/books/:id", authenticate, getOneBook);

// Endpoint: Add book
router.post("/books/add-book", authenticate, addBook);

// Endpoint: Modify a book's details
router.patch("/books/update-book/:id", authenticate, editBook);

// // Endpoint: Delete a book by id
router.delete("/books/delete-book/:id", authenticate, deleteBook);


export default router;
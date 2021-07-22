import { log } from "console";
import { Book } from "../model/book_schema.js";
import { User } from "../model/user_schema.js";

// Adding book to the db -- REWRITE THIS TO WORK WITH REQ.USER
export const addBook = async (req, res) => {

  // Checking if all fields are filled
  if(![req.body.title, req.body.author, req.body.category, req.body.publication_year].every(Boolean)) {
    return res.status(400).json({
      status: "Failed", 
      message: "Please fill all fields!"
    });
  }

  // Extract filled values
  let { title, author, category, publication_year: year } = req.body;

  title = title.toLowerCase();

  try {
    // Extract current user's id
    const { _id } = req.user;

    // Fetch user whose details match id, and populate its books
    const foundUser = await User.findOne({ _id }).populate("books");

    // Check if book title already exists
    const isBookExist = foundUser.books.some(book => {
      console.log("TITLE ", book.title)
      return book.title === title

    });

    // If book already exists...
    if(isBookExist) return res.status(401).json({
      status: "Failed",
      message: `You already have a book titled: ${title}.`
    })

    const newBook = new Book({
      title,
      author,
      category,
      year
    })

    // Save new instance of book to Book collection
    const savedBook = await newBook.save();
    
    if(!savedBook) return res.status(500).json({
      status: "Failed",
      message: `Error occured. Couldn't save book.`
    })

    // Add book obj to existing books
    foundUser.books.push(newBook);

    const response = await foundUser.save();

    if(!response) {
      return res.status(500).json({
        status: "Failed",
        message: "Oops! Couldn't add book now. Please retry"
      });
    }

    return res.status(200).json({ 
      status: "Success", message: "Book added successfully!" 
    });

  } catch (error) {
    res.status(500).json({ status: "Failed", error: error.message });
  }
}

// Getting a book by id
export const getOneBook = async (req, res) => {
  
  // Extract specified book id
  const { id } = req.params;

  // Extract user id
  const { _id: userId } = req.user;

  try {
    // Find user whose books contain has given id
    const foundUser = await User.findOne({ _id: userId }).populate("books");

    if(!foundUser.length) {
      return res.status(404).json({
        status: "Failed",
        message: "No book found matching Id."
      })
    }

    // Extract books array from details of user fetched
    const { books: usersBooks } = foundUser;
    
    // Filter for book with specified id
    const foundBook = usersBooks.find(book => book._id.toString() === id);

    if(Object.keys(foundBook).length === 0) {
      return res.status(404).json({
        status: "Failed",
        message: "No book found matching Id."
      })
    }
    
    return res.status(200).json({
      status: "Success",
      data: foundBook
    })

  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      message: error.message
    })
  }
}

// Getting all books for regular user 
export const getBooks = async (req, res) => {
  let conditions = {};

  // Checking for filter queries in the url
  if(req.query.title) conditions.title = req.query.title.toLowerCase();
  if(req.query.author) conditions.author = req.query.author.toLowerCase();
  if(req.query.category) conditions.category = req.query.category.toLowerCase();
  if(req.query.year) conditions.year = req.query.year;

  // Getting user's id
  const { _id: userId } = req.user;

  try {
    // Fetch user's details from DB
    const user = await User.findOne({ _id: userId }).populate("books");
    
    // If filter queries exist...
    if(Object.keys(conditions).length !== 0) {
      // Extract key and value arrays from passed conditions
      const conditions_keys = Object.keys(conditions);
      const conditions_values = Object.values(conditions);

      // Filter through user's books for key-value pairs matching conditions
      const foundBooks = user.books.filter(book => {
        for(let i = 0; i < conditions_keys.length; i++) {
          // if(book["key, e.g category"] === "value, e.g others")
          if(book[conditions_keys[i]] === conditions_values[i]) {
            return book;
          }
        }
      });

      if(foundBooks.length === 0) {
        return res.status(400).json({ 
          status: "Failure", 
          message: "No matching book found!"
        });
      }

      return res.status(200).json({ 
        status: "Success", books: foundBooks
      });
    }


    // If no filter queries were discovered... check if user's "book" is empty
    if(user.books.length === 0) {
      return res.status(400).json({ 
        status: "Failed", 
        message: "No book found. Please add one"
      });
    }
    
    return res.status(200).json({
      status: "Success", 
      books: user.books
    });

  } catch (error) {
    return res.status(500).json({ status: "Failed", message: error.message });
  }
}

// Modifying a book's details
export const editBook = async (req, res) => {
  // Check if there is at least a new value to be updated.
  if(![req.body.title, req.body.author, req.body.category, req.body.year].some(Boolean)) {
    return res.status(400).json({
      status: "Failed",
      message: "All fields cannot be blank to update book detials"
    });
  }
  
  // Extract user's id
  const { _id: user_id } = req.user;

  // Extract to-be-searched book id
  const { id: book_id } = req.params;

  try {
    const user = await User.findOne({ _id: user_id }).populate("books");

    // Check if user has an existing book with params id
    const existingBook = user.books.some(book => book._id.toString() === book_id);

    // If no book match id
    if(!existingBook) {
      return res.status(404).json({ 
        status: "Failed",
        message: "No matching book found!"
      });
    }
    
    // Find book in db which matches id, and update
    const updatedBook = await Book.findByIdAndUpdate(
      { _id: book_id },
      req.body,
      { new: true }
    );

    // If server error occurs
    if(updatedBook.length === 0) return res.status(400).json({ 
      status: "Failed", message: "Oops! Error updating book"
    });

    console.log(updatedBook)

    return res.status(200).json({ 
      status: "Success", 
      message: "Book updated successfully", 
      data: updatedBook
    });

  } catch (error) {
    return res.status(500).json({ status: "Failed", message: error.message });
  }
}

// Deleting a book
export const deleteBook = async (req, res) => {
  // Extract user's id
  const { _id: user_id } = req.user;

  // Extract to-be-searched book id
  const { id: book_id } = req.params;

  try {
    let book_index, removedBook;

    // Find user with id
    const user = await User.findOne({ _id: user_id }).populate("book");

    // If no user found...
    if(user.length === 0 || Object.keys(user).length === 0) {
      return res.status(404).json({
        status: "Failed",
        message: "No user matching id found"
      })
    }

    // Find book matching params id, and its index
    const bookToBeDeleted = user.books.filter((book, index) => {
      if(book._id.toString() === book_id) {
        book_index = index;
        return book._id.toString() === book_id;
      }
    })

    // If empty array was returned...
    if(bookToBeDeleted.length === 0) {
      return res.status(404).json({
        status: "Failed",
        message: "No book with passed id found"
      })
    }

    // Delete book from user's books
    removedBook = user.books.splice(book_index, 1);

    // Find removed book in the Book collection
    const deletedBook = await Book.findOneAndDelete({ _id: book_id });

    // If deleting book from Book collection in db failed...
    if(Object.keys(deletedBook).length === 0) {
      return res.status(404).json({
        status: "Failed",
        message: "No user matching id found"
      })
    }

    // Save updated user data to db
    const updatedBook = await User.findByIdAndUpdate(
      { _id: user_id },
      user,
      { new: true }
    );

    // If server error occurs
    if(updatedBook.length === 0) return res.status(500).json({ 
      status: "Failed", message: "Oops! Error updating book"
    });

    return res.status(200).json({ 
      status: "Success",
      message: "Book deleted successfully",
      deleted_book: removedBook,
      updated_data: updatedBook.books
    });

  } catch (error) {
    return res.status(500).json({ status: "Failed", message: error.message });
  }
}
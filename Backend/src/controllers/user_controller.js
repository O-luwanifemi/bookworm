import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Book } from '../model/book_schema.js';
import { User } from '../model/user_schema.js';

export const registerUser = async (req, res) => {
  // Checking if all fields are filled
  if(![req.body.firstname, req.body.lastname, req.body.email, req.body.password].every(Boolean)) {
    return res.status(400).json({ status: "Failed", message: "No parameter can be empty!"});
  }

  // Fetching inputs
  const { firstname, lastname, email, password } = req.body;

  try {
    // Verifying that supplied email doesn't already belong to a user
    const existingUser = await User.findOne({ email });
    
    // If user exists, return error notice:
    if(existingUser) {
      return res.status(403).json({ 
        status: "Failed",
        message: 'User already exists. Please, log in.'
      });
    }

    // If user with same email doesn't exist, start registration
    const salt = await bcrypt.genSalt(10);

    // Generating encrypted password
    const hashedPassword = await bcrypt.hash(password, salt);

    // If Password failed to hash
    if(!hashedPassword) {
      return res.status(400).json({
        status: "Failed",
        message: "Failed to process password"
      })
    }

    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword
    });

    const response = await newUser.save();

    // DELETES SAVED PASSWORD FROM BEING VISIBLE TO THE USER. 
    delete response._doc.password;

    if(!response) {
      return res.status(500).json({ 
        status: 'Failed', 
        message: `Oops! Registration failed. Please try again.`
      });
    }

    return res.json({ 
      status: "Success",
      message: 'Account registration successful!'
    })
    
  } catch (error) {
    res.status(401).json({
      status: "Failed",
      message: error.message
    })
  }
}

export const login = async (req, res) => {

  // Checking if all fields are filled
  if(![req.body.email, req.body.password].every(Boolean)) {
    return res.status(400).json({ status: "Failed", message: "Enter your email and password!"});
  }

  const { email, password } = req.body;

  try {
    // Search database for user matching email address given
    const existingUser = await User.findOne({ email });

    if(!existingUser) {
      return res.status(404).json({ status: "Failed", message: "Invalid email address." });
    }

    // Check if password matches password stored in the db
    const isMatch = await bcrypt.compare(password, existingUser.password);

    // Prevents saved password from being visible to user
    delete res.isMatch;

    if(!isMatch) {
      return res.status(404).json({ status: "Failed", message: "Incorrect password"});
    }

    // Payload to be sent in token
    const { firstname, lastname, _id, role, books } = existingUser;

    const payload = {
      user: {
        _id,
        firstname,
        lastname,
        role,
        books
      }
    }

    // Generate token
    const token = jwt.sign(payload, process.env.SECRET, { 
      expiresIn: +process.env.EXPIRY
    });

    // If token is not generated
    if(!token) return res.status(401).json({
       status: "Failed", 
       message: "Error logging in. Could not generate token."
    });

    return res.status(200).json({
      status: 'Success',
      message: "Logged in successfully",
      token: `Bearer ${token}`
    })

  } catch (error) {
    return res.status(500).json({ status: "Failed", message: error.message });
  }
}


// OWNER'S ROUTES ONLY
export const deleteUser = async (req, res) => {
  // Extract id of user to be deleted
  const { id: _id } = req.params;

  try {

    // Find and delete user with passed id
    const deletedUser = await User.findOneAndDelete({ _id });
      
    // If no user was matched searched id
    if(!Object.keys(deletedUser).length) return res.status(404).json({ 
      status: "Failed", 
      message: "No user matching id found"
    });

    // If deleted user had no books...
    if(!deletedUser.books.length) {
      return res.status(200).json({
        status: "Success", 
        message: "User deleted successfully",
        data: deletedUser
      });
    }

    // Extracting book ids from deleted user's books
    const userBooks = deletedUser.books.map(book => book._id);

    // Delete books from books db matching the array of ObjectIds
    Book.deleteMany({ _id: userBooks }, (err, result) => {

      if(err) return res.status(500).json({
        status: "Failed", 
        message: err.message
      })

      console.log(result)

      return res.status(200).json({
        status: "Success", 
        message: "User deleted successfully",
        deletedUser: deletedUser,
        deletedBooks: result
      });
    });

  } catch (error) {
    return res.status(500).json({ 
      status: "Failed", message: error.message 
    });
  }
}

export const getAllUsers = async (req, res) => {

  let conditions = {};

  // Checking for filter queries in the url
  if(req.query.firstname) conditions.firstname = req.query.firstname.toLowerCase();
  if(req.query.lastname) conditions.lastname = req.query.lastname.toLowerCase();
  if(req.query.email) conditions.email = req.query.email.toLowerCase();
  if(req.query.role) conditions.role = req.query.role.toLowerCase();
  
  try {
  
    // If filter queries exist...
    if(Object.keys(conditions).length) {
      const foundUsers = await User.find(conditions);

      if(!foundUsers.length) {
        return res.status(404).json({
          status: "Failed", 
          message: "No matching user(s) found!"
        });
      }

      return res.status(200).json({ status: "Success", data: foundUsers });
    }

    // If no filter queries were discovered...
    const foundUsers = await User.find();

    if(!foundUsers.length) return res.status(404).json({ 
      status: "Failed", 
      message: "No user found!"
    });

    return res.status(200).json({ status: "Success", data: foundUsers });

  } catch (error) {
    return res.status(500).json({ status: "Failed", message: error.message });
  }
}
# bookworm app

# REQUIREMENTS
  1. nodejs 
  2. express
  3. bcrypt
  4. cors 
  5. dotenv
  6. jsonwebtoken 
  7. mongoose
  8. nodemon (devDependency)
  9. Postman

# FEATURES
## Registered users (Regular) can:
  1. Add a book
     Request type: POST
     endpoint: '/books/add-book'
  2. Fetch all books, and be able to filter
     Request type: GET
     endpoint: '/books'
  3. Fetch a book by id
     Request type: GET
     endpoint: '/books/:id'
  4. Edit details of a book
     Request type: PATCH
     endpoint: '/books/update-book/:id'
  5. Delete a book
     Request type: DELETE
     endpoint: '/books/delete-book/:id'
## Registered users (Owner) can:
  1. Delete a user's account
  2. Delete all inventory of books

# TO-DOs
  1.  Install aforementioned packages
  2.  Update package.json to use es6 module
  3.  Setup package.json to enable use of nodemon
  4.  Create an express server in an entry js file, and affirm that server connects
  5.  Set up MongoDB database, and test to see it connect
  6.  Create individual schema for books and users in model folder
  7.  Create a registration route ('/signup'):
      - Validate given email doesn't already belong to an existing user
      - If it doesn't, create user's account
      - Hash new user's password
      - Create a token for user
      - Send token to user
      - Simulate creating a new user via postman
  8.  Create a login route ('/login'):
      - Check if given email is attached to an existing account. If it isn't return error notice.
      - Compare given password with hashed password in db
      - If there's a match, generate token for user
      - Send token to user
  9.  Create a route to add a book (add authentication)
  10. Create a route to get all books (add authentication)
  11. Create a route to get a book (add authentication)
  12. Create a route to edit a book (add authentication)
  13. Create a route to delete a book (add authentication)

# URL
  - http://localhost:1500



# body
   # main
      
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticate = async (req, res, next) => {

  // Check if there is a token
  if(!req.headers.authorization) {
    return res.status(401).json({ status: "Failed", message: "Unauthorized user"});
  }
  
  const bearerToken = req.headers.authorization.split(" ");

  try {
    // Check if token is of appropriate format
    if((bearerToken[0] !== "Bearer") && !bearerToken[1]) {
      return res.status(400).json({
        status: "Failed",
        message: "Invalid token format"
      })
    }

    const token = bearerToken[1];

    // Verify token
    const decodedToken = jwt.verify(token, process.env.SECRET);
    
    // If token verification failed
    if(!decodedToken) {
      return res.status(401).json({
        status: "Failed",
        message: "Invalid authorization token. Please login"
      });
    }

    // Assign user to req object
    req.user = decodedToken.user;

    // If all things pass, allow user proceed
    next();
    
  } catch (error) {
    return res.status(500).json({ status: "Error", message: error.message });
  }
}
import { User } from '../model/user_schema.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const seedOwner = async () => {
  const user = {
    firstname: process.env.OWNER_FIRSTNAME,
    lastname: process.env.OWNER_LASTNAME,
    email: process.env.OWNER_EMAIL,
    password: process.env.OWNER_PASSWORD,
    role: process.env.ROLE
  }

  const { firstname, lastname, email, password, role } = user;

  try {
    const existingUser = await User.findOne({ role });

    if(existingUser) {
      return "Owner account already exists!";
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const owner = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role
    });

    const response = await owner.save();

    // Prevents password from being visible
    delete response._doc.password;

    if(!response) {
      return "Oops! Couldn't create account. Something went wrong.";
    }

    console.log("Owner accounted created successfully!");

    process.exit();

  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

seedOwner();
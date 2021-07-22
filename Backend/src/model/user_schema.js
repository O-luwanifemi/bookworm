import pkg from 'mongoose';
import { types, objectIdref } from './modelsHelper/helper.js';

const { Schema, model } = pkg;
const { requiredString, requiredLowString, uniqueRequiredLowString } = types;

const userSchema = new Schema({
  firstname: requiredLowString(),
  lastname: requiredLowString(),
  email: uniqueRequiredLowString(),
  password: {
    ...requiredString(),
    min: 6
  },
  books: [ objectIdref("Book") ],
  role: {
    type: String,
    default: "regular",
    enum: [ "regular", "owner" ]
  }
}, { timestamps: true });

export const User = model("User", userSchema);
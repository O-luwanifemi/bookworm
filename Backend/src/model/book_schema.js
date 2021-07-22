import pkg from 'mongoose';

import { types } from './modelsHelper/helper.js';

const { Schema, model } = pkg;
const { requiredLowString, uniqueRequiredLowString } = types;

export const bookSchema = new Schema({
  title: uniqueRequiredLowString(),
  author: requiredLowString(),
  category: {
    ...requiredLowString(),
    enum: [ 
      "comics", 
      "fiction", 
      "science", 
      "non-ficiton", 
      "business", 
      "sports", 
      "others", 
      "finance", 
      "health", 
      "novel" 
    ]
  },
  year: {
    type: Number,
    required: true,
    min: 4
  }
}, { timestamps: true });

export const Book = model("Book", bookSchema);

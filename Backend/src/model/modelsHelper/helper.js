import mongoose from 'mongoose';

const { Schema } = mongoose;

export const types = {
  requiredString: () => ({
    type: String,
    required: true
  }),

  requiredLowString: () => ({
    type: String,
    required: true,
    lowerCase: true
  }),

  uniqueRequiredLowString: () => ({
    type: String,
    unique: true,
    required: true,
    lowerCase: true
  })
}

export const objectIdref = ref => ({
  type: Schema.Types.ObjectId,
  ref
})
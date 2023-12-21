import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // email must be uniq
  },
  password: {
    type: String,
    required: true,
  },
  avatar: String, // String is shorthand for {type: String}
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('user', userSchema);
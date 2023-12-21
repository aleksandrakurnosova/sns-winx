import mongoose from 'mongoose';
const { Schema } = mongoose;

const postSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  userName: String,
  userAvatar: String,
  postBody: {
    type: String,
    required: true,
  },
  likes: [Schema.Types.ObjectId],
  comments: [
    {
      userId: Schema.Types.ObjectId,
      userName: String,
      userAvatar: String,
      commentBody: { type: String, required: true },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('post', postSchema);
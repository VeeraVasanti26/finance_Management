import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'Please specify if it is income or expense'],
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Record = mongoose.model('Record', recordSchema);
export default Record;

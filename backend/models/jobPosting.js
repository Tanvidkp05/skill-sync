const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  datePosted: {
    type: String,
    // default: Date.now,
  },
  status: {
    type: String,
    enum: ['Open', 'Closed'],
    default: 'Open',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

// const JobPosting = mongoose.model('JobPosting', jobPostingSchema);

module.exports = jobPostingSchema;
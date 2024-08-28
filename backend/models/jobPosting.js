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
    type: [String],
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
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Open', 'Closed'],
    default: 'Open',
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter',
    required: true,
  },
  applications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
    },
  ],
});

const JobPosting = mongoose.model('JobPosting', jobPostingSchema);

module.exports = JobPosting;
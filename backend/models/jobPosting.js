const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema({
  pdfPath: { // Field for the PDF file path
    type: String,
    required: true,
  },
  userId: { // Reference to the user who uploaded the file
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  datePosted: { // Timestamp for when the PDF was uploaded
    type: Date,
    default: Date.now,
  }
});
// Create and export the JobPosting model
//const JobPosting = mongoose.model('JobPosting', jobPostingSchema);
module.exports = jobPostingSchema;

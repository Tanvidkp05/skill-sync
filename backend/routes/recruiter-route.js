const express = require('express');
const router = express.Router();
const JobPosting = require('../models/jobPosting')

// Create a new job posting
router.post('/jobs', async (req, res) => {
  const { title, description, requirements, salary, location } = req.body;
  const recruiterId = req.headers['x-recruiter-id'];

  try {
    const newJobPosting = new JobPosting({
      title,
      description,
      requirements,
      salary,
      location,
      recruiterId,
    });

    await newJobPosting.save();
    res.status(201).json(newJobPosting);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job posting' });
  }
});

// Retrieve all job postings for a recruiter
router.get('/jobs', async (req, res) => {
  const recruiterId = req.headers['x-recruiter-id'];

  try {
    const jobPostings = await JobPosting.find({ recruiterId });
    res.json(jobPostings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve job postings' });
  }
});

// Update an existing job posting
router.put('/jobs/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, requirements, salary, location, status } = req.body;

  try {
    const jobPosting = await JobPosting.findById(id);
    if (!jobPosting) {
      return res.status(404).json({ error: 'Job posting not found' });
    }

    jobPosting.title = title || jobPosting.title;
    jobPosting.description = description || jobPosting.description;
    jobPosting.requirements = requirements || jobPosting.requirements;
    jobPosting.salary = salary || jobPosting.salary;
    jobPosting.location = location || jobPosting.location;
    jobPosting.status = status || jobPosting.status;

    await jobPosting.save();
    res.json({ message: 'Job posting updated successfully', jobPosting });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job posting' });
  }
});

// Delete a job posting
router.delete('/jobs/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await JobPosting.findByIdAndDelete(id);
    res.json({ message: 'Job posting deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete job posting' });
  }
});

// Retrieve details of a specific job posting
router.get('/jobs/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const jobPosting = await JobPosting.findById(id).populate('applications');
    if (!jobPosting) {
      return res.status(404).json({ error: 'Job posting not found' });
    }
    res.json(jobPosting);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve job posting' });
  }
});

module.exports = router;

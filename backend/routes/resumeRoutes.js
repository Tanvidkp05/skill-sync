const express = require('express');
const router = express.Router();
const generateresume = require('../generateresume'); // Import the function that generates the resume

//might delete later
router.post('/generate-resume', async (req, res) => {
    console.log('Request received:', req.body); // Add this line
    try {
      const resumeData = req.body;
      const resumePdf = await generateresume(resumeData);
      res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
      res.setHeader('Content-Type', 'application/pdf');
      res.send(resumePdf);
    } catch (error) {
      console.error('Error generating resume:', error); // Add this line
      res.status(500).json({ message: 'Error generating resume' });
    }
  });
  
  module.exports = router;

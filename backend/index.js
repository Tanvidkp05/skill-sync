const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const recruiterRoutes = require('./routes/recruiter-route');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://tanvidkp05:ZaPuIbGyBzVEOVaj@job-postings.5tosd.mongodb.net/?retryWrites=true&w=majority&appName=job-postings',{
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((error) => console.error('Failed to connect to MongoDB Atlas', error));

const jobPosting=require('./models/jobPosting');

// recruiter route
app.use('/api/recruiter', recruiterRoutes);


app.listen(4000,() => {
    console.log(`Server listening on port 4000`);
  });

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jobPostingSchema=require('./models/jobPosting');

const app = express();

app.use(express.json());


const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://127.0.0.1:27017/auth', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));


    app.use(
        cors({
          origin: "http://localhost:3000",
          credentials: true
        })
      );

// Define User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    dob: { type: Date, required: true },
    mobileNumber: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// job-posting schema
const JobPosting = mongoose.model('jobpostings', jobPostingSchema);

// Registration Route
app.post('/api/auth/register', async (req, res) => {
    const { email, password, role, firstName, middleName, lastName, username, dob, mobileNumber } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email,
            password: hashedPassword,
            role,
            firstName,
            middleName,
            lastName,
            username,
            dob,
            mobileNumber,
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({ role: user.role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

// job-posting route
app.post('/api/jobpostings', async (req, res) => {
    let job=new JobPosting(req.body);
    let result= await job.save();
    res.send(result);
});

app.get('/api/jobpostings', async (req, res) => {
    try {
      const jobPostings = await JobPosting.find(); // Find all job postings in the collection
      res.status(200).json(jobPostings); // Send the fetched data as JSON response
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching job postings' }); // Handle errors
    }
  });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
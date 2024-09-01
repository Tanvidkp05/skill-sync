const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jobPostingSchema = require('./models/jobPosting');
const authenticateToken = require('./middleware/authMiddleware');
require('dotenv').config();


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
        credentials: true,
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

// Job Posting schema
const JobPosting = mongoose.model('jobpostings', jobPostingSchema);

// Registration Route
app.post('/api/auth/register', async (req, res) => {
    const { email, password, role, firstName, middleName, lastName, username, dob, mobileNumber } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({
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

        // Create JWT payload
        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        // Sign and return the token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token });
            }
        );
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
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT payload
        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        // Sign and return the token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({ token });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

// User GET Route to retrieve user data
app.get('/api/auth/user', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // Get userId from the JWT payload
        const user = await User.findById(userId).select('-password'); // Exclude the password from the response

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user data' });
    }
});

app.use('/api/jobpostings', authenticateToken);


// Job-posting route
app.post('/api/jobpostings', authenticateToken, async (req, res) => {
    const { title, description, requirements, salary, location, datePosted, status } = req.body;
    const userId = req.user.id; // Get userId from the JWT payload
    console.log(userId);
    

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });}

    try {
        const job = new JobPosting({
            title,
            description,
            requirements,
            salary,
            location,
            datePosted,
            status,
            userId
        });

        const result = await job.save();
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating job posting' });
    }
});

app.get('/api/jobpostings', authenticateToken, async (req, res) => {
    const userId = req.user.id; // Get userId from the JWT payload

    try {
        const jobPostings = await JobPosting.find({ userId }); // Find job postings for the logged-in user
        res.status(200).json(jobPostings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching job postings' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

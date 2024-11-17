const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jobPostingSchema = require('./models/jobPosting');
const authenticateToken = require('./middleware/authMiddleware');
require('dotenv').config();
const multer = require('multer');
const { PythonShell } = require('python-shell');
const path = require('path');
const pythonScriptPath = './ml/predict.py';
const { exec } = require('child_process');



// Create an Express app
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/auth', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

// CORS configuration
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

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

// Job Posting model
const JobPosting = mongoose.model('jobpostings', jobPostingSchema);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files to the 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Append timestamp to the filename
    },
});
const upload = multer({ storage: storage });

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

        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.status(201).json({ token });
        });
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

        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.status(200).json({ token });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

// User GET Route to retrieve user data
app.get('/api/auth/user', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user data' });
    }
});

// Job Posting Routes with authentication
app.use('/api/jobpostings', authenticateToken);

// Job-posting route for uploading PDF
// Job-posting route for uploading PDF
app.post('/api/jobpostings/upload', upload.single('pdfFile'), async (req, res) => {
    const userId = req.user.id;

    if (!req.file) {
        return res.status(400).json({ message: 'PDF file is required' });
    }

    try {
        console.log('User ID:', userId);
        console.log('File path:', path.resolve(req.file.path));

        const job = new JobPosting({
            title: req.file.originalname,
            userId,
            pdfPath: req.file.path
        });

        const result = await job.save();

        console.log('Job posting created:', result);

        // res.status(201).json({
        //     jobPosting: result
        // });

        // Run Python script to get prediction
        // PythonShell.run(pythonScriptPath, {
        //     args: [path.resolve(req.file.path)],
        //     pythonOptions: ['-u'],
        // }, (err, predictionResults) => {
        //     console.log("Python script executed");

        //     if (err) {
        //         console.error('Error executing Python script:', err);
        //         return res.status(500).json({ message: 'Error processing resume with ML' });
        //     }
        //     if (!predictionResults) {
        //         console.log('No output from Python script');
        //         return res.status(500).json({ message: 'No prediction received from Python script' });
        //     }

        //     console.log('Prediction results:', predictionResults);

        //     if (!predictionResults || predictionResults.length === 0) {
        //         console.log('No output from Python script');
        //         return res.status(500).json({ message: 'No prediction received from Python script' });
        //     }

        //     const predictedCategory = predictionResults[0] ? predictionResults[0] : 'No prediction';
        //     console.log('Predicted category:', predictedCategory);

        //     res.status(201).json({
        //         jobPosting: result,
        //         prediction: predictedCategory
        //     });
        // });

        const pythonScriptPath = path.resolve(__dirname, './ml/predict.py');
        const filePath = path.resolve(req.file.path);  // Ensure this is absolute path

        // Wrap the file path in quotes to handle spaces correctly
        const command = `python "${pythonScriptPath}" "${filePath}"`;
    
        exec(command, (err, stdout, stderr) => {
            if (err) {
                console.error(`exec error: ${err}`);
                return res.status(500).json({ message: 'Error executing Python script' });
            }
            // if (stderr) {
            //     console.error(`stderr: ${stderr}`);
            //     return res.status(500).json({ message: 'Python script error' });
            // }
            console.log(`stdout: ${stdout}`);
            res.status(200).json({ message: 'Python script executed successfully', result: stdout });
        });

    } catch (error) {
        console.error('Error creating job posting:', error);
        res.status(500).json({ message: 'Error creating job posting' });
    }
});



// Route to serve the PDF
app.get('/api/jobpostings/pdf/:id', async (req, res) => {
    try {
        const jobPosting = await JobPosting.findById(req.params.id);
        if (!jobPosting || !jobPosting.pdfPath) {
            return res.status(404).json({ message: 'PDF file not found' });
        }

        // Serve the file
        res.sendFile(jobPosting.pdfPath, { root: '.' }); // Adjust the root path as needed
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving PDF file' });
    }
});



// Get job postings for the logged-in user
app.get('/api/jobpostings', async (req, res) => {
    const userId = req.user.id;

    try {
        const jobPostings = await JobPosting.find({ userId });
        res.status(200).json(jobPostings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching job postings' });
    }
});

//prediction route
app.post('/api/jobpostings/predict', async (req, res) => {
    const keywords = req.body.keywords; // Assume keywords are passed from the frontend

    const options = {
        args: [JSON.stringify(keywords)]  // Convert keywords to JSON string
    };

    PythonShell.run('predict.py', options, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error during prediction' });
        }

        console.log('Predictions:', results);
        res.status(200).json({ predictions: JSON.parse(results[0]) }); // Send back predictions
    });
});


// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

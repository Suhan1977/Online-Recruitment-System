const express = require('express');
const cors = require('cors');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer Storage Setup for Physical Files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';

// ================= AUTHENTICATION ================= //

// Register User (Saves exact password you type)
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please fill in all fields.' });
    }

    try {
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email is already registered.' });
        }

        // Direct insert of the normal password
        await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
            name, email, password
        ]);

        res.status(201).json({ message: 'Registration successful! Please log in.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

// Login User (Checks exact password you type)
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password.' });
    }

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const user = rows[0];

        // Direct match of the normal password
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Login successful!',
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

// ================= JOBS ROUTES ================= //

app.get('/api/jobs', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM jobs');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching jobs.' });
    }
});

app.get('/api/jobs/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM jobs WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Job not found.' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching job.' });
    }
});

// ================= APPLICATIONS ================= //

const uploadFields = upload.fields([
    { name: 'resume', maxCount: 1 }, 
    { name: 'photo', maxCount: 1 }, 
    { name: 'signature', maxCount: 1 }
]);

app.post('/api/applications', uploadFields, async (req, res) => {
    const { job_id, applicant_name, applicant_email, age, is_18_plus, nationality } = req.body;

    if (!req.files || !req.files.resume || !req.files.photo || !req.files.signature) {
        return res.status(400).json({ message: 'Please upload all required files.' });
    }

    const resumePath = req.files.resume[0].path;
    const photoPath = req.files.photo[0].path;
    const signaturePath = req.files.signature[0].path;
    const is18 = (is_18_plus === 'true' || is_18_plus === true) ? 1 : 0;

    try {
        const query = `
            INSERT INTO applications 
            (job_id, applicant_name, applicant_email, age, is_18_plus, nationality, resume_path, photo_path, signature_path) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await db.query(query, [
            job_id, applicant_name, applicant_email, age, is18, nationality, resumePath, photoPath, signaturePath
        ]);

        res.status(201).json({ message: 'Application submitted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error submitting application.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
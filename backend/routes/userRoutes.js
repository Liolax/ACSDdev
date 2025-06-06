import { Router } from 'express';
import User from '../models/UserModel.js';
import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { sign } = jwt;
const router = Router();

// Read JWT_SECRET from environment variables only
const JWT_SECRET = process.env.JWT_SECRET;

// POST /api/users/register - Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, name } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password, and role are required.' });
    }
    if (!['buyer', 'seller'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Role must be buyer or seller.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }
    const hashedPassword = await hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, role, name });
    const savedUser = await newUser.save();
    return res.status(201).json(savedUser);
  } catch (error) {
    return res.status(500).json({ message: 'Error registering user', error });
  }
});

// POST /api/users/login - Log in a user
router.post('/login', async (req, res) => {
  try {
    // Add check for JWT_SECRET availability
    if (!JWT_SECRET) {
      return res.status(500).json({ message: 'Server configuration error.' });
    }
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ token, user });
  } catch (error) {
    return res.status(500).json({ message: 'Error logging in', error });
  }
});

// GET /api/users/:id - Fetch user details
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({ message: 'Error fetching user details', error });
  }
});

// PUT /api/users/:id - Update a user
router.put('/:id', async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: 'Error updating user', error });
  }
});

export default router;

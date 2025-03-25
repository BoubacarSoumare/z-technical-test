import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'Z-pV4q?d7!3z';

// Debug logging
console.log('Auth routes are being registered');

// Test route to verify auth router is working
router.get('/test', (req, res) => {
  res.json({ message: 'Auth router is working' });
});

// Login endpoint
router.post('/login', async (req, res) => {
  console.log('Login request received:', req.body);
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send response
    res.json({
      userId: user._id,
      token,
      preferences: user.preferences
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new user
    const user = new UserModel({
      name,
      email,
      password,
      preferences: {
        sortBy: 'lastModifiedDate',
        sortOrder: 'desc'
      }
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      userId: user._id,
      token,
      name: user.name,
      email: user.email,
      preferences: user.preferences
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating account' });
  }
});

// Generate token endpoint
router.post('/generate', (req, res) => {
  const userId = Math.random().toString(36).substring(2);
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });

  res.json({
    userId,
    token
  });
});

// Export as default
export default router;
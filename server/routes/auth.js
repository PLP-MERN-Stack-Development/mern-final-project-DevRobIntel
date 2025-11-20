import { Router } from 'express';
import User from '../models/User.js';
const router = Router();
import pkg from 'jsonwebtoken';
const { sign } = pkg;

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    const token = sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, username, email } });
  } catch (err) { res.status(400).json({ msg: err.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findOne({ email });
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ msg: 'Invalid credentials' });
    const token = sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email } });
  } catch (err) { res.status(400).json({ msg: err.message }); }
});

export default router;
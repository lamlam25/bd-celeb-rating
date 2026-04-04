import bcrypt from 'bcryptjs';
import { findUserByEmail, createUser } from '../../../lib/storage';
import { signToken } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
  
  // Check if user already exists (await the async function)
  const existingUser = await findUserByEmail(email);
  if (existingUser) return res.status(409).json({ error: 'Email already registered' });
  
  const hashed = await bcrypt.hash(password, 10);
  const user = await createUser({ name, email, password: hashed });
  const token = signToken({ id: user.id, email: user.email, name: user.name });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
}
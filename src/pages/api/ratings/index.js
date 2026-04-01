import { addRating, getRatingsByUser } from '../../../lib/storage';
import { getUserFromRequest } from '../../../lib/auth';

export default function handler(req, res) {
  const user = getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'POST') {
    const { imageId, celebrityId, celebrityName, imageNumber, rating } = req.body;
    if (!imageId || !rating) return res.status(400).json({ error: 'imageId and rating required' });
    addRating({ userId: user.id, userEmail: user.email, userName: user.name, imageId, celebrityId, celebrityName, imageNumber, rating });
    return res.json({ success: true });
  }

  if (req.method === 'GET') {
    const ratings = getRatingsByUser(user.id);
    return res.json({ ratings });
  }

  res.status(405).end();
}
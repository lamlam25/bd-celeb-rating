import { supabase } from '../../../lib/supabase';
import { getUserFromRequest } from '../../../lib/auth';

export default async function handler(req, res) {
  const user = getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  // Get all users
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, name, email, created_at')
    .order('created_at', { ascending: false });

  if (usersError) {
    console.error('Error fetching users:', usersError);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }

  // Get all ratings
  const { data: ratings, error: ratingsError } = await supabase
    .from('ratings')
    .select('*');

  if (ratingsError) {
    console.error('Error fetching ratings:', ratingsError);
    return res.status(500).json({ error: 'Failed to fetch ratings' });
  }

  // Calculate stats for each user
  const userStats = users.map(u => {
    const userRatings = ratings.filter(r => r.user_id === u.id);
    return {
      ...u,
      totalRatings: userRatings.length,
      avgRating: userRatings.length > 0
        ? (userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length).toFixed(2)
        : 0,
    };
  });

  // Calculate celebrity averages
  const celebStats = {};
  ratings.forEach(r => {
    if (!celebStats[r.celebrity_id]) {
      celebStats[r.celebrity_id] = {
        id: r.celebrity_id,
        name: r.celebrity_name,
        ratings: [],
      };
    }
    celebStats[r.celebrity_id].ratings.push(r.rating);
  });

  const celebrityAverages = Object.values(celebStats).map(c => ({
    id: c.id,
    name: c.name,
    totalRatings: c.ratings.length,
    avgRating: (c.ratings.reduce((sum, r) => sum + r, 0) / c.ratings.length).toFixed(2),
    ratingDistribution: {
      5: c.ratings.filter(r => r === 5).length,
      4: c.ratings.filter(r => r === 4).length,
      3: c.ratings.filter(r => r === 3).length,
      2: c.ratings.filter(r => r === 2).length,
      1: c.ratings.filter(r => r === 1).length,
    },
  })).sort((a, b) => b.avgRating - a.avgRating);

  res.json({
    users: userStats,
    totalUsers: users.length,
    totalRatings: ratings.length,
    celebrityAverages,
  });
}

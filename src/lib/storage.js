let users = [];
let ratings = [];

export function getUsers() { return users; }
export function findUserByEmail(email) { return users.find(u => u.email === email); }
export function createUser(user) { users.push(user); return user; }
export function getRatings() { return ratings; }
export function addRating(rating) {
  const idx = ratings.findIndex(r => r.userId === rating.userId && r.imageId === rating.imageId);
  if (idx >= 0) {
    ratings[idx] = { ...ratings[idx], ...rating, updatedAt: new Date().toISOString() };
  } else {
    ratings.push({ ...rating, createdAt: new Date().toISOString() });
  }
}
export function getRatingsByUser(userId) { return ratings.filter(r => r.userId === userId); }
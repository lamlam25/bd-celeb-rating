import { supabase } from './supabase';

// User operations
export async function getUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*');
  
  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }
  return data || [];
}

export async function findUserByEmail(email) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error) {
    // User not found is not an error we want to log
    if (error.code === 'PGRST116') return null;
    console.error('Error finding user:', error);
    return null;
  }
  
  // Convert database format to app format
  if (data) {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      password: data.password_hash,
      createdAt: data.created_at
    };
  }
  
  return data;
}

export async function createUser(user) {
  const { data, error } = await supabase
    .from('users')
    .insert([{
      name: user.name,
      email: user.email,
      password_hash: user.password
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating user:', error);
    throw error;
  }
  
  // Return in the same format as before
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    password: data.password_hash,
    createdAt: data.created_at
  };
}

// Rating operations
export async function getRatings() {
  const { data, error } = await supabase
    .from('ratings')
    .select('*');
  
  if (error) {
    console.error('Error fetching ratings:', error);
    return [];
  }
  
  // Convert database format to app format
  return (data || []).map(rating => ({
    userId: rating.user_id,
    userEmail: rating.user_email || '',
    userName: rating.user_name || '',
    imageId: rating.image_id,
    celebrityId: rating.celebrity_id,
    celebrityName: rating.celebrity_name,
    imageNumber: rating.image_number,
    rating: rating.rating,
    createdAt: rating.created_at,
    updatedAt: rating.updated_at
  }));
}

export async function addRating(rating) {
  const { data, error } = await supabase
    .from('ratings')
    .upsert({
      user_id: rating.userId,
      user_email: rating.userEmail || '',
      user_name: rating.userName || '',
      image_id: rating.imageId,
      celebrity_id: rating.celebrityId,
      celebrity_name: rating.celebrityName,
      image_number: rating.imageNumber,
      rating: rating.rating
    }, {
      onConflict: 'user_id,image_id'
    })
    .select();
  
  if (error) {
    console.error('Error adding/updating rating:', error);
    throw error;
  }
  
  return data;
}

export async function getRatingsByUser(userId) {
  const { data, error } = await supabase
    .from('ratings')
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching user ratings:', error);
    return [];
  }
  
  // Convert database format to app format
  return (data || []).map(rating => ({
    userId: rating.user_id,
    userEmail: rating.user_email || '',
    userName: rating.user_name || '',
    imageId: rating.image_id,
    celebrityId: rating.celebrity_id,
    celebrityName: rating.celebrity_name,
    imageNumber: rating.image_number,
    rating: rating.rating,
    createdAt: rating.created_at,
    updatedAt: rating.updated_at
  }));
}
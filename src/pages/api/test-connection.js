import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  try {
    // Test Supabase connection
    const { data, error } = await supabase
      .from('users')
      .select('count');
    
    if (error) {
      return res.status(500).json({ 
        status: 'error',
        message: 'Supabase connection failed',
        error: error.message,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
      });
    }
    
    res.json({ 
      status: 'success',
      message: 'Supabase connected successfully',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'error',
      message: err.message,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
    });
  }
}

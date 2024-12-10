import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('teams')
      .select('*');
    
    if (error) res.status(500).json({ error: error.message });
    else res.status(200).json(data);
  } else if (req.method === 'POST') {
    const { data, error } = await supabase
      .from('teams')
      .insert([req.body]);
    
    if (error) res.status(500).json({ error: error.message });
    else res.status(201).json(data);
  }
}
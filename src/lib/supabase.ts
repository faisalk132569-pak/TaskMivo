import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://hexotrqsbrkdnvdddxtz.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjNlNDBlMTUxLTg1MGEtNGZjNC04NGIxLTU4YmQwNWY3YjRhMiJ9.eyJwcm9qZWN0SWQiOiJoZXhvdHJxc2Jya2RudmRkZHh0eiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY5ODUzNzQ0LCJleHAiOjIwODUyMTM3NDQsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.-V7GiL1301sPk-3QdQFxByQGaSArR5NlhTiGBfDxcEE';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };
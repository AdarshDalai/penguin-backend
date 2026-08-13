const { createClient } = require('@supabase/supabase-js');
const { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } = require('./env');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('[penguin] Warning: SUPABASE_URL or SUPABASE_ANON_KEY is not set in .env');
}

const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Admin client initialized with Service Role Key for privileged auth operations
const supabaseAdmin = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

function createScopedClient(token) {
  return createClient(
    SUPABASE_URL || 'https://placeholder.supabase.co',
    SUPABASE_ANON_KEY || 'placeholder-key',
    {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

module.exports = {
  supabase,
  supabaseAdmin,
  createScopedClient,
};

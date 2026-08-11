/**
 * User Model definition representing auth.users entity structure in Supabase DB.
 */
const UserModel = {
  tableName: 'auth.users',
  fields: {
    id: 'UUID PRIMARY KEY',
    email: 'TEXT UNIQUE',
    encrypted_password: 'TEXT',
    email_confirmed_at: 'TIMESTAMPTZ',
    phone: 'TEXT',
    raw_app_meta_data: 'JSONB',
    raw_user_meta_data: 'JSONB',
    is_super_admin: 'BOOLEAN',
    role: 'TEXT',
    aud: 'TEXT',
    banned_until: 'TIMESTAMPTZ',
    deleted_at: 'TIMESTAMPTZ',
    last_sign_in_at: 'TIMESTAMPTZ',
    created_at: 'TIMESTAMPTZ',
    updated_at: 'TIMESTAMPTZ',
  },
};

module.exports = UserModel;

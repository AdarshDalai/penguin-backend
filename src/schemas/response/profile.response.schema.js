/**
 * Response formatter for profile data.
 */

function formatProfileResponse(profile) {
  if (!profile) return null;
  return {
    id: profile.id,
    email: profile.email || null,
    display_name: profile.display_name || null,
    avatar_url: profile.avatar_url || null,
    phone: profile.phone || null,
    bio: profile.bio || null,
    website: profile.website || null,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
  };
}

module.exports = {
  formatProfileResponse,
};

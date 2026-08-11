const openapiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Penguin Express Backend API',
    version: '1.0.0',
    description: 'Complete API documentation for Penguin Backend powered by Supabase Auth and Express.',
  },
  tags: [
    { name: 'auth', description: 'Supabase User Authentication endpoints' },
    { name: 'admin-auth', description: 'Supabase Admin Authentication endpoints' },
    { name: 'profile', description: 'User profile CRUD endpoints' },
    { name: 'storage', description: 'Supabase Storage endpoints' },
    { name: 'health', description: 'Health check endpoints' },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['health'],
        summary: 'Health check',
        description: 'Returns service health status.',
        responses: { 200: { description: 'Healthy' } },
      },
    },
    '/auth/signup': {
      post: {
        tags: ['auth'],
        summary: 'Sign up user',
        description: 'Registers a new user via Supabase Auth (email/password or phone/password).',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'user@example.com' },
                  password: { type: 'string', example: 'password123' },
                  phone: { type: 'string', example: '+1234567890' },
                  options: { type: 'object' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'User created' }, 400: { description: 'Validation error' } },
      },
    },
    '/auth/signin': {
      post: {
        tags: ['auth'],
        summary: 'Sign in with Password',
        description: 'Authenticates user with email/phone and password.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'user@example.com' },
                  password: { type: 'string', example: 'password123' },
                },
                required: ['password'],
              },
            },
          },
        },
        responses: { 200: { description: 'Authenticated' }, 401: { description: 'Invalid credentials' } },
      },
    },
    '/auth/signin-otp': {
      post: {
        tags: ['auth'],
        summary: 'Sign in with OTP / Magic Link',
        description: 'Sends a magic link or SMS OTP to user.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'user@example.com' },
                  phone: { type: 'string', example: '+1234567890' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'OTP sent' } },
      },
    },
    '/auth/verify-otp': {
      post: {
        tags: ['auth'],
        summary: 'Verify OTP',
        description: 'Verifies email or phone OTP token.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'user@example.com' },
                  phone: { type: 'string', example: '+1234567890' },
                  token: { type: 'string', example: '123456' },
                  type: { type: 'string', example: 'signup' },
                },
                required: ['token', 'type'],
              },
            },
          },
        },
        responses: { 200: { description: 'OTP verified' } },
      },
    },
    '/auth/signin-oauth': {
      post: {
        tags: ['auth'],
        summary: 'Sign in with OAuth',
        description: 'Generates OAuth redirect URL for provider (google, github, apple, etc.).',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  provider: { type: 'string', example: 'google' },
                },
                required: ['provider'],
              },
            },
          },
        },
        responses: { 200: { description: 'OAuth URL generated' } },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['auth'],
        summary: 'Sign out / Logout',
        description: 'Revokes user session using Authorization Bearer header token.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  scope: {
                    type: 'string',
                    enum: ['global', 'local', 'others'],
                    default: 'global',
                    description: 'Signout scope: global (all sessions), local (current session), or others (all except current)',
                  },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Logged out' }, 400: { description: 'Invalid scope' }, 401: { description: 'Unauthorized' } },
      },
    },
    '/auth/user': {
      get: {
        tags: ['auth'],
        summary: 'Get current user',
        description: 'Fetches user details associated with the Authorization Bearer header token.',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'User profile fetched' }, 401: { description: 'Unauthorized' } },
      },
      put: {
        tags: ['auth'],
        summary: 'Update current user',
        description: 'Updates user details (email, password, phone, user_metadata).',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                  data: { type: 'object' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'User updated' } },
      },
    },
    '/auth/reset-password': {
      post: {
        tags: ['auth'],
        summary: 'Reset password for email',
        description: 'Sends a password reset link to user email.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'user@example.com' },
                },
                required: ['email'],
              },
            },
          },
        },
        responses: { 200: { description: 'Reset email sent' } },
      },
    },
    '/auth/refresh': {
      post: {
        tags: ['auth'],
        summary: 'Refresh session',
        description: 'Obtains a new access token using a refresh token.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  refresh_token: { type: 'string', example: '<REFRESH_TOKEN>' },
                },
                required: ['refresh_token'],
              },
            },
          },
        },
        responses: { 200: { description: 'Session refreshed' } },
      },
    },
    '/auth/reauthenticate': {
      post: {
        tags: ['auth'],
        summary: 'Reauthenticate user',
        description: 'Reauthenticates user before performing sensitive actions.',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Reauthenticated' } },
      },
    },
    '/auth/admin/users': {
      get: {
        tags: ['admin-auth'],
        summary: 'Admin: List users',
        description: 'Lists all registered users (Admin/Service Role).',
        responses: { 200: { description: 'List of users' } },
      },
      post: {
        tags: ['admin-auth'],
        summary: 'Admin: Create user',
        description: 'Creates a user via admin API.',
        responses: { 201: { description: 'User created' } },
      },
    },
    '/auth/admin/users/{id}': {
      get: {
        tags: ['admin-auth'],
        summary: 'Admin: Get user by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'User details' } },
      },
      put: {
        tags: ['admin-auth'],
        summary: 'Admin: Update user by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'User updated' } },
      },
      delete: {
        tags: ['admin-auth'],
        summary: 'Admin: Delete user by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'User deleted' } },
      },
    },
    '/profiles': {
      post: {
        tags: ['profile'],
        summary: 'Create user profile',
        description: 'Creates a user profile in public.profiles.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProfileRequest' },
            },
          },
        },
        responses: { 201: { description: 'Profile created' } },
      },
    },
    '/profiles/{id}': {
      get: {
        tags: ['profile'],
        summary: 'Get profile by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Profile found' } },
      },
      put: {
        tags: ['profile'],
        summary: 'Update profile',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProfileRequest' },
            },
          },
        },
        responses: { 200: { description: 'Profile updated' } },
      },
      delete: {
        tags: ['profile'],
        summary: 'Delete profile',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Profile deleted' } },
      },
    },
    '/storage/upload': {
      post: {
        tags: ['storage'],
        summary: 'Upload file to Supabase storage bucket',
        description: 'Accepts multipart/form-data with file field and uploads to Supabase storage bucket.',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  file: { type: 'string', format: 'binary', description: 'File to upload' },
                  bucket: { type: 'string', description: 'Optional target bucket name' },
                  path: { type: 'string', description: 'Optional custom destination path in bucket' },
                },
                required: ['file'],
              },
            },
          },
        },
        responses: {
          201: { description: 'File uploaded successfully' },
          400: { description: 'Invalid upload request or missing file' },
        },
      },
    },
    '/storage/presign-url': {
      post: {
        tags: ['storage'],
        summary: 'Generate presigned URL for viewing a stored object',
        description: 'Generates a temporary signed URL for a file URL or storage object path.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  file_url: { type: 'string', example: 'https://xxx.supabase.co/storage/v1/object/public/penguin-storage/uploads/file.png' },
                  bucket: { type: 'string', example: 'penguin-storage' },
                  expires_in: { type: 'integer', example: 3600 },
                },
                required: ['file_url'],
              },
            },
          },
        },
        responses: {
          200: { description: 'Presigned URL generated' },
          400: { description: 'Invalid parameters or missing file_url' },
        },
      },
    },
  },
  components: {
    schemas: {
      ProfileRequest: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'd3b07384-d113-46a8-a534-7117c4b008d7' },
          email: { type: 'string', example: 'user@example.com' },
          display_name: { type: 'string', example: 'Adarsh Dalai' },
          avatar_url: { type: 'string', example: 'https://example.com/avatar.png' },
          phone: { type: 'string', example: '+1234567890' },
          bio: { type: 'string', example: 'Software engineer' },
          website: { type: 'string', example: 'https://example.com' },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

module.exports = openapiSpec;

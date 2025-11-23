-- Add admin roles for existing users
-- This fixes the issue where RLS policies were blocking image management operations

-- Add admin role for sami.lamqaddam@gmail.com (user_id: 9cbccf4e-aa2b-4d6e-bd5e-5260b59f9957)
INSERT INTO user_roles (user_id, role)
VALUES
  ('9cbccf4e-aa2b-4d6e-bd5e-5260b59f9957', 'admin'),
  ('98cb39fa-b68b-4747-a73c-d4aba3c6774b', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- IMPORTANT: If this migration fails with "function gen_salt does not exist",
-- you need to enable the pgcrypto extension via the Supabase Dashboard:
-- 1. Go to Database > Extensions in your Supabase dashboard
-- 2. Search for "pgcrypto" and enable it
-- Alternatively, run: CREATE EXTENSION IF NOT EXISTS pgcrypto SCHEMA extensions;

-- Enable pgcrypto extension (may already be enabled)
CREATE EXTENSION IF NOT EXISTS pgcrypto SCHEMA extensions;

-- Function to allow admins to update the password of another user
-- This requires elevated privileges, so it must be SECURITY DEFINER
-- and we must carefully check that the caller is an admin.

CREATE OR REPLACE FUNCTION public.admin_update_user_password(target_user_id UUID, new_password TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
    -- 1. Check if the executing user is an admin
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Access denied: Only admins can perform this action';
    END IF;

    -- 2. Update the user's encrypted password
    -- Using the pgcrypto extension's crypt function which Supabase uses internally
    UPDATE auth.users
    SET encrypted_password = crypt(new_password, gen_salt('bf'))
    WHERE id = target_user_id;

    -- 3. Check if update happened
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;
END;
$$;

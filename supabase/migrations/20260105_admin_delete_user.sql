
-- Function to allow admins to permanently DELETE another user
-- This requires elevated privileges (SECURITY DEFINER)

CREATE OR REPLACE FUNCTION public.admin_delete_user(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

    -- 2. Prevent deleting yourself
    IF target_user_id = auth.uid() THEN
        RAISE EXCEPTION 'Cannot delete your own account while logged in';
    END IF;

    -- 3. Delete the user from auth.users
    -- This will cascade to public.profiles and other related tables if foreign keys are set up correctly with ON DELETE CASCADE.
    -- If not, you might need to manually delete from public tables first.
    -- Assuming standard Supabase setup where profiles refs auth.users ON DELETE CASCADE usually.
    DELETE FROM auth.users
    WHERE id = target_user_id;

    -- 4. Check if deletion happened
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;
END;
$$;

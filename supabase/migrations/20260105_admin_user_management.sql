
-- 1. Function to toggle user ban status (Lock/Unlock)
CREATE OR REPLACE FUNCTION public.admin_toggle_ban_user(target_user_id UUID, ban_until TIMESTAMP WITH TIME ZONE)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if executor is admin
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    -- Prevent self-ban
    IF target_user_id = auth.uid() THEN
        RAISE EXCEPTION 'Cannot ban your own account';
    END IF;

    -- Update auth.users
    UPDATE auth.users
    SET banned_until = ban_until
    WHERE id = target_user_id;
END;
$$;

-- 2. Function to fetch users with their ban status
-- Returns a combined view of profile + auth data securely for admins
CREATE OR REPLACE FUNCTION public.admin_get_users_with_status()
RETURNS TABLE (
    id UUID,
    email TEXT,
    full_name TEXT,
    role TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    banned_until TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check permissions
    IF NOT EXISTS (SELECT 1 FROM public.profiles p_check WHERE p_check.id = auth.uid() AND p_check.role = 'admin') THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    RETURN QUERY
    SELECT 
        p.id,
        p.email,
        p.full_name,
        p.role,
        p.created_at,
        u.banned_until
    FROM public.profiles p
    JOIN auth.users u ON p.id = u.id
    WHERE p.role != 'admin' -- Only show regular users as requested
    ORDER BY p.created_at DESC;
END;
$$;

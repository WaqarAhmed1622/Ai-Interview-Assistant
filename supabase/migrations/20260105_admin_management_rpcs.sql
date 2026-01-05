-- RPC to delete an admin user (cleanup auth and public)
CREATE OR REPLACE FUNCTION public.delete_admin_user(target_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  check_role TEXT;
BEGIN
  -- 1. Check if caller is admin
  SELECT role INTO check_role FROM public.profiles WHERE id = auth.uid();
  IF check_role IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- 2. Prevent self-deletion
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot delete yourself';
  END IF;

  -- 3. Delete from auth.users (cascade should handle public.profiles)
  DELETE FROM auth.users WHERE id = target_user_id;
END;
$$;

-- RPC to update admin details (including password if provided)
CREATE OR REPLACE FUNCTION public.update_admin_user(
    target_user_id UUID,
    new_email TEXT,
    new_name TEXT,
    new_password TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  check_role TEXT;
BEGIN
  -- 1. Check if caller is admin
  SELECT role INTO check_role FROM public.profiles WHERE id = auth.uid();
  IF check_role IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- 2. Update profile name
  UPDATE public.profiles
  SET full_name = new_name
  WHERE id = target_user_id;

  -- 3. Update auth email
  UPDATE auth.users
  SET email = new_email,
      updated_at = now()
  WHERE id = target_user_id;

  -- 4. Update password if provided
  IF new_password IS NOT NULL AND new_password <> '' THEN
    UPDATE auth.users
    SET encrypted_password = crypt(new_password, gen_salt('bf'))
    WHERE id = target_user_id;
  END IF;
END;
$$;

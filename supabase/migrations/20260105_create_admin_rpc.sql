-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- RPC to create a new admin user
-- Only callable by existing admins
CREATE OR REPLACE FUNCTION public.create_new_admin(
    new_email TEXT,
    new_password TEXT,
    new_name TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
  check_role TEXT;
BEGIN
  -- 1. Check if caller is admin
  SELECT role INTO check_role FROM public.profiles WHERE id = auth.uid();
  
  IF check_role IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Access denied: Only admins can create new admins';
  END IF;

  -- 2. Verify email doesn't exist
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = new_email) THEN
    RAISE EXCEPTION 'User with this email already exists';
  END IF;

  -- 3. Generate new ID
  new_id := gen_random_uuid();

  -- 4. Insert into auth.users
  -- NOTE: We use the default instance_id '00000000-0000-0000-0000-000000000000'
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_id,
    'authenticated',
    'authenticated',
    new_email,
    crypt(new_password, gen_salt('bf')),
    now(), -- Auto-confirm
    jsonb_build_object('full_name', new_name),
    now(),
    now(),
    '',
    '',
    '',
    ''
  );

  -- 5. The trigger `on_auth_user_created` will likely run and create a 'user' profile.
  -- We wait a moment or just update immediately. Triggers run in the same transaction.
  -- So we can simply Update the role to 'admin' now.
  
  -- Wait, depending on trigger timing, the row might not be visible yet if it's AFTER INSERT?
  -- Triggers are synchronous. So after INSERT returns, the trigger has run.
  
  UPDATE public.profiles
  SET role = 'admin'
  WHERE id = new_id;

  RETURN new_id;
END;
$$;

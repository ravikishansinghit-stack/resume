-- Make handle_new_user trigger resilient so auth user creation doesn't fail when profile insert errors
-- Timestamp-based migration file: 2025-11-07

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Try to create a profile for the new auth user.
  -- If insertion fails for any reason (RLS, constraints), catch the error and log a NOTICE
  -- so that user creation in auth.users won't be aborted.
  BEGIN
    INSERT INTO public.profiles (user_id, full_name, email)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
      NEW.email
    );
  EXCEPTION WHEN unique_violation THEN
    -- Profile already exists; just log and continue
    RAISE NOTICE 'handle_new_user: profile already exists for user %', NEW.id;
  WHEN OTHERS THEN
    -- Log the error but don't abort user creation
    RAISE NOTICE 'handle_new_user: suppressed error for user %: %', NEW.id, SQLERRM;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

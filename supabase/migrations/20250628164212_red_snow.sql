/*
  # Add Demo Data for New Users

  1. Modify the handle_new_user function to create demo data
    - Add 2 sample addresses
    - Add 2 sample payment cards
    - This will make demos easier and more realistic

  2. Sample Data
    - Home and Work addresses
    - Personal and Business cards
    - Realistic but fake data for demos
*/

-- Update the handle_new_user function to include demo data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Create the profile
  INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', ''),
    NOW(),
    NOW()
  );

  -- Add sample addresses for demo purposes
  INSERT INTO public.saved_addresses (user_id, name, first_name, last_name, address_line_1, city, state, zip_code, phone, is_default)
  VALUES 
    (
      NEW.id,
      'Details 1',
      COALESCE(SPLIT_PART(COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', 'John Doe'), ' ', 1), 'John'),
      COALESCE(SPLIT_PART(COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', 'John Doe'), ' ', 2), 'Doe'),
      '123 Main Street',
      'San Francisco',
      'CA',
      '94102',
      '(555) 123-4567',
      true
    ),
    (
      NEW.id,
      'Details 2',
      COALESCE(SPLIT_PART(COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', 'John Doe'), ' ', 1), 'John'),
      COALESCE(SPLIT_PART(COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', 'John Doe'), ' ', 2), 'Doe'),
      '456 Business Ave, Suite 200',
      'New York',
      'NY',
      '10001',
      '(555) 987-6543',
      false
    );

  -- Add sample payment cards for demo purposes
  INSERT INTO public.saved_cards (user_id, name, card_brand, last_four, expiry_month, expiry_year, cardholder_name, is_default)
  VALUES 
    (
      NEW.id,
      'Card 1',
      'Visa',
      '4242',
      '12',
      '2028',
      COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', 'John Doe'),
      true
    ),
    (
      NEW.id,
      'Card 2',
      'Mastercard',
      '5555',
      '08',
      '2027',
      COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', 'John Doe'),
      false
    );

  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Could not create demo data for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Drop existing restrictive SELECT policy
DROP POLICY IF EXISTS "Anyone can read products" ON public.products;

-- Drop existing restrictive INSERT policy
DROP POLICY IF EXISTS "Authenticated users can create products" ON public.products;

-- Create permissive SELECT policy for everyone
CREATE POLICY "Anyone can read products"
ON public.products FOR SELECT
USING (true);

-- Create permissive INSERT policy for everyone (no user_id check)
CREATE POLICY "Anyone can insert products"
ON public.products FOR INSERT
WITH CHECK (true);

-- Make user_id nullable so anon inserts work
ALTER TABLE public.products ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.products ALTER COLUMN user_id SET DEFAULT null;

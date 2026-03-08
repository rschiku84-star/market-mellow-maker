
-- Drop existing restrictive SELECT policies on products
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
DROP POLICY IF EXISTS "Users can view their own products" ON public.products;

-- Drop existing restrictive INSERT/UPDATE/DELETE policies and recreate as permissive
DROP POLICY IF EXISTS "Users can create their own products" ON public.products;
DROP POLICY IF EXISTS "Users can update their own products" ON public.products;
DROP POLICY IF EXISTS "Users can delete their own products" ON public.products;

-- Anyone can read all products (permissive)
CREATE POLICY "Anyone can read products"
ON public.products FOR SELECT
USING (true);

-- Only authenticated users can create products (permissive)
CREATE POLICY "Authenticated users can create products"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update only their own products (permissive)
CREATE POLICY "Users can update own products"
ON public.products FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Users can delete only their own products (permissive)
CREATE POLICY "Users can delete own products"
ON public.products FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

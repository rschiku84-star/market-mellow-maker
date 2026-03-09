-- Add offer_amount column to products table for fixed discount offers
ALTER TABLE public.products ADD COLUMN offer_amount numeric DEFAULT NULL;

-- Add UPDATE policy for anonymous users (to allow editing sample products)
DROP POLICY IF EXISTS "Users can update own products" ON public.products;
CREATE POLICY "Anyone can update products"
ON public.products FOR UPDATE
USING (true)
WITH CHECK (true);
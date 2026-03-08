-- Allow public (unauthenticated) read access to active products for storefront
CREATE POLICY "Public can view active products"
ON public.products
FOR SELECT
TO anon
USING (status = 'active');
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface ProductData {
  name: string;
  description?: string;
  price: number;
  category?: string;
  status?: string;
  images?: string[];
}

function validateProduct(data: ProductData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate name
  if (!data.name || typeof data.name !== 'string') {
    errors.push('Product name is required');
  } else if (data.name.trim().length < 2) {
    errors.push('Product name must be at least 2 characters');
  } else if (data.name.length > 200) {
    errors.push('Product name must be less than 200 characters');
  }

  // Validate price
  if (data.price === undefined || data.price === null) {
    errors.push('Price is required');
  } else if (typeof data.price !== 'number' || isNaN(data.price)) {
    errors.push('Price must be a valid number');
  } else if (data.price < 0) {
    errors.push('Price cannot be negative');
  } else if (data.price > 999999.99) {
    errors.push('Price exceeds maximum allowed value');
  }

  // Validate description (optional but limited)
  if (data.description && typeof data.description === 'string' && data.description.length > 5000) {
    errors.push('Description must be less than 5000 characters');
  }

  // Validate category
  const validCategories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Other'];
  if (data.category && !validCategories.includes(data.category)) {
    errors.push(`Category must be one of: ${validCategories.join(', ')}`);
  }

  // Validate status
  const validStatuses = ['draft', 'active', 'archived'];
  if (data.status && !validStatuses.includes(data.status)) {
    errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
  }

  // Validate images array
  if (data.images) {
    if (!Array.isArray(data.images)) {
      errors.push('Images must be an array');
    } else if (data.images.length > 10) {
      errors.push('Maximum 10 images allowed');
    } else {
      for (const url of data.images) {
        if (typeof url !== 'string' || !url.startsWith('http')) {
          errors.push('Each image must be a valid URL');
          break;
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;

    // Parse request body
    const body = await req.json();
    const { action, productId, ...productData } = body;

    // Validate product data
    const validation = validateProduct(productData as ProductData);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: 'Validation failed', details: validation.errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize data
    const sanitizedData = {
      name: productData.name.trim(),
      description: productData.description?.trim() || '',
      price: Math.round(productData.price * 100) / 100, // Round to 2 decimal places
      category: productData.category || 'Other',
      status: productData.status || 'draft',
      images: productData.images || [],
      user_id: userId,
    };

    let result;

    if (action === 'create') {
      const { data, error } = await supabase
        .from('products')
        .insert(sanitizedData)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else if (action === 'update' && productId) {
      // Remove user_id from update data (shouldn't change ownership)
      const { user_id, ...updateData } = sanitizedData;
      
      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action. Use "create" or "update"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, product: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in validate-product:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});


-- Table for storing generated video records
CREATE TABLE public.generated_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  script text,
  video_url text NOT NULL DEFAULT '/sample-marketing-reel.mp4',
  thumbnail_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.generated_videos ENABLE ROW LEVEL SECURITY;

-- Users can view their own videos
CREATE POLICY "Users can view own videos"
  ON public.generated_videos FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own videos
CREATE POLICY "Users can insert own videos"
  ON public.generated_videos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own videos
CREATE POLICY "Users can delete own videos"
  ON public.generated_videos FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

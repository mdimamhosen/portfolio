-- Create table for storing visitor details
CREATE TABLE public.visitors (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    ip_address TEXT,
    user_agent TEXT,
    referrer TEXT,
    page_url TEXT,
    screen_resolution TEXT,
    language TEXT,
    timezone TEXT,
    visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    country TEXT,
    city TEXT
);

-- Enable RLS
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert visitor data (public tracking)
CREATE POLICY "Anyone can insert visitor data" 
ON public.visitors 
FOR INSERT 
WITH CHECK (true);

-- Only allow select for authenticated admin email
CREATE POLICY "Only admin can view visitors" 
ON public.visitors 
FOR SELECT 
USING (auth.jwt() ->> 'email' = 'mimam22.cse@bu.ac.bd');
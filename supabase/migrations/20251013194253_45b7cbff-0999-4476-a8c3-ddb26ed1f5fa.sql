-- Create table for mental health resources
CREATE TABLE public.mental_health_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  website TEXT,
  hours TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mental_health_resources ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view resources (public data)
CREATE POLICY "Mental health resources are viewable by everyone"
ON public.mental_health_resources
FOR SELECT
USING (true);

-- Only authenticated users can insert resources
CREATE POLICY "Authenticated users can insert resources"
ON public.mental_health_resources
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Insert some sample resources in Argentina
INSERT INTO public.mental_health_resources (name, type, address, phone, latitude, longitude, city, country, description, website, hours)
VALUES
  ('Centro de Salud Mental Buenos Aires', 'Servicios de Consejería', 'Av. Corrientes 1234, Buenos Aires', '+54 11 4123-4567', -34.603722, -58.381592, 'Buenos Aires', 'Argentina', 'Centro especializado en salud mental con profesionales capacitados', 'https://example.com', 'Lun-Vie: 9:00-18:00'),
  ('Hospital de Emergencias Psiquiátricas', 'Apoyo en Crisis 24/7', 'Av. Rivadavia 5678, Buenos Aires', '+54 11 4234-5678', -34.609722, -58.421592, 'Buenos Aires', 'Argentina', 'Atención de emergencias psiquiátricas las 24 horas', 'https://example.com', '24/7'),
  ('Fundación Ayuda Mental Córdoba', 'Servicios de Consejería', 'San Martín 890, Córdoba', '+54 351 456-7890', -31.420083, -64.188776, 'Córdoba', 'Argentina', 'Fundación dedicada a la salud mental comunitaria', 'https://example.com', 'Lun-Vie: 8:00-20:00'),
  ('Centro de Crisis Rosario', 'Apoyo en Crisis 24/7', 'Pellegrini 456, Rosario', '+54 341 567-8901', -32.944341, -60.650539, 'Rosario', 'Argentina', 'Centro de atención en crisis con guardias permanentes', 'https://example.com', '24/7'),
  ('Clínica de Bienestar Mendoza', 'Salud Médica y Mental', 'San Martín 234, Mendoza', '+54 261 678-9012', -32.889458, -68.845839, 'Mendoza', 'Argentina', 'Atención integral de salud física y mental', 'https://example.com', 'Lun-Sab: 9:00-19:00');

-- Create function to calculate distance between two points (Haversine formula)
CREATE OR REPLACE FUNCTION public.calculate_distance(
  lat1 DECIMAL,
  lon1 DECIMAL,
  lat2 DECIMAL,
  lon2 DECIMAL
)
RETURNS DECIMAL AS $$
DECLARE
  radius DECIMAL := 6371; -- Earth's radius in km
  dlat DECIMAL;
  dlon DECIMAL;
  a DECIMAL;
  c DECIMAL;
BEGIN
  dlat := radians(lat2 - lat1);
  dlon := radians(lon2 - lon1);
  
  a := sin(dlat/2) * sin(dlat/2) + 
       cos(radians(lat1)) * cos(radians(lat2)) * 
       sin(dlon/2) * sin(dlon/2);
  
  c := 2 * atan2(sqrt(a), sqrt(1-a));
  
  RETURN radius * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
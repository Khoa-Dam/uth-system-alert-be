-- Add PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add geometry column to crime_reports table
ALTER TABLE crime_reports ADD COLUMN IF NOT EXISTS geom geometry(POINT, 4326);

-- Create GIST index on geom for spatial queries
CREATE INDEX IF NOT EXISTS crime_reports_geom_gist ON crime_reports USING GIST (geom);

-- Update existing records to populate geom from lat/lng
UPDATE crime_reports 
SET geom = ST_SetSRID(ST_MakePoint(lng, lat), 4326)
WHERE lat IS NOT NULL AND lng IS NOT NULL AND geom IS NULL;


-- Create the child-photos bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('child-photos', 'child-photos', false)
ON CONFLICT (id) DO NOTHING;

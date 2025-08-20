-- add_announcement_columns.sql
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS title VARCHAR(255);
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS price VARCHAR(100);

-- modify poll_votes table

ALTER TABLE poll_votes
ADD COLUMN browser_id text NOT NULL DEFAULT 'unknown';
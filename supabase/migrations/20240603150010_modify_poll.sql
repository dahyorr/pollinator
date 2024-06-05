
ALTER TABLE poll Add COLUMN require_auth boolean NOT NULL DEFAULT false;
ALTER TABLE poll_votes DROP COLUMN browser_id;
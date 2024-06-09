CREATE OR REPLACE FUNCTION update_poll_options_vote_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the vote count for the option associated with the vote
    UPDATE poll_options
    SET votes = (SELECT COUNT(*) FROM poll_votes WHERE poll_option_id = NEW.poll_option_id)
    WHERE id = NEW.poll_option_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_poll_responses_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the vote count for the option associated with the vote
    UPDATE poll
    SET responses = (SELECT COUNT(*) FROM poll_votes WHERE poll_id = NEW.poll_id)
    WHERE id = NEW.poll_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_poll_option_vote_count_trigger
AFTER INSERT OR DELETE OR UPDATE ON poll_votes
FOR EACH ROW
EXECUTE FUNCTION update_poll_options_vote_count();

CREATE TRIGGER update_poll_responses_count_trigger
AFTER INSERT OR DELETE OR UPDATE ON poll_votes
FOR EACH ROW
EXECUTE FUNCTION update_poll_responses_count();
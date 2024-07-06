CREATE OR REPLACE FUNCTION auto_close_polls() 
RETURNS void 
LANGUAGE plpgsql 
VOLATILE 
PARALLEL SAFE 
AS $$
DECLARE 
    pollRecord RECORD;
BEGIN 
    FOR pollRecord IN
        SELECT *
        FROM poll
        WHERE closed_at IS NULL
          AND end_date IS NOT NULL
          AND end_date < NOW()
          AND status = 'open'
    LOOP
        UPDATE poll
        SET closed_at = NOW(),
            status = 'closed',
            end_date = NULL
        WHERE id = pollRecord.id;
    END LOOP;
END;
$$;

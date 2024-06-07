CREATE TABLE poll_options(
    id char(21) DEFAULT nanoid() PRIMARY KEY,
    poll_id char(21) NOT NULL,
    value text NOT NULL,
    votes numeric DEFAULT 0,
    FOREIGN KEY (poll_id) REFERENCES poll(id) ON DELETE CASCADE
);
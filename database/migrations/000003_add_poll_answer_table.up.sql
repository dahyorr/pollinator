CREATE TABLE poll_answer(
    id char(21) DEFAULT nanoid() PRIMARY KEY,
    poll_id char(21) NOT NULL,
    text text NOT NULL,
    votes int DEFAULT 0,
    FOREIGN KEY (poll_id) REFERENCES poll(id) ON DELETE CASCADE
);
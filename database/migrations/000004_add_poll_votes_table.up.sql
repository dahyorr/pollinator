CREATE TABLE poll_vote(
    id char(21) DEFAULT nanoid() PRIMARY KEY,
    poll_id char(21) NOT NULL,
    poll_answer_id char(21) NOT NULL,
    created_at timestamp DEFAULT now(),
    FOREIGN KEY (poll_id) REFERENCES poll(id) ON DELETE CASCADE,
    FOREIGN KEY (poll_answer_id) REFERENCES poll_answer(id) ON DELETE CASCADE
);
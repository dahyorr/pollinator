CREATE TABLE poll_votes(
    id char(21) DEFAULT nanoid() PRIMARY KEY,
    poll_id char(21) NOT NULL,
    poll_option_id char(21) NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp DEFAULT now(),
    FOREIGN KEY (poll_option_id) REFERENCES poll_options(id) ON DELETE CASCADE,
    FOREIGN KEY (poll_id) REFERENCES poll(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

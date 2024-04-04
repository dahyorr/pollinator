CREATE TABLE poll(
    id char(21) DEFAULT nanoid() PRIMARY KEY,
    question text NOT NULL,
    created_at timestamp DEFAULT now(),
    end_date timestamp,
    status text DEFAULT 'open'
);


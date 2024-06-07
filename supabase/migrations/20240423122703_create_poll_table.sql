CREATE TABLE poll(
    id char(21) DEFAULT nanoid() PRIMARY KEY,
    question text NOT NULL,
    created_at timestamp DEFAULT now(),
    end_date timestamp,
    user_id uuid REFERENCES auth.users(id),
    status text DEFAULT 'open',
    closed_at timestamp,
    multiple_choice boolean DEFAULT false,
    responses numeric DEFAULT 0
);


CREATE TABLE IF NOT EXISTS messages (
    id serial PRIMARY KEY,
    created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    processed boolean DEFAULT false,
    processing_delay integer NOT NULL DEFAULT 0,
    content text NOT NULL
);
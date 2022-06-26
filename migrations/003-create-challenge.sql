CREATE TABLE challenge (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    name text NOT NULL,
    flag text NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT now()
);
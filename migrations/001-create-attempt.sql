CREATE TABLE attempt (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    name text NOT NULL,
    challenge text NOT NULL,
    flag text NOT NULL,
    submitted timestamp without time zone NOT NULL DEFAULT now()
);
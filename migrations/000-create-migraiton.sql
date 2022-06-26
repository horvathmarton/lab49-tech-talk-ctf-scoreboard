CREATE TABLE migration (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    name text NOT NULL,
    migrated timestamp without time zone NOT NULL DEFAULT now()
);
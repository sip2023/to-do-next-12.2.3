-- Create the 'todos' database
CREATE DATABASE todos;

-- Connect to the 'todos' database
\c todos;

-- Create the 'todos' table
CREATE TABLE todos (
    id serial PRIMARY KEY,
    name text,
    completed boolean
);

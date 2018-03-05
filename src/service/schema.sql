DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;

CREATE TABLE users (
  username TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  fullname TEXT NOT NULL,
  CONSTRAINT username_length_ge_8 CHECK (char_length(username) >= 6)
);

CREATE TABLE sessions (
  username TEXT REFERENCES users(username),
  token TEXT PRIMARY KEY
);

INSERT INTO users VALUES (
  'tester1',
  '$2b$12$QAt.aoH5NajMWLhDhIMM1OS9BoIZW/0WM9pX4Hij7Tycja/KkR45C',
  'Test User 1'
);

INSERT INTO users VALUES (
  'tester2',
  '$2b$12$9drN5hBC8rWP7VQuJ5B3SOzoxeSCX7YcyY358aq20hN8O3JLYr3Hq',
  'Test User 2'
);

INSERT INTO users VALUES (
  'tester3',
  '$2b$12$DxdJS9h/xTp/OqA5uUVChuBB9bZAR.RXSIjfxEBD.08NJE2o8lvnW',
  'Test User 3'
);

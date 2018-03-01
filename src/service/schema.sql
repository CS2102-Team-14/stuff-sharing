CREATE TABLE users (
  username TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  fullname TEXT NOT NULL,
  CONSTRAINT username_length_ge_8 CHECK (char_length(username) >= 6)
)

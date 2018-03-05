DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS items CASCADE;

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

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  owner TEXT REFERENCES users(username),
  borrower TEXT REFERENCES users(username),
  item_name TEXT NOT NULL,
  item_price NUMERIC NOT NULL,
  item_description TEXT,
  loan_duration INTEGER NOT NULL,
  status INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT owner_not_borrower CHECK (owner <> borrower),
  CONSTRAINT price_gt_zero CHECK (item_price > 0)
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

INSERT INTO items (owner, borrower, item_name, item_price, item_description, loan_duration, status) VALUES (
  'tester1',
  'tester2',
  'Drill',
  20,
  'Can drill holes into concrete or wood.',
  10,
  0
);

INSERT INTO items (owner, borrower, item_name, item_price, item_description, loan_duration, status) VALUES (
  'tester1',
  'tester2',
  'Scissors',
  20,
  NULL,
  10,
  1
);

INSERT INTO items (owner, borrower, item_name, item_price, item_description, loan_duration, status) VALUES (
  'tester2',
  NULL,
  'Pikachu Onesie',
  15,
  'Great for sleepovers',
  7,
  0
);

INSERT INTO items (owner, borrower, item_name, item_price, item_description, loan_duration, status) VALUES (
  'tester3',
  NULL,
  'MTG Deck',
  100,
  'Sure win against anybody',
  10,
  0
);

INSERT INTO items (owner, borrower, item_name, item_price, item_description, loan_duration, status) VALUES (
  'tester3',
  NULL,
  'Beer Cooler',
  10,
  'Its a box that keeps beer cool',
  15,
  0
);

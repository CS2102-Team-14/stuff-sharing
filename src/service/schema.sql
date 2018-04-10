DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS bids CASCADE;
DROP FUNCTION IF EXISTS create_bid;
DROP FUNCTION IF EXISTS accept_bid;

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

CREATE TABLE bids (
	item_id SERIAL REFERENCES items(id),
	username TEXT REFERENCES users(username),
	amount NUMERIC NOT NULL,
  UNIQUE(item_id, username, amount)
);

CREATE FUNCTION create_bid(
	_item_id INTEGER,
	_username TEXT,
	_amount NUMERIC)
RETURNS VOID AS $$
BEGIN
	-- Check that item exists and is not on loan
	-- Check that bidder is not owner
	-- Check that new bid is larger than all existing bids
	-- Check that new bid is at least listed price
	IF NOT EXISTS(SELECT * FROM items WHERE items.id = _item_id AND items.status = 0) THEN
		RAISE EXCEPTION 'Invalid item ID';
	ELSEIF EXISTS(SELECT * FROM items WHERE items.id = _item_id AND items.owner = _username) THEN
		RAISE EXCEPTION 'Bidder must not be item owner';
	ELSEIF EXISTS(SELECT * FROM bids WHERE bids.item_id = _item_id AND bids.amount >= _amount) OR
		(SELECT item_price FROM items WHERE items.id = _item_id) > _amount THEN
		RAISE EXCEPTION 'Bid must exceed list price and all other bids';
	ELSE
		INSERT INTO bids VALUES(_item_id, _username, _amount);
	END IF;
END; $$
LANGUAGE plpgsql;

CREATE FUNCTION accept_bid(
  _item_id INTEGER,
  _owner TEXT,
  _bidder TEXT,
  _amount NUMERIC)
RETURNS VOID AS $$
BEGIN
  -- Check that item exists and is not on loan
  -- Check that owner owns the item
  -- Check that bid exists
  IF NOT EXISTS(SELECT * FROM items WHERE items.id = _item_id AND items.status = 0) THEN
    RAISE EXCEPTION 'Invalid item ID';
  ELSEIF NOT EXISTS(SELECT * FROM items WHERE items.id = _item_id AND items.owner = _owner) THEN
    RAISE EXCEPTION 'Not item owner, cannot accept bid';
  ELSEIF NOT EXISTS(SELECT * FROM bids WHERE bids.item_id = _item_id AND bids.username = _bidder AND bids.amount = _amount) THEN
    RAISE EXCEPTION 'Bid does not exist';
  ELSE
    UPDATE items SET borrower = _bidder WHERE id = _item_id;
    DELETE FROM bids WHERE item_id = _item_id;
  END IF;
END; $$
LANGUAGE plpgsql;

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

from flask import Blueprint, jsonify, request
from psycopg2 import IntegrityError

items_controller = Blueprint("items", __name__)

import app
import users

### Utility functions ###
def print_msg(msg):
	print("[%s] %s" % (__name__, msg))

### Common error responses ###
def respond_invalid_token():
	error = "Invalid session token"
	print_msg(error)
	return jsonify({"error": error})

def respond_invalid_item_id():
	error = "Invalid item id"
	print_msg(error)
	return jsonify({"error": error})

@items_controller.route("/items", methods=["GET", "POST", "PUT"])
def items():
	if request.method == "GET":
		with app.get_db().cursor() as cursor:
			try:
				cursor.execute("SELECT * FROM items")
				items = cursor.fetchall()
				return jsonify({"error": False, "items": items})
			except Exception as e:
				print_msg("%s %s" % (type(e), e))
				return jsonify({"error": "Unknown error"})
	elif request.method == "POST":
		post_data = request.get_json() or {}
		token = post_data.get("token")

		with app.get_db().cursor() as cursor:
			try:
				cursor.execute(
				"SELECT * FROM sessions WHERE token = %s",
				[str(token)])
				session = cursor.fetchone()
				if session is None:
					return respond_invalid_token()
				else:
					cursor.execute(
					"SELECT * FROM items WHERE owner = %s",
					[session[0]])
					items = cursor.fetchall()
					return jsonify({"error": False, "items": items})
			except Exception as e:
				print_msg("%s %s" % (type(e), e))
				return jsonify({"error": "Unknown error"})
	elif request.method == "PUT":
		post_data = request.get_json() or {}
		token = post_data.get("token")
		item_name = post_data.get("name")
		item_description = post_data.get("description") or None
		item_price = post_data.get("price")
		item_duration = post_data.get("duration")

		# TODO: Validation of parameters
		is_token_valid, username = users.validate_token(token)
		if is_token_valid:
			with app.get_db().cursor() as cursor:
				cursor.execute(
				"INSERT INTO items(owner,borrower,item_name,item_price,item_description,loan_duration) VALUES(%s,NULL,%s,%s,%s,%s)",
				[username,item_name, item_price, item_description, item_duration])
				cursor.connection.commit()
				print_msg("Created item")
				if cursor.rowcount == 1:
					return jsonify({"error": False})
				else:
					return respond_invalid_item_id()
		else:
			return respond_invalid_token()

@items_controller.route("/items/search", methods=["POST"])
def item_search():
	if request.method == "POST":
		post_data = request.get_json() or {}
		search = post_data.get("search") or ""

		with app.get_db().cursor() as cursor:
			try:
				cursor.execute("SELECT * FROM items WHERE item_name LIKE %s LIMIT 10",
				["%%%s%%" % search])
				items = cursor.fetchall()
				return jsonify({"error": False, "items": items})
			except Exception as e:
				print_msg("%s %s" % (type(e), e))
				return jsonify({"error": "Unknown error"})


@items_controller.route("/items/<int:item_id>", methods=["GET", "PUT"])
def item_details(item_id):
	if request.method == "GET":
		with app.get_db().cursor() as cursor:
			cursor.execute(
			"SELECT * FROM items WHERE id = %s",
			[item_id])
			item = cursor.fetchone()
			if item is None:
				return respond_invalid_item_id()
			else:
				return jsonify({"error": False, "item": item})
	elif request.method == "PUT":
		post_data = request.get_json() or {}
		token = post_data.get("token")
		item_name = post_data.get("name")
		item_description = post_data.get("description") or None
		item_price = post_data.get("price")
		item_duration = post_data.get("duration")

		# TODO: Validation of parameters
		is_token_valid, username = users.validate_token(token)
		if is_token_valid:
			with app.get_db().cursor() as cursor:
				cursor.execute(
				"UPDATE items SET item_name = %s, item_description = %s, item_price = %s, loan_duration = %s WHERE owner = %s AND id = %s",
				[item_name, item_description, item_price, item_duration, username, item_id])
				cursor.connection.commit()
				print_msg("Updated item %s" % item_id)
				if cursor.rowcount == 1:
					return jsonify({"error": False})
				else:
					return respond_invalid_item_id()
		else:
			return respond_invalid_token()

@items_controller.route("/items/delete/<int:item_id>", methods=["POST"])
def item_delete(item_id):
	if request.method == "POST":
		post_data = request.get_json() or {}
		token = post_data.get("token")

		is_token_valid, username = users.validate_token(token)
		if is_token_valid:
			with app.get_db().cursor() as cursor:
				try:
					cursor.execute("DELETE FROM items WHERE owner = %s AND id = %s",
					[username, item_id])
					cursor.connection.commit()
					if cursor.rowcount == 1:
						print_msg("Deleted item id=%d belonging to %s" % (item_id, username))
						return jsonify({"error": False})
					else:
						return respond_invalid_item_id()
				except Exception as e:
					print_msg("%s %s" % (type(e), e))
					return jsonify({"error": "Unknown error"})
		else:
			return respond_invalid_token()

@items_controller.route("/items/<int:item_id>/bid", methods=["POST"])
def item_bid(item_id):
	if request.method == "POST":
		post_data = request.get_json() or {}
		token = post_data.get("token")
		amount = post_data.get("amount")

		is_token_valid, username = users.validate_token(token)
		if is_token_valid:
			with app.get_db().cursor() as cursor:
				try:
					cursor.execute("SELECT create_bid(%s, %s, %s)", [item_id, username, amount])
					cursor.connection.commit()
					print_msg("Bid successfully created")
					return jsonify({"error": False})
				except Exception as e:
					print_msg("%s %s" % (type(e), e))
					return jsonify({"error": str(e).split("CONTEXT")[0]})
		else:
			return respond_invalid_token()

@items_controller.route("/items/<int:item_id>/bids", methods=["POST"])
def item_bids(item_id):
	if request.method == "POST":
		post_data = request.get_json() or {}
		token = post_data.get("token")

		is_token_valid, username = users.validate_token(token)
		if is_token_valid:
			with app.get_db().cursor() as cursor:
				try:
					cursor.execute("SELECT * FROM bids WHERE item_id = %s ORDER BY amount DESC", [item_id])
					bids = cursor.fetchall()
					return jsonify({"error": False, "bids": bids})
				except Exception as e:
					print_msg("%s %s" % (type(e), e))
					return jsonify({"error": "Unknown error"})
		else:
			return respond_invalid_token()

@items_controller.route("/bids", methods=["POST"])
def user_bids():
	if request.method == "POST":
		post_data = request.get_json() or {}
		token = post_data.get("token")

		is_token_valid, username = users.validate_token(token)
		if is_token_valid:
			with app.get_db().cursor() as cursor:
				try:
					cursor.execute("SELECT * FROM (SELECT item_id, username, MAX(amount) FROM bids WHERE bids.username = %s GROUP BY item_id, username) AS max_bids INNER JOIN items on max_bids.item_id = items.id",
					[username])
					bids = cursor.fetchall()
					return jsonify({"error": False, "bids": bids})
				except Exception as e:
					print_msg("%s %s" % (type(e), e))
					return jsonify({"error": "Unknown error"})
		else:
			return respond_invalid_token()

@items_controller.route("/bids/accept", methods=["POST"])
def accept_bid():
	if request.method == "POST":
		post_data = request.get_json() or {}
		token = post_data.get("token")
		item_id = post_data.get("item_id")
		bidder = post_data.get("bidder")
		amount = post_data.get("amount")

		is_token_valid, username = users.validate_token(token)
		if is_token_valid:
			with app.get_db().cursor() as cursor:
				try:
					cursor.execute("SELECT accept_bid(%s, %s, %s, %s)", [item_id, username, bidder, amount])
					cursor.connection.commit()
					print_msg("Bid successfully accepted")
					return jsonify({"error": False})
				except Exception as e:
					print_msg("%s %s" % (type(e), e))
					return jsonify({"error": str(e).split("CONTEXT")[0]})
		else:
			return respond_invalid_token()
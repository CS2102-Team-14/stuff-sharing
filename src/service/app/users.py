import bcrypt
from flask import Blueprint, jsonify, request
from psycopg2 import IntegrityError

users_controller = Blueprint("users", __name__)

import app

def print_msg(msg):
    print("[%s] %s" % (__name__, msg))

@users_controller.route("/users/register", methods=["POST"])
def users_register():
    post_data = request.get_json() or {}
    username = post_data.get("username")
    password = post_data.get("password")
    fullname = post_data.get("fullname")

    if None in [username, password, fullname]:
        error = "Missing required parameter(s)"
        print_msg(error)
        return jsonify({"error": error})

    password = str(password).encode("UTF-8")

    hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())
    with app.get_db().cursor() as cursor:
        try:
            cursor.execute(
            "INSERT INTO users VALUES (%s, %s, %s)",
            [username, hashed_password, fullname])
            cursor.connection.commit()
            print_msg("Created user (%s, %s, %s)"
            % (username, hashed_password, fullname))
            return jsonify({"error": False})
        except IntegrityError as e:
            error = "Username already exists or is too short"
            print_msg(error)
            return jsonify({"error": error})

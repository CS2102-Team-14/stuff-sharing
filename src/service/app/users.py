import bcrypt
from flask import Blueprint, jsonify, request
from psycopg2 import IntegrityError
import uuid

users_controller = Blueprint("users", __name__)

import app

### Common error responses ###
def respond_missing_params():
    error = "Missing required parameter(s)"
    print_msg(error)
    return jsonify({"error": error})

def respond_authentication_failed():
    error = "Incorrect username or password"
    print_msg(error)
    return jsonify({"error": error})

### Utility functions ###
def print_msg(msg):
    print("[%s] %s" % (__name__, msg))

@users_controller.route("/users/register", methods=["POST"])
def users_register():
    post_data = request.get_json() or {}
    username = post_data.get("username")
    password = post_data.get("password")
    fullname = post_data.get("fullname")

    if None in [username, password, fullname]:
        return respond_missing_params()

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

@users_controller.route("/users/authenticate", methods=["POST"])
def users_authenticate():
    post_data = request.get_json() or {}
    username = post_data.get("username")
    password = post_data.get("password")

    if None in [username, password]:
        return respond_missing_params()

    password = str(password).encode("UTF-8")

    with app.get_db().cursor() as cursor:
        try:
            cursor.execute(
            "SELECT password FROM users WHERE username = %s",
            [username])
            user = cursor.fetchone()
            if user is None:
                return respond_authentication_failed()
            else:
                stored_password = user[0]
                if bcrypt.hashpw(password, stored_password) == stored_password:
                    token = str(uuid.uuid4())
                    with app.get_db().cursor() as cursor:
                        cursor.execute(
                        "INSERT INTO sessions VALUES (%s, %s)",
                        [username, token])
                        cursor.connection.commit()
                        print_msg("Created session (%s, %s)" % (username, token))
                    return jsonify({"error": False, "token": token})
                else:
                    return respond_authentication_failed()
        except Exception as e:
            print_msg("%s %s" % (type(e), e))
            return respond_authentication_failed()

def validate_token(token):
    with app.get_db().cursor() as cursor:
        try:
            cursor.execute(
            "SELECT * FROM sessions WHERE token = %s",
            [str(token)])
            session = cursor.fetchone()
            if session is None:
                return False, None
            else:
                return True, session[0]
        except Exception as e:
            print_msg("%s %s" % (type(e), e))
            return False, None

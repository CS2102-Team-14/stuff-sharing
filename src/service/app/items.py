from flask import Blueprint, jsonify, request
from psycopg2 import IntegrityError

items_controller = Blueprint("items", __name__)

import app

### Utility functions ###
def print_msg(msg):
    print("[%s] %s" % (__name__, msg))

@items_controller.route("/items", methods=["GET"])
def items():
    with app.get_db().cursor() as cursor:
        try:
            cursor.execute("SELECT * FROM items")
            items = cursor.fetchall()
            return jsonify({"error": False, "items": items})
        except Exception as e:
            print_msg("%s %s" % (type(e), e))
            return jsonify({"error": "Unknown error"})

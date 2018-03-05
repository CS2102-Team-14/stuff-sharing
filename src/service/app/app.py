#!/bin/env python2

from flask import Flask, g
from flask_cors import CORS
import json
import os
import psycopg2

# Import and register application controllers
import users
import items

app = Flask(__name__)
app.register_blueprint(users.users_controller)
app.register_blueprint(items.items_controller)
CORS(app)

# REST API root gives database connection status
@app.route("/", methods=["GET"])
def index():
    return app.response_class(
        response = json.dumps({
            "database": get_db() is not None
        }),
        status = 200,
        mimetype = "application/json"
    )

### Database common functions ###

DATABASE_KEY = "postgres_db"

# Typecast database NUMERIC to float
DEC2FLOAT = psycopg2.extensions.new_type(
    psycopg2.extensions.DECIMAL.values,
    'DEC2FLOAT',
    lambda value, curs: float(value) if value is not None else None)
psycopg2.extensions.register_type(DEC2FLOAT)

@app.cli.command()
def initdb():
    print("[DB] Initializing database with schema")
    db = get_db()
    with db.cursor() as cursor:
        cursor.execute(open("../schema.sql", "r").read())
        db.commit()

def get_db():
    """Opens a new database connection if there is none yet for the current
    application context.
    """
    if not hasattr(g, DATABASE_KEY):
        db = psycopg2.connect("dbname=root user=root password=root")
        setattr(g, DATABASE_KEY, db)
        print("[DB] Connection established")
    else:
        db = getattr(g, DATABASE_KEY)
    return db

@app.teardown_appcontext
def close_db(error):
    """Closes the database again at the end of the request."""
    if hasattr(g, DATABASE_KEY):
        db = getattr(g, DATABASE_KEY)
        db.close()
        print("[DB] Connection closed")

if __name__ == '__main__':
    # Change the working directory to the script directory
    abspath = os.path.abspath(__file__)
    dname = os.path.dirname(abspath)
    os.chdir(dname)

    # Start Flask app
    app.run(debug=False, port=8080, host="0.0.0.0")

# Stuff Sharing Web Application by Team 14
TODO: Write a description and architecture of the application.

# Running the application
You will need to install docker and start the docker service. Then execute `run.sh` as root which will set up an instance of the application frontend on port 80, and application backend on port 8080.

```bash
$ sudo apt install docker
$ sudo systemctl start docker
$ sudo sh run.sh
```

If all goes well, you can navigate to http://127.0.0.1:8080/ and see a JSON response showing the status of the database connection.

# Developing the application locally

## Installing dependencies
We'll be using python Flask framework and the bcrypt module.

```bash
sudo pip install flask
sudo pip install bcrypt
```

## Configuring PostgreSQL
We first need to initialize the PostgreSQL datastore (at it's default location) in case it was not done for us on install.

```bash
# Run the following commands as user 'postgres'
$ sudo su postgres
$ initdb --locale en_US.UTF-8 -D '/var/lib/postgres/data'
```

We then need to create a role for the user which is going to interact with PostgreSQL.

```bash
$ psql --command "CREATE USER root WITH SUPERUSER PASSWORD 'root';"
```

We will use the Flask CLI to initialize the database with our schema at `src/service/schema.sql`.

```bash
$ cd service/app
$ export FLASK_APP=app.py
$ flask initdb
```

## Running the application backend
The `-B` flag tells python to not compile bytecode versions of the python scripts.

```bash
$ python -B src/service/app/app.py
```

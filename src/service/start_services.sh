#!/bin/sh

apachectl start
/etc/init.d/postgresql start
export FLASK_APP=/service/app/app.py
(cd /service/app && flask initdb)
python /service/app/app.py

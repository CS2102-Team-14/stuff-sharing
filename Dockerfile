FROM ubuntu:latest
RUN apt-get update
RUN apt-get install -y python-pip
RUN apt-get install -y apache2
RUN apt-get install -y postgresql
RUN pip install -U pip
RUN pip install -U flask
RUN pip install -U flask-cors
RUN pip install -U bcrypt
RUN pip install -U psycopg2-binary
RUN echo "ServerName localhost  " >> /etc/apache2/apache2.conf
RUN echo "$user     hard    nproc       20" >> /etc/security/limits.conf
EXPOSE 80
EXPOSE 8080
ADD ./src/service /service
ADD ./src/html /html
USER postgres
RUN /etc/init.d/postgresql start &&\
psql --command "CREATE USER root WITH SUPERUSER PASSWORD 'root';" &&\
createdb -O root root &&\
/etc/init.d/postgresql stop

USER root
CMD ["/bin/bash", "/service/start_services.sh"]

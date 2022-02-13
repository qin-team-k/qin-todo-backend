FROM mysql:8.0

RUN /bin/cp -f /etc/localtime /etc/localtime.org
RUN /bin/cp -f /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

COPY ./.my.cnf /etc/mysql/conf.d/

RUN mkdir -p /var/log/mysql
RUN chown mysql.mysql /var/log/mysql

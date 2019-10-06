#!/usr/bin/env bash

DB_USERNAME=dbuser
DB_PASSWORD=cc1234
DB_DATABASE=soen6461

echo "Enter your mysql username:"
read MYSQL_USER
echo "Enter your mysql password:"
read MYSQL_PASSWORD

MYSQL_OPT="--host=localhost --user=${MYSQL_USER} --password=${MYSQL_PASSWORD}"

echo "drop user ${DB_USERNAME};" | mysql ${MYSQL_OPT}
echo "drop database ${DB_DATABASE};;" | mysql ${MYSQL_OPT}

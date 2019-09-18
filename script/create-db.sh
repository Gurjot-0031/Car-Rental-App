#!/usr/bin/env bash

DB_USERNAME=rental
DB_PASSWORD=cc1234
DB_DATABASE=soen6461

MYSQL_OPT="--host=localhost --user=root --password="

echo "create database ${DB_DATABASE} DEFAULT CHARACTER SET utf8;" | mysql ${MYSQL_OPT}
echo "create user ${DB_USERNAME} identified by '${DB_PASSWORD}';" | mysql ${MYSQL_OPT}
echo "grant all privileges on ${DB_DATABASE}.* TO ${DB_USERNAME};" | mysql ${MYSQL_OPT}
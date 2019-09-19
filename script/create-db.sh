#!/usr/bin/env bash

DB_USERNAME=dbuser
DB_PASSWORD=cc1234
DB_DATABASE=soen6461

echo "Enter your mysql username:"
read MYSQL_USER
echo "Enter your mysql password:"
read MYSQL_PASSWORD

MYSQL_OPT="--host=localhost --user=${MYSQL_USER} --password=${MYSQL_PASSWORD}"

echo "create database ${DB_DATABASE} DEFAULT CHARACTER SET utf8;" | mysql ${MYSQL_OPT}
echo "create user ${DB_USERNAME} identified by '${DB_PASSWORD}';" | mysql ${MYSQL_OPT}
echo "grant all privileges on ${DB_DATABASE}.* TO ${DB_USERNAME};" | mysql ${MYSQL_OPT}
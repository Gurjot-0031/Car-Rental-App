#!/usr/bin/env bash

DB_USERNAME=rental
DB_PASSWORD=cc1234
DB_DATABASE=soen6461

MYSQL_OPT="--host=localhost --user=root --password="

echo "drop user ${DB_USERNAME};" | mysql ${MYSQL_OPT}
echo "drop database ${DB_DATABASE};;" | mysql ${MYSQL_OPT}

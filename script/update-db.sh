#!/usr/bin/env bash

PROJECT_DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd .. && pwd )
cd "$PROJECT_DIR"

echo "Running Flyway migrations..."
./gradlew backend:flywayMigrate || echo "Flyway migration failed"

#echo "Generating JOOQ sources..."
#./gradlew backend:generateTheJooqSchemaSource || echo "Jooq schema generation failed"

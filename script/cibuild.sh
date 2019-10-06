#!/usr/bin/env bash
set -e

PROJECT_DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd .. && pwd )
cd "$PROJECT_DIR"

./gradlew build -Pbundle-client -Pprod-build

#!/usr/bin/env bash

# change to script's directory
cd "$(dirname "$0")/eosio_docker"

if [ -e "data/initialized" ]
then
    script="./scripts/continue_blockchain.sh"
else
    script="./scripts/init_blockchain.sh"
fi

echo "=== run docker container from the eosio/eos-dev image ==="
docker run --rm --name eosio_notechain_container -d \
-p 8888:8888 -p 9876:9876 \
-v "$(pwd)"/contracts:/opt/eosio/bin/contracts \
-v "$(pwd)"/scripts:/opt/eosio/bin/scripts \
-v "$(pwd)"/data:/mnt/dev/data \
-w "/opt/eosio/bin/" eosio/eos-dev:v1.1.0 /bin/bash -c "$script"

if [ "$1" != "--nolog" ]
then
    echo "=== follow eosio_notechain_container logs ==="
    docker logs eosio_notechain_container --follow
fi

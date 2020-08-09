#!/usr/bin/env bash

set -e

home="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

echo "[setup] Import wallet private key: "
read -r pk

env_file="# Network config
ENDPOINT='https://api.s0.t.hmny.io'

# Pool config
POOL='0x8902d5f97c7992631134ced8ed8c16e4f09bfef2'

# Token A config
TOKEN_NAME1='1LINK'
TOKEN_ADDR1='0x7a791E76BF4d4f3b9B492AbB74E5108180bE6B5a'

# Token B config
TOKEN_NAME2='1SEED'
TOKEN_ADDR2='0x493c9d4362fB4FD1D0C17a6ECad08de33Fc1d8C2'

# Wallet config
PRIVATE_KEY='${pk}'
"

echo "$env_file" | tee ${home}/.env > /dev/null

echo "[setup] Complete"

/bin/bash
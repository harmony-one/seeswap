#!/usr/bin/env bash

set -e

home="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

pushd "$(pwd)" > /dev/null

cd "$home" || exit 1

if [ "$1" == "help" ]; then
  echo "Supported Commands:"
  echo "$(echo "$(ls ./cmd)" | sed "s/.js//g")"
  popd > /dev/null
  exit 0
fi

node "$home/cmd/${1}.js" "${@:2}"

popd > /dev/null


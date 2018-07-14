#!/usr/bin/env bash

# Run with sudo for port 80

while :
do
    case "$1" in
      -p)
          port="$2"
          if ! [[ "$port" =~ ^[0-9]+$ ]]
          then
              echo "invalid port"
          fi
          shift 2
          ;;
      -*)
          echo "Error: Unknown option: $1" >&2
          exit 1
          ;;
      *)  # No more options
          break
          ;;
    esac
done

# Don't like this.. assumes virtual env exists, is named venv, and is at the
# repo's top level. Should be a better way to get sudo to use the venv...
# I can think about it more later if it ever matters
DIR="$( cd -P "$( dirname "$0" )" && pwd )"
$DIR/../venv/bin/python $DIR/manage.py runmodwsgi \
    --url-alias /media /home/pi/website-sandbox/server/media \
    --user pi --group pi \
    --reload-on-changes --log-to-terminal --startup-log \
    --port ${port-80}

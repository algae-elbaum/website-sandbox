#!/usr/bin/env bash

python manage.py runmodwsgi --reload-on-changes --log-to-terminal --port 80 --user pi --group pi

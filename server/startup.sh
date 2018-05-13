#!/usr/bin/env bash

# Run with sudo for port 80

../venv/bin/python manage.py runmodwsgi --url-alias /media /home/pi/website-sandbox/server/media \
                                        --user pi --group pi \
                                        --reload-on-changes --log-to-terminal --startup-log \
                                        --port 80

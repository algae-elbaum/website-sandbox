#!/usr/bin/env bash

# Run with sudo for port 80

../venv/bin/python manage.py runmodwsgi --reload-on-changes --log-to-terminal --port 80 --user pi --group pi

#!/usr/bin/env bash

touch /var/www/html/youtube_dls/$2.status
youtube-dl $1 --extract-audio --audio-format mp3 > /var/www/html/youtube_dls/$2.status 2>&1

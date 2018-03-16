#!/usr/bin/env python
import cgi
import json
import sys, os
import string
import subprocess
import time

form = cgi.FieldStorage()
youtube_url_start = 'https://www.youtube.com/watch?v='
valid_id_chars = string.ascii_letters + string.digits + '-_'

if 'yt_url' in form:
    url = form['yt_url'].value
    vid_id = url[len(youtube_url_start):]
    valid = url.startswith(youtube_url_start) and len(vid_id) == 11
    for c in vid_id:
        valid = valid and c in valid_id_chars
    
    if valid:
        subprocess.Popen(['./yt_server_dl.sh', url, vid_id])


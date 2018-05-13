#!/usr/bin/env python
import cgi
import json
import sys, os

fake_root = '/home/pi/youtube_dls/'
true_root = '/youtube_dls/'


files = []

files = [os.path.join(fake_root, f) for f in os.listdir(fake_root) if os.path.isfile(f) and f.endswith('.mp3')]

files.sort(key=os.path.getctime, reverse=True)

files = [os.path.join(true_root, f[len(fake_root):]) for f in files]

# Give cgi what it wants
print 'Content-type: application/json'
print
json.dump(files, sys.stdout)

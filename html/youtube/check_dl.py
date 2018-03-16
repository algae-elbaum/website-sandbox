#!/usr/bin/env python
import cgi
import json
import sys, os
import time

form = cgi.FieldStorage()
youtube_url_start = 'https://www.youtube.com/watch?v='

assert 'yt_url' in form
path = form['yt_url'].value[len(youtube_url_start):] + '.status'

print 'Content-type: application/json'
print

if (not os.path.isfile(path)):
    time.sleep(.1)
if (not os.path.isfile(path)):
    print "probably invalid url"
    sys.exit()

f = open(path, 'r')
for line in f:  
    pass
f.close()
print >> sys.stderr, line
# now line is the last line in the file
if line.startswith('Deleting'):
    print  'success'
    os.remove(path)
elif line.startswith(';'):
    print 'failed'
    os.remove(path)
else:
    print 'still going'


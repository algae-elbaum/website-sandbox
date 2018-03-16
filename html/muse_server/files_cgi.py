#!/usr/bin/env python
import cgi
import json
import sys, os

form = cgi.FieldStorage()

fake_root = '/home/pi/Music'
true_root = '/home/Music'
real = ['mp3', 'mp4', 'm4a', 'flac', 'avi', 'wav']

default_curr_dir = fake_root
curr_dir = default_curr_dir
if ('c_dir' in form):
    assert form['c_dir'].value.startswith(true_root)
    curr_dir = fake_root + form['c_dir'].value[len(true_root):]


def check_f_or_d(name):
    valid_extension = False
    for n in real:
        valid_extension |= n in name
    # First check if the extension is valid, and if it isn't then make sure
    # it's a directory
    if not valid_extension and not os.path.isdir(name):
        return False
    # Then make sure it matches the search parameter
    else:
        return ('s_key' not in form or form['s_key'].value.lower() in name.lower())


dirs = []
files = []

r, ds, fs = os.walk(curr_dir).next()
for d in ds:
    full_dir = os.path.join(true_root + r[len(fake_root):], d)
    if check_f_or_d(os.path.join(r, d)):
        dirs.append(full_dir)

for f in fs:
    full_file = os.path.join(true_root + r[len(fake_root):], f)
    if check_f_or_d(os.path.join(r, f)):
        files.append(full_file)

files.sort()

if curr_dir != default_curr_dir:
    dirs = [true_root + curr_dir[:curr_dir.rfind('/')][len(fake_root):]] + dirs  # ahahahaha

print >> sys.stderr, curr_dir

json_out = {'dirs' : dirs, 'files' : files}


# Give cgi what it wants
print 'Content-type: application/json'
print
json.dump(json_out, sys.stdout)

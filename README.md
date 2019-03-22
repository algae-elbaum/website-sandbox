# website-sandbox

My personal website! algaelbaum.me

Sandbox as in a playground.

Homepage with basic information. Side pages with whatever dumb projects I end
up doing.


To do the thing:
```
$ virtualenv -p python3 venv  # At top level (website-sandbox/)
$ . venv/bin/activate
$ pip install -r requirements.txt
$ cd server
$ sudo ./startup.sh [-p port]  # sudo optional, required for port 80 (default)

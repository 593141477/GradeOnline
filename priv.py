
from flask import request, Response, session
from urlparse import urlparse
import re
import teacher

pattern = re.compile(r'/(\w+)\b')

def check_auth(username, password):
    m = pattern.match(request.url)
    if m:
        mod = m.group(1)
        if session['priv'] == mod:
            return True
        if mod == 'teacher':
            t = teacher.auth(username, password)
            if t:
                session['priv'] == mod
            return t
        elif mod == 'admin':
            pass
            return True


    return False

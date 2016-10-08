
from flask import request, Response, session
from urlparse import urlparse
import re
import teacher
from config import ADMIN_USERNAME, ADMIN_PASSWD
from config import CLIENT_USERNAME, CLIENT_PASSWD

pattern = re.compile(r'^/(\w+)\b')

def check_auth(username, password):
    m = pattern.match(request.path)
    if m:
        mod = m.group(1)
        if ('priv' in session):
            if session['priv'] == mod:
                return 0
            else:
                return 3 #Already logged in
        if mod == 'teacher':
            t = teacher.auth(username, password)
            if t:
                session['priv'] = mod
                session['teacher_id'] = t
                return 0
            return 2
        elif mod == 'client':
            if username==CLIENT_USERNAME and password==CLIENT_PASSWD:
                session['priv'] = mod
                return 0
            return 2
        elif mod == 'admin':
            if username==ADMIN_USERNAME and password==ADMIN_PASSWD:
                session['priv'] = mod
                return 0
            return 2
        else:
            return -1

    return -1

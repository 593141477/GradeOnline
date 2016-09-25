
from flask import request, Response, session
from urlparse import urlparse
import re
import teacher

pattern = re.compile(r'^/(\w+)\b')

def check_auth(username, password):
    m = pattern.match(request.path)
    if m:
        mod = m.group(1)
        if ('priv' in session) and session['priv'] == mod:
            return True
        if mod == 'teacher':
            t = teacher.auth(username, password)
            if t:
                session['priv'] = mod
                session['teacher_id'] = t
            return t
        elif mod == 'admin':
            session['priv'] = mod
            return True

    return False

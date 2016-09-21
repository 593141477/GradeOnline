#!/usr/bin/env python
from functools import wraps
from flask import request, Response
from flask import Flask
app = Flask(__name__)

import api
import teacher

@app.route('/')
def hello_world():
    return 'Hello, World!'


def authenticate():
    """Sends a 401 response that enables basic auth"""
    return Response(
    'Could not verify your access level for that URL.\n'
    'You have to login with proper credentials', 401,
    {'WWW-Authenticate': 'Basic realm="Login Required"'})

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or not priv.check_auth(auth.username, auth.password):
            return authenticate()
        return f(*args, **kwargs)
    return decorated

@app.route('/teacher/grades')
@requires_auth
def teacher_grades():
    return render_template('grades.html')

@app.route('/teacher/load_grades.json')
@requires_auth
def teacher_load_grades():
    return render_template('secret_page.html')

@app.route('/teacher/submit', methods=['POST'])
@requires_auth
def teacher_submit():
    return render_template('secret_page.html')

@app.route('/admin/classes/<int:class_id>')
@requires_auth
def admin_classes(class_id):
    return render_template('secret_page.html')

@app.route('/admin/classes/update', methods=['POST'])
@requires_auth
def admin_class_update():
    return render_template('secret_page.html')

@app.route('/admin/teachers')
@requires_auth
def admin_teachers():
    return render_template('teachers.html', teachers=teacher.getTeachers())

@app.route('/admin/teachers/update', methods=['POST'])
@requires_auth
def admin_teacher_update():
    return teacher.update();

@app.route('/admin/schedule')
@requires_auth
def admin_schedule():
    return render_template('secret_page.html')

@app.route('/admin/schedule/update', methods=['POST'])
@requires_auth
def admin_schedule_update():
    return render_template('secret_page.html')

app.run()
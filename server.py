#!/usr/bin/env python
import os
from functools import wraps
from flask import request, Response, render_template, send_from_directory
from flask import Flask, session, redirect, url_for

app = Flask(__name__)

# import api
import priv
import teacher
import students
import schedule
import grades

def handle_static(res, name):
    # if not app.config['DEBUG']:
    #     abort(403)
    #     return
    return send_from_directory(os.path.dirname(os.path.realpath(__file__))+'/static/'+res, name)

@app.route('/js/<path:name>')
def static_js(name):
    return handle_static('js',name)
@app.route('/css/<path:name>')
def static_css(name):
    return handle_static('css',name)

@app.route('/')
def hello_world():
    return redirect('./teacher/grades/*')

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
        if not auth:
            return authenticate()
        ret = priv.check_auth(auth.username, auth.password)
        if ret==2:
            return authenticate()
        elif ret != 0:
            return Response('No authorization', 403)
        return f(*args, **kwargs)
    return decorated

@app.route('/teacher/grades/<string:Id>')
@requires_auth
def teacher_grades(Id='*'):
    s = schedule.wrapQueryResult(schedule.getScheduleForTeacher(session['teacher_id']))
    g = grades.getGradesByScheduleId(Id) if Id!='*' else {}
    t = teacher.getTeacherById(session['teacher_id'])
    return render_template('grades.html',grades=g,schedule_list=s,schedule_id=Id,teacher=t)

@app.route('/teacher/grades/update', methods=['POST'])
@requires_auth
def teacher_submit():
    grades.bulkUpdate()
    return 'success'

@app.route('/admin/')
@requires_auth
def admin_index():
    return render_template('admin.html')

@app.route('/admin/classes/<string:class_id>')
@requires_auth
def admin_classes(class_id='*'):
    class_list = students.getClassList()
    l = students.wrapQueryResult(students.getStudents(class_id)) if class_id!='*' else []
    return render_template('classes.html',class_list=class_list,students = l, class_id = class_id)

@app.route('/admin/classes/update', methods=['POST'])
@requires_auth
def admin_class_update():
    students.bulkUpdate()
    return 'success'

@app.route('/admin/classes/new', methods=['POST'])
@requires_auth
def admin_class_new():
    students.new()
    return 'success'

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
    s = schedule.wrapQueryResult(schedule.getSchedule())
    t = teacher.getTeachers()
    c = students.getClassList()
    return render_template('schedule.html', class_list = c, teacher_list = t, schedule=s)

@app.route('/admin/schedule/update', methods=['POST'])
@requires_auth
def admin_schedule_update():
    schedule.bulkUpdate()
    s = schedule.wrapQueryResult(schedule.getSchedule())
    t = teacher.getTeachers()
    c = students.getClassList()
    return render_template('schedule.html', class_list = c, teacher_list = t, schedule=s)

app.secret_key = 'super secret key 233'
app.config['DEBUG']=True
app.run()

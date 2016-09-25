from flask import request, Response, session
import logging
from database import getTable
from bson.objectid import ObjectId
import schedule, students

TABLE_NAME = 'grades'

def bulkUpdate():
    tab = getTable(TABLE_NAME)
    post = request.get_json()
    sch = schedule.getOneSchedule(post['schedule_id'])
    assert sch['teacher']==ObjectId(session['teacher_id'])
    stu = students.getStudentIds(sch['class_id'])
    glist = []
    for item in post['data']:
        sid = item['student_id']
        assert sid in stu
        assert not(item['grade'] is None)
        v = float(item['grade'])
        assert v>=0 and v<=100
        glist.append({'student_id': sid, 'grade': v})
    tab.update({
        'class_id': sch['class_id'],
        'date': sch['date'], 
        'teacher': sch['teacher']},
        {'$set':{'grade_list': glist}},
        upsert=True)

def getGradesByScheduleId(schedule_id):
    tab = getTable(TABLE_NAME)
    sch = schedule.getOneSchedule(schedule_id)
    assert sch['teacher']==ObjectId(session['teacher_id'])
    slist = []
    for i in students.getStudents(sch['class_id'])[0]['students']:
        slist.append({
            'student_name': i['student_name'],
            'student_id': i['student_id']
            })
    g = tab.find_one({
        'class_id': sch['class_id'],
        'date': sch['date'], 
        'teacher': sch['teacher']
        })
    if g:
        for item in g['grade_list']:
            sid = item['student_id']
            for j in range(len(slist)):
                if slist[j]['student_id']==sid:
                    slist[j]['grade'] = item['grade']
    return slist

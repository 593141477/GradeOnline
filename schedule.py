from flask import request,redirect
import logging
from database import getTable
from bson.objectid import ObjectId
import re

TABLE_NAME = 'schedule'

def getSchedule():
    tab = getTable(TABLE_NAME)
    return tab.find()

def getScheduleForTeacher(teacher_id):
    tab = getTable(TABLE_NAME)
    return tab.find({'teacher': ObjectId(teacher_id)})

def getOneSchedule(schedule_id):
    tab = getTable(TABLE_NAME)
    return tab.find_one({'_id': ObjectId(schedule_id)})

def wrapQueryResult(result):
    l = []
    for s in result:
        s['_id']=str(s['_id'])
        s['teacher']=str(s['teacher'])
        l.append(s)
    return l

def bulkUpdate():
    errorNum=0
    succeNum=0
    tab = getTable(TABLE_NAME)
    post = request.get_json()
    print(post)
    for s in post:
        s['teacher']=ObjectId(s['teacher'])
        s.pop('$$hashKey',None)
    ret = tab.insert_many(post)
    assert ret.acknowledged
    tab.remove()
    ret = tab.insert_many(post)
    assert ret.acknowledged
    

def getAllstudents():
    tab = getTable(TABLE_NAME)
    return tab.find()

def getClassList():
    tab = getTable(TABLE_NAME)
    class_list = set()
    result = tab.find()
    for mClass in result:
        class_list.add(mClass['class_id'])
    class_list = list(class_list)
    return class_list

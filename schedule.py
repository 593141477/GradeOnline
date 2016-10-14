# -*- coding: utf-8 -*-
from flask import request,redirect
import logging
from database import getTable
from bson.objectid import ObjectId
import re

TABLE_NAME = 'schedule'

WEEKDAYS = {s:i for i,s in enumerate([u"一",u"二",u"三",u"四",u"五",u"六",u"日"])}

def getSchedule():
    tab = getTable(TABLE_NAME)
    return tab.find()

def getScheduleForTeacher(teacher_id):
    tab = getTable(TABLE_NAME)
    return tab.find({'teacher': ObjectId(teacher_id)})

def getScheduleByClass(class_id):
    tab = getTable(TABLE_NAME)
    return tab.find({'class_id': ObjectId(class_id)})

def getOneSchedule(schedule_id):
    tab = getTable(TABLE_NAME)
    return tab.find_one({'_id': ObjectId(schedule_id)})

def wrapQueryResult(result):
    l = []
    for s in result:
        s['_id']=str(s['_id'])
        s['teacher']=str(s['teacher'])
        s['class_id']=str(s['class_id'])
        if 'content' in s:
            s['content']=s['content']
        l.append(s)
    return l

def bulkUpdate():
    errorNum=0
    succeNum=0
    tab = getTable(TABLE_NAME)
    post = request.get_json()
    l = []
    for s in post:
        l.append({
            'teacher': ObjectId(s['teacher']),
            'date': s['date'],
            'class_id': ObjectId(s['class_id']),
            'content': s['content'] if ('content' in s) else ''
            })
    ret = tab.insert_many(l)
    assert ret.acknowledged
    tab.remove()
    ret = tab.insert_many(l)
    assert ret.acknowledged
    
def removeSchByClassId(cid):
    tab = getTable(TABLE_NAME)
    tab.remove({'class_id': ObjectId(cid)})

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

def sortByDate(schList):
    def cmpDate(a, b):
        da = a['date']
        db = b['date']
        if da['week'] != db['week']:
            return da['week'] < db['week']
        if da['dow'] != db['dow']:
            return WEEKDAYS[da['dow']] < WEEKDAYS[db['dow']]
        return da['cod'] < db['cod']
    schList.sort(cmp=cmpDate)

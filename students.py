from flask import request,redirect
import logging
from database import getTable
from bson.objectid import ObjectId
import re

TABLE_NAME = 'classes'

def getStudents(class_id):
    tab = getTable(TABLE_NAME)
    return tab.find({'_id': ObjectId(class_id)})

def getStudentIds(class_id):
    tab = getTable(TABLE_NAME)
    l=[]
    for i in tab.find_one({'_id': ObjectId(class_id)})['students']:
        l.append(i['student_id'])
    return l

def new():
    name = request.form['name']
    assert len(name)>0
    tab = getTable(TABLE_NAME)
    tab.insert({'name': name, 'students': []})

def bulkUpdate():
    errorNum=0
    succeNum=0
    tab = getTable(TABLE_NAME)
    post = request.get_json()
    classes = {}

    print(post)
    class_id = ObjectId(post['class_id'])

    #put students with the same <class_id> into the same list
    for student in post['data']:
        student.pop('$$hashKey',None)

    tab.update_one({'_id':class_id},{"$set":{'students': post['data']}})

def wrapQueryResult(result):
    l = []
    for s in result:
        s.pop('_id',None)
        l.append(s)
    return l

def getAllstudents():
    tab = getTable(TABLE_NAME)
    return tab.find()

def getClassList():
    tab = getTable(TABLE_NAME)
    class_list = list()
    result = tab.find({}, ['name'])
    for mClass in result:
        class_list.append({'_id': str(mClass['_id']), 'name': mClass['name']})
    return class_list

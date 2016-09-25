from flask import request,redirect
import logging
from database import getTable
from bson.objectid import ObjectId
import re

TABLE_NAME = 'classes'

def getStudents(class_id):
    tab = getTable(TABLE_NAME)
    return tab.find({'class_id': class_id})

def setStudents(class_id, students):
    tab = getTable(TABLE_NAME)
    pass

def bulkUpdate():
    errorNum=0
    succeNum=0
    tab = getTable(TABLE_NAME)
    post = request.get_json()
    classes = {}

    # print(post)

    #put students with the same <class_id> into the same list
    for student in post:
        student.pop('$$hashKey',None)
        if not classes.get(student['class_id']):
            classes[student['class_id']] = []
        classes[student['class_id']].append(student)
        student.pop('class_id',None)

    for class_id in classes:
        # print(class_id,classes[class_id])
        tab.update_one({'class_id':class_id},{"$set":{'students':classes[class_id]}},True)

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
    result = tab.find()
    for mClass in result:
        class_list.append({'_id': mClass['class_id']})
    return class_list

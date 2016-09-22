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
    for student in post:
        student.pop('$$hashKey',None)
        if tab.insert(student):
            succeNum += 1
        else:
            errorNum += 1
    pass #errorNum...

def wrapQueryResult(result):
    l = []
    for s in result:
        s.pop('_id',None)
        l.append(s)
    return l

def getAllstudents():
        tab = getTable(TABLE_NAME)
        return tab.find()

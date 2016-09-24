from flask import request,redirect
import logging
from database import getTable
from bson.objectid import ObjectId
import re

TABLE_NAME = 'schedule'

def getSchedule():
    tab = getTable(TABLE_NAME)
    return tab.find({'class_id': class_id})

def bulkUpdate():
    errorNum=0
    succeNum=0
    tab = getTable(TABLE_NAME)
    post = request.get_json()
    print(post)
    for s in post:
        s.pop('$$hashKey',None)
    tab.insert(post)

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
    class_list = set()
    result = tab.find()
    for mClass in result:
        class_list.add(mClass['class_id'])
    class_list = list(class_list)
    return class_list

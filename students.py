from flask import request,redirect
import logging
from database import getTable
from bson.objectid import ObjectId

TABLE_NAME = 'classes'

def getStudents(class_id):
    tab = getTable(TABLE_NAME)
    return tab.find({'class_id': class_id})

def setStudents(class_id, students):
    tab = getTable(TABLE_NAME)
    pass

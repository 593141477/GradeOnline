from flask import request,redirect
import logging
from database import getTable
from bson.objectid import ObjectId
from helper import hash_sha256

TABLE_NAME = 'teachers'

def getTeachers():
	tab = getTable(TABLE_NAME)
	teacherList = []
	for i in tab.find({}, ['user','name']):
		teacherList.append({
			'_id':str(i['_id']), 
			'name': i['name'],
			'user': i['user']
			})
	return teacherList

def getTeacherById(teacher_id):
	tab = getTable(TABLE_NAME)

	return tab.find_one({'_id': ObjectId(teacher_id)}, ['user','name'])

def auth(username, pwd):
	tab = getTable(TABLE_NAME)
	pwd = hash_sha256(pwd)
	r = tab.find_one({'user':username, 'pwd': pwd})
	if r:
		return str(r['_id'])
	return None

def update():
	try:
		op = request.form['op']
		tab = getTable(TABLE_NAME)
		if op == 'add':
			tab.insert({
				'name': request.form['name'],
				'user': request.form['user'],
				'pwd': hash_sha256(request.form['pwd']),
				})
		elif op == 'del':
			tab.remove({'_id': ObjectId(request.form['id'])})
		elif op == 'pwd':
			tab.update({'_id': ObjectId(request.form['id'])},
				{'$set':{'pwd': hash_sha256(request.form['pwd'])}
				})
	except Exception, e:
		logging.exception(e)

	return redirect('admin/teachers')

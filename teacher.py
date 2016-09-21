from flask import request,redirect
import logging
from database import getTable
from helper import hash_sha256

TABLE_NAME = 'teachers'

def getTeachers():
	tab = getTable(TABLE_NAME)
	return tab.find()

def auth(username, pwd):
	tab = getTable(TABLE_NAME)
	pwd = hash_sha256(pwd)
	r = tab.find_one({'user':username, 'pwd': pwd})
	if r:
		return True
	return False

def update():
	try:
		op = request.form['op']
		tab = getTable(TABLE_NAME)
		if op == 'add':
			add.insert_one({
				'name': request.form['name'],
				'id': request.form['id'],
				'pwd': hash_sha256(request.form['pwd']),
				})
	except Exception, e:
		logging.exception(e)

	return redirect('.')
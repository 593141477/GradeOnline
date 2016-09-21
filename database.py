from pymongo import MongoClient
client = MongoClient()
db = client['GradeOnline']

def getTable(name):
	return db[name]
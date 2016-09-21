from pymongo import MongoClient

def getTable(name):
    client = MongoClient()
    db = client['GradeOnline']
    return db[name]
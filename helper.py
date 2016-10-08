import hashlib
import json

def hash_sha256(text):
	sh = hashlib.sha256()
	sh.update(text)
	return sh.hexdigest()

def json_response(errorCode, data):
    return json.dumps({'error': errorCode, 'response': data})

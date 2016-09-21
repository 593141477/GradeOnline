import hashlib

def hash_sha256(text):
	sh = hashlib.sha256()
	sh.update(text)
	return sh.hexdigest()
from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017"

client = MongoClient(MONGO_URI)

db = client["smart_complaint"]
complaints_collection = db["complaints"]
Responsible_faculty = db["responsibilities"]

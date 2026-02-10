import os
from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)

db = client["smart_complaint_db"]

complaints_collection = db["complaints"]
Responsible_faculty = db["responsible_faculty"]

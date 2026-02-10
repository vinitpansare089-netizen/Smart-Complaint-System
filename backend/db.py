import os
from pymongo import MongoClient

MONGO_URL = os.getenv("MONGO_URL")

client = MongoClient(MONGO_URL)

db = client["smart_complaint_db"]

complaints_collection = db["complaints"]
Responsible_faculty = db["responsible_faculty"]

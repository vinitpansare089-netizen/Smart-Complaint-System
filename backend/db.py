import os
from pymongo import MongoClient

MONGO_URL = os.getenv("MONGO_URL")

client = MongoClient(MONGO_URL)

db = client["complaint_admin"]

complaints_collection = db["complaints"]
Responsible_faculty = db["responsible_faculty"]
print("DEBUG MONGO_URL =", MONGO_URL)
import os
from pymongo import MongoClient

# Read MongoDB URI from environment variable
MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise Exception("❌ MONGO_URI environment variable not set")

client = MongoClient(MONGO_URI)

db = client["smart_complaint_db"]

complaints_collection = db["complaints"]
Responsible_faculty = db["responsibilities"]

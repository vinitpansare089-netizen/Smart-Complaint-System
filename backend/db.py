# import os
# from pymongo import MongoClient

# MONGO_URL = os.getenv("MONGO_URL")

# client = MongoClient(MONGO_URL)

# db = client["complaint_admin"]

# complaints_collection = db["complaints"]
# Responsible_faculty = db["responsible_faculty"]
# print("DEBUG MONGO_URL =", MONGO_URL)

import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Get path of backend folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Point directly to backend/.env
ENV_PATH = os.path.join(BASE_DIR, ".env")

# Load it
load_dotenv(ENV_PATH)

# Read variable
MONGO_URL = os.getenv("MONGO_URL")

print("DEBUG MONGO_URL =", MONGO_URL)

if not MONGO_URL:
    raise ValueError("❌ MONGO_URL is missing")

client = MongoClient(MONGO_URL)

db = client["complaint_admin"]

complaints_collection = db["complaints"]
Responsible_faculty = db["responsible_faculty"]

import os
import uuid
from datetime import datetime, timezone, timedelta

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import joblib
from bson import ObjectId
from sklearn.metrics.pairwise import cosine_similarity

# Local imports (important for Render)
from .db import complaints_collection, Responsible_faculty


# ===============================
# PATH SETUP (VERY IMPORTANT)
# ===============================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "Models")


def load_model(filename: str):
    path = os.path.join(MODEL_DIR, filename)

    if not os.path.exists(path):
        raise FileNotFoundError(f"Model file missing: {path}")

    return joblib.load(path)


# ===============================
# ADMIN CONFIG
# ===============================

ADMIN_EMAIL = "admin@college.com"
ADMIN_PASSWORD = "admin123"


# ===============================
# APP INIT
# ===============================

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===============================
# DATA MODELS
# ===============================

class Complaint(BaseModel):
    student_name: str
    department: str
    title: str
    description: str


class StatusUpdate(BaseModel):
    status: str


# ===============================
# HEALTH CHECK
# ===============================

@app.get("/health")
def health():
    return {
        "status": "OK",
        "message": "Backend is running... VINIT!"
    }


# ===============================
# LOAD ML MODELS
# ===============================

try:
    vectorizer_category = load_model("vectorizer_category.pkl")
    category_model = load_model("category_model.pkl")

    vectorizer_priority = load_model("vectorizer_priority.pkl")
    priority_model = load_model("priority_model.pkl")

    emotion_vectorizer = load_model("emotion_vectorizer.pkl")
    emotion_model = load_model("emotion_model.pkl")

    print("✅ All ML models loaded successfully")

except Exception as e:
    print("❌ Model loading failed:", e)
    raise e


# ===============================
# ML HELPERS
# ===============================

def predict_category(text: str) -> str:
    X = vectorizer_category.transform([text])
    return str(category_model.predict(X)[0])


def safety_override(text: str) -> bool:
    danger_words = [
        "ragging", "harass", "harassment", "threat", "attack",
        "injury", "blood", "stolen", "emergency", "fight",
        "unsafe", "stalking", "abuse", "abusive", "bully"
    ]

    text = text.lower()
    return any(w in text for w in danger_words)


def predict_priority(text: str) -> str:

    if safety_override(text):
        return "High"

    X = vectorizer_priority.transform([text])
    return str(priority_model.predict(X)[0])


def predict_emotion(text: str) -> str:
    X = emotion_vectorizer.transform([text])
    return str(emotion_model.predict(X)[0])


# ===============================
# URGENCY SCORING
# ===============================

def urgency_score(text, category, priority, emotion):

    score = 20

    # Priority
    if priority == "High":
        score += 40
    elif priority == "medium":
        score += 25
    else:
        score += 10

    # Emotion
    if emotion in ["fear", "anger"]:
        score += 15
    elif emotion in ["sadness", "disgust"]:
        score += 8

    # Category
    if category == "safety":
        score += 35
    elif category in ["infrastructure", "water"]:
        score += 10
    else:
        score += 5

    # Risky words
    danger_words = [
        "ragging", "harass", "harassment", "threat", "attack",
        "injury", "blood", "stolen", "emergency", "fight",
        "unsafe", "stalking", "abuse", "abusive", "bully",
        "fire", "spark", "burning"
    ]

    text = text.lower()

    if any(w in text for w in danger_words):
        score += 10

    return min(score, 100)


# ===============================
# RISK DETECTION
# ===============================

def get_recent_complaints(hours=24, limit=100):

    cutoff = datetime.now(timezone.utc) - timedelta(hours=hours)

    return list(
        complaints_collection.find(
            {"created_at": {"$gte": cutoff}},
            {"text_vector": 1}
        ).limit(limit)
    )


def compute_similarity(v1, v2):
    return cosine_similarity([v1], [v2])[0][0]


def detect_emerging_risk(current_vector):

    recent = get_recent_complaints()

    count = 0

    for c in recent:

        past = c.get("text_vector")

        if not past:
            continue

        sim = compute_similarity(current_vector, past)

        if sim >= 0.6:
            count += 1

    return {
        "detected": count >= 3,
        "similar_complaints": count
    }


# ===============================
# AUTHORITY LOOKUP
# ===============================

def get_responsible_authority(department: str):

    record = Responsible_faculty.find_one(
        {"department": {"$regex": f"^{department.strip()}$", "$options": "i"}}
    )

    if record:
        return {
            "role": record["role"],
            "name": record["name"]
        }

    return {
        "role": "General Admin",
        "name": "Not Assigned"
    }


# ===============================
# CREATE COMPLAINT
# ===============================

@app.post("/complaint")
def create_complaint(c: Complaint):

    ref = f"CMP-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{uuid.uuid4().hex[:4]}"

    text = f"{c.title} {c.description}"

    vector = vectorizer_category.transform([text]).toarray()[0].tolist()

    category = predict_category(text)
    priority = predict_priority(text)
    emotion = predict_emotion(text)

    urgency = urgency_score(text, category, priority, emotion)

    assigned_to = get_responsible_authority(c.department)

    doc = {
        "reference_id": ref,
        "student_name": c.student_name,
        "department": c.department,
        "title": c.title,
        "description": c.description,

        "emotion": emotion,
        "category": category,
        "priority": priority,
        "urgency": urgency,

        "status": "Pending",
        "assigned_to": assigned_to,

        "text_vector": vector,
        "created_at": datetime.now(timezone.utc)
    }

    complaints_collection.insert_one(doc)

    return {
        "message": "Complaint submitted",
        "reference_id": ref,
        "assigned_to": assigned_to,
        "status": "Pending"
    }


# ===============================
# GET ALL COMPLAINTS
# ===============================

@app.get("/complaints")
def get_complaints():

    data = list(complaints_collection.find())

    result = []

    for c in data:

        result.append({
            "id": str(c["_id"]),
            "reference_id": c.get("reference_id"),
            "student_name": c.get("student_name"),
            "title": c.get("title"),
            "description": c.get("description"),
            "department": c.get("department"),

            "category": c.get("category"),
            "priority": c.get("priority"),
            "urgency": c.get("urgency"),

            "emotion": c.get("emotion"),
            "assigned_to": c.get("assigned_to"),

            "status": c.get("status"),
            "created_at": c.get("created_at")
        })

    return {
        "total": len(result),
        "complaints": result
    }


# ===============================
# UPDATE STATUS
# ===============================

@app.patch("/complaints/{cid}")
def update_status(cid: str, s: StatusUpdate):

    res = complaints_collection.update_one(
        {"_id": ObjectId(cid)},
        {"$set": {"status": s.status}}
    )

    if res.matched_count == 0:
        raise HTTPException(404, "Complaint not found")

    return {"message": "Status updated"}


# ===============================
# ADMIN LOGIN
# ===============================

@app.post("/admin/login")
def admin_login(data: dict):

    if (
        data.get("email") == ADMIN_EMAIL and
        data.get("password") == ADMIN_PASSWORD
    ):
        return {
            "success": True,
            "token": "admin-secret-token"
        }

    return {"success": False}

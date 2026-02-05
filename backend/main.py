from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
from db import complaints_collection
from bson import ObjectId
from datetime import datetime, timezone, timedelta
from sklearn.metrics.pairwise import cosine_similarity
from db import Responsible_faculty
import uuid
from fastapi import HTTPException


ADMIN_EMAIL = "admin@college.com"
ADMIN_PASSWORD = "admin123"


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # exact frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#### Data Models


class Complaint(BaseModel):
    student_name: str
    department: str
    title: str
    description: str


class StatusUpdate(BaseModel):
    status: str

       

####### Health Check bhai...


@app.get("/health")
def health():
    return {"status": "OK", "message": "Backend is running... VINIT!"}



##### Load ML Models


vectorizer_category = joblib.load("models/vectorizer_category.pkl")
category_model = joblib.load("models/category_model.pkl")

vectorizer_priority = joblib.load("models/vectorizer_priority.pkl")
priority_model = joblib.load("models/priority_model.pkl")

print("ML models loaded successfully")


###### ML Helper Functions Saaaaarrrrr....


def predict_category(text: str) -> str:
    X_vec = vectorizer_category.transform([text])
    return str(category_model.predict(X_vec)[0])


def safety_override(text: str) -> bool:
    text = text.lower()
    danger_words = [
        "ragging", "harass", "harassment", "threat", "attack",
        "injury", "blood", "stolen", "emergency", "fight",
        "unsafe", "stalking", "abuse", "abusive", "bully"
    ]
    return any(word in text for word in danger_words)


def predict_priority(text: str) -> str:
    if safety_override(text):
        return "High"

    X_vec = vectorizer_priority.transform([text])
    return str(priority_model.predict(X_vec)[0])

###### Helper Function for emotion ----------
def predict_emotion(text: str) -> str:
    X_vec = emotion_vectorizer.transform([text])
    pred = emotion_model.predict(X_vec)[0]
    return str(pred)


def urgency_score(text, category, priority, emotion):
    score = 20

#####Sab PRIORITY ke liye score
    if priority == 'High':
        score += 40
    elif priority == 'medium':
        score += 25
    else:
        score += 10

#####Sab Emotion ke liye score

    if emotion in ['fear', 'anger']:
        score += 15
    elif emotion in ['sadness', 'disgust']:
        score += 8
    else:
        score += 0

######Sab category ke liye score
    if category == 'safety':
        score += 35
    elif category in ['infrastructure', 'water']:
        score += 10
    else:
        score += 5

#######Risky words
    danger_words = [
        "ragging", "harass", "harassment", "threat", "attack",
        "injury", "blood", "stolen", "emergency", "fight",
        "unsafe", "stalking", "abuse", "abusive", "bully", "fire", "spark", "burning"
    ]
    text = text.lower()
    if any(word in text for word in danger_words):
     score += 10

    return min(score, 100)


def get_recent_complaints(hours=24, limit=100):
    cutoff_time = datetime.now(timezone.utc) - timedelta(hours=hours)

    complaints = list(
        complaints_collection.find(
            {"created_at": {"$gte": cutoff_time}},
            {"text_vector": 1, "created_at": 1}
        ).limit(limit)
    )
    
    return complaints

def compute_similarity(vec1, vec2):
    return cosine_similarity([vec1], [vec2])[0][0]



def detect_emerging_risk(current_vector, hours=24, similarity_threshold=0.6):
    recent_complaints = get_recent_complaints(hours=hours)

    similar_count = 0

    for c in recent_complaints:
        past_vector = c.get("text_vector")
        if not past_vector:
            continue

        sim = compute_similarity(current_vector, past_vector)
        #print("SIM:", sim)


        if sim >= similarity_threshold:
            similar_count += 1

    # Decision is DATA-driven, not rule-per-text
    if similar_count >= 3:
        return {
            "detected": True,
            "similar_complaints": similar_count,
            "time_window_hours": hours
        }

    return {
        "detected": False,
        "similar_complaints": similar_count,
        "time_window_hours": hours
    }



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



#### Create Complaint


@app.post("/complaint")
def create_complaint(c: Complaint):
    reference_id = f"CMP-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{uuid.uuid4().hex[:4].upper()}"
    text = str(c.title) + " " + str(c.description)
    text_vector = vectorizer_category.transform([text]).toarray()[0].tolist()
    emerging_risk = detect_emerging_risk(text_vector)
    emotion = predict_emotion(text)
    category = predict_category(text)
    priority = predict_priority(text)
    urgency = urgency_score(text, category, priority, emotion)
    department = c.department.strip().lower()
    assigned_to = get_responsible_authority(c.department)


    # Final safety rule
    if category == "Safety":
        priority = "High"

    if emotion in ["fear","anger"]:
        priority = "High"

    doc = {
        "message": "Complaint submitted successfully",
        "reference_id": reference_id,
        "student_name": c.student_name,
        "department": c.department,
        "title": c.title,
        "description": c.description,
        "emotion": emotion,
        "category": category,
        "priority": priority,
        "urgency": urgency,
        "status": "Pending",
        "created_at": datetime.now(timezone.utc),
        "text_vector": text_vector,
        "assigned_to": assigned_to
    }

    result = complaints_collection.insert_one(doc)

    return {
        "message": "Complaint submitted successfully",
        "reference_id": reference_id,
        #"mongo_id": str(result.inserted_id),
        #"category": category,
        #"priority": priority,
        #"emerging_risk": emerging_risk,
        "assigned_to": assigned_to,
        "status": "Pending"
    }





### Get All Complaints sir....


@app.get("/complaints")
def get_complaints():
    complaints = list(complaints_collection.find())

    admin_complaints = []

    for c in complaints:
        admin_complaints.append({
    "id": str(c["_id"]),
    "reference_id": c.get("reference_id"),
    "student_name": c.get("student_name", ""),
    "title": c.get("title"),
    "description": c.get("description"),
    "department": c.get("department", ""),
    "category": c.get("category", ""),
    "priority": c.get("priority", ""),
    "urgency": c.get("urgency", 0),          
    "emotion": c.get("emotion", "unknown"), 
    "emerging_risk": c.get("emerging_risk", {}),
    "assigned_to": c.get("assigned_to", {}),
    "status": c.get("status", "Pending"),   
    "created_at": c.get("created_at")
})


    return {
        "total_complaints": len(admin_complaints),
        "complaints": admin_complaints
    }



### Update Complaint Ka Status Sir...


@app.patch("/complaints/{id}")
def update_complaint_status(id: str, s: StatusUpdate):

    result = complaints_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"status": s.status}}
    )

    if result.matched_count == 0:
        return {"message": "Complaint not found"}

    updated = complaints_collection.find_one({"_id": ObjectId(id)})
    updated["_id"] = str(updated["_id"])

    return {
        "message": "Status updated",
        "complaint": updated
    }

@app.put("/complaint/{cid}/status")
def update_status(cid: str, status: str):

    complaints_collection.update_one(
        {"_id": ObjectId(cid)},
        {"$set": {"status": status}}
    )

    return {"message": "Status updated"}


@app.post("/admin/login")
def admin_login(data: dict):

    email = data.get("email")
    password = data.get("password")

    if email == ADMIN_EMAIL and password == ADMIN_PASSWORD:
        return {
            "success": True,
            "token": "admin-secret-token"
        }

    return {"success": False}



#### Emotional files load(kar)...pehle
emotion_vectorizer = joblib.load("models/emotion_vectorizer.pkl")
emotion_model = joblib.load("models/emotion_model.pkl")

print("Model is loaded chief.....good to go sir")
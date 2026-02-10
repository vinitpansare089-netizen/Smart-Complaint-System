import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix
import joblib


# ===============================
# PATH SETUP
# ===============================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

os.makedirs(MODEL_DIR, exist_ok=True)


# ===============================
# SAFETY OVERRIDE
# ===============================
def safety_override(text):

    danger_words = [
        "ragging", "harass", "harassment", "threat", "attack",
        "injury", "blood", "stolen", "emergency", "fight",
        "unsafe", "stalking", "abuse", "abusive", "bully"
    ]

    text = text.lower()
    return any(w in text for w in danger_words)


# ===============================
# LOAD DATA
# ===============================
df = pd.read_csv("Data/complaints_train.csv")

print("Total rows:", len(df))
print("Category distribution:\n", df["category"].value_counts())
print("Priority distribution:\n", df["priority"].value_counts())


X = df["text"]
Y_cat = df["category"]
Y_pri = df["priority"]


# ===============================
# SPLIT
# ===============================
X_train_c, X_test_c, Yc_train, Yc_test = train_test_split(
    X, Y_cat,
    test_size=0.2,
    random_state=42,
    stratify=Y_cat
)

X_train_p, X_test_p, Yp_train, Yp_test = train_test_split(
    X, Y_pri,
    test_size=0.2,
    random_state=42,
    stratify=Y_pri
)


# ===============================
# VECTORIZERS
# ===============================

vectorizer_c = TfidfVectorizer(
    ngram_range=(1, 2),
    stop_words="english",
    max_features=6000
)

vectorizer_p = TfidfVectorizer(
    ngram_range=(1, 2),
    stop_words="english",
    max_features=6000
)


Xc_train_vec = vectorizer_c.fit_transform(X_train_c)
Xc_test_vec = vectorizer_c.transform(X_test_c)

Xp_train_vec = vectorizer_p.fit_transform(X_train_p)
Xp_test_vec = vectorizer_p.transform(X_test_p)


# ===============================
# MODELS
# ===============================

cat_model = LogisticRegression(
    max_iter=3000,
    class_weight="balanced"
)

pri_model = LogisticRegression(
    max_iter=2000,
    class_weight="balanced"
)


cat_model.fit(Xc_train_vec, Yc_train)
pri_model.fit(Xp_train_vec, Yp_train)


# ===============================
# EVALUATION
# ===============================

print("\n===== CATEGORY REPORT =====")
print(classification_report(Yc_test, cat_model.predict(Xc_test_vec)))

print("\n===== PRIORITY REPORT =====")
print(classification_report(Yp_test, pri_model.predict(Xp_test_vec)))


# ===============================
# SAVE MODELS (SAFE)
# ===============================

joblib.dump(vectorizer_c, os.path.join(MODEL_DIR, "vectorizer_category.pkl"))
joblib.dump(cat_model, os.path.join(MODEL_DIR, "category_model.pkl"))

joblib.dump(vectorizer_p, os.path.join(MODEL_DIR, "vectorizer_priority.pkl"))
joblib.dump(pri_model, os.path.join(MODEL_DIR, "priority_model.pkl"))

print("\n✅ Category & Priority models saved successfully")

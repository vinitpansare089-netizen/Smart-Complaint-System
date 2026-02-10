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
# LOAD DATA
# ===============================
df = pd.read_csv("data/emotion_train.csv")

print("Emotion distribution:\n", df["emotion"].value_counts())


X = df["text"]
Y = df["emotion"]


# ===============================
# SPLIT
# ===============================
X_train, X_test, Y_train, Y_test = train_test_split(
    X, Y,
    test_size=0.2,
    random_state=42,
    stratify=Y
)


print("Train size:", len(X_train))
print("Test size:", len(X_test))


# ===============================
# VECTORIZER
# ===============================
vectorizer = TfidfVectorizer(
    lowercase=True,
    stop_words="english",
    ngram_range=(1, 2),
    max_features=5000
)


X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

print("Vector shape:", X_train_vec.shape)


# ===============================
# MODEL
# ===============================
model = LogisticRegression(
    max_iter=1500,
    class_weight="balanced"
)

model.fit(X_train_vec, Y_train)


# ===============================
# EVALUATION
# ===============================
y_pred = model.predict(X_test_vec)

print("\n===== EMOTION REPORT =====")
print(classification_report(Y_test, y_pred))

print("\n===== CONFUSION MATRIX =====")
print(confusion_matrix(Y_test, y_pred))


# ===============================
# SAVE
# ===============================
joblib.dump(vectorizer, os.path.join(MODEL_DIR, "emotion_vectorizer.pkl"))
joblib.dump(model, os.path.join(MODEL_DIR, "emotion_model.pkl"))

print("\n✅ Emotion model saved successfully")

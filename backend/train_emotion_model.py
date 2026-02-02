### Training with jhonny lever and his machenics named loadkar and vinit 
### enjoy the coding vinit.........

import pandas as pd
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix
import joblib

##### Aye Load(kar) chal jaldi
df = pd.read_csv('data/emotion_train.csv')

#print(df.head(10))
#print(df['emotion'].value_counts())

##### Aim for target and shoot

X = df['text']
Y = df['emotion']

#### Aye chal ab train aur test krke tod(split) kar......

X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size = 0.2, random_state = 42, stratify = Y)

### Zara size to check kar - loadkar & vinit

print("Train size: ",len(X_train))
print("Test size: ", len(X_test))

### aye vinit check karna sare emotion training data me hai ya nhi...
#Y_train.value_counts().plot(kind='bar',title='Train Emotion Distribution')
#plt.show()

#Y_test.value_counts().plot(kind='bar',title='Train Emotion Distribution')
#plt.show()

### TF-IDF ....
vectorizer = TfidfVectorizer(
    lowercase=True,
    stop_words="english",
    ngram_range=(1, 2),
    max_features=3000
)

X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

print("Vector shape:", X_train_vec.shape)

### Model Traininig start kar ab sab set hai(par vo nhi....)
model = LogisticRegression(
    max_iter=1000,
    class_weight='balanced'
)

### ab fit kar de ...
model.fit(X_train_vec, Y_train)

### evaluate kar de sab kaam ho chuka hai...
y_pred = model.predict(X_test_vec)

print("\n---- Classification Report ----")
print(classification_report(Y_test, y_pred))

print("\n---- Confusion Matrix ----")
print(confusion_matrix(Y_test, y_pred))

### ab kaam ko save kar de loadkar files bana de

joblib.dump(vectorizer, "models/emotion_vectorizer.pkl")
joblib.dump(model, "models/emotion_model.pkl")
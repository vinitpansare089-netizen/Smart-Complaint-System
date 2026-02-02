import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix
import joblib


df = pd.read_csv('Data/complaints_train.csv')

#print(df.head(10))
#print("Total Rows: ", len(df))

print("Total rows:", len(df))
print(df["category"].value_counts())

##Target and features###

X = df["text"]
Y_cat = df['category']
Y_pri = df['priority']

#print("X sample:")
#print(X.head(3))

#print("Y sample:")
#print(Y.head(3))

#print(df["priority"].value_counts())

#print(df.isnull().sum())

#print(df["category"].unique())
#print(df["priority"].unique())

## train test split ##

X_train, X_test, Ycat_train, Ycat_test = train_test_split(X, Y_cat, random_state=42, test_size=0.2, stratify=Y_cat)
#print("Total X rows:", len(X))
X_train_p, X_test_p, Ypri_train, Ypri_test = train_test_split(X, Y_pri, test_size=0.2, random_state=42, stratify=Y_pri)

#print("X_train:", len(X_train))
#print("X_test:", len(X_test))

### TF-IDF ###

## CATEGORY VECTOR ##
vectorizer_c = TfidfVectorizer(ngram_range=(1,2), stop_words='english')
X_train_vec = vectorizer_c.fit_transform(X_train)
X_test_vec = vectorizer_c.transform(X_test)

## PRIORITY VECTOR ##
vectorizer_p = TfidfVectorizer(ngram_range=(1,2))
X_train_p_vec = vectorizer_p.fit_transform(X_train_p)
X_test_p_vec = vectorizer_p.transform(X_test_p)

#print('Priority Train:', len(X_train_p))
#print('Priority Test:', len(X_test_p))

#print("X_train_vec shape:", X_train_vec.shape)
#print("X_test_vec shape:", X_test_vec.shape)

##Taining of model using ALgorithms ##

## CATEGORY MODEL ##
cat_model = LogisticRegression(max_iter=3000, class_weight='balanced')
cat_model.fit(X_train_vec, Ycat_train)

cat_pred = cat_model.predict(X_test_vec)

## PRIORITY MODEL ##
pri_model = LogisticRegression(max_iter=2000, class_weight='balanced')
pri_model.fit(X_train_p_vec, Ypri_train)

pri_pred = pri_model.predict(X_test_p_vec)

#print(cat_pred)

### Evalution ###

print('\n-------Classification report-----')
print(classification_report(Ycat_test, cat_pred))

print('\n------confusion matrix-------')
print(confusion_matrix(Ycat_test, cat_pred))

#print("\n-----PRIORITY CONFUSION MATRIX --------")
#print(confusion_matrix(Ypri_test, pri_pred))

#print("\n----PRIORITY CLASSIFICATION REPORT -----")
#print(classification_report(Ypri_test, pri_pred))

final_pred = []

for text, pred in zip(X_test_p, pri_pred):
    if safety_override(text):
        final_pred.append("High")
    else:
        final_pred.append(pred)

#print(confusion_matrix(Ypri_test, final_pred))
#print(classification_report(Ypri_test, final_pred))

joblib.dump(vectorizer_c, "models/vectorizer_category.pkl")
joblib.dump(cat_model, "models/category_model.pkl")



joblib.dump(vectorizer_p, "models/vectorizer_priority.pkl")
joblib.dump(pri_model, "models/priority_model.pkl")
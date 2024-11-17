import os
import re
import sys
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from PyPDF2 import PdfReader  # type: ignore

# Function to clean the resume text
def clean_resume_text(txt):
    cleanText = re.sub(r'http\S+\s', ' ', txt)
    cleanText = re.sub(r'#\S+\s', ' ', cleanText)
    cleanText = re.sub(r'@\S+', '  ', cleanText)
    cleanText = re.sub(r'[!"#$%&\'()*+,-./:;<=>?@\[\\\]^_`{|}~]', ' ', cleanText)
    cleanText = re.sub(r'\s+', ' ', cleanText)
    return cleanText

# Get the current directory
current_dir = os.path.dirname(os.path.abspath(__file__))
tfidf_path = os.path.join(current_dir, 'tfidf.pkl')
clf_path = os.path.join(current_dir, 'clf.pkl')

# Load the trained model and TfidfVectorizer
try:
    tfidf = pickle.load(open(tfidf_path, 'rb'))
    clf = pickle.load(open(clf_path, 'rb'))
except FileNotFoundError as e:
    print(f"Error: {e}")
    sys.exit(1)

# Get the resume file path from the arguments
resume_path = sys.argv[1]
# print(f"Received resume path: {resume_path}")  # Debugging the resume path

# Read the resume content
try:
    with open(resume_path, 'rb') as file:
        pdf_reader = PdfReader(file)
        resume_text = " ".join([page.extract_text() for page in pdf_reader.pages])
        # print(f"Extracted resume text: {resume_text[:500]}...")  # Preview of extracted text
except Exception as e:
    print(f"Error reading resume: {e}")
    sys.exit(1)

# Clean the resume text
cleaned_resume = clean_resume_text(resume_text)
# print(f"Cleaned resume text: {cleaned_resume[:500]}...")  # Preview of cleaned text

# Transform the cleaned resume using the trained TfidfVectorizer
input_features = tfidf.transform([cleaned_resume])
# print(f"Transformed input features: {input_features.shape}")  # Check feature shape

# Make the prediction using the trained classifier
prediction_id = clf.predict(input_features)[0]
# print(f"Prediction ID: {prediction_id}")  # Debugging the prediction ID

# Map category ID to category name
category_mapping = {
    15: "Java Developer",
    23: "Testing",
    8: "DevOps Engineer",
    20: "Python Developer",
    24: "Web Designing",
    12: "HR",
    13: "Hadoop",
    3: "Blockchain",
    10: "ETL Developer",
    18: "Operations Manager",
    6: "Data Science",
    22: "Sales",
    16: "Mechanical Engineer",
    1: "Arts",
    7: "Database",
    11: "Electrical Engineering",
    14: "Health and fitness",
    19: "PMO",
    4: "Business Analyst",
    9: "DotNet Developer",
    2: "Automation Testing",
    17: "Network Security Engineer",
    21: "SAP Developer",
    5: "Civil Engineer",
    0: "Advocate",
}

category_name = category_mapping.get(prediction_id, "Unknown")
print("Prediction:", category_name)  # Final output

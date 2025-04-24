import os
import re
import sys
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from PyPDF2 import PdfReader  # type: ignore
import json
from nltk.corpus import stopwords
import nltk
nltk.download('stopwords')
import google.generativeai as genai
from fuzzywuzzy import fuzz



# Function to clean the resume text
def clean_resume_text(txt):
    cleanText = re.sub(r'http\S+\s', ' ', txt)
    cleanText = re.sub(r'#\S+\s', ' ', cleanText)
    cleanText = re.sub(r'@\S+', '  ', cleanText)
    cleanText = re.sub(r'[!"#$%&\'()*+,-./:;<=>?@\[\\\]^_`{|}~]', ' ', cleanText)
    cleanText = re.sub(r'\s+', ' ', cleanText)
    return cleanText

def preprocess_text(text):
    # Lowercase text
    text = text.lower()
    # Remove non-alphanumeric characters (punctuation, special symbols)
    text = re.sub(r'[^a-z\s]', '', text)
    # Tokenize and remove stopwords (common words like 'the', 'is', 'and')
    stop_words = set(stopwords.words('english'))
    words = text.split()
    cleaned_words = [word for word in words if word not in stop_words]
    return cleaned_words

from rapidfuzz import fuzz

def extract_skills_from_resume(resume_text, target_profession, profession_to_skills, threshold=70):
    matched_skills = set()

    # Clean resume
    resume_text = resume_text.lower()
    resume_text = re.sub(r'[^a-z0-9\s]', '', resume_text)

    required_skills = profession_to_skills.get(target_profession, [])

    for skill in required_skills:
        if fuzz.partial_ratio(skill.lower(), resume_text) >= threshold:
            matched_skills.add(skill)

    return matched_skills

def skill_gap_analysis(resume_text, target_profession, profession_to_skills, threshold=70):
    required_skills = set(profession_to_skills.get(target_profession, []))
    matched_skills = extract_skills_from_resume(resume_text, target_profession, profession_to_skills, threshold)
    
    missing_skills = required_skills - matched_skills

    match_percentage = (len(matched_skills) / len(required_skills)) * 100 if required_skills else 0

    return match_percentage, list(missing_skills)

# Replace with your Gemini API key
genai.configure(api_key="AIzaSyAbFmCTAscfze1JE4HNamGtEPkOG9oNwsw")

# Use an available model (not "gemini-pro")
model = genai.GenerativeModel("gemini-1.5-pro")  # Changed from "gemini-1.5-pro"

import json
import re

def get_skill_info(skills, prompt):
    try:
        # Send a single batch request with the provided prompt
        response = model.generate_content(prompt)

        # Print the raw response for debugging
        # print(response.text)

        # Check if the response is empty or invalid
        if not response.text.strip():
            return "Error: Empty response received"

        # Remove any unwanted markdown (e.g., ```json)
        clean_response = re.sub(r'```json|\n```', '', response.text).strip()
        clean_response = clean_response.replace('\u201c', '"').replace('\u201d', '"')
        clean_response = clean_response.replace(' "raw" ', ' \\"raw\\" ')

        # Check if the cleaned response is a valid JSON string
        if clean_response.startswith("{") and clean_response.endswith("}"):
            try:
                skill_data = json.loads(clean_response)
                return skill_data
            except json.JSONDecodeError as e:
                return f"Error parsing JSON: {str(e)}"
        else:
            return f"Error: Response doesn't look like valid JSON: {clean_response}"

    except Exception as e:
        return f"Error: {e}"





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

# Read the resume content
try:
    with open(resume_path, 'rb') as file:
        pdf_reader = PdfReader(file)
        resume_text = " ".join([page.extract_text() for page in pdf_reader.pages])
except Exception as e:
    print(f"Error reading resume: {e}")
    sys.exit(1)

# Clean the resume text
cleaned_resume = clean_resume_text(resume_text)

skill_vector=preprocess_text(cleaned_resume)

# Transform the cleaned resume using the trained TfidfVectorizer
input_features = tfidf.transform([cleaned_resume])

# Make the prediction using the trained classifier
prediction_id = clf.predict(input_features)[0]

# Map category ID to category name and skills
category_mapping = {
    15: {"name": "Java Developer", "skills": [
        "Java", "Spring Boot", "Hibernate", "JPA", "Microservices", "RESTful APIs", 
        "Maven", "Gradle", "JUnit", "Mockito", "Design Patterns", "Multithreading", 
        "Collections", "JVM", "Performance Tuning", "Docker", "Kubernetes", "AWS", 
        "Azure", "CI/CD", "Security", "Kafka", "Redis", "NoSQL", "Agile Methodologies"]},
    23: {"name": "Testing", "skills": [
        "Manual Testing", "Automation Testing", "Selenium", "TestNG", "JUnit", "Cucumber", 
        "Appium", "JMeter", "Load Testing", "Performance Testing", "Security Testing", 
        "API Testing", "Postman", "SoapUI", "Test Planning", "Test Cases", "Defect Tracking", 
        "JIRA", "Quality Assurance", "Regression Testing", "Integration Testing", 
        "System Testing", "User Acceptance Testing", "Accessibility Testing", "Test Documentation"]},
    8: {"name": "DevOps Engineer", "skills": [
        "Docker", "Kubernetes", "CI/CD", "Jenkins", "GitLab CI", "Ansible", "Terraform", 
        "AWS", "Azure", "GCP", "Linux", "Bash Scripting", "Python", "Monitoring", "Prometheus", 
        "Grafana", "ELK Stack", "Infrastructure as Code", "Microservices", "Networking", "Security", 
        "Helm", "ArgoCD", "Git", "Performance Tuning"]},
    20: {"name": "Python Developer", "skills": [
        "Python", "Django", "Flask", "FastAPI", "RESTful APIs", "Microservices", "SQL", "NoSQL", 
        "ORM", "Celery", "Redis", "Docker", "Kubernetes", "AWS", "Azure", "CI/CD", "Testing", "Pytest", 
        "Data Structures", "Algorithms", "Design Patterns", "Asyncio", "Web Scraping", "Machine Learning", 
        "Security"]},
    24: {"name": "Web Designing", "skills": [
        "HTML", "CSS", "JavaScript", "jQuery", "Responsive Design", "UX/UI Design", 
        "Adobe Photoshop", "Illustrator", "Wireframing", "Prototyping", "Bootstrap", "Figma", 
        "Sketch", "User Research", "Branding", "Typography", "Color Theory", "SEO", "Cross-Browser Testing"]},
    12: {"name": "HR", "skills": [
        "Recruitment", "Employee Relations", "HR Policies", "Onboarding", "Performance Management", 
        "Compensation and Benefits", "HR Analytics", "Payroll", "Labor Laws", "Conflict Resolution", 
        "Training and Development", "Employee Engagement", "Talent Acquisition", "Succession Planning"]},
    13: {"name": "Hadoop", "skills": [
        "Hadoop", "MapReduce", "HDFS", "YARN", "Hive", "Pig", "Spark", "Flume", "Oozie", "Zookeeper", 
        "HBase", "Sqoop", "NoSQL", "Data Lakes", "Big Data Analytics", "Cloud Storage", "ETL"]},
    3: {"name": "Blockchain", "skills": [
        "Blockchain", "Ethereum", "Solidity", "Cryptocurrency", "Smart Contracts", "Bitcoin", 
        "DApps", "Decentralized Finance", "Hyperledger", "Crypto Wallets", "Security", 
        "Distributed Ledger Technology", "ICO", "Blockchain Architecture", "Data Privacy"]},
    10: {"name": "ETL Developer", "skills": [
        "ETL", "SQL", "Data Warehousing", "Informatica", "Talend", "Apache NiFi", "SSIS", 
        "Data Integration", "Data Transformation", "Data Cleaning", "Data Modeling", "Data Pipelines", 
        "Big Data", "Cloud Platforms", "Hadoop", "Spark", "Python"]},
    18: {"name": "Operations Manager", "skills": [
        "Project Management", "Process Improvement", "Supply Chain Management", "Lean", "Six Sigma", 
        "Team Leadership", "Resource Allocation", "Budget Management", "Inventory Management", 
        "Risk Management", "Logistics", "Business Strategy", "Customer Satisfaction", "Vendor Management"]},
    6: {"name": "Data Science", "skills": [
        "Python", "R", "Machine Learning", "Deep Learning", "Data Visualization", "NLP", "Pandas", 
        "NumPy", "Scikit-learn", "TensorFlow", "Keras", "PyTorch", "SQL", "NoSQL", "Big Data", "Hadoop", 
        "Spark", "Data Mining", "Data Wrangling", "Statistics", "Time Series Analysis", "Predictive Modeling", 
        "Data Cleaning", "Feature Engineering", "Model Evaluation"]},
    22: {"name": "Sales", "skills": [
        "Sales Strategy", "Lead Generation", "CRM", "Salesforce", "Negotiation", "Cold Calling", 
        "B2B Sales", "B2C Sales", "Market Research", "Sales Forecasting", "Client Relationship", 
        "Product Knowledge", "Sales Presentations", "Closing Deals", "Customer Retention", 
        "Sales Reporting", "Team Management"]},
    16: {"name": "Mechanical Engineer", "skills": [
        "CAD", "SolidWorks", "AutoCAD", "Mechanical Design", "Product Development", "Thermodynamics", 
        "Materials Science", "FEA", "Stress Analysis", "Prototyping", "Manufacturing", "Machining", 
        "HVAC", "Robotics", "Mechanism Design", "Fluid Mechanics", "Engineering Standards", "Automation"]},
    1: {"name": "Arts", "skills": [
        "Art History", "Creative Design", "Illustration", "Painting", "Sculpture", "Graphic Design", 
        "Photography", "Digital Art", "Printmaking", "Mixed Media", "Art Curation", "Museum Studies", 
        "Typography", "Branding", "Visual Storytelling", "Concept Art"]},
    7: {"name": "Database", "skills": [
        "SQL", "NoSQL", "Database Design", "MySQL", "MongoDB", "PostgreSQL", "Oracle", "Database Optimization", 
        "Data Warehousing", "ETL", "Database Security", "Data Modeling", "Big Data", "Cloud Databases", 
        "Replication", "Backup and Recovery", "Performance Tuning"]},
    11: {"name": "Electrical Engineering", "skills": [
        "Circuit Design", "Power Systems", "PLC Programming", "Microcontrollers", "Embedded Systems", 
        "Electronics", "Control Systems", "Signal Processing", "Matlab", "Simulink", "Power Electronics", 
        "Renewable Energy", "Electrical Safety", "Automation", "Cabling", "HVAC", "Lighting Systems"]},
    14: {"name": "Health and Fitness", "skills": [
        "Personal Training", "Nutrition", "Fitness Assessment", "Weight Loss", "Exercise Physiology", 
        "Yoga", "Pilates", "Strength Training", "Kettlebell", "Cardio", "Sports Coaching", 
        "Anatomy", "Health Coaching", "Behavioral Coaching", "Injury Prevention", "Wellness"]},
    19: {"name": "PMO", "skills": [
        "Project Management", "Project Planning", "Risk Management", "Resource Management", "Budgeting", 
        "Project Scheduling", "Stakeholder Communication", "Agile", "Scrum", "Project Tracking", 
        "Governance", "Quality Assurance", "Change Management", "Documentation"]},
    4: {"name": "Business Analyst", "skills": [
        "Business Analysis", "Requirements Gathering", "Data Analysis", "Process Mapping", "Stakeholder Management", 
        "Agile", "SQL", "JIRA", "Excel", "Tableau", "Power BI", "UML", "Data Visualization", "SWOT Analysis", 
        "Project Management", "Problem Solving", "Business Process Improvement"]},
    9: {"name": "DotNet Developer", "skills": [
        "C#", ".NET", "ASP.NET", "MVC", "Entity Framework", "SQL", "Web API", "Microservices", 
        "Web Development", "JavaScript", "HTML", "CSS", "SQL Server", "Azure", "JQuery", "Visual Studio"]},
    2: {"name": "Automation Testing", "skills": [
        "Selenium", "TestNG", "Jenkins", "Appium", "JMeter", "Cucumber", "Robot Framework", 
        "Continuous Integration", "API Testing", "Git", "Maven", "JUnit", "Load Testing", "Performance Testing", 
        "Agile Testing", "Automation Scripts"]},
    17: {"name": "Network Security Engineer", "skills": [
        "Firewalls", "VPN", "TCP/IP", "Network Monitoring", "Intrusion Detection Systems", "SIEM", 
        "Encryption", "Penetration Testing", "Ethical Hacking", "Network Configuration", "Wi-Fi Security", 
        "Data Privacy", "Network Troubleshooting", "Cloud Security", "Network Security Audits"]},
    21: {"name": "SAP Developer", "skills": [
        "SAP", "ABAP", "SAP HANA", "SAP Fiori", "SAP UI5", "SAP ERP", "SAP Netweaver", "S/4HANA", 
        "BAPI", "RFC", "Data Migration", "Module Configuration", "FICO", "CRM", "Business Workflow"]},
    5: {"name": "Civil Engineer", "skills": [
        "AutoCAD", "Civil 3D", "Structural Analysis", "Construction Management", "Surveying", "Geotechnical Engineering", 
        "Materials Science", "Project Management", "Concrete", "Steel", "Road Design", "Bridge Design", "Soil Mechanics", 
        "Water Resources", "Construction Site Safety", "Cost Estimation"]},
    0: {"name": "Advocate", "skills": [
        "Legal Research", "Litigation", "Contract Law", "Corporate Law", "Civil Law", "Criminal Law", 
        "Legal Drafting", "Dispute Resolution", "Family Law", "Constitutional Law", "Legal Advice", 
        "Negotiation", "Arbitration", "Intellectual Property Law", "Legal Compliance", "Mediation"]}
}

# Get the profession and its associated skills
category = category_mapping.get(prediction_id, "Unknown")
profession_name = category["name"]
required_skills_dict = {cat["name"]: cat["skills"] for cat in category_mapping.values()}
resume_skills = extract_skills_from_resume(cleaned_resume, profession_name, required_skills_dict)
match_percent, missing = skill_gap_analysis(resume_text, profession_name, required_skills_dict)

# for skill in missing:
#     print(f"\n {skill.capitalize()}:")
#     print(get_skill_info(skill))
prompt = f"Explain the following skills in simple terms. What are they, why are they important in the IT industry, and how can someone learn each of them give them in json format skills, description?\n\n"
prompt += "\n".join([f"'{skill}'" for skill in missing])
skill_info = get_skill_info(missing, prompt)


# Output the profession and skills
# print("Prediction:", category["name"])
# print("Skills Required:")
# for skill in category["skills"]:
#     print(f"- {skill}")

output = {
    "prediction": category["name"],
    "skills": category["skills"],
    "match_percent": match_percent,
    "missing_skills": missing,
    "skill_info": skill_info
}
print(json.dumps(output))
# print(cleaned_resume)
# print(skill_vector)
# print(resume_skills)



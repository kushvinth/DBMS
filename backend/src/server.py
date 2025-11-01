from fastapi import FastAPI
from contextlib import asynccontextmanager
from src.db.connection import get_connection
from src.auth.routes import router as admin_router
import pandas as pd
import joblib
from sklearn.preprocessing import StandardScaler, LabelEncoder
from dotenv import load_dotenv
import os
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from src.routes.student_routes import router as student_router
from src.routes.performance_routes import router as performance_router

load_dotenv()
loaded_model = joblib.load(os.getenv("MODEL_PATH"))




class InputData(BaseModel):
    IQ: float
    Prev_Sem_Result: float
    CGPA: float
    Academic_Performance: float
    Extra_Curricular_Score: float
    Communication_Skills: float
    Projects_Completed: int
    Internship_Experience_Yes: int

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🔄 Checking MySQL connection...")
    conn = get_connection()
    if conn and conn.is_connected():
        print("✅ Connected to MySQL.")
        conn.close()
    yield

app = FastAPI(title="Placement Prediction API", version="1.0", lifespan=lifespan)
origins = [
    "http://localhost:5173",  
    "http://127.0.0.1:5173",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(admin_router) # admin endpoints
app.include_router(student_router) # student endpoints
app.include_router(performance_router) # performance routes

@app.post("/predict")
def predict(data: list[InputData]):
    """
    Predict placement status for given student data.
    Random Forest models don't require feature scaling.
    """
    try:
        # Validate input
        if not data or len(data) == 0:
            return {"error": "No data provided", "input_count": 0, "predictions": []}
        
        # Convert to DataFrame
        df = pd.DataFrame([d.dict() for d in data])
        
        # Ensure correct column order
        feature_columns = [
            'IQ', 'Prev_Sem_Result', 'CGPA', 'Academic_Performance',
            'Extra_Curricular_Score', 'Communication_Skills', 
            'Projects_Completed', 'Internship_Experience_Yes'
        ]
        df = df[feature_columns]
        
        # Make predictions (Random Forest doesn't need scaling)
        predictions = loaded_model.predict(df)
        
        # Convert predictions to readable format
        # Model outputs 0/1, convert to No/Yes
        placement_predictions = ['Yes' if pred == 1 else 'No' for pred in predictions]
        
        # Optionally save predictions to database
        try:
            conn = get_connection()
            if conn:
                cur = conn.cursor()
                for i, input_data in enumerate(data):
                    insert_query = """
                    INSERT INTO predictions 
                    (IQ, Prev_Sem_Result, CGPA, Academic_Performance, 
                     Extra_Curricular_Score, Communication_Skills, 
                     Projects_Completed, Internship_Experience_Yes, predicted_status)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """
                    cur.execute(insert_query, (
                        input_data.IQ,
                        input_data.Prev_Sem_Result,
                        input_data.CGPA,
                        input_data.Academic_Performance,
                        input_data.Extra_Curricular_Score,
                        input_data.Communication_Skills,
                        input_data.Projects_Completed,
                        input_data.Internship_Experience_Yes,
                        placement_predictions[i]
                    ))
                conn.commit()
                cur.close()
                conn.close()
        except Exception as db_error:
            # If database save fails, continue without it
            print(f"⚠️  Warning: Could not save prediction to database: {db_error}")
        
        return {
            "input_count": len(data),
            "predictions": placement_predictions
        }
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        import traceback
        traceback.print_exc()
        return {
            "error": str(e),
            "input_count": 0,
            "predictions": []
        }

@app.get("/predict/student/{student_id}")
def predict_by_student_id(student_id: int):
    """
    Predict placement status for a student by their ID.
    Fetches student data from database and makes prediction.
    """
    try:
        # Fetch student data from database
        conn = get_connection()
        if not conn:
            return {"error": "Database connection failed"}
        
        cur = conn.cursor(dictionary=True)
        query = """
        SELECT id, name, email, iq, prev_sem_result, cgpa, academic_performance,
               communication_skills, extra_curricular_score, projects_completed, 
               internship_experience
        FROM students WHERE id = %s
        """
        cur.execute(query, (student_id,))
        student = cur.fetchone()
        cur.close()
        conn.close()
        
        if not student:
            return {"error": f"Student with ID {student_id} not found"}
        
        # Check if student has all required data
        required_fields = ['iq', 'prev_sem_result', 'cgpa', 'academic_performance',
                          'communication_skills', 'extra_curricular_score', 
                          'projects_completed', 'internship_experience']
        
        missing_fields = [field for field in required_fields if student.get(field) is None]
        if missing_fields:
            return {
                "error": "Student data incomplete",
                "missing_fields": missing_fields,
                "message": "Please update student record with all required fields"
            }
        
        # Prepare data for prediction
        prediction_input = {
            'IQ': float(student['iq']),
            'Prev_Sem_Result': float(student['prev_sem_result']),
            'CGPA': float(student['cgpa']),
            'Academic_Performance': float(student['academic_performance']),
            'Extra_Curricular_Score': float(student['extra_curricular_score']),
            'Communication_Skills': float(student['communication_skills']),
            'Projects_Completed': int(student['projects_completed']),
            'Internship_Experience_Yes': 1 if student['internship_experience'] else 0
        }
        
        # Create DataFrame
        df = pd.DataFrame([prediction_input])
        
        # Ensure correct column order
        feature_columns = [
            'IQ', 'Prev_Sem_Result', 'CGPA', 'Academic_Performance',
            'Extra_Curricular_Score', 'Communication_Skills', 
            'Projects_Completed', 'Internship_Experience_Yes'
        ]
        df = df[feature_columns]
        
        # Make prediction
        prediction = loaded_model.predict(df)[0]
        prediction_result = 'Yes' if prediction == 1 else 'No'
        
        # Save prediction to database
        try:
            conn = get_connection()
            if conn:
                cur = conn.cursor()
                insert_query = """
                INSERT INTO predictions 
                (student_id, IQ, Prev_Sem_Result, CGPA, Academic_Performance, 
                 Extra_Curricular_Score, Communication_Skills, 
                 Projects_Completed, Internship_Experience_Yes, predicted_status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """
                cur.execute(insert_query, (
                    student_id,
                    prediction_input['IQ'],
                    prediction_input['Prev_Sem_Result'],
                    prediction_input['CGPA'],
                    prediction_input['Academic_Performance'],
                    prediction_input['Extra_Curricular_Score'],
                    prediction_input['Communication_Skills'],
                    prediction_input['Projects_Completed'],
                    prediction_input['Internship_Experience_Yes'],
                    prediction_result
                ))
                conn.commit()
                cur.close()
                conn.close()
        except Exception as db_error:
            print(f"⚠️  Warning: Could not save prediction to database: {db_error}")
        
        return {
            "student_id": student_id,
            "student_name": student['name'],
            "student_email": student['email'],
            "prediction": prediction_result,
            "student_data": prediction_input
        }
        
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        import traceback
        traceback.print_exc()
        return {"error": str(e)}

@app.get("/")
def root():
    return {"message": "Placement Prediction API is running 🚀"}

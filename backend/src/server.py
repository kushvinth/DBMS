from fastapi import FastAPI, HTTPException
from contextlib import asynccontextmanager
from db.connection import get_connection
from auth.routes import router as admin_router
import requests
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from routes.student_routes import router as student_router
from routes.performance_routes import router as performance_router

load_dotenv()

# ✅ Startup check for MySQL connection
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🔄 Checking MySQL connection...")
    conn = get_connection()
    if conn and conn.is_connected():
        print("✅ Connected to MySQL.")
        conn.close()
    yield

# ✅ Initialize app
app = FastAPI(title="Placement Prediction API", version="1.0", lifespan=lifespan)

# ✅ CORS setup
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://mudfish-complete-luckily.ngrok-free.app"  # include ngrok for frontend access
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Register routes
app.include_router(admin_router)
app.include_router(student_router)
app.include_router(performance_router)


@app.get("/")
def root():
    return {"message": "Placement Prediction API is running 🚀"}


# ✅ Unified prediction route
@app.get("/predict/student/{student_id}")
def predict_by_student_id(student_id: int):
    """
    Fetch student data by ID → send to ngrok ML API → return prediction + student info.
    """
    try:
        # 1️⃣ Fetch student data from the database
        conn = get_connection()
        if not conn:
            raise HTTPException(status_code=500, detail="Database connection failed")

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
            raise HTTPException(status_code=404, detail=f"Student with ID {student_id} not found")

        # 2️⃣ Check for missing fields
        required_fields = [
            'iq', 'prev_sem_result', 'cgpa', 'academic_performance',
            'communication_skills', 'extra_curricular_score',
            'projects_completed', 'internship_experience'
        ]
        missing_fields = [f for f in required_fields if student.get(f) is None]
        if missing_fields:
            return {
                "error": "Student data incomplete",
                "missing_fields": missing_fields,
                "message": "Please update student record with all required fields"
            }

        # 3️⃣ Prepare payload for ML API (as a list of one object)
        payload = [
            {
                "IQ": float(student['iq']),
                "Prev_Sem_Result": float(student['prev_sem_result']),
                "CGPA": float(student['cgpa']),
                "Academic_Performance": float(student['academic_performance']),
                "Extra_Curricular_Score": float(student['extra_curricular_score']),
                "Communication_Skills": float(student['communication_skills']),
                "Projects_Completed": int(student['projects_completed']),
                "Internship_Experience_Yes": 1 if student['internship_experience'] else 0,
            }
        ]

        # 4️⃣ Send to ML model API
        try:
            response = requests.post(
                "https://mudfish-complete-luckily.ngrok-free.app/predict",
                json=payload,  # ✅ send as list
                timeout=15
            )
            response.raise_for_status()
        except requests.RequestException as e:
            raise HTTPException(status_code=500, detail=f"ML model request failed: {e}")

        ml_response = response.json()
        prediction = ml_response.get("prediction", "Unknown")

        # 5️⃣ Return combined data to frontend
        return {
            "student_id": student['id'],
            "student_name": student['name'],
            "student_email": student['email'],
            "prediction": prediction,
            "student_data": payload[0]
        }

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

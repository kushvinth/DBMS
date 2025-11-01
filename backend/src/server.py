from fastapi import FastAPI
from contextlib import asynccontextmanager
from db.connection import get_connection
from auth.routes import router as admin_router
import pandas as pd
import joblib
from sklearn.preprocessing import StandardScaler, LabelEncoder
from dotenv import load_dotenv
import os
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from routes.student_routes import router as student_router
from routes.performance_routes import router as performance_router

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
    df = pd.DataFrame([d.dict() for d in data])
    sc_new = StandardScaler()
    sc_new.fit(df)
    new_data_scaled = sc_new.transform(df)
    predictions = loaded_model.predict(new_data_scaled)

    le_new = LabelEncoder()
    le_new.fit(['No', 'Yes'])
    placement_predictions = le_new.inverse_transform(predictions)
    return {
        "input_count": len(data),
        "predictions": placement_predictions.tolist()
    }

@app.get("/")
def root():
    return {"message": "Placement Prediction API is running 🚀"}

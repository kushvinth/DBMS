from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib
from sklearn.preprocessing import StandardScaler, LabelEncoder
from dotenv import load_dotenv
import os

load_dotenv()
loaded_model = joblib.load(os.getenv("MODEL_PATH"))

app = FastAPI(title="Placement Prediction API", version="1.0")

class InputData(BaseModel):
    IQ: float
    Prev_Sem_Result: float
    CGPA: float
    Academic_Performance: float
    Extra_Curricular_Score: float
    Communication_Skills: float
    Projects_Completed: int
    Internship_Experience_Yes: int  # 1 for Yes, 0 for No


@app.post("/predict")
def predict(data: list[InputData]):
    """
    Predict placement outcome based on provided candidate data.
    """
    # Convert list of InputData objects into DataFrame
    df = pd.DataFrame([d.dict() for d in data])

    # Scale features (⚠️ Must be fitted on training data in production)
    sc_new = StandardScaler()
    sc_new.fit(df)  # Replace with pre-fitted scaler in real use
    new_data_scaled = sc_new.transform(df)

    # Make predictions
    predictions = loaded_model.predict(new_data_scaled)

    # Decode predictions (0 -> 'No', 1 -> 'Yes')
    le_new = LabelEncoder()
    le_new.fit(['No', 'Yes'])
    placement_predictions = le_new.inverse_transform(predictions)

    # Return predictions
    return {
        "input_count": len(data),
        "predictions": placement_predictions.tolist()
    }


@app.get("/")
def root():
    return {"message": "Placement Prediction API is running 🚀"}

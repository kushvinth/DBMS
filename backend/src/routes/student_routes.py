# src/routes/student_routes.py
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
from src.auth.deps import get_current_admin
import src.models.student_model as student_model

router = APIRouter(prefix="/admin/students", tags=["Students"])

class StudentIn(BaseModel):
    name: str
    email: EmailStr
    cgpa: Optional[float] = None
    iq: Optional[float] = None
    prev_sem_result: Optional[float] = None
    academic_performance: Optional[float] = None
    communication_skills: Optional[float] = None
    extra_curricular_score: Optional[float] = None
    projects_completed: Optional[int] = 0
    internship_experience: Optional[bool] = False

@router.post("", summary="Add a new student")
def add_student(payload: StudentIn, admin=Depends(get_current_admin)):
    student = payload.dict()
    try:
        new_id = student_model.add_student(student)
        return {"student_id": new_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("", summary="List students")
def list_students(admin=Depends(get_current_admin)):
    return student_model.get_all_students()

@router.get("/{student_id}", summary="Get student by id")
def get_student(student_id: int, admin=Depends(get_current_admin)):
    s = student_model.get_student_by_id(student_id)
    if not s:
        raise HTTPException(status_code=404, detail="Student not found")
    return s

@router.put("/{student_id}", summary="Update student")
def update_student(student_id: int, payload: StudentIn, admin=Depends(get_current_admin)):
    ok = student_model.update_student(student_id, payload.dict(exclude_unset=True))
    if not ok:
        raise HTTPException(status_code=404, detail="Student not found or no changes")
    return {"message": "updated"}

@router.delete("/{student_id}", summary="Delete student")
def delete_student(student_id: int, admin=Depends(get_current_admin)):
    ok = student_model.delete_student(student_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"message": "deleted"}

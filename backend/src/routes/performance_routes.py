from fastapi import APIRouter, Depends, HTTPException
from db.connection import get_connection
from auth.deps import get_current_admin

router = APIRouter(prefix="/admin/performance", tags=["Performance"])

@router.get("/summary")
def get_performance_summary(admin=Depends(get_current_admin)):
    conn = get_connection()
    cur = conn.cursor(dictionary=True)

    cur.execute("SELECT AVG(CGPA) AS avg_cgpa, AVG(IQ) AS avg_iq FROM students")
    averages = cur.fetchone()

    cur.execute("SELECT COUNT(*) AS total, SUM(CASE WHEN predicted_status='Yes' THEN 1 ELSE 0 END) AS placed FROM predictions")
    placement = cur.fetchone()

    conn.close()

    summary = {
        "average_cgpa": round(averages["avg_cgpa"], 2) if averages["avg_cgpa"] else 0,
        "average_iq": round(averages["avg_iq"], 2) if averages["avg_iq"] else 0,
        "placement_rate": round((placement["placed"] / placement["total"] * 100), 2) if placement["total"] else 0
    }

    return summary

@router.get("/top-performers")
def get_top_performers(admin=Depends(get_current_admin)):
    conn = get_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT id, name, CGPA FROM students ORDER BY CGPA DESC LIMIT 5")
    top_students = cur.fetchall()
    conn.close()
    return {"top_performers": top_students}

@router.get("/skill-distribution")
def get_skill_distribution(admin=Depends(get_current_admin)):
    conn = get_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("""
        SELECT s.name AS skill, COUNT(ss.student_id) AS count
        FROM skills s
        LEFT JOIN student_skills ss ON s.id = ss.skill_id
        GROUP BY s.name
    """)
    data = cur.fetchall()
    conn.close()
    return {"skill_distribution": data}

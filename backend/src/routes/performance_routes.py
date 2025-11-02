from fastapi import APIRouter, Depends, HTTPException
from auth.deps import get_current_admin
from db.connection import get_connection

router = APIRouter(prefix="/admin/performance", tags=["Performance"])

@router.get("/summary")
def get_performance_summary(admin=Depends(get_current_admin)):
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    cur = conn.cursor(dictionary=True)

    try:
        # Get average CGPA and IQ from students table
        cur.execute("SELECT AVG(CGPA) AS avg_cgpa, AVG(IQ) AS avg_iq FROM students")
        averages = cur.fetchone()

        # Get placement rate from predictions table (if it exists)
        placement_rate = 0
        try:
            cur.execute("SELECT COUNT(*) AS total, SUM(CASE WHEN predicted_status='Yes' THEN 1 ELSE 0 END) AS placed FROM predictions")
            placement = cur.fetchone()
            if placement and placement["total"] and placement["total"] > 0:
                placement_rate = round((placement["placed"] / placement["total"] * 100), 2)
        except Exception:
            # predictions table doesn't exist yet, use 0 as default
            placement_rate = 0

        summary = {
            "average_cgpa": round(averages["avg_cgpa"], 2) if averages and averages["avg_cgpa"] else 0,
            "average_iq": round(averages["avg_iq"], 2) if averages and averages["avg_iq"] else 0,
            "placement_rate": placement_rate
        }

        return summary
    finally:
        cur.close()
        conn.close()

@router.get("/top-performers")
def get_top_performers(admin=Depends(get_current_admin)):
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    cur = conn.cursor(dictionary=True)
    try:
        cur.execute("SELECT id, name, CGPA FROM students WHERE CGPA IS NOT NULL ORDER BY CGPA DESC LIMIT 5")
        top_students = cur.fetchall()
        return {"top_performers": top_students}
    finally:
        cur.close()
        conn.close()

@router.get("/skill-distribution")
def get_skill_distribution(admin=Depends(get_current_admin)):
    conn = get_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    cur = conn.cursor(dictionary=True)
    try:
        # Try to get skill distribution if tables exist
        try:
            cur.execute("""
                SELECT s.name AS skill, COUNT(ss.student_id) AS count
                FROM skills s
                LEFT JOIN student_skills ss ON s.id = ss.skill_id
                GROUP BY s.name
            """)
            data = cur.fetchall()
        except Exception:
            # Skills tables don't exist, return empty array
            data = []
        
        return {"skill_distribution": data}
    finally:
        cur.close()
        conn.close()

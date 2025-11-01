# src/models/student_model.py
from src.db.connection import get_connection

def add_student(student: dict):
    conn = get_connection()
    cur = conn.cursor()
    sql = """
    INSERT INTO students
    (name, email, cgpa, iq, prev_sem_result, academic_performance,
     communication_skills, extra_curricular_score, projects_completed, internship_experience)
    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """
    params = (
        student.get("name"), student.get("email"), student.get("cgpa"), student.get("iq"),
        student.get("prev_sem_result"), student.get("academic_performance"),
        student.get("communication_skills"), student.get("extra_curricular_score"),
        student.get("projects_completed", 0), student.get("internship_experience", False)
    )
    cur.execute(sql, params)
    conn.commit()
    new_id = cur.lastrowid
    cur.close()
    conn.close()
    return new_id

def get_all_students():
    conn = get_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM students ORDER BY id DESC")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

def get_student_by_id(student_id: int):
    conn = get_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM students WHERE id = %s", (student_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    return row

def update_student(student_id: int, updates: dict):
    conn = get_connection()
    cur = conn.cursor()
    # Build update query dynamically but safely (parameterized)
    fields = []
    values = []
    for k, v in updates.items():
        fields.append(f"{k} = %s")
        values.append(v)
    if not fields:
        cur.close(); conn.close(); return False
    sql = "UPDATE students SET " + ", ".join(fields) + " WHERE id = %s"
    values.append(student_id)
    cur.execute(sql, tuple(values))
    conn.commit()
    affected = cur.rowcount
    cur.close()
    conn.close()
    return affected > 0

def delete_student(student_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM students WHERE id = %s", (student_id,))
    conn.commit()
    affected = cur.rowcount
    cur.close()
    conn.close()
    return affected > 0

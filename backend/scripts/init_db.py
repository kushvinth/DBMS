"""
Database Initialization Script
Creates the admins table and sets up default admin user
"""
import sys
import os

# Add parent directory to path to import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.db.connection import get_connection
from src.auth.hashing import hash_password
from mysql.connector import Error

def create_admins_table():
    """Create the admins table if it doesn't exist"""
    conn = get_connection()
    if not conn:
        print("❌ Failed to connect to database")
        return False
    
    try:
        cur = conn.cursor()
        
        # Create admins table
        create_table_query = """
        CREATE TABLE IF NOT EXISTS admins (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            hashed_password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """
        
        cur.execute(create_table_query)
        conn.commit()
        print("✅ Admins table created or already exists")
        cur.close()
        conn.close()
        return True
        
    except Error as e:
        print(f"❌ Error creating admins table: {e}")
        conn.close()
        return False

def create_default_admin(username: str = "admin", password: str = "admin123", force_recreate: bool = False):
    """Create default admin user if it doesn't exist"""
    conn = get_connection()
    if not conn:
        print("❌ Failed to connect to database")
        return False
    
    try:
        cur = conn.cursor(dictionary=True)
        
        # Check if admin already exists
        cur.execute("SELECT * FROM admins WHERE username = %s", (username,))
        existing_admin = cur.fetchone()
        
        if existing_admin and not force_recreate:
            print(f"ℹ️  Admin user '{username}' already exists")
            print(f"   Use force_recreate=True to update the password")
            cur.close()
            conn.close()
            return True
        
        # Hash the password
        print(f"🔐 Hashing password...")
        hashed_pwd = hash_password(password)
        print(f"✅ Password hashed successfully")
        
        if existing_admin and force_recreate:
            # Update existing admin password
            print(f"🔄 Updating existing admin user...")
            update_query = "UPDATE admins SET hashed_password = %s WHERE username = %s"
            cur.execute(update_query, (hashed_pwd, username))
            conn.commit()
            print(f"✅ Admin user password updated:")
        else:
            # Create new admin user
            insert_query = "INSERT INTO admins (username, hashed_password) VALUES (%s, %s)"
            cur.execute(insert_query, (username, hashed_pwd))
            conn.commit()
            print(f"✅ Default admin user created:")
        
        print(f"   Username: {username}")
        print(f"   Password: {password}")
        print(f"   ⚠️  Please change the password after first login!")
        
        cur.close()
        conn.close()
        return True
        
    except Error as e:
        print(f"❌ Error creating admin user: {e}")
        import traceback
        traceback.print_exc()
        conn.close()
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        conn.close()
        return False

def create_predictions_table():
    """Create the predictions table if it doesn't exist"""
    conn = get_connection()
    if not conn:
        print("❌ Failed to connect to database")
        return False
    
    try:
        cur = conn.cursor()
        
        # Create predictions table
        create_table_query = """
        CREATE TABLE IF NOT EXISTS predictions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            student_id INT,
            IQ FLOAT,
            Prev_Sem_Result FLOAT,
            CGPA FLOAT,
            Academic_Performance FLOAT,
            Extra_Curricular_Score FLOAT,
            Communication_Skills FLOAT,
            Projects_Completed INT,
            Internship_Experience_Yes INT,
            predicted_status VARCHAR(10) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL,
            INDEX idx_predicted_status (predicted_status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """
        
        cur.execute(create_table_query)
        conn.commit()
        print("✅ Predictions table created or already exists")
        cur.close()
        conn.close()
        return True
        
    except Error as e:
        # If foreign key constraint fails, create table without foreign key
        try:
            cur = conn.cursor()
            create_table_query = """
            CREATE TABLE IF NOT EXISTS predictions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT,
                IQ FLOAT,
                Prev_Sem_Result FLOAT,
                CGPA FLOAT,
                Academic_Performance FLOAT,
                Extra_Curricular_Score FLOAT,
                Communication_Skills FLOAT,
                Projects_Completed INT,
                Internship_Experience_Yes INT,
                predicted_status VARCHAR(10) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_predicted_status (predicted_status)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            """
            cur.execute(create_table_query)
            conn.commit()
            print("✅ Predictions table created or already exists (without foreign key)")
            cur.close()
            conn.close()
            return True
        except Error as e2:
            print(f"❌ Error creating predictions table: {e2}")
            conn.close()
            return False

def init_database(force_recreate: bool = False):
    """Initialize database - create tables and default admin"""
    print("🔄 Initializing database...")
    print("-" * 50)
    
    # Create admins table
    if not create_admins_table():
        print("❌ Failed to create admins table")
        return False
    
    # Create predictions table
    if not create_predictions_table():
        print("⚠️  Failed to create predictions table (continuing anyway)")
    
    # Create default admin user
    if not create_default_admin(force_recreate=force_recreate):
        print("❌ Failed to create default admin user")
        return False
    
    print("-" * 50)
    print("✅ Database initialization completed successfully!")
    return True

if __name__ == "__main__":
    import sys
    # Allow force recreate via command line argument
    force_recreate = "--force" in sys.argv or "-f" in sys.argv
    if force_recreate:
        print("⚠️  Force recreate mode: Will update existing admin password")
    init_database(force_recreate=force_recreate)

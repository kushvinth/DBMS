"""
Script to fix/update admin password in database
This will delete and recreate the admin user with the new hashing method
"""
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.db.connection import get_connection
from src.auth.hashing import hash_password, verify_password
from mysql.connector import Error

def fix_admin_password():
    """Delete and recreate admin user with new password hash"""
    conn = get_connection()
    if not conn:
        print("❌ Failed to connect to database")
        return False
    
    username = "admin"
    password = "admin123"
    
    try:
        cur = conn.cursor(dictionary=True)
        
        # Delete existing admin
        print("🔄 Deleting existing admin user (if exists)...")
        cur.execute("DELETE FROM admins WHERE username = %s", (username,))
        conn.commit()
        print("✅ Deleted existing admin")
        
        # Create new admin with new hash
        print(f"🔐 Creating new admin user with password '{password}'...")
        hashed_pwd = hash_password(password)
        print(f"✅ Password hashed: {hashed_pwd[:50]}...")
        
        # Verify the hash works
        print("🔍 Verifying hash works...")
        test_verify = verify_password(password, hashed_pwd)
        print(f"   Hash verification test: {'✅ PASSED' if test_verify else '❌ FAILED'}")
        
        if not test_verify:
            print("❌ Hash verification failed! Something is wrong with hashing.")
            cur.close()
            conn.close()
            return False
        
        # Insert new admin
        insert_query = "INSERT INTO admins (username, hashed_password) VALUES (%s, %s)"
        cur.execute(insert_query, (username, hashed_pwd))
        conn.commit()
        
        # Verify it was inserted correctly
        cur.execute("SELECT * FROM admins WHERE username = %s", (username,))
        new_admin = cur.fetchone()
        
        if new_admin:
            print(f"✅ Admin user created successfully!")
            print(f"   Username: {new_admin['username']}")
            print(f"   Hash: {new_admin['hashed_password'][:50]}...")
            
            # Final verification
            print("\n🔍 Final verification test...")
            final_verify = verify_password(password, new_admin['hashed_password'])
            print(f"   Final verification: {'✅ PASSED' if final_verify else '❌ FAILED'}")
            
            if final_verify:
                print("\n✅ SUCCESS! Admin user is ready to use:")
                print(f"   Username: {username}")
                print(f"   Password: {password}")
            else:
                print("\n❌ FAILED! Password verification failed after insertion.")
                cur.close()
                conn.close()
                return False
        else:
            print("❌ Admin user was not inserted correctly")
            cur.close()
            conn.close()
            return False
        
        cur.close()
        conn.close()
        return True
        
    except Error as e:
        print(f"❌ Database error: {e}")
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

if __name__ == "__main__":
    print("=" * 60)
    print("Admin Password Fix Script")
    print("=" * 60)
    print()
    fix_admin_password()

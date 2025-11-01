"""
Debug script to check admin user in database
"""
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.db.connection import get_connection
from src.auth.hashing import hash_password, verify_password

def check_admin():
    """Check if admin user exists and verify password"""
    conn = get_connection()
    if not conn:
        print("❌ Failed to connect to database")
        return
    
    try:
        cur = conn.cursor(dictionary=True)
        
        # Check if admins table exists
        cur.execute("SHOW TABLES LIKE 'admins'")
        table_exists = cur.fetchone()
        if not table_exists:
            print("❌ Admins table does not exist!")
            cur.close()
            conn.close()
            return
        
        print("✅ Admins table exists")
        
        # Get admin user
        cur.execute("SELECT * FROM admins WHERE username = %s", ("admin",))
        admin = cur.fetchone()
        
        if not admin:
            print("❌ Admin user 'admin' does not exist!")
            print("   Run: python scripts/init_db.py")
        else:
            print(f"✅ Admin user found:")
            print(f"   ID: {admin.get('id')}")
            print(f"   Username: {admin.get('username')}")
            print(f"   Hashed Password: {admin.get('hashed_password')[:50]}...")
            
            # Test password verification
            test_password = "admin123"
            is_valid = verify_password(test_password, admin.get('hashed_password'))
            print(f"\n🔐 Testing password verification:")
            print(f"   Testing password: '{test_password}'")
            print(f"   Result: {'✅ VALID' if is_valid else '❌ INVALID'}")
            
            # Try to create a new hash to see if hashing works
            print(f"\n🔐 Testing password hashing:")
            try:
                new_hash = hash_password(test_password)
                print(f"   ✅ Hashing works! Generated hash: {new_hash[:50]}...")
                
                # Verify the new hash
                verify_new = verify_password(test_password, new_hash)
                print(f"   New hash verification: {'✅ VALID' if verify_new else '❌ INVALID'}")
            except Exception as e:
                print(f"   ❌ Hashing failed: {e}")
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        conn.close()

if __name__ == "__main__":
    check_admin()

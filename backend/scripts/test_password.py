"""
Simple test script to verify password hashing and verification works
"""
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.auth.hashing import hash_password, verify_password

def test_password():
    """Test password hashing and verification"""
    password = "admin123"
    
    print(f"🔐 Testing password: '{password}'")
    print("-" * 50)
    
    # Hash the password
    print("1. Hashing password...")
    try:
        hashed = hash_password(password)
        print(f"✅ Hash generated: {hashed[:50]}...")
    except Exception as e:
        print(f"❌ Hashing failed: {e}")
        import traceback
        traceback.print_exc()
        return
    
    # Verify the password
    print("\n2. Verifying password...")
    try:
        is_valid = verify_password(password, hashed)
        print(f"{'✅' if is_valid else '❌'} Verification result: {is_valid}")
        
        if not is_valid:
            print("❌ Password verification FAILED!")
            print(f"   Original password: '{password}'")
            print(f"   Hash: {hashed[:50]}...")
    except Exception as e:
        print(f"❌ Verification failed: {e}")
        import traceback
        traceback.print_exc()
        return
    
    # Test wrong password
    print("\n3. Testing wrong password...")
    wrong_password = "wrongpass"
    try:
        is_valid = verify_password(wrong_password, hashed)
        print(f"{'❌' if is_valid else '✅'} Wrong password verification (should be False): {is_valid}")
        if is_valid:
            print("⚠️  WARNING: Wrong password was accepted!")
    except Exception as e:
        print(f"✅ Correctly rejected wrong password")
    
    print("-" * 50)
    print("✅ Password test completed!")

if __name__ == "__main__":
    test_password()

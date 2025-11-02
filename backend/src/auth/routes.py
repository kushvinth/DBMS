from fastapi import APIRouter, Form, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from auth.hashing import verify_password
from auth.jwt_handler import create_access_token, decode_access_token
from models.admin_model import get_admin_by_username

router = APIRouter(prefix="/admin", tags=["Admin"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/admin/login")

@router.post("/login")
def login(username: str = Form(...), password: str = Form(...)):
    # Debug logging (remove in production)
    print(f"🔍 Login attempt - Username: {username}, Password length: {len(password)}")
    
    admin = get_admin_by_username(username)
    if not admin:
        print(f"❌ User '{username}' not found in database")
        raise HTTPException(status_code=400, detail="Invalid username")

    print(f"✅ User found: {admin.get('username')}")
    print(f"🔐 Stored hash (first 50 chars): {admin['hashed_password'][:50]}...")
    print(f"🔐 Verifying password...")
    
    # Verify password with better error handling
    try:
        stored_hash = admin["hashed_password"]
        print(f"   Input password: '{password}'")
        print(f"   Stored hash: {stored_hash[:50]}...")
        
        is_valid = verify_password(password, stored_hash)
        print(f"   Verification result: {is_valid}")
        
        if not is_valid:
            print(f"❌ Password verification failed for user '{username}'")
            print(f"   Trying to understand why...")
            
            # Try to hash the input password and compare
            from src.auth.hashing import hash_password
            test_hash = hash_password(password)
            print(f"   New hash of input password: {test_hash[:50]}...")
            print(f"   Hashes match: {stored_hash == test_hash}")
            
            raise HTTPException(status_code=400, detail="Invalid password")
        print(f"✅ Password verified successfully")
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Password verification error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail="Invalid password")

    token = create_access_token({"sub": username})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/dashboard")
def dashboard(token: str = Depends(oauth2_scheme)):
    username = decode_access_token(token)
    return {"message": f"Welcome, {username}! You are authenticated~"}

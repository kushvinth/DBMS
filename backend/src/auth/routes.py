from fastapi import APIRouter, Form, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from auth.hashing import verify_password
from auth.jwt_handler import create_access_token, decode_access_token
from models.admin_model import get_admin_by_username

router = APIRouter(prefix="/admin", tags=["Admin"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/admin/login")

@router.post("/login")
def login(username: str = Form(...), password: str = Form(...)):
    admin = get_admin_by_username(username)
    if not admin:
        raise HTTPException(status_code=400, detail="Invalid username")

    if not verify_password(password, admin["hashed_password"]):
        raise HTTPException(status_code=400, detail="Invalid password")

    token = create_access_token({"sub": username})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/dashboard")
def dashboard(token: str = Depends(oauth2_scheme)):
    username = decode_access_token(token)
    return {"message": f"Welcome, {username}! You are authenticated~"}

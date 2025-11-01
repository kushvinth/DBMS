# src/auth/deps.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from src.auth.jwt_handler import decode_access_token
from src.models.admin_model import get_admin_by_username

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/admin/login")

def get_current_admin(token: str = Depends(oauth2_scheme)):
    username = decode_access_token(token)  # should raise HTTPException on invalid token
    admin = get_admin_by_username(username)
    if not admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid admin")
    return admin

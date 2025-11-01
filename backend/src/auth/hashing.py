import bcrypt

def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.
    Bcrypt has a 72-byte limit, so we truncate if necessary.
    """
    # Encode to bytes and truncate to 72 bytes if needed
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    
    # Generate salt and hash
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain: str, hashed: str) -> bool:
    """
    Verify a plain password against a hashed password.
    """
    try:
        # Validate inputs
        if not plain or not hashed:
            print(f"❌ verify_password: Missing plain or hashed password")
            return False
        
        # Check if hash looks like a bcrypt hash (should start with $2a$, $2b$, or $2y$)
        if not (hashed.startswith('$2a$') or hashed.startswith('$2b$') or hashed.startswith('$2y$')):
            print(f"❌ verify_password: Hash doesn't look like bcrypt hash. Hash: {hashed[:30]}...")
            return False
        
        # Encode both to bytes for comparison
        plain_bytes = plain.encode('utf-8')
        # Truncate to 72 bytes if needed
        if len(plain_bytes) > 72:
            plain_bytes = plain_bytes[:72]
        hashed_bytes = hashed.encode('utf-8')
        
        # Verify password
        result = bcrypt.checkpw(plain_bytes, hashed_bytes)
        return result
    except Exception as e:
        print(f"❌ Password verification error: {e}")
        import traceback
        traceback.print_exc()
        return False

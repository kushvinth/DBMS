# DBMS Backend

FastAPI backend for student placement prediction system.

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

**Note**: Make sure you also have `passlib[bcrypt]` and `python-jose[cryptography]` installed for authentication:
```bash
pip install passlib[bcrypt] python-jose[cryptography]
```

### 2. Database Configuration

Create a `.env` file in the `backend` directory with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=student_placement
MODEL_PATH=model/random_forest_model.pkl
```

### 3. Initialize Database

Run the database initialization script to create the `admins` table and default admin user:

```bash
python scripts/init_db.py
```

This will:
- Create the `admins` table if it doesn't exist
- Create a default admin user with credentials:
  - **Username**: `admin`
  - **Password**: `admin123`

**⚠️ Important**: Change the default password after first login!

### 4. Run the Server

```bash
uvicorn src.server:app --reload --host 0.0.0.0 --port 8000
```

Or if you have a different entry point:
```bash
uvicorn src.server:app --reload
```

## API Endpoints

- `POST /admin/login` - Admin login
- `GET /admin/dashboard` - Admin dashboard (requires authentication)
- Other endpoints for students and performance...

## Default Admin Credentials

After running `scripts/init_db.py`, you can login with:
- **Username**: `admin`
- **Password**: `admin123`

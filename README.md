# AJ Media Productions

## Structure
- `frontend/index.html` — homepage
- `frontend/styles.css` — responsive dark/cream/gold styling
- `frontend/script.js` — mobile navigation, booking modal, WhatsApp enquiry
- `backend/main.py` — FastAPI API with SQLite booking storage
- `backend/requirements.txt` — Python dependencies

## Run the frontend
Open `frontend/index.html` in a browser or use VS Code Live Server.

## Run the backend
In a terminal:
```bash
python -m venv .venv
# Windows PowerShell: .venv\Scripts\
cd backendActivate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
API docs: http://127.0.0.1:8000/docs


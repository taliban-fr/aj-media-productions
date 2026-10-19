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
cd backend
python -m venv .venv
# Windows PowerShell: .venv\Scripts\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
API docs: http://127.0.0.1:8000/docs

## Customize before publishing
- Replace `WHATSAPP_NUMBER` in `frontend/script.js` with your number, digits only.
- Replace the Instagram URL in `frontend/script.js`.
- Replace example prices and placeholder testimonials with accurate details.
- Add your logo, photography and optimized video under `frontend/assets/`.
- In `frontend/index.html`, uncomment the video element and add `assets/video/hero.mp4`.
- Tighten CORS and add production security before deployment.

The starter currently saves booking enquiries in SQLite. Client accounts, admin dashboard and payments are future steps.

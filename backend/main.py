from contextlib import asynccontextmanager
from datetime import date
from pathlib import Path
import sqlite3

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field

DB_PATH = Path(__file__).resolve().parent / "aj_media.db"


def initialize_database():
    with sqlite3.connect(DB_PATH) as db:
        db.execute("""
            CREATE TABLE IF NOT EXISTS bookings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT NOT NULL,
                service TEXT NOT NULL,
                preferred_date TEXT NOT NULL,
                budget TEXT NOT NULL,
                details TEXT,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        """)
        db.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize_database()
    yield


app = FastAPI(
    title="AJ Media Productions API",
    description="Starter API for photography booking enquiries.",
    version="0.1.0",
    lifespan=lifespan,
)
# Local development only. Set the exact deployed frontend origin before production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500", "http://localhost:5500",
        "http://127.0.0.1:5501", "http://localhost:5501", "null"
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


class BookingRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: str = Field(min_length=7, max_length=30)
    service: str = Field(min_length=2, max_length=80)
    date: date
    budget: str = Field(min_length=2, max_length=80)
    details: str = Field(default="", max_length=2000)


@app.get("/")
def root():
    return {"message": "AJ Media Productions API is running", "docs": "/docs"}


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "AJ Media Productions API"}


@app.post("/api/bookings", status_code=201)
def create_booking(booking: BookingRequest):
    if booking.date < date.today():
        raise HTTPException(status_code=422, detail="Preferred date cannot be in the past.")
    with sqlite3.connect(DB_PATH) as db:
        cursor = db.execute(
            """INSERT INTO bookings
               (name, email, phone, service, preferred_date, budget, details)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (
                booking.name.strip(), str(booking.email), booking.phone.strip(),
                booking.service.strip(), booking.date.isoformat(),
                booking.budget.strip(), booking.details.strip()
            ),
        )
        db.commit()
        booking_id = cursor.lastrowid
    return {"message": "Booking enquiry received", "booking_id": booking_id}

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AJ Media Productions</title>
    <!--Link to CSS file-->
    <link rel="stylesheet" href="styles.css">
    <!--Link to Google fonts-->
    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100..900;1,100..900&family=Dancing+Script:wght@400..700&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Playfair:ital,opsz,wght@0,5..1200,300..900;1,5..1200,300..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet">
</head>
<body>
    <!--Header Section-->
    <header class="site-header">
        <!--Top Info Bar-->
        <div class="top-bar">
            <div class="top-bar-left">
                <span>📍50504-00100,Sarit Centre, Nairobi</span>
            </div>
            <div class="top-bar-centre">
                <span>✦  Capturing Moments, While Creating Memorable Stories. ✦</span>
            </div>
            <div class="top-bar-right">
                <span>📞 +254 748367708</span>
                <span>✉️ ajmediaproductionltd@gmail.com</span>
            </div>
        </div>
        <!--Main Navigation-->
        <nav class="main-nav">
            <div class="logo">
                <a href="#" class="logo-container">
                   <img src="/frontend/assets/images/logo-image.jpeg" alt="AJ-logo" class="nav-logo">
                   <div class="logo-text">
                   <span class="brand-name"><b>AJ MEDIA</b><small>PRODUCTIONS</small></span>
                   </div>
                </a>
            </div>
            <ul class="nav-links">
                <li><a href="#" class="active">Home</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Services</a></li>
                <li><a href="#">Portfolio</a></li>
                <li><a href="#">Packages</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
            <a href="#" class="btn-primary">BOOK A SESSION</a>
        </nav>
    </header>
    
</body>
</html>
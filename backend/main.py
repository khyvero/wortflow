import os
import logging
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware

import models
from database import engine
from routers import vocabulary, ai

# create DB
# models.Base.metadata.create_all(bind=engine)
# remove it because handle DB Schema by Alembic
# set global logging config
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(name)s - %(message)s",
    handlers=[
        logging.StreamHandler()  # output to Console / Terminal
    ]
)

logger = logging.getLogger(__name__)
logger.info("Starting VocabStore API...")

app = FastAPI(title = "VocabStore API", version = "2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Vite dev server port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# mount router
app.include_router(vocabulary.router)
app.include_router(ai.router)

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Backend server running successfully"}


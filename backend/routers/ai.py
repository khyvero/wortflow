from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from services.ai_service import AIService
from models import GenderEnum, PartOfSpeechEnum
import logging
import schemas

# set logger
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ai", tags=["AI Generation"])

@router.post("/completion",
             response_model=schemas.AICompletionResponse,
             summary="Validate and complete missing fields for a word",
             )
def get_word_completion(req: schemas.AICompletionRequest):
    try:
        data = AIService.generate_completion(req.word, req.current_data)
        return data
    except Exception as e:
        logger.error(f"API Error in /ai/completion for request: {req.word}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during AI completion.")

@router.post("/image",
             response_model=schemas.ImageResponse,
             summary="Get an image by word",
             )
def get_word_image(req: schemas.ImageRequest):
    try:
        image_url = AIService.generate_image(req.word)
        return {"image_url": image_url}
    except Exception as e:
        logger.error(f"API Error in /ai/image for request: {req}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during image generation.")


import io
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError
from pydantic import BaseModel

from app.core.config import settings
from app.core.security import get_current_admin

router = APIRouter(prefix="/uploads", tags=["Image Uploads"])

# Resolved relative to the backend/ working directory (where uvicorn runs from).
UPLOAD_ROOT = Path(settings.UPLOAD_DIR).resolve()
UPLOAD_ROOT.mkdir(parents=True, exist_ok=True)

ALLOWED_EXT = {".jpg", ".jpeg", ".png", ".webp"}


def _safe_path_from_url(url: str) -> Path:
    """
    Resolve a stored '/uploads/<file>' URL (or bare filename) to a real path
    inside UPLOAD_ROOT. Strips any directory components first so a crafted
    '../../' can't escape the uploads directory.
    """
    filename = Path(url).name
    candidate = (UPLOAD_ROOT / filename).resolve()
    if candidate != UPLOAD_ROOT and UPLOAD_ROOT not in candidate.parents:
        raise HTTPException(status_code=400, detail="Invalid image path.")
    return candidate


@router.get("/check")
def check_image(url: str, _=Depends(get_current_admin)):
    """Lets the admin edit screen confirm an image file actually exists before
    trying to load it into the cropper, instead of failing opaquely."""
    return {"exists": _safe_path_from_url(url).exists()}


@router.post("")
async def upload_image(file: UploadFile = File(...), _=Depends(get_current_admin)):
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXT:
        raise HTTPException(status_code=400, detail="Unsupported image type. Use JPG, PNG, or WEBP.")

    data = await file.read()
    if len(data) > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"Image exceeds {settings.MAX_UPLOAD_SIZE_MB}MB limit.")

    try:
        probe = Image.open(io.BytesIO(data))
        probe.verify()
    except UnidentifiedImageError:
        raise HTTPException(status_code=400, detail="File is not a valid image.")

    filename = f"{uuid.uuid4().hex}{ext}"
    (UPLOAD_ROOT / filename).write_bytes(data)
    return {"url": f"/uploads/{filename}"}


class CropRequest(BaseModel):
    source_url: str
    x: int
    y: int
    width: int
    height: int
    target_width: int | None = None
    target_height: int | None = None


@router.post("/crop")
def crop_image(payload: CropRequest, _=Depends(get_current_admin)):
    """
    Crops (and optionally resizes) an image that's already on disk under
    UPLOAD_ROOT. Always writes the result as a NEW file so Cancel — simply
    not calling this endpoint — leaves the original untouched.
    """
    source_path = _safe_path_from_url(payload.source_url)
    if not source_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Original image file is missing from storage. Upload a new image instead.",
        )
    try:
        img = Image.open(source_path)
        img.load()
    except UnidentifiedImageError:
        raise HTTPException(status_code=400, detail="Stored file is not a valid image.")

    box = (
        max(0, payload.x),
        max(0, payload.y),
        min(img.width, payload.x + payload.width),
        min(img.height, payload.y + payload.height),
    )
    if box[2] <= box[0] or box[3] <= box[1]:
        raise HTTPException(status_code=400, detail="Invalid crop region.")

    cropped = img.crop(box)
    if payload.target_width and payload.target_height:
        cropped = cropped.resize((payload.target_width, payload.target_height), Image.LANCZOS)

    ext = source_path.suffix.lower()
    if ext in (".jpg", ".jpeg") and cropped.mode in ("RGBA", "P"):
        cropped = cropped.convert("RGB")

    filename = f"{uuid.uuid4().hex}{ext}"
    cropped.save(UPLOAD_ROOT / filename)
    return {"url": f"/uploads/{filename}"}

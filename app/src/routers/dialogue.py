import fastapi
from typing import Optional

from src.database.db import get_session
from ..schemas import dialogue as schemas
from ..services import dialogue as services

router = fastapi.APIRouter(prefix="/dialogue")


@router.get("/", response_model=list[schemas.Dialogue])
async def get_dialogues(
    creator: Optional[str] = None, session=fastapi.Depends(get_session)
) -> list[schemas.Dialogue]:
    return await services.get_dialogues(session, creator)


@router.get("/{dialogue_id}", response_model=schemas.Dialogue)
async def get_dialogue_by_id(
    dialogue_id: int, session=fastapi.Depends(get_session)
) -> schemas.Dialogue:
    return await services.get_dialogue_by_id(session, dialogue_id)


@router.post("/create", response_model=list[schemas.Dialogue])
async def create_dialogue(
    data: list[schemas.DilagoueCreate], session=fastapi.Depends(get_session)
) -> list[schemas.Dialogue]:
    return await services.create_dialogue(session, data)

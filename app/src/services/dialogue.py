from ..database import dialogue as db
from ..database.db import AsyncSession
from ..schemas import dialogue as schemas
from typing import Optional


async def create_dialogue(
    session: AsyncSession, data: list[schemas.DilagoueCreate]
) -> list[schemas.Dialogue]:
    return await db.create_dialogue(session, data)


async def get_dialogue_by_id(session: AsyncSession, id: int) -> schemas.Dialogue:
    return await db.get_dialogue_by_id(session, id)


async def get_dialogues(
    session: AsyncSession, creator: Optional[str] = None
) -> list[schemas.Dialogue]:
    return await db.get_dialogues(session, creator)

import sqlalchemy as sqla
from fastapi import HTTPException
from .db import AsyncSession
from ..schemas import dialogue as messsage_schemas
from .models import models


async def create_dialogue(
    session: AsyncSession, data: list[messsage_schemas.DilagoueCreate]
) -> list[messsage_schemas.Dialogue]:
    created_objects: list[messsage_schemas.Dialogue] = []
    for dialogue_schema in data:
        dialogue = models.Dialogue(**dialogue_schema.model_dump())
        session.add(dialogue)
        await session.flush()
        created_objects.append(
            messsage_schemas.Dialogue.model_validate(dialogue, from_attributes=True)
        )

    await session.commit()

    return created_objects


async def get_dialogues(session: AsyncSession) -> list[messsage_schemas.Dialogue]:
    stmt = sqla.select(models.Dialogue)
    dialogues = (await session.execute(stmt)).scalars().all()

    return [
        messsage_schemas.Dialogue.model_validate(dialogue, from_attributes=True)
        for dialogue in dialogues
    ]


async def get_dialogue_by_id(
    session: AsyncSession, id: int
) -> messsage_schemas.Dialogue:
    stmt = sqla.select(models.Dialogue).where(models.Dialogue.id == id)
    dialogue = (await session.execute(stmt)).scalars().one_or_none()

    if dialogue is None:
        raise HTTPException(404, f"Dialogue with {id=} not found")

    return messsage_schemas.Dialogue.model_validate(dialogue, from_attributes=True)

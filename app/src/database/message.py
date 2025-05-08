from typing import Optional
import sqlalchemy as sqla
from fastapi import HTTPException

from .db import AsyncSession
from ..schemas import message as messsage_schemas
from .models import models


async def create_message(
    session: AsyncSession, data: list[messsage_schemas.MessageCreate]
) -> list[messsage_schemas.Message]:
    created_objects: list[messsage_schemas.Message] = []
    for message_schema in data:
        message = models.Message(**message_schema.model_dump())
        session.add(message)
        await session.flush()
        created_objects.append(
            messsage_schemas.Message.model_validate(message, from_attributes=True)
        )

    await session.commit()

    return created_objects


async def get_messages(session: AsyncSession) -> list[messsage_schemas.Message]:
    stmt = sqla.select(models.Message)
    messages = (await session.execute(stmt)).scalars().all()

    return [
        messsage_schemas.Message.model_validate(message, from_attributes=True)
        for message in messages
    ]


async def get_message_by_id(session: AsyncSession, id: int) -> messsage_schemas.Message:
    stmt = sqla.select(models.Message).where(models.Message.id == id)
    message = (await session.execute(stmt)).scalars().one_or_none()

    if message is None:
        raise HTTPException(404, f"Message with {id=} not found")

    return messsage_schemas.Message.model_validate(message, from_attributes=True)


async def update_prev_id(session: AsyncSession, msg_id: int, prev_id: Optional[int]):
    stmt = sqla.select(models.Message).where(models.Message.id == msg_id)
    message = (await session.execute(stmt)).scalar_one_or_none()
    if message is None:
        return
    message.previous_message_id = prev_id
    session.add(message)
    await session.flush()
    await session.commit()


async def set_model_response(session: AsyncSession, message_id: int, response: str):
    stmt = sqla.select(models.Message).where(models.Message.id == message_id)
    message = (await session.execute(stmt)).scalar_one_or_none()
    if message is None:
        return
    message.model_response = response
    await session.flush()
    await session.commit()

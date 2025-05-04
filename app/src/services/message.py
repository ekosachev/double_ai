from ..database import message as db
from ..database.models import models
from ..database.general_db import check_if_set_of_objects_exist
from ..database.db import AsyncSession
from ..schemas import message as schemas
from fastapi import HTTPException


async def create_message(
    session: AsyncSession, data: list[schemas.MessageCreate]
) -> list[schemas.Message]:
    missing_branch_ids = await check_if_set_of_objects_exist(
        session, models.Branch, {m.branch_id for m in data}
    )
    if len(missing_branch_ids) != 0:
        raise HTTPException(
            404, f"Branches with ids {missing_branch_ids=}, do not exist"
        )
    missing_prev_ids = await check_if_set_of_objects_exist(
        session,
        models.Message,
        {m.previous_message_id for m in data if m.previous_message_id is not None},
    )
    if len(missing_prev_ids) != 0:
        raise HTTPException(404, f"Messages with ids {missing_prev_ids=}, do not exist")

    return await db.create_message(session, data)


async def get_message_by_id(session: AsyncSession, id: int) -> schemas.Message:
    return await db.get_message_by_id(session, id)


async def get_messages(session: AsyncSession) -> list[schemas.Message]:
    return await db.get_messages(session)

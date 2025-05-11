from ..database import permission as db
from ..database.models import models
from ..database.general_db import check_if_object_exists, check_if_set_of_objects_exist
from ..database.db import AsyncSession
from ..schemas import permission as schemas
from fastapi import HTTPException


async def create_permission(
    session: AsyncSession, data: list[schemas.PermissionCreate]
) -> list[schemas.Permission]:
    missing_dialogue_ids = await check_if_set_of_objects_exist(
        session, models.Dialogue, {b.dialogue_id for b in data}
    )
    if len(missing_dialogue_ids) != 0:
        raise HTTPException(
            404, f"Dialogues with ids {missing_dialogue_ids=}, do not exist"
        )

    return await db.create_permission(session, data)


async def get_permission_by_id(session: AsyncSession, id: int) -> schemas.Permission:
    if not await check_if_object_exists(session, models.Permission, id):
        raise HTTPException(404, f"Permission with {id=} does not exist")
    return await db.get_permission_by_id(session, id)


async def get_permissions(session: AsyncSession) -> list[schemas.Permission]:
    return await db.get_permissions(session)

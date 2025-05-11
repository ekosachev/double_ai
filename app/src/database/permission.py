from typing import Optional
import sqlalchemy as sqla
from fastapi import HTTPException

from .db import AsyncSession
from ..schemas import permission as schemas
from .models import models


async def create_permission(
    session: AsyncSession, data: list[schemas.PermissionCreate]
) -> list[schemas.Permission]:
    created_objects: list[schemas.Permission] = []
    for permission_schema in data:
        permission = models.Permission(**permission_schema.model_dump())
        session.add(permission)
        await session.flush()
        created_objects.append(
            schemas.Permission.model_validate(permission, from_attributes=True)
        )

    await session.commit()

    return created_objects


async def get_permissions(session: AsyncSession) -> list[schemas.Permission]:
    stmt = sqla.select(models.Permission)
    permissions = (await session.execute(stmt)).scalars().all()

    return [
        schemas.Permission.model_validate(permission, from_attributes=True)
        for permission in permissions
    ]


async def get_permission_by_id(session: AsyncSession, id: int) -> schemas.Permission:
    stmt = sqla.select(models.Permission).where(models.Permission.id == id)
    permission = (await session.execute(stmt)).scalars().one_or_none()

    if permission is None:
        raise HTTPException(404, f"Message with {id=} not found")

    return schemas.Permission.model_validate(permission, from_attributes=True)

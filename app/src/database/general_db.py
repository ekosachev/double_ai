import sqlalchemy as sqla
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Type

from src.database.models.base import Base


async def check_if_object_exists(
    session: AsyncSession, model: Type[Base], id: int
) -> bool:
    stmt = sqla.select(model).where(model.id == id)
    obj = (await session.execute(stmt)).scalars().one_or_none()
    if obj is None:
        return False
    return True


async def check_if_set_of_objects_exist(
    session: AsyncSession, model: Type[Base], ids: set[int]
) -> set[int]:
    stmt = sqla.select(model).where(model.id.in_(ids))
    objects = (await session.execute(stmt)).scalars().all()
    existing_ids: set[int] = {obj.id for obj in objects}
    return ids - existing_ids

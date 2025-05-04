import sqlalchemy as sqla
from fastapi import HTTPException
from .db import AsyncSession
from ..schemas import branch as branch_schemas
from .models import models


async def create_branch(
    session: AsyncSession, data: list[branch_schemas.BranchCreate]
) -> list[branch_schemas.Branch]:
    created_objects: list[branch_schemas.Branch] = []
    for branch_schema in data:
        branch = models.Branch(**branch_schema.model_dump())
        session.add(branch)
        await session.flush()
        created_objects.append(
            branch_schemas.Branch.model_validate(branch, from_attributes=True)
        )

    await session.commit()

    return created_objects


async def get_branches(session: AsyncSession) -> list[branch_schemas.Branch]:
    stmt = sqla.select(models.Branch)
    branches = (await session.execute(stmt)).scalars().all()

    return [
        branch_schemas.Branch.model_validate(branch, from_attributes=True)
        for branch in branches
    ]


async def get_branch_by_id(session: AsyncSession, id: int) -> branch_schemas.Branch:
    stmt = sqla.select(models.Branch).where(models.Branch.id == id)
    branch = (await session.execute(stmt)).scalars().one_or_none()

    if branch is None:
        raise HTTPException(404, f"Branch with {id=} not found")

    return branch_schemas.Branch.model_validate(branch, from_attributes=True)

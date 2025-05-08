import sqlalchemy as sqla
from .db import AsyncSession
from ..schemas import branch as schemas
from ..schemas import message as message_schemas
from .models import models


async def create_branch(
    session: AsyncSession, data: list[schemas.BranchCreate]
) -> list[schemas.Branch]:
    created_objects: list[schemas.Branch] = []
    for branch_schema in data:
        branch = models.Branch(**branch_schema.model_dump())
        session.add(branch)
        await session.flush()
        created_objects.append(
            schemas.Branch.model_validate(branch, from_attributes=True)
        )

    await session.commit()

    return created_objects


async def get_branches(session: AsyncSession) -> list[schemas.Branch]:
    stmt = sqla.select(models.Branch)
    branches = (await session.execute(stmt)).scalars().all()

    return [
        schemas.Branch.model_validate(branch, from_attributes=True)
        for branch in branches
    ]


async def get_branch_by_id(session: AsyncSession, id: int) -> schemas.Branch:
    stmt = sqla.select(models.Branch).where(models.Branch.id == id)
    branch = (await session.execute(stmt)).scalars().one_or_none()
    return schemas.Branch.model_validate(branch, from_attributes=True)


async def update_root_id(
    session: AsyncSession, branch_id: int, root_id: int
) -> schemas.Branch:
    stmt = sqla.select(models.Branch).where(models.Branch.id == branch_id)
    branch = (await session.execute(stmt)).scalars().one_or_none()

    assert branch is not None

    branch.root_id = root_id
    session.add(branch)
    await session.flush()
    await session.commit()

    return await get_branch_by_id(session, branch_id)


async def update_head_id(
    session: AsyncSession, branch_id: int, head_id: int
) -> schemas.Branch:
    stmt = sqla.select(models.Branch).where(models.Branch.id == branch_id)
    branch = (await session.execute(stmt)).scalars().one_or_none()

    assert branch is not None

    branch.head_id = head_id
    session.add(branch)
    await session.flush()
    await session.commit()

    return await get_branch_by_id(session, branch_id)


async def get_all_messages(
    session: AsyncSession, branch_id: int
) -> list[message_schemas.Message]:
    stmt = sqla.select(models.Message).where(models.Message.branch_id == branch_id)
    messages = (await session.execute(stmt)).scalars().all()

    return [
        message_schemas.Message.model_validate(m, from_attributes=True)
        for m in messages
    ]

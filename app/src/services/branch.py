from ..database import branch as db
from ..database.models import models
from ..database.general_db import check_if_set_of_objects_exist
from ..database.db import AsyncSession
from ..schemas import branch as schemas
from fastapi import HTTPException


async def create_branch(
    session: AsyncSession, data: list[schemas.BranchCreate]
) -> list[schemas.Branch]:
    missing_dialogue_ids = await check_if_set_of_objects_exist(
        session, models.Dialogue, {b.dialogue_id for b in data}
    )
    if len(missing_dialogue_ids) != 0:
        raise HTTPException(
            404, f"Dialogues with ids {missing_dialogue_ids=}, do not exist"
        )
    missing_parent_ids = await check_if_set_of_objects_exist(
        session,
        models.Branch,
        {b.parent_branch_id for b in data if b.parent_branch_id is not None},
    )
    if len(missing_parent_ids) != 0:
        raise HTTPException(
            404, f"Branches with ids {missing_parent_ids=}, do not exist"
        )
    missing_root_ids = await check_if_set_of_objects_exist(
        session, models.Message, {b.root_id for b in data if b.root_id is not None}
    )
    if len(missing_root_ids) != 0:
        raise HTTPException(404, f"Messages with ids {missing_root_ids=}, do not exist")
    missing_head_ids = await check_if_set_of_objects_exist(
        session, models.Message, {b.head_id for b in data if b.head_id is not None}
    )
    if len(missing_head_ids) != 0:
        raise HTTPException(404, f"Messages with ids {missing_head_ids=}, do not exist")

    for branch_schema in data:
        parent_id = branch_schema.parent_branch_id
        if parent_id is None:
            continue
        dialogue_id = branch_schema.dialogue_id
        parent_branch = await get_branch_by_id(session, parent_id)
        if dialogue_id != parent_branch.dialogue_id:
            raise HTTPException(
                422,
                f"Dialogue id of branch and parent branch do not match ({dialogue_id} != {parent_branch.dialogue_id})",
            )
    return await db.create_branch(session, data)


async def get_branch_by_id(session: AsyncSession, id: int) -> schemas.Branch:
    return await db.get_branch_by_id(session, id)


async def get_branches(session: AsyncSession) -> list[schemas.Branch]:
    return await db.get_branches(session)

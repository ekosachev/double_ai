from typing import Optional

from ..database import branch as db
from ..database.models import models
from ..database.general_db import check_if_object_exists, check_if_set_of_objects_exist
from ..database.db import AsyncSession
from ..schemas import branch as schemas
from ..schemas import message as message_schemas
from fastapi import HTTPException
from ..database import message as message_db


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
    if not await check_if_object_exists(session, models.Branch, id):
        raise HTTPException(404, f"Branch with {id=} does not exist")
    return await db.get_branch_by_id(session, id)


async def get_branches(session: AsyncSession) -> list[schemas.Branch]:
    return await db.get_branches(session)


async def get_root_message(
    session: AsyncSession, id: int
) -> Optional[message_schemas.Message]:
    branch = await get_branch_by_id(session, id)
    if branch.root_id is None:
        return None

    return await message_db.get_message_by_id(session, branch.root_id)


async def get_head_message(
    session: AsyncSession, id: int
) -> Optional[message_schemas.Message]:
    branch = await get_branch_by_id(session, id)
    if branch.head_id is None:
        return None

    return await message_db.get_message_by_id(session, branch.head_id)


async def update_root_id(
    session: AsyncSession, branch_id: int, root_id: int
) -> schemas.Branch:
    if not await check_if_object_exists(session, models.Branch, branch_id):
        raise HTTPException(404, f"Branch with {id=} does not exist")
    if not await check_if_object_exists(session, models.Message, root_id):
        raise HTTPException(404, f"Message with {id=} does not exist")

    return await db.update_root_id(session, branch_id, root_id)


async def update_head_id(
    session: AsyncSession, branch_id: int, head_id: int
) -> schemas.Branch:
    if not await check_if_object_exists(session, models.Branch, branch_id):
        raise HTTPException(404, f"Branch with {id=} does not exist")
    if not await check_if_object_exists(session, models.Message, head_id):
        raise HTTPException(404, f"Message with {id=} does not exist")

    return await db.update_head_id(session, branch_id, head_id)


async def get_all_messages(
    session: AsyncSession, branch_id: int
) -> list[message_schemas.Message]:
    if not await check_if_object_exists(session, models.Branch, branch_id):
        raise HTTPException(404, f"Branch with {id=} does not exist")

    root_message = await get_root_message(session, branch_id)

    if root_message is None:
        raise HTTPException(
            400, "Root message is None, cannot determine ordering of messages"
        )
    assert root_message is not None

    messages = await db.get_all_messages(session, branch_id)
    sorted_messages = [root_message]

    while messages:
        prev_ids = {msg.id for msg in sorted_messages}
        to_remove: list[int] = []
        for i, message in enumerate(messages):
            if (
                message.previous_message_id in prev_ids
                or message.previous_message_id is None
            ):
                sorted_messages.append(message)
                to_remove.append(i)

        to_remove.reverse()
        for i in to_remove:
            messages.pop(i)

    return sorted_messages

from src.logs import get_logger
from src.services.branch import (
    get_all_messages,
    get_branch_by_id,
    update_root_id,
    update_head_id,
)
from src.services.dialogue import get_dialogue_by_id
from ..database import message as db
from ..database.models import models
from ..database.general_db import check_if_set_of_objects_exist
from ..database.db import AsyncSession
from ..schemas import message as schemas
from fastapi import HTTPException

from .open_router_api.main import open_router_api

MAX_GENERATION_ATTEMPTS = 5
logger = get_logger(__name__)


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

    new_messages = await db.create_message(session, data)
    for msg in new_messages:
        branch = await get_branch_by_id(session, msg.branch_id)
        if msg.previous_message_id is None:
            await db.update_prev_id(session, msg.id, branch.head_id)
        if branch.root_id is None:
            await update_root_id(session, branch.id, msg.id)
        await update_head_id(session, branch.id, msg.id)

    for message in new_messages:
        branch = await get_branch_by_id(session, message.branch_id)
        dialogue = await get_dialogue_by_id(session, branch.dialogue_id)
        response = None
        context = await get_full_context(session, message.id)
        context.pop(-1)
        for attempt in range(MAX_GENERATION_ATTEMPTS):
            logger.info(f"Generating completion for message. Attempt #{attempt + 1}")
            response = await open_router_api.request_completion(
                dialogue.model,
                message.user_message,
                [(msg.user_message, msg.model_response) for msg in context],
            )
            if response is None:
                logger.warning("Failed to generate completion")
            else:
                break
        if response is None:
            raise HTTPException(
                500,
                f"Could not generate completion in {MAX_GENERATION_ATTEMPTS} tries, aborting",
            )
        await db.set_model_response(session, message.id, response)

    return new_messages


async def get_message_by_id(session: AsyncSession, id: int) -> schemas.Message:
    return await db.get_message_by_id(session, id)


async def get_messages(session: AsyncSession) -> list[schemas.Message]:
    return await db.get_messages(session)


async def get_full_context(
    session: AsyncSession, message_id: int
) -> list[schemas.Message]:
    message = await get_message_by_id(session, message_id)
    branch_context = await get_all_messages(session, message.branch_id)
    branch = await get_branch_by_id(session, message.branch_id)

    context = []
    for msg in branch_context:
        context.append(msg)
        if msg.id == message_id:
            break

    if branch.parent_branch_id is not None:
        context = await get_full_context(session, context[0].previous_message_id)

    return context

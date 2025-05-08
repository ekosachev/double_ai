from src.logs import get_logger
from src.database.branch import get_branch_by_id, update_root_id, update_head_id
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

    for message in data:
        branch = await get_branch_by_id(session, message.branch_id)
        dialogue = await get_dialogue_by_id(session, branch.dialogue_id)
        response = None
        for attempt in range(MAX_GENERATION_ATTEMPTS):
            logger.info(f"Generating completion for message. Attempt #{attempt + 1}")
            response = await open_router_api.request_completion(
                dialogue.model, message.user_message
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
        message.model_response = response

    new_messages = await db.create_message(session, data)
    for msg in new_messages:
        branch = await get_branch_by_id(session, msg.branch_id)
        prev_id = branch.root_id
        await db.update_prev_id(session, msg.id, prev_id)
        if branch.root_id is None:
            await update_root_id(session, branch.id, msg.id)
        await update_head_id(session, branch.id, msg.id)
    return new_messages


async def get_message_by_id(session: AsyncSession, id: int) -> schemas.Message:
    return await db.get_message_by_id(session, id)


async def get_messages(session: AsyncSession) -> list[schemas.Message]:
    return await db.get_messages(session)

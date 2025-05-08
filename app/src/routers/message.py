import fastapi

from src.database.db import get_session
from ..schemas import message as schemas
from ..services import message as services

router = fastapi.APIRouter(prefix="/message")


@router.get("/", response_model=list[schemas.Message])
async def get_messages(session=fastapi.Depends(get_session)) -> list[schemas.Message]:
    return await services.get_messages(session)


@router.get("/{message_id}", response_model=schemas.Message)
async def get_messages_by_id(
    message_id: int, session=fastapi.Depends(get_session)
) -> schemas.Message:
    return await services.get_message_by_id(session, message_id)


@router.get("/{message_id}/context", response_model=list[schemas.Message])
async def get_full_msg_context(
    message_id: int, session=fastapi.Depends(get_session)
) -> list[schemas.Message]:
    return await services.get_full_context(session, message_id)


@router.post("/create", response_model=list[schemas.Message])
async def create_message(
    data: list[schemas.MessageCreate], session=fastapi.Depends(get_session)
) -> list[schemas.Message]:
    return await services.create_message(session, data)

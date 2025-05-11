import fastapi

from src.database.db import get_session
from ..schemas import permission as schemas
from ..services import permission as services

router = fastapi.APIRouter(prefix="/permission")


@router.get("/", response_model=list[schemas.Permission])
async def get_permissions(
    session=fastapi.Depends(get_session),
) -> list[schemas.Permission]:
    return await services.get_permissions(session)


@router.get("/{permission_id}", response_model=schemas.Permission)
async def get_dialogue_by_id(
    dialogue_id: int, session=fastapi.Depends(get_session)
) -> schemas.Permission:
    return await services.get_permission_by_id(session, dialogue_id)


@router.post("/create", response_model=list[schemas.Permission])
async def create_dialogue(
    data: list[schemas.PermissionCreate], session=fastapi.Depends(get_session)
) -> list[schemas.Permission]:
    return await services.create_permission(session, data)

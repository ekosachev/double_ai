import fastapi

from src.database.db import get_session
from ..schemas import branch as schemas
from ..services import branch as services

router = fastapi.APIRouter(prefix="/branch")


@router.get("/", response_model=list[schemas.Branch])
async def get_branches(session=fastapi.Depends(get_session)) -> list[schemas.Branch]:
    return await services.get_branches(session)


@router.get("/{branch_id}", response_model=schemas.Branch)
async def get_branch_by_id(
    branch_id: int, session=fastapi.Depends(get_session)
) -> schemas.Branch:
    return await services.get_branch_by_id(session, branch_id)


@router.post("/create", response_model=list[schemas.Branch])
async def create_branch(
    data: list[schemas.BranchCreate], session=fastapi.Depends(get_session)
) -> list[schemas.Branch]:
    return await services.create_branch(session, data)

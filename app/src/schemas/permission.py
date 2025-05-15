import pydantic as pd


class PermissionCreate(pd.BaseModel):
    dialogue_id: int
    user: str
    can_create_messages: bool = False
    can_create_branches: bool = False


class Permission(PermissionCreate):
    id: int

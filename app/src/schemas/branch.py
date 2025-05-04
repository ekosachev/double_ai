from typing import Optional
import pydantic as pd


class BranchCreate(pd.BaseModel):
    name: Optional[str] = None
    creator: str

    dialogue_id: int
    parent_branch_id: Optional[int] = None
    root_id: Optional[int] = None
    head_id: Optional[int] = None


class Branch(BranchCreate):
    id: int

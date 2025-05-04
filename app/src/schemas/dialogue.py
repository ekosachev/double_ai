from typing import Optional
from ..services.open_router_api.models import OpenRouterModel
import pydantic as pd


class DilagoueCreate(pd.BaseModel):
    name: Optional[str] = None
    model: OpenRouterModel
    creator: str


class Dialogue(DilagoueCreate):
    id: int

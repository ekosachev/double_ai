from datetime import datetime
from typing import Optional
import pydantic as pd


class MessageCreate(pd.BaseModel):
    user_message: str
    model_response: str
    timestamp: datetime
    branch_id: int
    previous_message_id: Optional[int] = None


class Message(MessageCreate):
    id: int

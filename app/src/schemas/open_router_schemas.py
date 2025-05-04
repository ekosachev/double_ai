import enum
from typing import Optional
import pydantic as pd

from src.services.open_router_api.models import OpenRouterCompletionRole


class ErrorResponse(pd.BaseModel):
    code: int
    message: str


class ReasoningEffort(enum.StrEnum):
    high = "high"
    medium = "medium"
    low = "low"


class Message(pd.BaseModel):
    role: Optional[OpenRouterCompletionRole] = None
    content: Optional[str] = None


class Reasoning(pd.BaseModel):
    effort: Optional[ReasoningEffort] = None
    max_tokens: Optional[int] = None
    exclude: Optional[bool] = False


class Usage(pd.BaseModel):
    include: Optional[bool] = True


class ChatCompletionRequest(pd.BaseModel):
    model: str
    messages: list[Message]
    models: Optional[list[str]] = None
    reasoning: Optional[Reasoning] = None
    usage: Optional[Usage] = None
    stream: Optional[bool] = False
    max_tokens: Optional[int] = None


class GenerationChoise(pd.BaseModel):
    message: Message


class ChatCompletionResponse(pd.BaseModel):
    id: Optional[str] = None
    choices: Optional[list[GenerationChoise]] = None

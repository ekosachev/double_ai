from enum import verify
from logging import Logger
from typing import Optional

from ...schemas import open_router_schemas as schemas

from src.services.open_router_api.models import (
    OpenRouterCompletionRole,
    OpenRouterModel,
)
import requests
import json

from ...logs import get_logger

from ...params.config import config


class OpenRouterAPI:
    api_key: str
    url: str = r"https://openrouter.ai/api/v1/chat/completions"
    logger: Logger

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.logger = get_logger(__name__)

    def _headers(self) -> dict[str, str]:
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    async def request_completion(
        self, model: OpenRouterModel, message: str, context: list[tuple[str, str]] = []
    ) -> Optional[str]:
        headers = self._headers()

        model_name = model.get_openrouter_name()
        if model_name is None:
            return None

        messages: list[schemas.Message] = []

        for user_msg, model_msg in context:
            messages += [
                schemas.Message(role=OpenRouterCompletionRole.user, content=user_msg),
                schemas.Message(
                    role=OpenRouterCompletionRole.assistant, content=model_msg
                ),
            ]

        messages.append(
            schemas.Message(role=OpenRouterCompletionRole.user, content=message)
        )

        request = schemas.ChatCompletionRequest(
            model=model_name,
            messages=messages,
            reasoning=schemas.Reasoning(exclude=True),
        )

        self.logger.info(f"Completion requested from model {model}")

        try:
            response = requests.post(
                self.url,
                data=json.dumps(
                    request.model_dump(
                        mode="json", exclude_none=True, exclude_unset=True
                    )
                ),
                headers=headers,
            )
        except requests.exceptions.SSLError as e:
            self.logger.error("Encountered an error while requesting completion")
            self.logger.error(e)
            return None
        response_json = response.json()
        self.logger.info(json.dumps(response_json))
        error_json = response_json.get("error", None)
        if error_json is not None:
            error_response = schemas.ErrorResponse.model_validate(error_json)
            self.logger.error("Encountered error while generating response")
            self.logger.error(f"{error_response.code}: {error_response.message}")
            return None

        success_response = schemas.ChatCompletionResponse.model_validate(response_json)
        self.logger.info(json.dumps(success_response.model_dump(mode="json")))
        completion_choises = success_response.choices
        if completion_choises is None:
            self.logger.warning("No completion choises received")
            return None
        self.logger.info("Completion successfull")
        return completion_choises[0].message.content


open_router_api = OpenRouterAPI(config.openrouter_key)

import enum


class OpenRouterModel(enum.StrEnum):
    ms_phi_4_r = "Microsoft Phi 4 Reasoning"
    quen_3 = "Quen 3"
    intern_vl3 = "InternVL3"
    llama_33_nem_super = "Llama 3.3 Nemotron Super"
    deepseek3 = "DeepSeek V3"

    def get_openrouter_name(self) -> str | None:
        if self == OpenRouterModel.ms_phi_4_r:
            return "microsoft/phi-4-reasoning:free"
        if self == OpenRouterModel.quen_3:
            return "qwen/qwen3-0.6b-04-28:free"
        if self == OpenRouterModel.intern_vl3:
            return "opengvlab/internvl3-14b:free"
        if self == OpenRouterModel.llama_33_nem_super:
            return "nvidia/llama-3.3-nemotron-super-49b-v1:free"
        if self == OpenRouterModel.deepseek3:
            return "deepseek/deepseek-v3-base:free"

        return None


class OpenRouterCompletionRole(enum.StrEnum):
    system = "system"
    developer = "developer"
    user = "user"
    assistant = "assistant"
    tool = "tool"

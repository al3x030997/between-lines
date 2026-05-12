from pydantic import BaseModel


class ManuscriptStub(BaseModel):
    """Minimal manuscript record returned to the agent-list frontend."""

    id: int
    title: str

    model_config = {"from_attributes": True}

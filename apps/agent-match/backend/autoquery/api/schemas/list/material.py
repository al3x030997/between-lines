from datetime import datetime

from pydantic import BaseModel, Field, field_validator

from autoquery.database.models import MATERIAL_TYPES


class MaterialVersionCreate(BaseModel):
    content: str = Field(default="")


class MaterialVersionRead(BaseModel):
    id: int
    type: str
    version_number: int
    content: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


def validate_material_type(value: str) -> str:
    if value not in MATERIAL_TYPES:
        raise ValueError(f"type must be one of {MATERIAL_TYPES}")
    return value

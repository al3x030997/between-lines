from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator

from autoquery.database.models import SUBMISSION_STATUSES


class SubmissionBase(BaseModel):
    agent_name: str = Field(min_length=1, max_length=255)
    agent_agency: str | None = None
    agent_email: str | None = None
    agent_genres: list[str] | None = None
    status: str = "researching"
    date_sent: datetime | None = None
    date_responded: datetime | None = None
    notes: str | None = None
    response_text: str | None = None
    query_version_id: int | None = None
    synopsis_version_id: int | None = None
    sample_version_id: int | None = None

    @field_validator("status")
    @classmethod
    def _validate_status(cls, v: str) -> str:
        if v not in SUBMISSION_STATUSES:
            raise ValueError(f"status must be one of {SUBMISSION_STATUSES}")
        return v


class SubmissionCreate(SubmissionBase):
    agent_id: int | None = None


class SubmissionUpdate(BaseModel):
    """All fields optional for PATCH semantics."""

    agent_name: str | None = Field(default=None, min_length=1, max_length=255)
    agent_agency: str | None = None
    agent_email: str | None = None
    agent_genres: list[str] | None = None
    status: str | None = None
    date_sent: datetime | None = None
    date_responded: datetime | None = None
    notes: str | None = None
    response_text: str | None = None
    query_version_id: int | None = None
    synopsis_version_id: int | None = None
    sample_version_id: int | None = None

    @field_validator("status")
    @classmethod
    def _validate_status(cls, v: str | None) -> str | None:
        if v is not None and v not in SUBMISSION_STATUSES:
            raise ValueError(f"status must be one of {SUBMISSION_STATUSES}")
        return v


class SubmissionRead(SubmissionBase):
    id: int
    agent_id: int | None = None
    manuscript_id: int | None = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class BulkImportError(BaseModel):
    row_index: int
    field: str | None = None
    message: str


class BulkImportResult(BaseModel):
    created: list[SubmissionRead]
    errors: list[BulkImportError]

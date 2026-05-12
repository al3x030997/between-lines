"""Submission CRUD + bulk import for agent-list."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import ValidationError
from sqlalchemy.orm import Session

from autoquery.api.deps import get_session_id
from autoquery.api.schemas.list.submission import (
    BulkImportError,
    BulkImportResult,
    SubmissionCreate,
    SubmissionRead,
    SubmissionUpdate,
)
from autoquery.database.db import get_db
from autoquery.database.models import Manuscript, Submission

router = APIRouter(prefix="/api/list", tags=["agent-list"])


def _ensure_manuscript_id(db: Session, session_id: str) -> int:
    """Return the session's manuscript id, creating a stub if needed.

    Mirrors the get-or-create in routes/list/manuscript.py — duplicated here
    so that bulk import works on first request without the frontend needing
    to round-trip the manuscript endpoint first.
    """
    existing = (
        db.query(Manuscript)
        .filter(Manuscript.session_id == session_id)
        .order_by(Manuscript.id.asc())
        .first()
    )
    if existing is not None:
        return existing.id
    manuscript = Manuscript(session_id=session_id, title="Untitled")
    db.add(manuscript)
    db.commit()
    db.refresh(manuscript)
    return manuscript.id


def _scoped(db: Session, session_id: str):
    return db.query(Submission).filter(Submission.session_id == session_id)


@router.get("/submissions", response_model=list[SubmissionRead])
def list_submissions(
    db: Session = Depends(get_db),
    session_id: str = Depends(get_session_id),
) -> list[Submission]:
    return (
        _scoped(db, session_id)
        .order_by(Submission.created_at.desc())
        .all()
    )


@router.post("/submissions", response_model=SubmissionRead, status_code=status.HTTP_201_CREATED)
def create_submission(
    payload: SubmissionCreate,
    db: Session = Depends(get_db),
    session_id: str = Depends(get_session_id),
) -> Submission:
    manuscript_id = _ensure_manuscript_id(db, session_id)
    submission = Submission(
        session_id=session_id,
        manuscript_id=manuscript_id,
        **payload.model_dump(),
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission


@router.post("/submissions/bulk", response_model=BulkImportResult)
def bulk_import_submissions(
    payload: list[dict],
    db: Session = Depends(get_db),
    session_id: str = Depends(get_session_id),
) -> BulkImportResult:
    """Import an array of rows. Validates each independently — valid rows are
    committed, invalid rows reported back with field/message. The whole batch
    is committed in one transaction; if a row fails Pydantic validation, only
    that row is dropped.
    """
    manuscript_id = _ensure_manuscript_id(db, session_id)
    valid: list[Submission] = []
    errors: list[BulkImportError] = []

    for idx, raw in enumerate(payload):
        try:
            data = SubmissionCreate.model_validate(raw)
        except ValidationError as exc:
            for err in exc.errors():
                errors.append(
                    BulkImportError(
                        row_index=idx,
                        field=".".join(str(p) for p in err.get("loc", ())) or None,
                        message=err.get("msg", "invalid"),
                    )
                )
            continue
        valid.append(
            Submission(
                session_id=session_id,
                manuscript_id=manuscript_id,
                **data.model_dump(),
            )
        )

    if valid:
        db.add_all(valid)
        db.commit()
        for submission in valid:
            db.refresh(submission)

    return BulkImportResult(
        created=[SubmissionRead.model_validate(s) for s in valid],
        errors=errors,
    )


@router.patch("/submissions/{submission_id}", response_model=SubmissionRead)
def update_submission(
    submission_id: int,
    payload: SubmissionUpdate,
    db: Session = Depends(get_db),
    session_id: str = Depends(get_session_id),
) -> Submission:
    submission = (
        _scoped(db, session_id)
        .filter(Submission.id == submission_id)
        .first()
    )
    if submission is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(submission, field, value)

    db.commit()
    db.refresh(submission)
    return submission


@router.delete("/submissions/{submission_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_submission(
    submission_id: int,
    db: Session = Depends(get_db),
    session_id: str = Depends(get_session_id),
) -> None:
    submission = (
        _scoped(db, session_id)
        .filter(Submission.id == submission_id)
        .first()
    )
    if submission is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found")
    db.delete(submission)
    db.commit()

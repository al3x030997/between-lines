"""Single-manuscript-per-session stub used by agent-list.

The frontend is single-manuscript for MVP (see plan). On first visit it calls
GET /api/list/manuscript and uses the returned id when creating submissions
and material versions. This route also forces the session cookie to be set
on first load.
"""
from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from autoquery.api.deps import get_session_id
from autoquery.api.schemas.list.manuscript import ManuscriptStub
from autoquery.database.db import get_db
from autoquery.database.models import Manuscript

router = APIRouter(prefix="/api/list", tags=["agent-list"])


@router.get("/manuscript", response_model=ManuscriptStub)
def get_or_create_manuscript(
    db: Session = Depends(get_db),
    session_id: str = Depends(get_session_id),
) -> Manuscript:
    existing = (
        db.query(Manuscript)
        .filter(Manuscript.session_id == session_id)
        .order_by(Manuscript.id.asc())
        .first()
    )
    if existing is not None:
        return existing

    manuscript = Manuscript(session_id=session_id, title="Untitled")
    db.add(manuscript)
    db.commit()
    db.refresh(manuscript)
    return manuscript

"""Directory browse for agent-list — reads the canonical Agent table.

The same agents that power agent-match's matching are exposed read-only here,
filtered to approved and non-opted-out records. Internal-only fields are
redacted via AgentPublic.
"""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from autoquery.api.deps import get_session_id
from autoquery.api.routes.list.submissions import _ensure_manuscript_id
from autoquery.api.schemas.agent import AgentPublic
from autoquery.api.schemas.list.submission import SubmissionRead
from autoquery.database.db import get_db
from autoquery.database.models import (
    REVIEW_STATUS_APPROVED,
    Agent,
    SUBMISSION_STATUS_RESEARCHING,
    Submission,
)

router = APIRouter(prefix="/api/list/directory", tags=["agent-list"])

DEFAULT_LIMIT = 50
MAX_LIMIT = 200


def _approved_query(db: Session):
    return db.query(Agent).filter(
        Agent.review_status == REVIEW_STATUS_APPROVED,
        Agent.opted_out.is_(False),
    )


@router.get("", response_model=list[AgentPublic])
def list_directory(
    db: Session = Depends(get_db),
    genre: str | None = Query(default=None),
    q: str | None = Query(default=None),
    limit: int = Query(default=DEFAULT_LIMIT, ge=1, le=MAX_LIMIT),
    offset: int = Query(default=0, ge=0),
) -> list[Agent]:
    query = _approved_query(db)

    if genre:
        query = query.filter(Agent.genres.any(genre))

    if q:
        like = f"%{q}%"
        query = query.filter(or_(Agent.name.ilike(like), Agent.agency.ilike(like)))

    return query.order_by(Agent.name.asc()).limit(limit).offset(offset).all()


@router.get("/{agent_id}", response_model=AgentPublic)
def get_directory_entry(
    agent_id: int,
    db: Session = Depends(get_db),
) -> Agent:
    agent = _approved_query(db).filter(Agent.id == agent_id).first()
    if agent is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")
    return agent


@router.post(
    "/{agent_id}/add",
    response_model=SubmissionRead,
    status_code=status.HTTP_201_CREATED,
)
def add_to_my_list(
    agent_id: int,
    db: Session = Depends(get_db),
    session_id: str = Depends(get_session_id),
) -> Submission:
    agent = _approved_query(db).filter(Agent.id == agent_id).first()
    if agent is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")

    manuscript_id = _ensure_manuscript_id(db, session_id)

    submission = Submission(
        session_id=session_id,
        manuscript_id=manuscript_id,
        agent_id=agent.id,
        agent_name=agent.name,
        agent_agency=agent.agency,
        agent_genres=list(agent.genres) if agent.genres else None,
        status=SUBMISSION_STATUS_RESEARCHING,
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission

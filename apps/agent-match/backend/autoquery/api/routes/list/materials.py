"""Material versioning routes for agent-list.

Versions are immutable once created — the only writes are POSTs that
auto-increment version_number for the (session, manuscript, type) tuple.
"""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from autoquery.api.deps import get_session_id
from autoquery.api.routes.list.submissions import _ensure_manuscript_id
from autoquery.api.schemas.list.material import MaterialVersionCreate, MaterialVersionRead
from autoquery.database.db import get_db
from autoquery.database.models import MATERIAL_TYPES, MaterialVersion

router = APIRouter(prefix="/api/list/materials", tags=["agent-list"])


def _validate_type(material_type: str) -> None:
    if material_type not in MATERIAL_TYPES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"type must be one of {list(MATERIAL_TYPES)}",
        )


@router.get("/{material_type}", response_model=list[MaterialVersionRead])
def list_versions(
    material_type: str,
    db: Session = Depends(get_db),
    session_id: str = Depends(get_session_id),
) -> list[MaterialVersion]:
    _validate_type(material_type)
    return (
        db.query(MaterialVersion)
        .filter(
            MaterialVersion.session_id == session_id,
            MaterialVersion.type == material_type,
        )
        .order_by(MaterialVersion.version_number.desc())
        .all()
    )


@router.post(
    "/{material_type}",
    response_model=MaterialVersionRead,
    status_code=status.HTTP_201_CREATED,
)
def create_version(
    material_type: str,
    payload: MaterialVersionCreate,
    db: Session = Depends(get_db),
    session_id: str = Depends(get_session_id),
) -> MaterialVersion:
    _validate_type(material_type)
    manuscript_id = _ensure_manuscript_id(db, session_id)

    next_version = (
        db.query(func.coalesce(func.max(MaterialVersion.version_number), 0))
        .filter(
            MaterialVersion.session_id == session_id,
            MaterialVersion.manuscript_id == manuscript_id,
            MaterialVersion.type == material_type,
        )
        .scalar()
    ) + 1

    version = MaterialVersion(
        session_id=session_id,
        manuscript_id=manuscript_id,
        type=material_type,
        version_number=next_version,
        content=payload.content,
    )
    db.add(version)
    db.commit()
    db.refresh(version)
    return version


@router.get("/version/{version_id}", response_model=MaterialVersionRead)
def get_version(
    version_id: int,
    db: Session = Depends(get_db),
    session_id: str = Depends(get_session_id),
) -> MaterialVersion:
    version = (
        db.query(MaterialVersion)
        .filter(
            MaterialVersion.id == version_id,
            MaterialVersion.session_id == session_id,
        )
        .first()
    )
    if version is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Version not found")
    return version

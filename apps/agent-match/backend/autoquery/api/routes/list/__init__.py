"""Routes powering agent-list (frontend at apps/agent-list/)."""
from autoquery.api.routes.list.directory import router as directory_router
from autoquery.api.routes.list.manuscript import router as manuscript_router
from autoquery.api.routes.list.materials import router as materials_router
from autoquery.api.routes.list.submissions import router as submissions_router

__all__ = [
    "directory_router",
    "manuscript_router",
    "materials_router",
    "submissions_router",
]

"""Add list_submissions and list_material_versions for agent-list.

Revision ID: 007
Revises: 006
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "007"
down_revision = "006"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "list_material_versions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("session_id", sa.String(36), nullable=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("manuscript_id", sa.Integer(), sa.ForeignKey("manuscripts.id", ondelete="CASCADE"), nullable=True),
        sa.Column("type", sa.String(16), nullable=False),
        sa.Column("version_number", sa.Integer(), nullable=False),
        sa.Column("content", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index(
        "ix_list_material_versions_session_id",
        "list_material_versions",
        ["session_id"],
    )
    op.create_index(
        "ix_list_material_versions_type",
        "list_material_versions",
        ["type"],
    )
    op.create_index(
        "ix_list_material_versions_lookup",
        "list_material_versions",
        ["session_id", "manuscript_id", "type"],
    )
    op.create_unique_constraint(
        "uq_list_material_versions_version",
        "list_material_versions",
        ["session_id", "manuscript_id", "type", "version_number"],
    )

    op.create_table(
        "list_submissions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("session_id", sa.String(36), nullable=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("manuscript_id", sa.Integer(), sa.ForeignKey("manuscripts.id", ondelete="SET NULL"), nullable=True),
        sa.Column("agent_id", sa.Integer(), sa.ForeignKey("agents.id", ondelete="SET NULL"), nullable=True),
        sa.Column("agent_name", sa.String(255), nullable=False),
        sa.Column("agent_agency", sa.String(255), nullable=True),
        sa.Column("agent_email", sa.String(255), nullable=True),
        sa.Column("agent_genres", postgresql.ARRAY(sa.Text()), nullable=True),
        sa.Column(
            "status",
            sa.String(50),
            nullable=False,
            server_default="researching",
        ),
        sa.Column("date_sent", sa.DateTime(timezone=True), nullable=True),
        sa.Column("date_responded", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "query_version_id",
            sa.Integer(),
            sa.ForeignKey("list_material_versions.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column(
            "synopsis_version_id",
            sa.Integer(),
            sa.ForeignKey("list_material_versions.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column(
            "sample_version_id",
            sa.Integer(),
            sa.ForeignKey("list_material_versions.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("response_text", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_list_submissions_session_id", "list_submissions", ["session_id"])
    op.create_index("ix_list_submissions_status", "list_submissions", ["status"])
    op.create_index(
        "ix_list_submissions_session_status",
        "list_submissions",
        ["session_id", "status"],
    )


def downgrade() -> None:
    op.drop_index("ix_list_submissions_session_status", table_name="list_submissions")
    op.drop_index("ix_list_submissions_status", table_name="list_submissions")
    op.drop_index("ix_list_submissions_session_id", table_name="list_submissions")
    op.drop_table("list_submissions")

    op.drop_constraint(
        "uq_list_material_versions_version",
        "list_material_versions",
        type_="unique",
    )
    op.drop_index("ix_list_material_versions_lookup", table_name="list_material_versions")
    op.drop_index("ix_list_material_versions_type", table_name="list_material_versions")
    op.drop_index("ix_list_material_versions_session_id", table_name="list_material_versions")
    op.drop_table("list_material_versions")

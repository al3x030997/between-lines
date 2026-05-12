"""Add profile_interpretation JSONB, profile_interpretation_raw, interpretation_prompt_version.

Revision ID: 006
Revises: 005
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision = "006"
down_revision = "005"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "agents",
        sa.Column("profile_interpretation", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
    )
    op.add_column("agents", sa.Column("profile_interpretation_raw", sa.Text(), nullable=True))
    op.add_column("agents", sa.Column("interpretation_prompt_version", sa.String(16), nullable=True))


def downgrade() -> None:
    op.drop_column("agents", "interpretation_prompt_version")
    op.drop_column("agents", "profile_interpretation_raw")
    op.drop_column("agents", "profile_interpretation")

"""add_announcement_fields

Revision ID: a1b2c3d4e5f6
Revises: your_previous_revision_id
Create Date: 2025-08-20 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic
revision = 'a1b2c3d4e5f6'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Ajouter les nouvelles colonnes à la table announcements
    op.add_column('announcements', sa.Column('title', sa.String(255), nullable=True))
    op.add_column('announcements', sa.Column('description', sa.Text(), nullable=True))
    op.add_column('announcements', sa.Column('price', sa.String(100), nullable=True))

def downgrade():
    # Supprimer les colonnes en cas de rollback
    op.drop_column('announcements', 'price')
    op.drop_column('announcements', 'description')
    op.drop_column('announcements', 'title')

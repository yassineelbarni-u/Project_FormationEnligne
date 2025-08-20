"""merge_heads

Revision ID: f1a2b3c4d5e6
Revises: 9bfca7a4f09f, a1b2c3d4e5f6
Create Date: 2025-08-20 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic
revision = 'f1a2b3c4d5e6'
# Fusion des deux têtes de révision
down_revision = ('9bfca7a4f09f', 'a1b2c3d4e5f6')
branch_labels = None
depends_on = None

def upgrade():
    # Cette migration sert uniquement à fusionner les branches
    pass

def downgrade():
    # Cette migration sert uniquement à fusionner les branches
    pass

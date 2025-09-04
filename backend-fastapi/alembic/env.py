from logging.config import fileConfig
from sqlalchemy import create_engine, pool
from alembic import context

# Import spécifique à TON projet (adapté à ton database.py)
from app.database import Base  # <-- Note le 'app.' devant database
from app.models import *      # <-- Importe tous tes modèles

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Utilise la Base de ton database.py
target_metadata = Base.metadata

def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    connectable = create_engine(
        config.get_main_option("sqlalchemy.url"),
        poolclass=pool.NullPool
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            compare_server_default=True
        )
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
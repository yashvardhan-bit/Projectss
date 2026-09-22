from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, session, sessionmaker

from app.config import settings

engine = create_engine(settings.database_url)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


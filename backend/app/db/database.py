from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://dimarik:1117@localhost:5432/powerline_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
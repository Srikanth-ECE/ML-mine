from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Float, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import func

# Use SQLite database
DATABASE_URL = "sqlite:///./ppe.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Worker Model
class Worker(Base):
    __tablename__ = "workers"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String(50), unique=True, index=True)
    name = Column(String(100))
    department = Column(String(50))
    rfid_tag = Column(String(100), unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# PPE Compliance Record
class PPECompliance(Base):
    __tablename__ = "ppe_compliance"
    
    id = Column(Integer, primary_key=True, index=True)
    worker_id = Column(Integer)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # Detection results
    helmet_detected = Column(Boolean, default=False)
    vest_detected = Column(Boolean, default=False)
    boots_detected = Column(Boolean, default=False)
    goggle_detected = Column(Boolean, default=False)
    mask_detected = Column(Boolean, default=False)
    gloves_detected = Column(Boolean, default=False)
    
    is_compliant = Column(Boolean, default=False)
    confidence_scores = Column(JSON)

# Create tables
Base.metadata.create_all(bind=engine)

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import Optional
import base64
from datetime import datetime

from app.models.database import get_db, Worker, PPECompliance
from app.services.ml_service import detector

router = APIRouter()

# Health check endpoint
@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "PPE Detection API"}

# Register new worker
@router.post("/register-worker")
async def register_worker(
    employee_id: str = Form(...),
    name: str = Form(...),
    department: str = Form(...),
    rfid_tag: str = Form(...),
    db: Session = Depends(get_db)
):
    """Register a new mine worker"""
    
    # Check if worker already exists
    existing = db.query(Worker).filter(
        (Worker.employee_id == employee_id) | (Worker.rfid_tag == rfid_tag)
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Worker or RFID already registered")
    
    # Create new worker
    new_worker = Worker(
        employee_id=employee_id,
        name=name,
        department=department,
        rfid_tag=rfid_tag
    )
    
    db.add(new_worker)
    db.commit()
    db.refresh(new_worker)
    
    return {
        "message": "Worker registered successfully",
        "worker_id": new_worker.id,
        "employee_id": new_worker.employee_id
    }

# PPE Compliance Check
@router.post("/check-compliance")
async def check_compliance(
    rfid_tag: Optional[str] = Form(None),
    employee_id: Optional[str] = Form(None),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Check PPE compliance using uploaded image"""
    
    try:
        # Find worker
        worker = None
        if rfid_tag:
            worker = db.query(Worker).filter(Worker.rfid_tag == rfid_tag).first()
        elif employee_id:
            worker = db.query(Worker).filter(Worker.employee_id == employee_id).first()
        
        if not worker:
            raise HTTPException(status_code=404, detail="Worker not found")
        
        # Read image
        image_data = await image.read()
        
        # Convert to base64
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        
        # Detect PPE
        detection_result = detector.detect_ppe(image_base64)
        
        if "error" in detection_result:
            raise HTTPException(status_code=500, detail=detection_result["error"])
        
        # Save compliance record
        compliance_record = PPECompliance(
            worker_id=worker.id,
            helmet_detected="helmet" in detection_result["detected_ppe"],
            vest_detected="safety_vest" in detection_result["detected_ppe"],
            boots_detected="boots" in detection_result["detected_ppe"],
            goggle_detected="goggles" in detection_result["detected_ppe"],
            mask_detected="mask" in detection_result["detected_ppe"],
            gloves_detected="gloves" in detection_result["detected_ppe"],
            is_compliant=detection_result["is_compliant"],
            confidence_scores=detection_result["confidence_scores"]
        )
        
        db.add(compliance_record)
        db.commit()
        
        # Prepare response
        response = {
            "worker_id": worker.id,
            "worker_name": worker.name,
            "employee_id": worker.employee_id,
            "timestamp": datetime.now().isoformat(),
            "compliance_check": detection_result,
            "entry_allowed": detection_result["is_compliant"],
            "record_id": compliance_record.id
        }
        
        if not detection_result["is_compliant"]:
            response["alert"] = f"Missing PPE: {', '.join(detection_result['missing_ppe'])}"
        
        return JSONResponse(content=response)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get compliance history
@router.get("/compliance-history/{worker_id}")
async def get_compliance_history(worker_id: int, db: Session = Depends(get_db)):
    """Get compliance history for a worker"""
    
    records = db.query(PPECompliance).filter(
        PPECompliance.worker_id == worker_id
    ).order_by(PPECompliance.timestamp.desc()).limit(50).all()
    
    history = []
    for record in records:
        history.append({
            "id": record.id,
            "timestamp": record.timestamp.isoformat() if record.timestamp else None,
            "is_compliant": record.is_compliant,
            "detected_items": {
                "helmet": record.helmet_detected,
                "vest": record.vest_detected,
                "boots": record.boots_detected,
                "goggles": record.goggle_detected,
                "mask": record.mask_detected,
                "gloves": record.gloves_detected
            },
            "confidence_scores": record.confidence_scores
        })
    
    return {"worker_id": worker_id, "compliance_history": history}

# Get all workers
@router.get("/workers")
async def get_workers(db: Session = Depends(get_db)):
    """Get all registered workers"""
    
    workers = db.query(Worker).all()
    
    worker_list = []
    for worker in workers:
        # Get latest compliance status
        latest = db.query(PPECompliance).filter(
            PPECompliance.worker_id == worker.id
        ).order_by(PPECompliance.timestamp.desc()).first()
        
        worker_list.append({
            "id": worker.id,
            "employee_id": worker.employee_id,
            "name": worker.name,
            "department": worker.department,
            "rfid_tag": worker.rfid_tag,
            "last_compliance": latest.is_compliant if latest else None,
            "last_check": latest.timestamp.isoformat() if latest else None
        })
    
    return {"workers": worker_list}

# Dashboard statistics
@router.get("/dashboard")
async def get_dashboard(db: Session = Depends(get_db)):
    """Get dashboard statistics"""
    
    from sqlalchemy import func
    
    # Total workers
    total_workers = db.query(func.count(Worker.id)).scalar()
    
    # Today's compliance
    today = datetime.now().date()
    today_records = db.query(PPECompliance).filter(
        func.date(PPECompliance.timestamp) == today
    ).all()
    
    if today_records:
        compliant_today = sum(1 for r in today_records if r.is_compliant)
        compliance_rate = (compliant_today / len(today_records)) * 100
    else:
        compliance_rate = 0
    
    # Common violations
    violations = {
        "no_helmet": db.query(func.count(PPECompliance.id)).filter(
            PPECompliance.helmet_detected == False
        ).scalar(),
        "no_vest": db.query(func.count(PPECompliance.id)).filter(
            PPECompliance.vest_detected == False
        ).scalar(),
        "no_boots": db.query(func.count(PPECompliance.id)).filter(
            PPECompliance.boots_detected == False
        ).scalar()
    }
    
    return {
        "total_workers": total_workers,
        "today_compliance_rate": round(compliance_rate, 2),
        "checks_today": len(today_records),
        "common_violations": violations,
        "system_status": "operational"
    }

# Add worker manually
@router.post("/add-worker")
async def add_worker(
    name: str = Form(...),
    employee_id: str = Form(...),
    department: str = Form("Mining"),
    rfid: str = Form(...),
    db: Session = Depends(get_db)
):
    worker = Worker(
        name=name,
        employee_id=employee_id,
        department=department,
        rfid_tag=rfid
    )
    db.add(worker)
    db.commit()
    return {"message": "Worker added", "id": worker.id}
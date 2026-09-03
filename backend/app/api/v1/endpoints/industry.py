from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user, require_role, require_industry_ownership
from app.models.entities import User, Industry, MonitoringStation, IoTDevice, SensorReading, Alert, AIAnalysis
from app.schemas.schemas import IndustryOut, MonitoringStationOut, SensorReadingOut, AlertOut, AIAnalysisOut

router = APIRouter(prefix="/industry", tags=["Industry"])


@router.get("/dashboard")
def get_industry_dashboard(
    current_user: User = Depends(require_role(["industry", "admin", "dlh"])),
    db: Session = Depends(get_db)
):
    industry_id = current_user.industry_id or "ind-puspa"
    industry = db.query(Industry).filter(Industry.id == industry_id).first()
    if not industry:
        raise HTTPException(status_code=404, detail={"code": "INDUSTRY_NOT_FOUND", "message": "Industri tidak ditemukan"})

    # Get primary station
    station = db.query(MonitoringStation).filter(MonitoringStation.industry_id == industry_id).first()
    station_data = None
    latest_readings = []
    
    if station:
        station_data = {
            "id": station.id,
            "industryId": station.industry_id,
            "name": station.name,
            "locationDesc": station.location_desc,
            "status": station.status,
            "lastReadingAt": station.last_reading_at.isoformat() if station.last_reading_at else None
        }

        # Latest reading per parameter
        param_keys = ["ph", "temperature", "tds", "turbidity", "do", "cod", "bod", "tss"]
        for p in param_keys:
            r = (
                db.query(SensorReading)
                .filter(SensorReading.station_id == station.id, SensorReading.parameter_key == p)
                .order_by(SensorReading.measured_at.desc())
                .first()
            )
            if r:
                latest_readings.append({
                    "id": r.id,
                    "parameterKey": r.parameter_key,
                    "value": r.value,
                    "unit": r.unit,
                    "condition": r.condition,
                    "quality": r.quality,
                    "measuredAt": r.measured_at.isoformat() if r.measured_at else None
                })

    recent_alerts = (
        db.query(Alert)
        .filter(Alert.industry_id == industry_id)
        .order_by(Alert.triggered_at.desc())
        .limit(5)
        .all()
    )
    alerts_data = [
        {
            "id": a.id,
            "title": a.title,
            "severity": a.severity,
            "status": a.status,
            "message": a.message,
            "parameterKeys": a.parameter_keys,
            "triggeredAt": a.triggered_at.isoformat() if a.triggered_at else None
        }
        for a in recent_alerts
    ]

    latest_analysis = (
        db.query(AIAnalysis)
        .filter(AIAnalysis.industry_id == industry_id)
        .order_by(AIAnalysis.generated_at.desc())
        .first()
    )
    analysis_data = None
    if latest_analysis:
        analysis_data = {
            "id": latest_analysis.id,
            "generatedAt": latest_analysis.generated_at.isoformat() if latest_analysis.generated_at else None,
            "horizonHours": latest_analysis.horizon_hours,
            "riskLevel": latest_analysis.risk_level,
            "riskScore": latest_analysis.risk_score,
            "summary": latest_analysis.summary,
            "confidence": latest_analysis.confidence
        }

    overall_condition = "normal"
    if any(r.get("condition") == "critical" for r in latest_readings):
        overall_condition = "critical"
    elif any(r.get("condition") == "warning" for r in latest_readings):
        overall_condition = "warning"

    return {
        "industry": {
            "id": industry.id,
            "name": industry.name,
            "businessType": industry.business_type,
            "address": industry.address,
            "complianceStatus": industry.compliance_status
        },
        "station": station_data,
        "overallCondition": overall_condition,
        "latestReadings": latest_readings,
        "recentAlerts": alerts_data,
        "latestAnalysis": analysis_data,
        "generatedAt": datetime.now(timezone.utc).isoformat()
    }


@router.get("/stations/{stationId}")
def get_station_detail(
    stationId: str,
    current_user: User = Depends(require_role(["industry", "admin", "dlh"])),
    db: Session = Depends(get_db)
):
    station = db.query(MonitoringStation).filter(MonitoringStation.id == stationId).first()
    if not station:
        raise HTTPException(status_code=404, detail={"code": "STATION_NOT_FOUND", "message": "Stasiun tidak ditemukan"})

    require_industry_ownership(current_user, station.industry_id)

    devices = db.query(IoTDevice).filter(IoTDevice.station_id == stationId).all()
    devices_data = [
        {
            "id": d.id,
            "stationId": d.station_id,
            "serialNumber": d.serial_number,
            "name": d.name,
            "parameterKeys": d.parameter_keys,
            "status": d.status,
            "firmwareVersion": d.firmware_version,
            "lastSeenAt": d.last_seen_at.isoformat() if d.last_seen_at else None
        }
        for d in devices
    ]

    # Latest readings
    latest_readings = []
    param_keys = ["ph", "temperature", "tds", "turbidity", "do", "cod", "bod", "tss"]
    for p in param_keys:
        r = (
            db.query(SensorReading)
            .filter(SensorReading.station_id == station.id, SensorReading.parameter_key == p)
            .order_by(SensorReading.measured_at.desc())
            .first()
        )
        if r:
            latest_readings.append({
                "id": r.id,
                "parameterKey": r.parameter_key,
                "value": r.value,
                "unit": r.unit,
                "condition": r.condition,
                "quality": r.quality,
                "measuredAt": r.measured_at.isoformat() if r.measured_at else None
            })

    return {
        "station": {
            "id": station.id,
            "industryId": station.industry_id,
            "name": station.name,
            "locationDesc": station.location_desc,
            "status": station.status,
            "lastReadingAt": station.last_reading_at.isoformat() if station.last_reading_at else None
        },
        "devices": devices_data,
        "latestReadings": latest_readings
    }


@router.get("/stations/{stationId}/readings")
def get_station_readings(
    stationId: str,
    parameter: Optional[str] = Query(None),
    limit: int = Query(24, ge=1, le=100),
    current_user: User = Depends(require_role(["industry", "admin", "dlh"])),
    db: Session = Depends(get_db)
):
    station = db.query(MonitoringStation).filter(MonitoringStation.id == stationId).first()
    if not station:
        raise HTTPException(status_code=404, detail={"code": "STATION_NOT_FOUND", "message": "Stasiun tidak ditemukan"})

    require_industry_ownership(current_user, station.industry_id)

    query = db.query(SensorReading).filter(SensorReading.station_id == stationId)
    if parameter:
        query = query.filter(SensorReading.parameter_key == parameter)

    readings = query.order_by(SensorReading.measured_at.desc()).limit(limit).all()

    return {
        "stationId": stationId,
        "parameter": parameter,
        "readings": [
            {
                "id": r.id,
                "parameterKey": r.parameter_key,
                "value": r.value,
                "unit": r.unit,
                "condition": r.condition,
                "quality": r.quality,
                "measuredAt": r.measured_at.isoformat() if r.measured_at else None
            }
            for r in readings
        ]
    }

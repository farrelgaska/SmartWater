from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user, require_role, require_industry_ownership
from app.models.entities import User, Alert, MonitoringStation, SensorReading, AIAnalysis
from app.schemas.schemas import AlertUpdate

router = APIRouter(prefix="/industry/alerts", tags=["Alerts"])


@router.get("")
def list_alerts(
    status_filter: Optional[str] = Query(None, alias="status"),
    severity: Optional[str] = Query(None),
    current_user: User = Depends(require_role(["industry", "admin", "dlh"])),
    db: Session = Depends(get_db)
):
    industry_id = current_user.industry_id or "ind-puspa"
    query = db.query(Alert).filter(Alert.industry_id == industry_id)

    if status_filter:
        query = query.filter(Alert.status == status_filter)
    if severity:
        query = query.filter(Alert.severity == severity)

    alerts = query.order_by(Alert.triggered_at.desc()).all()

    return {
        "data": {
            "alerts": [
                {
                    "id": a.id,
                    "industryId": a.industry_id,
                    "stationId": a.station_id,
                    "title": a.title,
                    "source": a.source,
                    "severity": a.severity,
                    "status": a.status,
                    "parameterKeys": a.parameter_keys,
                    "message": a.message,
                    "triggeredAt": a.triggered_at.isoformat() if a.triggered_at else None,
                    "acknowledgedAt": a.acknowledged_at.isoformat() if a.acknowledged_at else None,
                    "resolvedAt": a.resolved_at.isoformat() if a.resolved_at else None,
                    "aiAnalysisId": a.ai_analysis_id
                }
                for a in alerts
            ]
        }
    }


@router.get("/{alertId}")
def get_alert_detail(
    alertId: str,
    current_user: User = Depends(require_role(["industry", "admin", "dlh"])),
    db: Session = Depends(get_db)
):
    alert = db.query(Alert).filter(Alert.id == alertId).first()
    if not alert:
        raise HTTPException(status_code=404, detail={"code": "ALERT_NOT_FOUND", "message": "Peringatan tidak ditemukan"})

    require_industry_ownership(current_user, alert.industry_id)

    station = db.query(MonitoringStation).filter(MonitoringStation.id == alert.station_id).first()

    # Get readings around triggered time or latest
    readings = (
        db.query(SensorReading)
        .filter(SensorReading.station_id == alert.station_id)
        .order_by(SensorReading.measured_at.desc())
        .limit(8)
        .all()
    )

    analysis_data = None
    if alert.ai_analysis_id:
        anl = db.query(AIAnalysis).filter(AIAnalysis.id == alert.ai_analysis_id).first()
        if anl:
            analysis_data = {
                "id": anl.id,
                "riskLevel": anl.risk_level,
                "riskScore": anl.risk_score,
                "summary": anl.summary,
                "recommendations": [
                    {
                        "id": r.id,
                        "title": r.title,
                        "description": r.description,
                        "priority": r.priority,
                        "status": r.status
                    }
                    for r in anl.recommendations
                ]
            }

    return {
        "data": {
            "alert": {
                "id": alert.id,
                "industryId": alert.industry_id,
                "stationId": alert.station_id,
                "title": alert.title,
                "source": alert.source,
                "severity": alert.severity,
                "status": alert.status,
                "parameterKeys": alert.parameter_keys,
                "message": alert.message,
                "triggeredAt": alert.triggered_at.isoformat() if alert.triggered_at else None,
                "acknowledgedAt": alert.acknowledged_at.isoformat() if alert.acknowledged_at else None,
                "resolvedAt": alert.resolved_at.isoformat() if alert.resolved_at else None,
                "aiAnalysisId": alert.ai_analysis_id
            },
            "station": {
                "id": station.id,
                "name": station.name
            } if station else None,
            "readings": [
                {
                    "parameterKey": r.parameter_key,
                    "value": r.value,
                    "unit": r.unit,
                    "condition": r.condition
                }
                for r in readings
            ],
            "analysis": analysis_data
        }
    }


@router.patch("/{alertId}")
def update_alert_status(
    alertId: str,
    body: AlertUpdate,
    current_user: User = Depends(require_role(["industry", "admin", "dlh"])),
    db: Session = Depends(get_db)
):
    alert = db.query(Alert).filter(Alert.id == alertId).first()
    if not alert:
        raise HTTPException(status_code=404, detail={"code": "ALERT_NOT_FOUND", "message": "Peringatan tidak ditemukan"})

    require_industry_ownership(current_user, alert.industry_id)

    now = datetime.now(timezone.utc)
    if body.status == "acknowledged":
        alert.status = "acknowledged"
        alert.acknowledged_at = now
    elif body.status == "resolved":
        alert.status = "resolved"
        alert.resolved_at = now
    else:
        raise HTTPException(status_code=422, detail={"code": "INVALID_STATUS", "message": "Status tidak valid"})

    db.commit()
    db.refresh(alert)

    return {
        "data": {
            "alert": {
                "id": alert.id,
                "status": alert.status,
                "acknowledgedAt": alert.acknowledged_at.isoformat() if alert.acknowledged_at else None,
                "resolvedAt": alert.resolved_at.isoformat() if alert.resolved_at else None
            }
        }
    }

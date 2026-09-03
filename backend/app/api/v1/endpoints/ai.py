from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user, require_role, require_industry_ownership
from app.models.entities import User, AIAnalysis, MitigationRecommendation, MonitoringStation, SensorReading
from app.schemas.schemas import RecommendationUpdate

router = APIRouter(prefix="/industry", tags=["AI Analysis"])


@router.get("/ai-analyses/{analysisId}")
def get_ai_analysis(
    analysisId: str,
    current_user: User = Depends(require_role(["industry", "admin", "dlh"])),
    db: Session = Depends(get_db)
):
    analysis = db.query(AIAnalysis).filter(AIAnalysis.id == analysisId).first()
    if not analysis:
        raise HTTPException(status_code=404, detail={"code": "ANALYSIS_NOT_FOUND", "message": "Analisis AI tidak ditemukan"})

    require_industry_ownership(current_user, analysis.industry_id)

    station = db.query(MonitoringStation).filter(MonitoringStation.id == analysis.station_id).first()
    readings = (
        db.query(SensorReading)
        .filter(SensorReading.station_id == analysis.station_id)
        .order_by(SensorReading.measured_at.desc())
        .limit(8)
        .all()
    )

    factors_data = [
        {
            "rank": f.rank,
            "parameterKey": f.parameter_key,
            "label": f.label,
            "observedValue": f.observed_value,
            "unit": f.unit,
            "direction": f.direction,
            "contribution": f.contribution,
            "explanation": f.explanation
        }
        for f in sorted(analysis.anomaly_factors, key=lambda x: x.rank)
    ]

    recommendations_data = [
        {
            "id": r.id,
            "analysisId": r.analysis_id,
            "title": r.title,
            "description": r.description,
            "priority": r.priority,
            "status": r.status,
            "completedAt": r.completed_at.isoformat() if r.completed_at else None,
            "executionMode": r.execution_mode
        }
        for r in analysis.recommendations
    ]

    return {
        "data": {
            "analysis": {
                "id": analysis.id,
                "industryId": analysis.industry_id,
                "stationId": analysis.station_id,
                "generatedAt": analysis.generated_at.isoformat() if analysis.generated_at else None,
                "horizonHours": analysis.horizon_hours,
                "riskLevel": analysis.risk_level,
                "riskScore": analysis.risk_score,
                "confidence": analysis.confidence,
                "summary": analysis.summary,
                "relatedAlertId": analysis.related_alert_id,
                "anomalyFactors": factors_data,
                "recommendations": recommendations_data
            },
            "station": {
                "id": station.id,
                "name": station.name
            } if station else None,
            "relatedReadings": [
                {
                    "parameterKey": r.parameter_key,
                    "value": r.value,
                    "unit": r.unit,
                    "condition": r.condition
                }
                for r in readings
            ],
            "recommendations": recommendations_data
        }
    }


@router.patch("/recommendations/{recommendationId}")
def update_recommendation(
    recommendationId: str,
    body: RecommendationUpdate,
    current_user: User = Depends(require_role(["industry", "admin", "dlh"])),
    db: Session = Depends(get_db)
):
    rec = db.query(MitigationRecommendation).filter(MitigationRecommendation.id == recommendationId).first()
    if not rec:
        raise HTTPException(status_code=404, detail={"code": "RECOMMENDATION_NOT_FOUND", "message": "Item rekomendasi tidak ditemukan"})

    analysis = db.query(AIAnalysis).filter(AIAnalysis.id == rec.analysis_id).first()
    if analysis:
        require_industry_ownership(current_user, analysis.industry_id)

    now = datetime.now(timezone.utc)
    if body.status == "completed":
        rec.status = "completed"
        rec.completed_at = now
        rec.completed_by = current_user.id
    elif body.status == "pending":
        rec.status = "pending"
        rec.completed_at = None
        rec.completed_by = None
    else:
        raise HTTPException(status_code=422, detail={"code": "INVALID_STATUS", "message": "Status tidak valid"})

    db.commit()
    db.refresh(rec)

    return {
        "data": {
            "recommendation": {
                "id": rec.id,
                "status": rec.status,
                "completedAt": rec.completed_at.isoformat() if rec.completed_at else None,
                "completedBy": rec.completed_by
            }
        }
    }

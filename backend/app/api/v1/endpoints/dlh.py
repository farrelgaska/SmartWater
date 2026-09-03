import uuid
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user, require_role
from app.models.entities import User, Industry, MonitoringStation, Alert, SensorReading

router = APIRouter(prefix="/dlh", tags=["DLH"])


@router.get("/dashboard")
def get_dlh_dashboard(
    current_user: User = Depends(require_role(["dlh", "admin"])),
    db: Session = Depends(get_db)
):
    industries = db.query(Industry).all()
    stations = db.query(MonitoringStation).all()
    recent_alerts = db.query(Alert).order_by(Alert.triggered_at.desc()).limit(10).all()

    compliant_count = sum(1 for i in industries if i.compliance_status == "compliant")
    attention_count = sum(1 for i in industries if i.compliance_status == "attention")
    active_stations_count = sum(1 for s in stations if s.status == "active")

    industries_data = [
        {
            "id": i.id,
            "name": i.name,
            "businessType": i.business_type,
            "address": i.address,
            "location": {"latitude": i.latitude, "longitude": i.longitude},
            "complianceStatus": i.compliance_status,
            "stationCount": len(i.stations)
        }
        for i in industries
    ]

    stations_data = [
        {
            "id": s.id,
            "industryId": s.industry_id,
            "name": s.name,
            "status": s.status,
            "lastReadingAt": s.last_reading_at.isoformat() if s.last_reading_at else None
        }
        for s in stations
    ]

    incidents_data = [
        {
            "id": a.id,
            "industryId": a.industry_id,
            "title": a.title,
            "severity": a.severity,
            "status": a.status,
            "triggeredAt": a.triggered_at.isoformat() if a.triggered_at else None
        }
        for a in recent_alerts
    ]

    # Deterministic 7-day WQI trend
    wqi_trend = [
        {"day": "Senin", "wqi": 78.4, "status": "Baik"},
        {"day": "Selasa", "wqi": 76.2, "status": "Baik"},
        {"day": "Rabu", "wqi": 72.8, "status": "Cukup"},
        {"day": "Kamis", "wqi": 74.0, "status": "Baik"},
        {"day": "Jumat", "wqi": 71.5, "status": "Cukup"},
        {"day": "Sabtu", "wqi": 69.8, "status": "Perhatian"},
        {"day": "Minggu", "wqi": 75.6, "status": "Baik"}
    ]

    risk_forecast = {
        "horizonHours": 24,
        "overallRisk": "warning" if attention_count > 0 else "normal",
        "predictedIncidents": attention_count,
        "summary": "Proyeksi 24 jam ke depan mengindikasikan potensi peningkatan beban sedimentasi di klaster Buaran & Pekalongan Barat akibat peningkatan aktivitas pembilasan kain batik."
    }

    return {
        "summary": {
            "totalIndustries": len(industries),
            "compliantIndustries": compliant_count,
            "attentionIndustries": attention_count,
            "totalStations": len(stations),
            "activeStations": active_stations_count,
            "averageWQI": 74.2
        },
        "industries": industries_data,
        "stations": stations_data,
        "incidents": incidents_data,
        "wqiTrend": wqi_trend,
        "riskForecast": risk_forecast,
        "generatedAt": datetime.now(timezone.utc).isoformat()
    }


@router.get("/industries")
def get_dlh_industries(
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: User = Depends(require_role(["dlh", "admin"])),
    db: Session = Depends(get_db)
):
    query = db.query(Industry)
    if status_filter:
        query = query.filter(Industry.compliance_status == status_filter)
    industries = query.all()

    return {
        "industries": [
            {
                "id": i.id,
                "name": i.name,
                "businessType": i.business_type,
                "address": i.address,
                "complianceStatus": i.compliance_status,
                "latitude": i.latitude,
                "longitude": i.longitude
            }
            for i in industries
        ]
    }


@router.get("/compliance")
def get_dlh_compliance(
    current_user: User = Depends(require_role(["dlh", "admin"])),
    db: Session = Depends(get_db)
):
    industries = db.query(Industry).all()
    assessments = [
        {
            "industryId": i.id,
            "industryName": i.name,
            "status": i.compliance_status,
            "assessedAt": i.updated_at.isoformat() if i.updated_at else datetime.now(timezone.utc).isoformat(),
            "notes": "Penilaian berbasis ambang batas operasional stasiun pemantauan limbah (Demo Baseline)."
        }
        for i in industries
    ]
    return {
        "assessments": assessments,
        "basisNote": "Data evaluasi kepatuhan operasional limbah batik Pekalongan."
    }


@router.post("/reports")
def generate_report(
    current_user: User = Depends(require_role(["dlh", "admin"])),
    db: Session = Depends(get_db)
):
    report_id = f"rep-{uuid.uuid4().hex[:8]}"
    return {
        "data": {
            "reportId": report_id,
            "status": "ready",
            "downloadUrl": f"/api/dlh/reports/{report_id}/download",
            "generatedAt": datetime.now(timezone.utc).isoformat()
        }
    }

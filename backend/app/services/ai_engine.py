import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.entities import (
    AIAnalysis,
    AnomalyFactor,
    MitigationRecommendation,
    MonitoringStation,
    SensorReading,
    ThresholdRule
)


def generate_ai_analysis(
    db: Session,
    station: MonitoringStation,
    horizon_hours: int = 6,
    related_alert_id: Optional[str] = None
) -> AIAnalysis:
    # 1. Fetch latest readings for all parameters of this station
    readings = (
        db.query(SensorReading)
        .filter(SensorReading.station_id == station.id)
        .order_by(SensorReading.measured_at.desc())
        .limit(20)
        .all()
    )
    
    # 2. Determine anomaly factors based on current readings
    rules = {r.parameter_key: r for r in db.query(ThresholdRule).all()}
    
    anomaly_factors_data = []
    risk_score = 15.0
    risk_level = "normal"
    
    seen_params = set()
    rank = 1
    
    for r in readings:
        if r.parameter_key in seen_params:
            continue
        seen_params.add(r.parameter_key)
        
        rule = rules.get(r.parameter_key)
        if r.condition in ["warning", "critical"]:
            contribution = 40.0 if r.condition == "critical" else 20.0
            risk_score += contribution
            
            direction = "high"
            if rule and rule.warning_min and r.value < rule.warning_min:
                direction = "low"
            
            param_label = rule.name if rule else r.parameter_key.upper()
            explanation = (
                f"Kadar {param_label} terdeteksi {r.value} {r.unit}, "
                f"melampaui ambang batas normal. Hal ini berpotensi meningkatkan beban pencemaran limbah pewarna batik."
            )
            
            anomaly_factors_data.append({
                "rank": rank,
                "parameter_key": r.parameter_key,
                "label": f"Lonjakan {param_label}",
                "observed_value": r.value,
                "unit": r.unit,
                "direction": direction,
                "contribution": min(contribution, 100.0),
                "explanation": explanation
            })
            rank += 1
            
    risk_score = min(risk_score, 100.0)
    if risk_score >= 60.0:
        risk_level = "critical"
    elif risk_score >= 35.0:
        risk_level = "warning"
    else:
        risk_level = "normal"
        
    summary = (
        f"Analisis risiko berbasis AI memprediksi status kualitas air limbah berada pada level '{risk_level.upper()}' "
        f"dalam proyeksi {horizon_hours} jam ke depan. Operator disarankan memeriksa aerasi dan dosis koagulan."
        if risk_level != "normal" else
        f"Kualitas air limbah dalam kondisi stabil dan berada dalam batas aman baku mutu operasional."
    )
    
    analysis_id = f"anl-{uuid.uuid4().hex[:8]}"
    analysis = AIAnalysis(
        id=analysis_id,
        industry_id=station.industry_id,
        station_id=station.id,
        generated_at=datetime.now(timezone.utc),
        horizon_hours=horizon_hours,
        risk_level=risk_level,
        risk_score=risk_score,
        confidence=0.88,
        summary=summary,
        related_alert_id=related_alert_id
    )
    db.add(analysis)
    db.flush()
    
    # 3. Add Anomaly Factors
    for af in anomaly_factors_data:
        factor = AnomalyFactor(
            analysis_id=analysis_id,
            rank=af["rank"],
            parameter_key=af["parameter_key"],
            label=af["label"],
            observed_value=af["observed_value"],
            unit=af["unit"],
            direction=af["direction"],
            contribution=af["contribution"],
            explanation=af["explanation"]
        )
        db.add(factor)
        
    # 4. Add Actionable Human Mitigation Checklist
    recommendations_data = []
    if risk_level == "critical" or risk_level == "warning":
        recommendations_data = [
            {
                "title": "Verifikasi Dosis Koagulan & Flokulan di Bak Sedimentasi",
                "description": "Periksa takaran PAC (Poly Aluminium Chloride) atau tawas untuk mempercepat pengendapan zat warna sisa proses pewarnaan batik.",
                "priority": "critical" if risk_level == "critical" else "warning"
            },
            {
                "title": "Periksa Sistem Aerasi & Diffuser Oksigen",
                "description": "Pastikan blower aerasi di kolam biofilter beroperasi optimal guna menaikkan kadar oksigen terlarut (DO).",
                "priority": "warning"
            },
            {
                "title": "Catat Log Pengecekan Manual di Buku Operasional",
                "description": "Lakukan kalibrasi probe sensor pH/TDS jika angka pembacaan fisik berbeda dengan hasil laboratorium.",
                "priority": "normal"
            }
        ]
    else:
        recommendations_data = [
            {
                "title": "Pemeliharaan Rutin Filter & Pembersihan Sensor",
                "description": "Lakukan pembersihan permukaan probe sensor dari endapan lumpur secara berkala.",
                "priority": "normal"
            }
        ]
        
    for idx, rec in enumerate(recommendations_data):
        r_item = MitigationRecommendation(
            id=f"rec-{uuid.uuid4().hex[:8]}",
            analysis_id=analysis_id,
            title=rec["title"],
            description=rec["description"],
            priority=rec["priority"],
            status="pending",
            execution_mode="human-checklist"
        )
        db.add(r_item)
        
    db.commit()
    db.refresh(analysis)
    return analysis

from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.entities import MonitoringStation, IoTDevice, SensorReading, ThresholdRule
from app.schemas.schemas import TelemetryIngestRequest
from app.services.alert_engine import evaluate_reading_condition, process_telemetry_alerts
from app.services.ai_engine import generate_ai_analysis

router = APIRouter(prefix="/telemetry", tags=["IoT Telemetry"])


@router.post("/readings", status_code=status.HTTP_201_CREATED)
def ingest_telemetry_readings(
    payload: TelemetryIngestRequest,
    db: Session = Depends(get_db)
):
    station = db.query(MonitoringStation).filter(MonitoringStation.id == payload.stationId).first()
    if not station:
        raise HTTPException(status_code=404, detail={"code": "STATION_NOT_FOUND", "message": "Stasiun sensor tidak terdaftar"})

    device = None
    if payload.deviceId:
        device = db.query(IoTDevice).filter(IoTDevice.id == payload.deviceId).first()

    now = datetime.now(timezone.utc)
    station.last_reading_at = now
    if device:
        device.last_seen_at = now

    rules = {r.parameter_key: r for r in db.query(ThresholdRule).all()}

    saved_readings = []
    has_anomaly = False

    for item in payload.readings:
        rule = rules.get(item.parameterKey)
        condition = evaluate_reading_condition(item.parameterKey, item.value, rule)
        unit = item.unit or (rule.unit if rule else "")

        reading = SensorReading(
            station_id=station.id,
            device_id=payload.deviceId,
            parameter_key=item.parameterKey,
            value=item.value,
            unit=unit,
            condition=condition,
            quality="valid",
            measured_at=now
        )
        db.add(reading)
        saved_readings.append(reading)

        if condition in ["warning", "critical"]:
            has_anomaly = True
            process_telemetry_alerts(db, station, item.parameterKey, item.value, condition, rule)

    db.commit()

    # If any anomaly occurred, automatically trigger fresh AI decision support evaluation
    if has_anomaly:
        generate_ai_analysis(db, station, horizon_hours=6)

    return {
        "status": "success",
        "savedCount": len(saved_readings),
        "stationId": station.id,
        "hasAnomaly": has_anomaly,
        "ingestedAt": now.isoformat()
    }

import uuid
from datetime import datetime, timezone
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from app.models.entities import ThresholdRule, Alert, MonitoringStation, Industry


def evaluate_reading_condition(
    parameter_key: str,
    value: float,
    rule: Optional[ThresholdRule]
) -> str:
    if not rule:
        return "normal"

    if rule.critical_min is not None and value < rule.critical_min:
        return "critical"
    if rule.critical_max is not None and value > rule.critical_max:
        return "critical"
    if rule.warning_min is not None and value < rule.warning_min:
        return "warning"
    if rule.warning_max is not None and value > rule.warning_max:
        return "warning"

    return "normal"


def process_telemetry_alerts(
    db: Session,
    station: MonitoringStation,
    parameter_key: str,
    value: float,
    condition: str,
    rule: Optional[ThresholdRule]
) -> Optional[Alert]:
    if condition not in ["warning", "critical"]:
        return None

    unit_str = rule.unit if rule else ""
    param_name = rule.name if rule else parameter_key.upper()
    
    title = f"Peringatan {param_name}: Nilai Terindikasi Anomali ({value} {unit_str})"
    message = (
        f"Nilai {param_name} tercatat sebesar {value} {unit_str} di stasiun {station.name}. "
        f"Kondisi ini memerlukan pengawasan dan pengecekan bak penampungan/IPAL."
    )
    
    alert = Alert(
        id=f"alt-{uuid.uuid4().hex[:8]}",
        industry_id=station.industry_id,
        station_id=station.id,
        title=title,
        source="reading",
        severity=condition,
        status="new",
        _parameter_keys=f'["{parameter_key}"]',
        message=message,
        triggered_at=datetime.now(timezone.utc)
    )
    db.add(alert)
    return alert

import json
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.core.security import get_password_hash
from app.models.entities import (
    User,
    Industry,
    MonitoringStation,
    IoTDevice,
    SensorReading,
    Alert,
    AIAnalysis,
    AnomalyFactor,
    MitigationRecommendation,
    ThresholdRule
)


def seed_database(db: Session):
    # Check if database already seeded
    if db.query(User).first():
        return

    now = datetime.now(timezone.utc)

    # 1. Threshold Rules
    rules_data = [
        {"id": "rule-ph", "parameter_key": "ph", "name": "pH Air Limbah", "unit": "", "warning_min": 6.0, "warning_max": 9.0, "critical_min": 5.0, "critical_max": 10.0, "basis_note": "Baku Mutu Air Limbah Tekstil (Demo Baseline)"},
        {"id": "rule-temp", "parameter_key": "temperature", "name": "Suhu Air", "unit": "°C", "warning_min": 20.0, "warning_max": 38.0, "critical_min": 15.0, "critical_max": 42.0, "basis_note": "Baku Mutu Suhu Air (Demo Baseline)"},
        {"id": "rule-tds", "parameter_key": "tds", "name": "Total Dissolved Solids", "unit": "mg/L", "warning_min": None, "warning_max": 1500.0, "critical_min": None, "critical_max": 2500.0, "basis_note": "Kadar Padatan Terlarut (Demo Baseline)"},
        {"id": "rule-turb", "parameter_key": "turbidity", "name": "Kekeruhan (Turbidity)", "unit": "NTU", "warning_min": None, "warning_max": 75.0, "critical_min": None, "critical_max": 150.0, "basis_note": "Tingkat Kekeruhan (Demo Baseline)"},
        {"id": "rule-do", "parameter_key": "do", "name": "Dissolved Oxygen (DO)", "unit": "mg/L", "warning_min": 3.0, "warning_max": None, "critical_min": 1.5, "critical_max": None, "basis_note": "Oksigen Terlarut Minimum (Demo Baseline)"},
        {"id": "rule-cod", "parameter_key": "cod", "name": "Chemical Oxygen Demand (COD)", "unit": "mg/L", "warning_min": None, "warning_max": 150.0, "critical_min": None, "critical_max": 250.0, "basis_note": "Kebutuhan Oksigen Kimiawi (Demo Baseline)"},
        {"id": "rule-bod", "parameter_key": "bod", "name": "Biochemical Oxygen Demand (BOD)", "unit": "mg/L", "warning_min": None, "warning_max": 50.0, "critical_min": None, "critical_max": 100.0, "basis_note": "Kebutuhan Oksigen Biokimiawi (Demo Baseline)"},
        {"id": "rule-tss", "parameter_key": "tss", "name": "Total Suspended Solids (TSS)", "unit": "mg/L", "warning_min": None, "warning_max": 50.0, "critical_min": None, "critical_max": 100.0, "basis_note": "Padatan Tersuspensi (Demo Baseline)"},
    ]
    for r in rules_data:
        db.add(ThresholdRule(**r))
    db.flush()

    # 2. Industries
    ind_puspa = Industry(
        id="ind-puspa",
        name="Batik Puspa Kencana",
        business_type="Batik & Tekstil",
        address="Jl. Urip Sumoharjo No. 45, Buaran, Pekalongan",
        latitude=-6.9085,
        longitude=109.6734,
        compliance_status="compliant"
    )
    ind_sekar = Industry(
        id="ind-sekar",
        name="Batik Sekar Arum",
        business_type="Batik Tulis & Cap",
        address="Jl. Hayam Wuruk No. 12, Pekalongan Barat",
        latitude=-6.8921,
        longitude=109.6645,
        compliance_status="attention"
    )
    ind_canting = Industry(
        id="ind-canting",
        name="Batik Canting Mas",
        business_type="Tekstil & Pewarnaan",
        address="Kawasan Industri Medono, Pekalongan",
        latitude=-6.9142,
        longitude=109.6812,
        compliance_status="compliant"
    )
    db.add_all([ind_puspa, ind_sekar, ind_canting])
    db.flush()

    # 3. Users
    u_admin = User(
        id="usr-admin",
        name="Administrator Sistem",
        email="admin@smartwater.id",
        password_hash=get_password_hash("admin123"),
        role="admin",
        industry_id=None,
        status="active"
    )
    u_dlh = User(
        id="usr-dlh",
        name="Petugas Pengawas DLH",
        email="dlh@pekalongan.go.id",
        password_hash=get_password_hash("dlh123"),
        role="dlh",
        industry_id=None,
        status="active"
    )
    u_ind = User(
        id="usr-industry",
        name="Ahmad Hidayat (Batik Puspa)",
        email="owner@batikpuspa.com",
        password_hash=get_password_hash("industry123"),
        role="industry",
        industry_id="ind-puspa",
        status="active"
    )
    db.add_all([u_admin, u_dlh, u_ind])
    db.flush()

    # 4. Monitoring Stations
    st_puspa = MonitoringStation(
        id="st-puspa-01",
        industry_id="ind-puspa",
        name="Stasiun IPAL Outlet - Puspa Kencana",
        location_desc="Bak Penampungan & Outlet Pembuangan Akhir",
        status="active",
        last_reading_at=now
    )
    st_sekar = MonitoringStation(
        id="st-sekar-01",
        industry_id="ind-sekar",
        name="Stasiun IPAL Sedimentasi - Sekar Arum",
        location_desc="Kolam Pengendapan Awal",
        status="unstable",
        last_reading_at=now - timedelta(minutes=15)
    )
    st_canting = MonitoringStation(
        id="st-canting-01",
        industry_id="ind-canting",
        name="Stasiun Efluen Utama - Canting Mas",
        location_desc="Saluran Pelepasan Efluen",
        status="active",
        last_reading_at=now - timedelta(minutes=5)
    )
    db.add_all([st_puspa, st_sekar, st_canting])
    db.flush()

    # 5. IoT Devices
    dev_puspa = IoTDevice(
        id="dev-01",
        station_id="st-puspa-01",
        serial_number="SW-NODE-PKL-001",
        name="ESP32 Telemetry Node A1",
        _parameter_keys=json.dumps(["ph", "temperature", "tds", "turbidity", "do", "cod", "bod", "tss"]),
        status="active",
        firmware_version="1.2.0",
        last_seen_at=now
    )
    dev_sekar = IoTDevice(
        id="dev-02",
        station_id="st-sekar-01",
        serial_number="SW-NODE-PKL-002",
        name="ESP32 Telemetry Node B2",
        _parameter_keys=json.dumps(["ph", "temperature", "tds", "turbidity"]),
        status="unstable",
        firmware_version="1.1.4",
        last_seen_at=now - timedelta(minutes=15)
    )
    db.add_all([dev_puspa, dev_sekar])
    db.flush()

    # 6. Sensor Readings for Puspa Kencana (Historical & Current)
    param_defaults = [
        ("ph", 7.4, "", "normal"),
        ("temperature", 28.5, "°C", "normal"),
        ("tds", 820.0, "mg/L", "normal"),
        ("turbidity", 42.0, "NTU", "normal"),
        ("do", 4.8, "mg/L", "normal"),
        ("cod", 95.0, "mg/L", "normal"),
        ("bod", 28.0, "mg/L", "normal"),
        ("tss", 32.0, "mg/L", "normal"),
    ]

    for hours_ago in range(12, -1, -1):
        t = now - timedelta(hours=hours_ago)
        for pkey, base_val, unit, cond in param_defaults:
            # Add slight realistic variance
            val = round(base_val + ((hours_ago % 3) * 0.15 - 0.1), 2)
            reading = SensorReading(
                station_id="st-puspa-01",
                device_id="dev-01",
                parameter_key=pkey,
                value=val,
                unit=unit,
                condition="normal",
                quality="valid",
                measured_at=t
            )
            db.add(reading)

    # 7. Initial AI Analysis & Anomaly Factor
    analysis = AIAnalysis(
        id="anl-demo-01",
        industry_id="ind-puspa",
        station_id="st-puspa-01",
        generated_at=now - timedelta(hours=1),
        horizon_hours=6,
        risk_level="normal",
        risk_score=18.5,
        confidence=0.92,
        summary="Kondisi kualitas air limbah terpantau normal dan stabil. Proyeksi 6 jam ke depan menunjukkan risiko pencemaran rendah.",
        related_alert_id=None
    )
    db.add(analysis)
    db.flush()

    factor = AnomalyFactor(
        analysis_id="anl-demo-01",
        rank=1,
        parameter_key="ph",
        label="pH Air Limbah",
        observed_value=7.4,
        unit="",
        direction="high",
        contribution=12.0,
        explanation="Nilai pH stabil di rentang netral (7.4), proses netralisasi berfungsi dengan baik."
    )
    db.add(factor)

    # 8. Mitigation Recommendations
    rec1 = MitigationRecommendation(
        id="rec-demo-01",
        analysis_id="anl-demo-01",
        title="Pembersihan Berkala Sensor Turbidity & pH",
        description="Bersihkan elektroda probe dari lapisan sisa lilin batik (malam) agar akurasi sensor tetap terjaga.",
        priority="normal",
        status="pending",
        execution_mode="human-checklist"
    )
    rec2 = MitigationRecommendation(
        id="rec-demo-02",
        analysis_id="anl-demo-01",
        title="Inspeksi Rutin Debit Bak Sedimentasi",
        description="Periksa level air pada bak pengendap untuk mencegah limpasan saat puncak proses pewarnaan kain batik.",
        priority="normal",
        status="pending",
        execution_mode="human-checklist"
    )
    db.add_all([rec1, rec2])

    # 9. Alert
    alert = Alert(
        id="alt-demo-01",
        industry_id="ind-puspa",
        station_id="st-puspa-01",
        title="Fluktuasi Kekeruhan Ringan",
        source="reading",
        severity="warning",
        status="acknowledged",
        _parameter_keys=json.dumps(["turbidity"]),
        message="Kekeruhan sempat menyentuh 65 NTU selama proses pembilasan kain batik, kondisi saat ini telah normal kembali.",
        triggered_at=now - timedelta(hours=4),
        acknowledged_at=now - timedelta(hours=3),
        ai_analysis_id="anl-demo-01"
    )
    db.add(alert)

    db.commit()

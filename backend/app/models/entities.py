import json
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Float,
    Integer,
    DateTime,
    ForeignKey,
    Text,
    Enum as SqlEnum
)
from sqlalchemy.orm import relationship
from app.core.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)  # 'admin' | 'dlh' | 'industry'
    industry_id = Column(String(50), ForeignKey("industries.id", ondelete="SET NULL"), nullable=True)
    status = Column(String(20), default="active")  # 'active' | 'inactive'
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    industry = relationship("Industry", back_populates="users")


class Industry(Base):
    __tablename__ = "industries"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    business_type = Column(String(100), default="Batik & Textile")
    address = Column(Text, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    compliance_status = Column(String(30), default="compliant")  # 'compliant' | 'attention' | 'unknown'
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    users = relationship("User", back_populates="industry")
    stations = relationship("MonitoringStation", back_populates="industry", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="industry", cascade="all, delete-orphan")
    ai_analyses = relationship("AIAnalysis", back_populates="industry", cascade="all, delete-orphan")


class MonitoringStation(Base):
    __tablename__ = "monitoring_stations"

    id = Column(String(50), primary_key=True, index=True)
    industry_id = Column(String(50), ForeignKey("industries.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(150), nullable=False)
    location_desc = Column(Text, nullable=True)
    status = Column(String(20), default="active")  # 'active' | 'offline' | 'unstable'
    last_reading_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    industry = relationship("Industry", back_populates="stations")
    devices = relationship("IoTDevice", back_populates="station", cascade="all, delete-orphan")
    readings = relationship("SensorReading", back_populates="station", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="station", cascade="all, delete-orphan")
    ai_analyses = relationship("AIAnalysis", back_populates="station", cascade="all, delete-orphan")


class IoTDevice(Base):
    __tablename__ = "iot_devices"

    id = Column(String(50), primary_key=True, index=True)
    station_id = Column(String(50), ForeignKey("monitoring_stations.id", ondelete="CASCADE"), nullable=False)
    serial_number = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(150), nullable=False)
    _parameter_keys = Column("parameter_keys", Text, nullable=False, default="[]")
    status = Column(String(20), default="active")  # 'active' | 'offline' | 'unstable'
    firmware_version = Column(String(50), default="1.0.0")
    last_seen_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    station = relationship("MonitoringStation", back_populates="devices")
    readings = relationship("SensorReading", back_populates="device")

    @property
    def parameter_keys(self):
        try:
            return json.loads(self._parameter_keys)
        except Exception:
            return []

    @parameter_keys.setter
    def parameter_keys(self, value):
        self._parameter_keys = json.dumps(value)


class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    station_id = Column(String(50), ForeignKey("monitoring_stations.id", ondelete="CASCADE"), nullable=False, index=True)
    device_id = Column(String(50), ForeignKey("iot_devices.id", ondelete="SET NULL"), nullable=True)
    parameter_key = Column(String(30), nullable=False, index=True)  # ph, temperature, tds, turbidity, do, cod, bod, tss
    value = Column(Float, nullable=False)
    unit = Column(String(20), nullable=False)
    condition = Column(String(20), default="normal")  # 'normal' | 'warning' | 'critical'
    quality = Column(String(20), default="valid")  # 'valid' | 'suspect' | 'missing'
    measured_at = Column(DateTime(timezone=True), default=utcnow, index=True)

    station = relationship("MonitoringStation", back_populates="readings")
    device = relationship("IoTDevice", back_populates="readings")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String(50), primary_key=True, index=True)
    industry_id = Column(String(50), ForeignKey("industries.id", ondelete="CASCADE"), nullable=False)
    station_id = Column(String(50), ForeignKey("monitoring_stations.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    source = Column(String(30), default="reading")  # 'reading' | 'prediction'
    severity = Column(String(20), nullable=False)  # 'warning' | 'critical'
    status = Column(String(20), default="new")  # 'new' | 'acknowledged' | 'resolved'
    _parameter_keys = Column("parameter_keys", Text, nullable=False, default="[]")
    message = Column(Text, nullable=False)
    triggered_at = Column(DateTime(timezone=True), default=utcnow)
    acknowledged_at = Column(DateTime(timezone=True), nullable=True)
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    ai_analysis_id = Column(String(50), ForeignKey("ai_analyses.id", ondelete="SET NULL"), nullable=True)

    industry = relationship("Industry", back_populates="alerts")
    station = relationship("MonitoringStation", back_populates="alerts")
    ai_analysis = relationship("AIAnalysis", foreign_keys=[ai_analysis_id])

    @property
    def parameter_keys(self):
        try:
            return json.loads(self._parameter_keys)
        except Exception:
            return []

    @parameter_keys.setter
    def parameter_keys(self, value):
        self._parameter_keys = json.dumps(value)


class AIAnalysis(Base):
    __tablename__ = "ai_analyses"

    id = Column(String(50), primary_key=True, index=True)
    industry_id = Column(String(50), ForeignKey("industries.id", ondelete="CASCADE"), nullable=False)
    station_id = Column(String(50), ForeignKey("monitoring_stations.id", ondelete="CASCADE"), nullable=False)
    generated_at = Column(DateTime(timezone=True), default=utcnow)
    horizon_hours = Column(Integer, default=6)
    risk_level = Column(String(20), default="normal")  # 'normal' | 'warning' | 'critical'
    risk_score = Column(Float, nullable=True)
    confidence = Column(Float, nullable=True)
    summary = Column(Text, nullable=False)
    related_alert_id = Column(String(50), nullable=True)

    industry = relationship("Industry", back_populates="ai_analyses")
    station = relationship("MonitoringStation", back_populates="ai_analyses")
    anomaly_factors = relationship("AnomalyFactor", back_populates="analysis", cascade="all, delete-orphan")
    recommendations = relationship("MitigationRecommendation", back_populates="analysis", cascade="all, delete-orphan")


class AnomalyFactor(Base):
    __tablename__ = "anomaly_factors"

    id = Column(Integer, primary_key=True, autoincrement=True)
    analysis_id = Column(String(50), ForeignKey("ai_analyses.id", ondelete="CASCADE"), nullable=False)
    rank = Column(Integer, nullable=False)
    parameter_key = Column(String(30), nullable=False)
    label = Column(String(100), nullable=False)
    observed_value = Column(Float, nullable=False)
    unit = Column(String(20), nullable=False)
    direction = Column(String(30), nullable=False)  # 'high' | 'low' | 'rapid-change'
    contribution = Column(Float, nullable=True)
    explanation = Column(Text, nullable=False)

    analysis = relationship("AIAnalysis", back_populates="anomaly_factors")


class MitigationRecommendation(Base):
    __tablename__ = "mitigation_recommendations"

    id = Column(String(50), primary_key=True, index=True)
    analysis_id = Column(String(50), ForeignKey("ai_analyses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    priority = Column(String(20), default="normal")  # 'normal' | 'warning' | 'critical'
    status = Column(String(20), default="pending")  # 'pending' | 'completed'
    completed_at = Column(DateTime(timezone=True), nullable=True)
    completed_by = Column(String(50), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    execution_mode = Column(String(50), default="human-checklist")

    analysis = relationship("AIAnalysis", back_populates="recommendations")


class ThresholdRule(Base):
    __tablename__ = "threshold_rules"

    id = Column(String(50), primary_key=True, index=True)
    parameter_key = Column(String(30), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    unit = Column(String(20), nullable=False)
    warning_min = Column(Float, nullable=True)
    warning_max = Column(Float, nullable=True)
    critical_min = Column(Float, nullable=True)
    critical_max = Column(Float, nullable=True)
    basis_note = Column(Text, nullable=True)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

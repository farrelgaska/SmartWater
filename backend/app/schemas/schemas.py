from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class BaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


# --- Auth & Session ---
class SessionRequest(BaseModel):
    email: str
    password: str


class UserOut(BaseSchema):
    id: str
    name: str
    email: str
    role: str
    industryId: Optional[str] = None
    status: str


class SessionResponseData(BaseModel):
    user: UserOut
    token: str


class SessionResponse(BaseModel):
    data: SessionResponseData


# --- User Management ---
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: Optional[str] = "password123"
    role: str
    industry_id: Optional[str] = None


class UserUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    status: Optional[str] = None
    industry_id: Optional[str] = None


# --- Industry ---
class IndustryLocation(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class IndustryOut(BaseSchema):
    id: str
    name: str
    businessType: str = Field(..., alias="business_type")
    address: str
    location: Optional[IndustryLocation] = None
    complianceStatus: str = Field(..., alias="compliance_status")
    stationIds: List[str] = []


# --- Station ---
class MonitoringStationOut(BaseSchema):
    id: str
    industryId: str = Field(..., alias="industry_id")
    name: str
    locationDesc: Optional[str] = Field(None, alias="location_desc")
    status: str
    lastReadingAt: Optional[datetime] = Field(None, alias="last_reading_at")
    deviceIds: List[str] = []


# --- IoT Device ---
class IoTDeviceOut(BaseSchema):
    id: str
    stationId: str = Field(..., alias="station_id")
    serialNumber: str = Field(..., alias="serial_number")
    name: str
    parameterKeys: List[str] = Field(default_factory=list, alias="parameter_keys")
    status: str
    firmwareVersion: Optional[str] = Field(None, alias="firmware_version")
    lastSeenAt: Optional[datetime] = Field(None, alias="last_seen_at")


class IoTDeviceCreate(BaseModel):
    station_id: str
    serial_number: str
    name: str
    parameter_keys: List[str] = []
    status: Optional[str] = "active"
    firmware_version: Optional[str] = "1.0.0"


class IoTDeviceUpdate(BaseModel):
    name: Optional[str] = None
    station_id: Optional[str] = None
    parameter_keys: Optional[List[str]] = None
    status: Optional[str] = None
    firmware_version: Optional[str] = None


# --- Sensor Readings ---
class SensorReadingOut(BaseSchema):
    id: int
    stationId: str = Field(..., alias="station_id")
    deviceId: Optional[str] = Field(None, alias="device_id")
    parameterKey: str = Field(..., alias="parameter_key")
    value: float
    unit: str
    condition: str
    quality: str
    measuredAt: datetime = Field(..., alias="measured_at")


class TelemetryItem(BaseModel):
    parameterKey: str
    value: float
    unit: Optional[str] = None


class TelemetryIngestRequest(BaseModel):
    stationId: str
    deviceId: Optional[str] = None
    readings: List[TelemetryItem]


# --- Anomaly Factors & AI ---
class AnomalyFactorOut(BaseSchema):
    rank: int
    parameterKey: str = Field(..., alias="parameter_key")
    label: str
    observedValue: float = Field(..., alias="observed_value")
    unit: str
    direction: str
    contribution: Optional[float] = None
    explanation: str


class MitigationRecommendationOut(BaseSchema):
    id: str
    analysisId: str = Field(..., alias="analysis_id")
    title: str
    description: str
    priority: str
    status: str
    completedAt: Optional[datetime] = Field(None, alias="completed_at")
    completedBy: Optional[str] = Field(None, alias="completed_by")
    executionMode: str = Field("human-checklist", alias="execution_mode")


class RecommendationUpdate(BaseModel):
    status: str  # 'pending' | 'completed'


class AIAnalysisOut(BaseSchema):
    id: str
    industryId: str = Field(..., alias="industry_id")
    stationId: str = Field(..., alias="station_id")
    generatedAt: datetime = Field(..., alias="generated_at")
    horizonHours: int = Field(..., alias="horizon_hours")
    riskLevel: str = Field(..., alias="risk_level")
    riskScore: Optional[float] = Field(None, alias="risk_score")
    confidence: Optional[float] = None
    summary: str
    anomalyFactors: List[AnomalyFactorOut] = Field(default_factory=list, alias="anomaly_factors")
    recommendationIds: List[str] = []
    recommendations: List[MitigationRecommendationOut] = []
    relatedAlertId: Optional[str] = Field(None, alias="related_alert_id")


# --- Alerts ---
class AlertOut(BaseSchema):
    id: str
    industryId: str = Field(..., alias="industry_id")
    stationId: str = Field(..., alias="station_id")
    title: str
    source: str
    severity: str
    status: str
    parameterKeys: List[str] = Field(default_factory=list, alias="parameter_keys")
    message: str
    triggeredAt: datetime = Field(..., alias="triggered_at")
    acknowledgedAt: Optional[datetime] = Field(None, alias="acknowledged_at")
    resolvedAt: Optional[datetime] = Field(None, alias="resolved_at")
    aiAnalysisId: Optional[str] = Field(None, alias="ai_analysis_id")


class AlertUpdate(BaseModel):
    status: str  # 'acknowledged' | 'resolved'


# --- Threshold Rules ---
class ThresholdRuleOut(BaseSchema):
    id: str
    parameterKey: str = Field(..., alias="parameter_key")
    name: str
    unit: str
    warningMin: Optional[float] = Field(None, alias="warning_min")
    warningMax: Optional[float] = Field(None, alias="warning_max")
    criticalMin: Optional[float] = Field(None, alias="critical_min")
    criticalMax: Optional[float] = Field(None, alias="critical_max")
    basisNote: Optional[str] = Field(None, alias="basis_note")


class ThresholdRuleUpdate(BaseModel):
    warningMin: Optional[float] = None
    warningMax: Optional[float] = None
    criticalMin: Optional[float] = None
    criticalMax: Optional[float] = None
    basisNote: Optional[str] = None

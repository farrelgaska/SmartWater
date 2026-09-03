import uuid
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_password_hash
from app.api.deps import get_current_user, require_role
from app.models.entities import User, IoTDevice, MonitoringStation, ThresholdRule
from app.schemas.schemas import (
    UserCreate, UserUpdate,
    IoTDeviceCreate, IoTDeviceUpdate,
    ThresholdRuleUpdate
)

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/system")
def get_system_overview(
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    devices = db.query(IoTDevice).all()
    users = db.query(User).all()
    stations = db.query(MonitoringStation).all()

    active_devices = sum(1 for d in devices if d.status == "active")
    unstable_devices = sum(1 for d in devices if d.status == "unstable")
    offline_devices = sum(1 for d in devices if d.status == "offline")

    devices_data = [
        {
            "id": d.id,
            "stationId": d.station_id,
            "stationName": d.station.name if d.station else "-",
            "serialNumber": d.serial_number,
            "name": d.name,
            "parameterKeys": d.parameter_keys,
            "status": d.status,
            "firmwareVersion": d.firmware_version,
            "lastSeenAt": d.last_seen_at.isoformat() if d.last_seen_at else None
        }
        for d in devices
    ]

    users_data = [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "industryId": u.industry_id,
            "industryName": u.industry.name if u.industry else "-",
            "status": u.status
        }
        for u in users
    ]

    return {
        "data": {
            "summary": {
                "serverStatus": "healthy",
                "totalDevices": len(devices),
                "activeDevices": active_devices,
                "unstableDevices": unstable_devices,
                "offlineDevices": offline_devices,
                "totalUsers": len(users),
                "totalStations": len(stations)
            },
            "devices": devices_data,
            "users": users_data
        }
    }


# --- Device Management ---
@router.post("/devices")
def create_device(
    body: IoTDeviceCreate,
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    existing = db.query(IoTDevice).filter(IoTDevice.serial_number == body.serial_number).first()
    if existing:
        raise HTTPException(status_code=409, detail={"code": "DUPLICATE_SERIAL", "message": "Nomor serial perangkat sudah terdaftar"})

    station = db.query(MonitoringStation).filter(MonitoringStation.id == body.station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail={"code": "STATION_NOT_FOUND", "message": "Stasiun tidak ditemukan"})

    dev = IoTDevice(
        id=f"dev-{uuid.uuid4().hex[:8]}",
        station_id=body.station_id,
        serial_number=body.serial_number,
        name=body.name,
        parameter_keys=body.parameter_keys,
        status=body.status or "active",
        firmware_version=body.firmware_version or "1.0.0",
        last_seen_at=datetime.now(timezone.utc)
    )
    db.add(dev)
    db.commit()
    db.refresh(dev)

    return {
        "data": {
            "device": {
                "id": dev.id,
                "serialNumber": dev.serial_number,
                "name": dev.name,
                "status": dev.status
            }
        }
    }


@router.patch("/devices/{deviceId}")
def update_device(
    deviceId: str,
    body: IoTDeviceUpdate,
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    dev = db.query(IoTDevice).filter(IoTDevice.id == deviceId).first()
    if not dev:
        raise HTTPException(status_code=404, detail={"code": "DEVICE_NOT_FOUND", "message": "Perangkat tidak ditemukan"})

    if body.name is not None:
        dev.name = body.name
    if body.station_id is not None:
        dev.station_id = body.station_id
    if body.parameter_keys is not None:
        dev.parameter_keys = body.parameter_keys
    if body.status is not None:
        dev.status = body.status
    if body.firmware_version is not None:
        dev.firmware_version = body.firmware_version

    db.commit()
    db.refresh(dev)

    return {
        "data": {
            "device": {
                "id": dev.id,
                "name": dev.name,
                "status": dev.status
            }
        }
    }


# --- User Management ---
@router.get("/users")
def list_users(
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    users = db.query(User).all()
    return {
        "data": {
            "users": [
                {
                    "id": u.id,
                    "name": u.name,
                    "email": u.email,
                    "role": u.role,
                    "industryId": u.industry_id,
                    "status": u.status
                }
                for u in users
            ]
        }
    }


@router.post("/users")
def create_user(
    body: UserCreate,
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    existing = db.query(User).filter(User.email == body.email).first()
    if existing:
        raise HTTPException(status_code=409, detail={"code": "DUPLICATE_EMAIL", "message": "Email sudah digunakan"})

    u = User(
        id=f"usr-{uuid.uuid4().hex[:8]}",
        name=body.name,
        email=body.email,
        password_hash=get_password_hash(body.password or "password123"),
        role=body.role,
        industry_id=body.industry_id,
        status="active"
    )
    db.add(u)
    db.commit()
    db.refresh(u)

    return {
        "data": {
            "user": {
                "id": u.id,
                "name": u.name,
                "email": u.email,
                "role": u.role,
                "industryId": u.industry_id,
                "status": u.status
            }
        }
    }


@router.patch("/users/{userId}")
def update_user(
    userId: str,
    body: UserUpdate,
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    u = db.query(User).filter(User.id == userId).first()
    if not u:
        raise HTTPException(status_code=404, detail={"code": "USER_NOT_FOUND", "message": "Pengguna tidak ditemukan"})

    if body.name is not None:
        u.name = body.name
    if body.role is not None:
        u.role = body.role
    if body.status is not None:
        u.status = body.status
    if body.industry_id is not None:
        u.industry_id = body.industry_id

    db.commit()
    db.refresh(u)

    return {
        "data": {
            "user": {
                "id": u.id,
                "name": u.name,
                "email": u.email,
                "role": u.role,
                "status": u.status
            }
        }
    }


# --- Threshold Rules ---
@router.get("/threshold-rules")
def get_threshold_rules(
    current_user: User = Depends(require_role(["admin", "dlh", "industry"])),
    db: Session = Depends(get_db)
):
    rules = db.query(ThresholdRule).all()
    return {
        "data": {
            "rules": [
                {
                    "id": r.id,
                    "parameterKey": r.parameter_key,
                    "name": r.name,
                    "unit": r.unit,
                    "warningMin": r.warning_min,
                    "warningMax": r.warning_max,
                    "criticalMin": r.critical_min,
                    "criticalMax": r.critical_max,
                    "basisNote": r.basis_note
                }
                for r in rules
            ]
        }
    }


@router.patch("/threshold-rules/{ruleId}")
def update_threshold_rule(
    ruleId: str,
    body: ThresholdRuleUpdate,
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    rule = db.query(ThresholdRule).filter(ThresholdRule.id == ruleId).first()
    if not rule:
        raise HTTPException(status_code=404, detail={"code": "RULE_NOT_FOUND", "message": "Aturan threshold tidak ditemukan"})

    if body.warningMin is not None:
        rule.warning_min = body.warningMin
    if body.warningMax is not None:
        rule.warning_max = body.warningMax
    if body.criticalMin is not None:
        rule.critical_min = body.criticalMin
    if body.criticalMax is not None:
        rule.critical_max = body.criticalMax
    if body.basisNote is not None:
        rule.basis_note = body.basisNote

    db.commit()
    db.refresh(rule)

    return {
        "data": {
            "rule": {
                "id": rule.id,
                "parameterKey": rule.parameter_key,
                "warningMin": rule.warning_min,
                "warningMax": rule.warning_max,
                "criticalMin": rule.critical_min,
                "criticalMax": rule.critical_max
            }
        }
    }

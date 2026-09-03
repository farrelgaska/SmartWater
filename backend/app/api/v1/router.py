from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    industry,
    alerts,
    ai,
    dlh,
    admin,
    telemetry
)

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(industry.router)
api_router.include_router(alerts.router)
api_router.include_router(ai.router)
api_router.include_router(dlh.router)
api_router.include_router(admin.router)
api_router.include_router(telemetry.router)

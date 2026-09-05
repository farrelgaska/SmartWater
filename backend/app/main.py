from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.api.v1.router import api_router
from app.services.seed_service import seed_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Startup: Create tables if not exist
    Base.metadata.create_all(bind=engine)
    
    # 2. Seed initial demo data
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
        
    yield
    # Shutdown logic (if any)


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan
)

# CORS configuration
# Note: Do NOT mix allow_origins list with allow_origin_regex in Starlette 1.6.x
# as it causes OPTIONS preflight to return 400 Bad Request.
# Use allow_origin_regex alone to cover all localhost/127.0.0.1 ports.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION
    }

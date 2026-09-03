import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.core.database import Base, get_db
from app.services.seed_service import seed_database

# Use in-memory SQLite for tests
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_smartwater.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="module")
def client():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    seed_database(db)
    db.close()

    def override_get_db():
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_auth_login_success(client):
    # Test Industry login
    res = client.post("/api/auth/session", json={
        "email": "owner@batikpuspa.com",
        "password": "industry123"
    })
    assert res.status_code == 200
    data = res.json()["data"]
    assert "token" in data
    assert data["user"]["role"] == "industry"
    assert data["user"]["industryId"] == "ind-puspa"


def test_auth_login_invalid_password(client):
    res = client.post("/api/auth/session", json={
        "email": "owner@batikpuspa.com",
        "password": "wrongpassword"
    })
    assert res.status_code == 401


def test_industry_dashboard_access(client):
    # Login as industry
    login_res = client.post("/api/auth/session", json={
        "email": "owner@batikpuspa.com",
        "password": "industry123"
    })
    token = login_res.json()["data"]["token"]

    # Access dashboard
    dash_res = client.get("/api/industry/dashboard", headers={"Authorization": f"Bearer {token}"})
    assert dash_res.status_code == 200
    dash_data = dash_res.json()
    assert dash_data["industry"]["name"] == "Batik Puspa Kencana"
    assert len(dash_data["latestReadings"]) > 0


def test_dlh_dashboard_rbac(client):
    # Login as industry user
    login_ind = client.post("/api/auth/session", json={
        "email": "owner@batikpuspa.com",
        "password": "industry123"
    })
    token_ind = login_ind.json()["data"]["token"]

    # Try accessing DLH dashboard as industry -> MUST BE FORBIDDEN
    dlh_res = client.get("/api/dlh/dashboard", headers={"Authorization": f"Bearer {token_ind}"})
    assert dlh_res.status_code == 403

    # Login as DLH
    login_dlh = client.post("/api/auth/session", json={
        "email": "dlh@pekalongan.go.id",
        "password": "dlh123"
    })
    token_dlh = login_dlh.json()["data"]["token"]

    # Access DLH dashboard as DLH -> SUCCESS
    dlh_res2 = client.get("/api/dlh/dashboard", headers={"Authorization": f"Bearer {token_dlh}"})
    assert dlh_res2.status_code == 200
    assert dlh_res2.json()["summary"]["totalIndustries"] >= 3


def test_admin_system_overview(client):
    # Login as admin
    login_admin = client.post("/api/auth/session", json={
        "email": "admin@smartwater.id",
        "password": "admin123"
    })
    token_admin = login_admin.json()["data"]["token"]

    admin_res = client.get("/api/admin/system", headers={"Authorization": f"Bearer {token_admin}"})
    assert admin_res.status_code == 200
    data = admin_res.json()["data"]
    assert "devices" in data
    assert "users" in data


def test_telemetry_ingest_and_alert_trigger(client):
    # Ingest abnormal reading for st-puspa-01 (pH = 9.8 -> critical)
    telemetry_payload = {
        "stationId": "st-puspa-01",
        "deviceId": "dev-01",
        "readings": [
            {"parameterKey": "ph", "value": 9.8, "unit": ""},
            {"parameterKey": "turbidity", "value": 85.0, "unit": "NTU"}
        ]
    }
    ingest_res = client.post("/api/telemetry/readings", json=telemetry_payload)
    assert ingest_res.status_code == 201
    assert ingest_res.json()["hasAnomaly"] is True

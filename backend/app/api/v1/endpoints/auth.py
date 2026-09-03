from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, create_access_token
from app.models.entities import User
from app.schemas.schemas import SessionRequest, SessionResponse, SessionResponseData, UserOut
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/session", response_model=SessionResponse)
def create_session(body: SessionRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "INVALID_CREDENTIALS", "message": "Email atau kata sandi tidak valid"}
        )
    
    if user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "USER_INACTIVE", "message": "Akun pengguna dinonaktifkan"}
        )

    access_token = create_access_token(subject=user.id)
    user_out = UserOut(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        industryId=user.industry_id,
        status=user.status
    )
    return {"data": {"user": user_out, "token": access_token}}


@router.get("/session")
def get_session(current_user: User = Depends(get_current_user)):
    user_out = UserOut(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        role=current_user.role,
        industryId=current_user.industry_id,
        status=current_user.status
    )
    return {"data": {"user": user_out}}


@router.delete("/session", status_code=status.HTTP_204_NO_CONTENT)
def delete_session(current_user: User = Depends(get_current_user)):
    return Response(status_code=status.HTTP_204_NO_CONTENT)

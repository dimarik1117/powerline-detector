from fastapi import APIRouter

router = APIRouter()

@router.get("/analyses")
def get_analyses():
    return {"message": "List of analyses"}

@router.get("/analyses/{analysis_id}")
def get_analysis(analysis_id: int):
    return {"analysis_id": analysis_id}

@router.get("/users")
def get_users():
    return {"message": "Users endpoint"}
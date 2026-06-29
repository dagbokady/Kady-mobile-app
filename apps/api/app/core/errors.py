# app/core/errors.py — erreur métier au format unique {detail, code}.
from fastapi import Request
from fastapi.responses import JSONResponse


class ApiError(Exception):
    def __init__(self, status: int, code: str, detail: str):
        self.status = status
        self.code = code
        self.detail = detail


async def api_error_handler(_: Request, exc: ApiError) -> JSONResponse:
    return JSONResponse(status_code=exc.status, content={"detail": exc.detail, "code": exc.code})


def err(status: int, code: str, detail: str) -> ApiError:
    return ApiError(status, code, detail)

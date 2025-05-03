from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    async def update(self, **kwargs):
        for key, val in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, val)

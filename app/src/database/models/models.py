import sqlalchemy as sqla
from .base import Base

# class User(Base):
#     __tablename__ = 'users'
#     id: Mapped[int] = mapped_column(
#         primary_key=True,
#         autoincrement=True,
#         unique=True
#     )
#
#     first_name: Mapped[Optional[str]]
#     last_name: Mapped[Optional[str]]
#     login: Mapped[str] = mapped_column(unique=True)
#     password: Mapped[str]
#     created_at: Mapped[datetime] = mapped_column(
#         DateTime(timezone=True),
#         server_default=func.now()
#     )

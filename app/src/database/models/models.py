from datetime import datetime
import enum
import sqlalchemy as sqla
from typing import Optional
import sqlalchemy.orm as orm
from .base import Base
from ...services.open_router_api.models import OpenRouterModel

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


class Dialogue(Base):
    __tablename__ = "dialogue"
    id: orm.Mapped[int] = orm.mapped_column(
        primary_key=True, autoincrement=True, unique=True
    )

    # ----- FIELDS -----
    name: orm.Mapped[str] = orm.mapped_column(default="Новый диалог")
    model: orm.Mapped[str]
    creator: orm.Mapped[str]

    # ----- REALATIONSHIPS -----
    branches: orm.Mapped[list["Branch"]] = orm.relationship(back_populates="dialogue")
    permissions: orm.Mapped[list["Permission"]] = orm.relationship(
        back_populates="dialogue"
    )


class Branch(Base):
    __tablename__ = "branch"
    id: orm.Mapped[int] = orm.mapped_column(
        primary_key=True, autoincrement=True, unique=True
    )
    # ----- FIELDS -----
    name: orm.Mapped[str] = orm.mapped_column(default="Новая ветка")
    creator: orm.Mapped[str]

    # ----- FOREIGN KEYS -----
    dialogue_id: orm.Mapped[int] = orm.mapped_column(sqla.ForeignKey("dialogue.id"))
    parent_branch_id: orm.Mapped[Optional[int]] = orm.mapped_column(
        sqla.ForeignKey("branch.id")
    )
    root_id: orm.Mapped[Optional[int]] = orm.mapped_column(
        sqla.ForeignKey("message.id")
    )
    head_id: orm.Mapped[Optional[int]] = orm.mapped_column(
        sqla.ForeignKey("message.id")
    )

    # ----- REALATIONSHIPS -----
    dialogue: orm.Mapped["Dialogue"] = orm.relationship(back_populates="branches")
    parent_branch: orm.Mapped[Optional["Branch"]] = orm.relationship(
        back_populates="child_branches"
    )
    child_branches: orm.Mapped[list["Branch"]] = orm.relationship(
        back_populates="parent_branch", remote_side=id
    )
    root: orm.Mapped[Optional["Message"]] = orm.relationship(
        back_populates="root_of", foreign_keys=[root_id]
    )
    head: orm.Mapped[Optional["Message"]] = orm.relationship(
        back_populates="head_of", foreign_keys=[head_id]
    )
    messages: orm.Mapped[list["Message"]] = orm.relationship(
        back_populates="branch", foreign_keys="Message.branch_id"
    )


class Message(Base):
    __tablename__ = "message"
    id: orm.Mapped[int] = orm.mapped_column(
        primary_key=True, autoincrement=True, unique=True
    )
    # ----- FIELDS -----
    user_message: orm.Mapped[str] = orm.mapped_column(type_=sqla.TEXT)
    model_response: orm.Mapped[str] = orm.mapped_column(type_=sqla.TEXT)
    timestamp: orm.Mapped[datetime] = orm.mapped_column(sqla.DateTime(timezone=True))

    # ----- FOREIGN KEYS -----
    branch_id: orm.Mapped[int] = orm.mapped_column(sqla.ForeignKey("branch.id"))
    previous_message_id: orm.Mapped[Optional[int]] = orm.mapped_column(
        sqla.ForeignKey("message.id"),
    )

    # ----- REALATIONSHIPS -----
    branch: orm.Mapped["Branch"] = orm.relationship(
        back_populates="messages", foreign_keys=branch_id
    )
    previous_message: orm.Mapped["Message"] = orm.relationship(
        back_populates="next_message", uselist=False
    )
    next_message: orm.Mapped["Message"] = orm.relationship(
        back_populates="previous_message", uselist=False, remote_side=id
    )
    root_of: orm.Mapped[Optional["Branch"]] = orm.relationship(
        back_populates="root", foreign_keys="Branch.root_id"
    )
    head_of: orm.Mapped[Optional["Branch"]] = orm.relationship(
        back_populates="head", foreign_keys="Branch.head_id"
    )


class Permission(Base):
    __tablename__ = "permission"
    id: orm.Mapped[int] = orm.mapped_column(
        primary_key=True, autoincrement=True, unique=True
    )

    can_send_messages: orm.Mapped[bool] = orm.mapped_column(default=False)
    can_create_branches: orm.Mapped[bool] = orm.mapped_column(default=False)
    user: orm.Mapped[str]

    dialogue_id: orm.Mapped[int] = orm.mapped_column(sqla.ForeignKey("dialogue.id"))
    dialogue: orm.Mapped[Dialogue] = orm.relationship(
        back_populates="permissions", uselist=False
    )

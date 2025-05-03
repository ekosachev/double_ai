import sqlalchemy as sqla
from db import AsyncSession

# async def reg_user(login: str, password: str) -> int | None:
#     session: AsyncSession
#     async with async_session() as session:
#         check = await session.execute(
#             select(
#                 User.login
#             ).where(
#                 User.login == login
#             )
#         )
#         check = check.scalar_one_or_none()
#         if check is not None:
#             raise HTTPException(
#                 detail='login already exist',
#                 status_code=status.HTTP_400_BAD_REQUEST
#             )
#
#         new_user = User(
#             login=login,
#             password=password
#         )
#         session.add(new_user)
#         await session.commit()
#
#         return new_user


# async def get_user_by_id(id_user: int):
#     session: AsyncSession
#     async with async_session() as session:
#         user = await session.execute(
#             select(
#                 User
#             ).where(
#                 User.id == int(id_user)
#             )
#         )
#         user = user.scalar_one_or_none()
#         if user is None:
#             raise HTTPException(
#                 status_code=404,
#                 detail=f'{id_user=} does not exist'
#             )
#
#         return user


# async def get_user_by_login(login: str):
#     session: AsyncSession
#     async with async_session() as session:
#         user = await session.execute(
#             select(
#                 User
#             ).where(
#                 User.login == login
#             )
#         )
#         user = user.scalar_one_or_none()
#         return user


# async def update_user(id_user: int, new_data: UserUpdate):
#     session: AsyncSession
#     async with async_session() as session:
#         user = await session.execute(
#             select(
#                 User
#             ).where(
#                 User.id == id_user
#             )
#         )
#         user = user.scalar_one_or_none()
#         if user is None:
#             raise HTTPException(
#                 detail=f'id={id_user} does not exist in users table',
#                 status_code=status.HTTP_400_BAD_REQUEST
#             )
#
#         if new_data.first_name:
#             user.first_name = new_data.first_name
#
#         if new_data.last_name:
#             user.last_name = new_data.last_name
#
#         if new_data.login:
#             user.login = new_data.login
#
#         if new_data.password:
#             user.password = hash_password(new_data.password)
#
#         await session.commit()

FROM python:3.12-alpine

WORKDIR /bot
#ENV PYTHONUNBUFFERED 1
#
#RUN pip install --upgrade pip
#COPY ./requirements.txt requirements.txt
#RUN pip install --user -r requirements.txt
#
#ENV PATH=/root/.local/bin:$PATH
#
#COPY . .
#CMD python bot.py

COPY requirements.txt ./requirements.txt

RUN pip install -r requirements.txt

COPY .. .
CMD ["python3", "bot.py"]

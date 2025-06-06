FROM python:3.12.2

WORKDIR /app

COPY ./requirements.txt ./requirements.txt

RUN pip install --no-cache-dir -r requirements.txt 

COPY . .

CMD ["python3", "__main__.py"]

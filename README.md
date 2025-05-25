
# Double AI

Телеграмм-приложение для взаимодействия с различными LLM в формате диалога. В приложении имеется возможность создания диалога, выбора модели, управления совместным доступом к чатам, шаблоны промптов, ветвление диалога (последнее не реализовано до конца)

[Ссылка на презентацию](https://disk.yandex.ru/i/zucfn_t1X0r_8g)


## Состав команды MISIS x VSUET double 13.0

- Лоскутова Валерия (БИВТ-24-15)
- Косачев Егор (БИВТ-24-15)
- Чекалина Виктория (БИВТ-24-16)
- Бедрин Данила
- Дегтярев Антон


## Использование проекта

Приложение доступно в боте `@double_ai_double_bot` в телеграмм


## Используемые языки и технологии

### Бэкенд
- PostgreSQL
- Python
- SQLAlchemy
- FastAPI

### Фронтенд
- Node.js
- React
- Vite

### Прочее
- Caddy
- Docker & Docker-compose
## Запуск решения

Чтобы запустить проект выполните

```bash
  docker compose up -d
```

Для запуска проекта необходимо добавить файлы SSL-сертификатов в папку `cert` в корне проекта, а также создать в корне проекта файл `.env`
```env
DBUSER={{YOUR_DB_USER_NAME}}
DBPASSWORD={{YOUR_DB_PASSWORD}}
DBHOST=db
DBNAME={{YOUR_DB_NAME}}
DBPORT=5432
RESET_DB={{if set to true will reset database upon startup}}
OPENROUTER_KEY={{YOUR_OPENROUTER_API_KEY}}
```
и файл `db.env`
```env
POSTGRES_USER={{YOUR_DB_USER_NAME}}
POSTGRES_PASSWORD={{YOUR_DB_USER_PASSWORD})
POSTGRES_DB={{YOUR_DB_NAME}}
```

В `Caddyfile` заменить домен `double-ai.ru` на необходимый

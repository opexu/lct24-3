# Стройплощадки
Демо проекта доступно по адресу:
http://стройплощадки.online

## Запуск проекта
1. Перед началом работы поместить .env в корень проекта
2. Необходимо установить docker последней версии
3. Поместить папки с файлами:
    'документация 2024' -> ./back/uploads
    'картинки 2024' -> ./back/uploads
4. Запуск проекта
    docker compose up -d --build

## Пример .env
```
STRAPI_HOST=0.0.0.0
STRAPI_PORT=1337
API_SERVER_URL=http://localhost/backend
JWT_SECRET=GGBEmmTuzrohhcU29ubUYg==
ADMIN_JWT_SECRET=DTwNlKb2ZC0Lr+Slk9447Q==
APP_KEYS=b9CnGGc+TOTFl/e6qUjUQw==,QBXCYZiPIMTPjq/zBMjmPQ==,OSVXz/Ur8RcCuD3tJXhO7A==,RI0zB1eXVQ5GhgmPQO/mYw==
API_TOKEN_SALT=tCX8ujAUH+v86hIDWBeOPg==
TRANSFER_TOKEN_SALT=gyO4flUBr6szb3FAolu7sw==
NODE_ENV=development
DATABASE_CLIENT=client
DATABASE_HOST=lct-postgres
DATABASE_PORT=5432
DATABASE_NAME=lct
DATABASE_USERNAME=user
DATABASE_PASSWORD=password
```
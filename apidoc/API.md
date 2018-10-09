WebbyLab's REST API format
--------------------------

## Общая логика REST API

1. Все роуты API начинаются с /api/v1
2. Названия коллекций всегда во множественном числе. Например, "users", "orders", "posts" и тд.
3. Именна полей в camelCase
4. Даты и время всегда в ISO8601 UTC. Например, "2015-04-02T14:20Z". Просто даты, записывается без времени, например "2015-04-02".
5. Перечисляемые типы всегда встроки в вверхнем регистре. Например, для role: 'ADMIN', 'MODERATOR', 'USER'
6. Каждый возвращаемый объект содержит поле "id" с идентификатором объекта. значение для "id" всегда возвращается, как строка (чтобы избежать проблем с ограничением длины int)
7. Все ссылки на связанные объекты должны находится в секции links. Каждая ссылка должна содержать название коллекции (type) и идентификтор объекта(id). Возможны добавление дополнительных данных. ВАЖНО: ссылки не должны конфликтовать с названиями атрибутов в главном объекте.


## Стандартный набор роутов для коллекции, на примере списка постов.

Логика следующая. Есть коллекция /api/v1/posts, в коллекции есть посты /api/v1/posts/:id
Роуты, по сути, это идентификаторы, а методы HTTP - это применяемые к коллекции действия.

- **GET /api/v1/posts** - получить коллекцию постов, может возвращать не все поля.
POST /api/v1/posts - добавить пост к коллекцию, назад возвращает новосозданные объект.
- **GET /api/v1/posts/31** - получить пост с id=31. Обязательно содержит все поля, что возвращались при получении списка, но может содержать дополнительные поля (например, "payload")
- **PUT /api/v1/posts/31** - заменить(добавить) пост с id=31
- **PATСH /api/v1/posts/31** - обновить поля поста с id=31
- **DELETE /api/v1/posts/31** - удалить пост c id=31

### Создание поста
#### Запрос

POST /api/v1/posts

```javascript
{
    "data": {
        "title": "Babel vs Traceur",
        "text": "What is better..."
    }
}
```

#### Ответ

```javascript
{
    "status": 1,
    "data": {
        "id": "2312",
        "title": "Babel vs Traceur",
        "text": "What is better..."

        "links": {
            "comments": []
        },

        "createdAt": "2015-04-02T14:20Z",
        "updatedAt": "2015-04-02T14:20Z", 
    }
}
```


### Получения списка всех постов

#### Запрос
GET /api/v1/posts

#### Ответ

```javascript
{
    "status": 1,
    "data": [{
        "id": "2312",
        "title": "Babel vs Traceur",
        "text": "What is better..."

        "links": {
            "comments": [
                {"type": "comments", "id": 23},
                {"type": "comments", "id": 24}
            ]
        },

        "createdAt": "2015-04-02T14:20Z",
        "updatedAt": "2015-04-02T14:20Z", 
    }]
}
```


### Получения одного поста

#### Запрос
GET /api/v1/posts/2312

#### Ответ

```javascript
{
    "status": 1,
    "data": {
        "id": "2312",
        "title": "Babel vs Traceur",
        "text": "What is better..."

        "links": {
            "comments": [
                {"type": "comments", "id": 23},
                {"type": "comments", "id": 24}
            ]
        },

        "createdAt": "2015-04-02T14:20Z",
        "updatedAt": "2015-04-02T14:20Z", 
    }
}
```


### Обновление поста

#### Запрос
PATCH /api/v1/posts/2312

```javascript
{
    "data": {
        "title": "Babel vs Traceur!",
    }
}
```

#### Ответ

```javascript
{
    "status": 1,
    "data": {
        "id": "2312",
        "title": "Babel vs Traceur!",
        "text": "What is better...",

        "links": {
            "comments": [
                {"type": "comments", "id": 23},
                {"type": "comments", "id": 24}
            ]
        },

        "createdAt": "2015-04-02T14:20Z",
        "updatedAt": "2015-04-02T14:20Z", 
    }
}
```


### Удаление поста

#### Запрос
DELETE /api/v1/posts/2312

#### Ответ

```javascript
{
    "status": 1,
}
```

### Более сложный пример: создание заказа
POST /api/v1/orders

#### Запрос

```javascript
{
    "data": {
        "name": "Заказ техники",
        "deliveryDate": "2015-04-20",

        "links": {
            "customer": {"type": "customers", "id": "212"},
            "payments": [
                {"type": "payments", "id": "34"},
                {"type": "payments", "id": "35"}
            ],
        },

        "orderedProducts": [
            { 
                "quantity": 20, 
                "links": {
                    "product":{ "type": "products", "id": "123" } 
                } 
            },{ 
                "quantity": 21, 
                "links": {
                    "product":{ "type": "products", "id": "124" } 
                } 
            }
        ]
    }
}
```


#### Ответ

```javascript
{
    "status": 1,
    "data": {
        "id": "2312",
        "name": "Заказ техники",
        "deliveryDate": "2015-04-20",

        "status": "PENDING",

        "links": {
            "customer": {"type": "customers", "id": "212"},
            "payments": [
                {"type": "payments", "id": "34"},
                {"type": "payments", "id": "35"}
            ],
        },

        "orderedProducts": [
            { 
                "quantity": 20, 
                "links": {
                    "product":{ "type": "products", "id": "123" } 
                } 
            },{ 
                "quantity": 21, 
                "links": {
                    "product":{ "type": "products", "id": "124" } 
                } 
            }
        ],

        "createdAt": "2015-04-02T14:20Z",
        "updatedAt": "2015-04-02T14:20Z", 
    }
}
```
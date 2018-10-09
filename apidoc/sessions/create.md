# SESSIONS CREATE
-----------------

## Request

    POST /api/v1/sessions

```javascript
    {
        "data": {
            "email": "jorrk@mail.com",
            "password": "some pass"
        }
    }
```

## Response

```javascript
{
    "status": 1                               // integer, 1 if action was successful, otherwise 0

    "data": {
        "jwt": "5321d7eaf69e47e24b000001...", // JSON Web Token with "id", "login"
    }
}
```
# USER UPDATE
-------------

## Request

    PUT /api/v1/users/:userId?token=dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk

```javascript

    {
        "data": {
            "firstName"   : "Ivan",
            "secondName"  : "Levin"
        }
    }
```

## Response

```javascript

    {
        "status": 1,
        "data": {
            "email"       : "vasya@mail.com",

            "firstName"   : "Ivan",
            "secondName"  : "Levin"
        }
    }

```
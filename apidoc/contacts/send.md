# EMAIL SEND
------------

## Request

    POST /api/v1/contacts

```javascript

    {
        "data": {
            "name"        : "Ivan",
            "phoneNumber" : "123321",
            "email"       : "email@gmail.com",
            "website"     : "http://site.com",
            "solution"    : "solution",
            "timeframe"   : "timeframe",
            "additional"  : "text"
        }
    }

```

## Response

```javascript

    {
        "status": 1
    }

```
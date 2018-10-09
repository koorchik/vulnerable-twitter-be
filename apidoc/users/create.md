# USERS CREATE
--------------

## Request

    POST /api/v1/users

```javascript

    {
        "data": {
            "email"   : "test@mailinator.com",
            "password": "password"
        }
    }

```

## Response

```javascript

    {
        "status": 1,
        "data": {
            "id": "56cc5605240219154b0ff6a5",
            "status": "PENDING",
            "email": "test@mailinator.com",
            "firstName": "",
            "secondName": "",
            "createdAt": "2016-02-23T12:52:10.980Z"
        }
    }

```
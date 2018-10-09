# USER RESET PASSWORD
-------------

## Request

    POST /api/v1/users/resetPasswordBySMS

```javascript

    {
        "data": {
            "email" : "vasya@mail.com"
        }
    }

```

## Response

```javascript

    {
        "actionId": "5bb63538c816ed0000000002",
        "status": 1
    }

```
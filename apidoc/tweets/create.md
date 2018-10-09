# NEWS CREATE
-------------

## Request

    POST /api/v1/tweets?token=dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk

```javascript

    {
        "data": {
            "title"    : "Title",
            "subtitle" : "Subtitle",
            "text"     : "Text",
            "image"    : "url/to/img"
        }
    }

```

## Response

```javascript

    {
        "status": 1,
        "data": {
            "id"          : "accd97828b241d12d121c1"
            "title"       : "Title",
            "subtitle"    : "Subtitle",
            "text"        : "Text",
            "image"       : "url/to/img",
            "isPublished" : "false",
            "createdAt"   : "2016-02-23T13:41:54.457Z"
        }
    }

```
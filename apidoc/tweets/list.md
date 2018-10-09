# NEWS LIST
-----------

## Request

    GET /api/v1/tweets/


## Response

```javascript

    {
        "status": 1,
        "data": [
            {
                "id"          : "accd97828b241d12d121c1"
                "title"       : "Title",
                "subtitle"    : "Subtitle",
                "text"        : "Text",
                "image"       : "url/to/img",
                "isPublished" : "false",
                "createdAt"   : "2016-02-23T13:41:54.457Z"
            },
            {
                "id"          : "accd97828b241d12d121c1"
                "title"       : "Title2",
                "subtitle"    : "Subtitle2",
                "text"        : "Text2",
                "image"       : "url/to/img2",
                "isPublished" : "true",
                "createdAt"   : "2016-02-23T13:41:54.457Z"
            }
        ],
        "meta": {
            "totalCount": 2,
            "filteredCount": 2,
            "limit": 20,
            "offset": 0
        }
    }

```
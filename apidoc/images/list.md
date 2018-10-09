# IMAGES LIST
-------------

## Request

    GET /api/v1/images/


## Response

```javascript

    {
        "status": 1,
        "data": [
            {
                "id"       : "accd97828b241d12d121c1",
                "imageUrl" : "url/to/image"
            },
            {
                "id"       : "accd97828b241d12d121c2",
                "imageUrl" : "url/to/image"
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
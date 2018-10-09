# IMAGES CREATE
---------------

## Request

    POST /api/v1/images?token=dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk

    // Files must be uploaded in multipart-form-data
    // 'image' is required

## Response

```javascript

    {
        "status": 1,
        "data": {
            "id"       : "accd97828b241d12d121c1",
            "imageUrl" : "url/to/image"
        }
    }

```
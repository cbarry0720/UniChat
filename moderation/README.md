# Moderation Service

## DataBase Structure :

### The moderation DataBase follows the following format:
There is no database for this service.

# API Endpoints :

## POST : `/events`

### Handles all events. Required parameters:
```json
{
    "type" : "string",
    "data" : {} // Can be of type Comment, Post, etc.
}
```

### Accepted Events:
```
"PostCreated"
"CommentCreated"
```

## Responses:

### `Status 200` : Event Successfully Handled
Response based on event type

### `Status 300` : Event Not Recognized
```json
{
    "message" : "Event not recognized",
    "type" : "string",
    "data" : {} // Can be of type Comment, Post
}
```

### `Status 400` : Body missing parameters
```json
{
    "error" : "Body missing parameters",
    "expected" : {
        "userID" : "string"
    }
}
```

### `Status 404` : Data not found
```json
{
    "error" : "Data not found",
    "expected" : {
        "userID" : "string"
    }
}
```


# Query Service

## DataBase Structure :

### The comments DataBase follows the following format:
```json
[
    {
        "postID" : "string",
        "userID" : "string",
        "groupID" : "string",
        "postText" : "string",
        "postMedia" : "string",
        "postUpvotes" : [
            {
                "voteID" : "string",
                "voter" : "string",
                "postID" : "string",
                "voteType" : "string"
            }
        ],
        "postDownvotes" : [
            {
                "voteID" : "string",
                "voter" : "string",
                "postID" : "string",
                "voteType" : "string"
            }
        ],
        "postComments" : [
            {
                "commentID" : "string",
                "userID" : "string",
                "postID" : "string",
                "content" : "string"
            }
        ]
    }
]
```
# API Endpoints :

## GET : `/posts/all`

### Get all posts. Required parameters:
```json
{}
```

## Responses:

### `Status 200` : Posts successfully returned
```json
[
    {
        "postID" : "string",
        "userID" : "string",
        "groupID" : "string",
        "postText" : "string",
        "postMedia" : "string",
        "postUpvotes" : [
            {
                "voteID" : "string",
                "voter" : "string",
                "postID" : "string",
                "voteType" : "string"
            }
        ],
        "postDownvotes" : [
            {
                "voteID" : "string",
                "voter" : "string",
                "postID" : "string",
                "voteType" : "string"
            }
        ],
        "postComments" : [
            {
                "commentID" : "string",
                "userID" : "string",
                "postID" : "string",
                "content" : "string"
            }
        ]
    }
]
```

## GET : `/posts/group/:id`

### Get all posts by group. Required parameters:
```json
{
    "groupID" : "string"
}
```

## Responses:

### `Status 200` : Posts successfully returned
```json
[
    {
        "postID" : "string",
        "userID" : "string",
        "groupID" : "string",
        "postText" : "string",
        "postMedia" : "string",
        "postUpvotes" : [
            {
                "voteID" : "string",
                "voter" : "string",
                "postID" : "string",
                "voteType" : "string"
            }
        ],
        "postDownvotes" : [
            {
                "voteID" : "string",
                "voter" : "string",
                "postID" : "string",
                "voteType" : "string"
            }
        ],
        "postComments" : [
            {
                "commentID" : "string",
                "userID" : "string",
                "postID" : "string",
                "content" : "string"
            }
        ]
    }
]
```

### `Status 400` : Body missing parameters
```json
{
    "error" : "Body missing parameters",
    "expected" : {
        "groupID" : "string"
    }
}
```

## GET : `/posts/user/:id`

### Get all posts by user. Required parameters:
```json
{
    "userID" : "string"
}
```

## Responses:

### `Status 200` : Posts successfully returned
```json
[
    {
        "postID" : "string",
        "userID" : "string",
        "groupID" : "string",
        "postText" : "string",
        "postMedia" : "string",
        "postUpvotes" : [
            {
                "voteID" : "string",
                "voter" : "string",
                "postID" : "string",
                "voteType" : "string"
            }
        ],
        "postDownvotes" : [
            {
                "voteID" : "string",
                "voter" : "string",
                "postID" : "string",
                "voteType" : "string"
            }
        ],
        "postComments" : [
            {
                "commentID" : "string",
                "userID" : "string",
                "postID" : "string",
                "content" : "string"
            }
        ]
    }
]
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

## POST : `/events`

### Handles all events. Required parameters:
```json
{
    "type" : "string",
    "data" : {}
}
```
### Acceptable Events:
```

```

## Responses:

### `Status 200` : Event Successfully Handled
Response based on event type

### `Status 300` : Event Not Recognized
```json
{
    "message" : "Event not recognized",
    "type" : "string",
    "data" : {}
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


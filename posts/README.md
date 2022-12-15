# Posts Service

## Authors

-   Chris Barry - [@cbarry0720](https://github.com/cbarry0720)

## Description

The Posts service takes care of all the posts that are created by users. It stores the posts in a database where the frontend can get the posts.

## Interaction with Other Services

This service mainly interacts with the User service. The Posts service sends an "Post Created" event to the event bus, then recieved by the User and Group services to put in their databases. The Posts service also recieves created events from the comments and votes services.

## DataBase Structure :

### The posts DataBase follows the following format:

```json
[
	{
		"postID": "string",
		"userID": "string",
		"groupID": "string",
		"postText": "string",
		"postMedia": "string",
		"postUpvotes": [],
		"postDownvotes": [],
		"postComments": []
	}
]
```

## API Endpoints :

### GET : `/posts/all`

#### Get all posts.

### Responses:

#### `Status 200` : Posts successfully retrieved

```json
[
    {
        "postID": "string",
        "userID": "string",
        "groupID": "string",
        "postText": "string",
        "postMedia": "string",
        "postUpvotes": [],
        "postDownvotes": [],
        "postComments": []
    },
    ...
]
```

### POST : `/posts/create`

#### Create a new post. Required parameters:

```json
{
	"userID": "string",
	"groupID": "string",
	"postText": "string",
	"postMedia": "string"
}
```

### Responses:

#### `Status 200` : Post successfully created

```json
{
	"postID": "string",
	"userID": "string",
	"groupID": "string",
	"postText": "string",
	"postMedia": "string",
	"postUpvotes": [],
	"postDownvotes": [],
	"postComments": []
}
```

#### `Status 400` : Missing Body Parameters

```
Invalid Details!
```

#### `Status 500` : Internal Server Error

```
Internal Server Error!
```

### GET : `/posts/:postID`

#### Get a post by its ID.

### Responses:

#### `Status 200` : Post successfully retrieved

```json
{
	"postID": "string",
	"userID": "string",
	"groupID": "string",
	"postText": "string",
	"postMedia": "string",
	"postUpvotes": [],
	"postDownvotes": [],
	"postComments": []
}
```

#### `Status 404` : Post not found

```
Post not found!
```

### POST `/posts/events`

#### Recieve events from other services.

### Responses:

#### `Status 200` : Event successfully recieved

```json
{
	"type": "string",
	"data": {}
}
```

#### `Status 400` : Missing Body Parameters

```
Invalid Details!
```

## How to run the service

### Prerequisites

-   Node.js
-   MongoDB

### Running the service

1.  Clone the repository
2.  Run `npm install` to install all dependencies
3.  Run `npm start` to start the service

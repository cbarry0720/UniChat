# Users Service

## Authors

-   Chris Barry - [@cbarry0720](https://github.com/cbarry0720)

## Description

The Users service takes care of all the user information. It stores the user's information in a database, and allows the frontend to get the user information.

## Interaction with Other Services

This service mainly interacts with all services in the application since everything uses a userID. The Authentication service sends an "User Created" event to the event bus, then recieved by the User service to put in their database. The User service also recieves many created/added events from other services, and stores the information in the database.

## DataBase Structure :

### The users DataBase follows the following format:

```json
[
	{
		"userID": "string",
		"firstName": "string",
		"lastName": "string",
		"tagName": "string",
		"posts": [],
		"comments": [],
		"upvotes": [],
		"downvotes": [],
		"courses": [],
		"deadlines": []
	}
]
```

## API Endpoints :

### GET : `/users/all`

#### Get all users

### Responses:

#### `Status 200` : Users successfully retrieved

```json
[
    {
        "userID": "string",
        "firstName": "string",
        "lastName": "string",
        "tagName": "string",
        "posts": [],
        "comments": [],
        "upvotes": [],
        "downvotes": [],
        "courses": [],
        "deadlines": []
    },
    ...
]
```

## GET : `/users/:userID`

#### Get a user by their userID

### Responses:

#### `Status 200` : User successfully retrieved

```json
{
	"userID": "string",
	"firstName": "string",
	"lastName": "string",
	"tagName": "string",
	"posts": [],
	"comments": [],
	"upvotes": [],
	"downvotes": [],
	"courses": [],
	"deadlines": []
}
```

#### `Status 404` : User not found

```
User Not Found!
```

## POST : `/users/events`

#### Recieve events from other services. Required parameters:

```json
{
	"type": "string",
	"data": {}
}
```

### Responses:

#### `Status 200` : Event successfully recieved

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

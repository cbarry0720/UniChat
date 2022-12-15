# Deadline Service

## Authors

-   Ibrahim Syed - *@Ibrahimmsyed7* - [isyed@umass.edu](isyed@umass.edu)
## Description

The deadline service allows users to create a deadline as well as subscribe to a deadline

## Interaction with Other Services

This service interacts with the user service since it involves deadlines being created by a user 

## DataBase Structure :

### The deadline DataBase follows the following format:

```json
[
	{
		"deadlineID": "string",
        "deadlineUsers": [],
        "deadlineName": "string",
        "deadlineTime": "string",
	}
]
```

## API Endpoints :

### post : `deadline/create`

### Responses:

#### `Status 201` : Deadlines successfully created

```json
[
    {
        "deadlineID": "string",
        "deadlineUsers": [],
        "deadlineName": "string",
        "deadlineTime": "string",
    },
]
```

### POST : `/deadline/addUser`

#### add a user. Required parameters:

```json
{
	"userID": "string",
	"deadlineID": "string",
}
```

### Responses:

#### `Status 200` : User subscribed to deadline

#### `Status 400` : Missing Body Parameters

```
Invalid Details!
```

#### `Status 500` : Internal Server Error

```
Internal Server Error!
```

#### `Status 404` : Deadline not found

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

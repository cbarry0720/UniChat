# Group Service

## Authors

-   Ibrahim Syed - *@Ibrahimmsyed7* - [isyed@umass.edu](isyed@umass.edu)
## Description

The group service allows users to create a group as well as join to a group

## Interaction with Other Services

This service interacts with the user service since it involves groups being created by the users

## DataBase Structure :

### The group DataBase follows the following format:

```json
[
	{
		"groupUsers": [],
        "groupName": "string",
	}
]
```

## API Endpoints :

### post : `group/create`

### Responses:

#### `Status 201` : group created

```json
[
    {
        "groupID": "string",
        "groupUsers": [],
        "groupName": "string"
    },
]
```

### POST : `/group/addUser`

#### add a user. Required parameters:

```json
{
	"userID": "string",
	"groupID": "string",
}
```

### Responses:

#### `Status 200` : User added to group

#### `Status 400` : Missing Body Parameters

```
Invalid Details!
```

#### `Status 500` : Internal Server Error

```
Internal Server Error!
```

#### `Status 404` : group not found

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

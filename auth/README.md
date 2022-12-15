# Authentication Service

## Authors

-   Chris Barry - [@cbarry0720](https://github.com/cbarry0720)

## Description

The Authentication service takes care of a user logging in and signing up once the application loads. Most importantly, it stores password information in the database

## Interaction with Other Services

This service mainly interacts with the User service. Once a user signs up, an "User Created" event is sent to the event bus, then recieved by the User service to put in their database.

# DataBase Structure :

## The authentication DataBase follows the following format:

```json
[
	{
		"_id": "string",
		"tagName": "string",
		"password": "string",
		"firstName": "string",
		"lastName": "string"
	}
]
```

# API Endpoints :

## POST : `/auth/signup`

### Create a new user. Required parameters:

```json
{
	"tagName": "string",
	"password": "string",
	"firstName": "string",
	"lastName": "string"
}
```

### Responses:

#### `Status 200` : User successfully created

```json
{
	"tagName": "string",
	"firstName": "string",
	"lastName": "string",
	"password": "string",
	"userID": "string"
}
```

#### `Status 400` : Missing Body Parameters

```
Invalid Details!
```

## POST : `/auth/login`

### Login with an already created user. Required parameters:

```json
{
	"tagName": "string",
	"password": "string"
}
```

### Responses:

#### `Status 200` : User successfully logged in

```json
{
	"userID": "string",
	"message": "Logged in!"
}
```

#### `Status 400` : Missing Body Parameters

```
Invalid Details!
```

#### `Status 404` : User not found

```json
{
	"message": "User not found!"
}
```

#### `Status 400` : Incorrect Password

```json
{
	"message": "Invalid Password!"
}
```

## POST : `/auth/events`

### Recieve events from the event bus. Required parameters:

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

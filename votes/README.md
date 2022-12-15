# Votes Service

## Authors

-   Ibrahim Syed - *@Ibrahimmsyed7* - [isyed@umass.edu](isyed@umass.edu)
## Description

The votes service allows user to upvote or downvote a post.

## Interaction with Other Services

This service interacts with the user and posts service since it involves users submitting a vote to 

## DataBase Structure :

### The votes DataBase follows the following format:

```json
[
	{
		"voter": "string",
        "postID": "string",
        "voteType": "string",
	}
]
```

## API Endpoints :

### post : `votes/create`

### Responses:

#### `Status 201` : vote created

```json
[
    {
        "voteID": "string",
        "voter": "string",
        "postID": "string",
        "voteType": "string",
    },
]
```

### Responses:

#### `Status 400` : Missing Body Parameters

```
Invalid Details!
```

#### `Status 500` : Internal Server Error

```
Internal Server Error!
```

#### `Status 404` : Votes not found

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

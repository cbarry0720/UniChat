# Comments Service

## DataBase Structure :

### The comments DataBase follows the following format:
```json
[
	{
		"commentID" : string,
		"userID" : string,
		"postID" : string,
		"content" : string
	}
]
```

# API Endpoints :

## POST : `/comments/create`

### Create a new comment. Required parameters:
```json
{
	"postID" : string,
	"userID" : string,
	"content" : string
}
```

## Responses:

### `Status 200` : Comment successfully created
```json
{
	"commentID" : string,
	"postID" : string,
	"userID" : string,
	"content" : string
}
```

### `Status 400` : Missing body parameters 
```json
{
	error: 'Body missing parameters.',
	expected: {
		"userID" : string,
		"postID" : string,
		"content" : string
	}
}
```

## GET : `/comments/:id`

### Gets all comments by postID. Required parameters:
```json
{
	"postID" : string
}
```

## Responses:

### `Status 200` : Comments successfully returned
```json
[
	{
		"commentID" : string,
		"postID" : string,
		"userID" : string,
		"content" : string
	},
	{
		"commentID" : string,
		"postID" : string,
		"userID" : string,
		"content" : string
	}
]
```

### `Status 400` : Missing body parameters
```json
{
	error: 'Body missing parameters.',
	expected: {
		"postID" : string
	}
}
```
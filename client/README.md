# UniChat React Frontend

## Authors

-   Chris Barry - [@cbarry0720](https://github.com/cbarry0720)
-   Ibrahim Syed - [@ibrahimmsyed7](https://github.com/ibrahimmsyed7)
-   Anshul Vemulapalli - [@x3z3](https://github.com/x3z3)

## Description

This is the frontend for the UniChat project. It is a React app that is written in typescript made from create-react-app. The app uses axios to make requests to the backend. It also uses bootstrap for styling.

## Interaction with other services & API Endpoints

The frontend interacts with the backend through the following endpoints:

-   `http://localhost:4000/auth/login` - POST request to login - Auth service
-   `http://localhost:4000/auth/signup` - POST request to signup - Auth service
-   `http://localhost:4001/user/:id` - GET request to get a user - User service
-   `http://localhost:4002/posts/create` - POST request to create a post - Posts service
-   `http://localhost:4003/comment/create` - POST request to create a comment - Comments service
-   `http://localhost:4007/deadline/create` - POST request to create a deadline - Deadlines service
-   `http://localhost:4007/deadlines/all` - GET request to get all deadlines - Deadlines service
-   `http://localhost:4008/groups/create` - POST request to create a group - Groups service
-   `http://localhost:4008/groups/all` - GET request to get all groups - Groups service
-   `http://localhost:4006/votes/create` - POST request to create a vote - Votes service
-   `http://localhost:4004/posts/all` - GET request to get all posts - Query service
-   `http://localhost:4004/posts/user/:id` - GET request to get all posts by userID - Query service
-   `http://localhost:4004/posts/group/:id` - GET request to get all posts by groupID - Query service

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

[![Netlify Status](https://api.netlify.com/api/v1/badges/a2d722ce-ad9e-4849-a48d-78041460f264/deploy-status)](https://app.netlify.com/sites/mr-explorer/deploys)

[![codecov](https://codecov.io/gh/VGLoic/mr-jam/branch/master/graph/badge.svg)](https://codecov.io/gh/VGLoic/mr-jam)

## Available Scripts

In the project directory, you can run:

### `yarn install:all`

Installs the dependencies for the frontend application and the lambda functions

### `yarn start:app`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

You will need the lambda functions running locally in order to use the application. See next section.

### `yarn start:lambda`

Runs the lambda functions in the development mode.<br />
Open [http://localhost:9000/.netlify/functions/main](http://localhost:9000/.netlify/functions/main) to use the Apollo Playground.

The functions will reload if you make edits in `src/lambda`.<br />

### `yarn start:all`

Runs the lambda function and the frontend application in development mode in parallel.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn test:cover`

Launches the test runner and generates coverage.

### `yarn build:app`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn build:lambda`

Builds the functions for production to the `src/lambda/dist` folder.<br />

The build is minified and the filenames include the hashes.<br />.

### `yarn build:all`

Builds the functions and the application for production.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

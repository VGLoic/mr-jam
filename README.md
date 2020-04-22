[![Netlify Status](https://api.netlify.com/api/v1/badges/a2d722ce-ad9e-4849-a48d-78041460f264/deploy-status)](https://app.netlify.com/sites/mr-explorer/deploys)

[![codecov](https://codecov.io/gh/VGLoic/mr-jam/branch/master/graph/badge.svg)](https://codecov.io/gh/VGLoic/mr-jam)

## Available Scripts

In the project directory, you can run:

### `yarn install`

Installs the dependencies for the client application and the lambda functions

### `yarn start:client`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

You will need the lambda functions running locally in order to use the application. See next section.

### `yarn start:lambda`

Runs the lambda functions in the development mode.<br />
Open [http://localhost:9000/.netlify/functions/main](http://localhost:9000/.netlify/functions/main) to use the Apollo Playground.

The functions will reload if you make edits in `packages/lambda/src`.<br />

### `yarn start:all`

Runs the lambda function and the client application in development mode in parallel.

### `yarn test:client`

Launches the test runner for the client application in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn test:client:cover`

Launches the test runner and generates coverage for the client.

### `yarn test:lambda`

Launches the test runner for the lambda functions in the interactive watch mode.

### `yarn test:lambda:cover`

Launches the test runner and generates coverage for the lambda functions.

### `yarn test:cover`

Launches the test runner and generates coverage for the lambda functions and client application.

### `yarn build:client`

Builds the client for production to the `packages/client/build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn build:lambda`

Builds the functions for production to the `packages/lambda/dist` folder.<br />

### `yarn build:all`

Builds the functions and the client application for production.

### `yarn contracts:compile`

Compile the solidity contracts and create the JSON artifacts in `build/contracts`.

### `yarn contracts:deploy:dev`

Deploy the contracts on the `development` network.

### `yarn contracts:console:dev`

Launch the truffle console on the `development` network.

### `yarn ganache:start`

Launch a development blockchain associated to the `development` network on port `7545`.

## Available blockchain networks

### `development`

Local network used to develop and test the smart contracts. The expected port is `7545`.

# Example Client for Frequency

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
But it uses yarn instead of npm.

## Get started
* Make sure [yarn is installed](https://classic.yarnpkg.com/en/docs/getting-started)
* Clone this repo
* `yarn install`
* Follow instructions for [building and starting Frequency](https://github.com/LibertyDSNP/frequency)
* `cp .env.sample .env` and then edit `.env` to reflect what chain to connect to and what secret key to use for a Provider.
It's fine if it is not already registered as an MSA; the app will register for you automatically.
* Make sure the collators and relay chain you have configured are running.
* `yarn start`

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


# Example Client for Frequency
Intended largely for demos to a wider audience, this is a React application that connects to the Frequency parachain and can do simple things with it.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Get started
* Make sure [npm is installed](https://docs.npmjs.com/cli/v9/configuring-npm/install)
* Clone this repo
* `npm install`
* Follow instructions for [running a Frequency chain](https://github.com/LibertyDSNP/frequency):
  * You must match the version of [`@frequency/api-augment` package](@frequency-chain/api-augment) to the frequency chain version you are running.
  * For most purposes, launching Frequency chain in instant-seal mode will be enough.
  * If you aren't doing chain development, there is a docker image for running in instant-seal mode, is faster than building and running.
* `cp .env.sample .env` and then edit `.env` to reflect what chain to connect to and what secret key to use for a Provider.
It's fine if it is not already registered as an MSA; the app will register for you automatically.
* If you aren't running an instant-seal Frequency parachain, Make sure the collators and relay chain you have configured are running.
* `yarn start`

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

NOT IMPLEMENTED YET

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Project Directory Structure 

`./TraceClient/` dir encapsulates everything, will become a module to be included anywhere in JS.

`./App.js` serves as testing env for module, currently culminating with `LotExplorer` component, which touches on all current progress.

`./TraceClient/TraceAPI.js` encapsulates all backend connectivity, GraphQL queries etc.

`./TraceClient/MockLotData.js` has mock data to fill all Lot data. To switch `./TraceClient/components/LotExplorer` over to mock data just add `mock` prop to LotExplorer in `App.js`: `<LotExplorer mock />`

`./TraceClient/components` is home for UI components. Stateful containers get own directory with index.js + index.css, see `./TraceClient/components/LotExplorer` as example. Stateless functional component parts occupy a single file each, raising state (and styling) up to whatever container they are included in.

## Backend Connectivity

Currently dev only, using endpoint: `http://trace-backend-dev-pr-204.herokuapp.com`
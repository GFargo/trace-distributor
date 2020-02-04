# Trace Distributor Portal

## Install

### `yarn install`

## Run

### `yarn start`

## Test

### `yarn test`

## Build

### `yarn build`

## Project Directory

- `src/core`: Trace Core Submodule
- `src/layouts`: Trace Distributor Portal Layouts
- `src/pages`: Trace Distributor Portal Pages
- `src/services`: Trace Distributor Portal State Machine and API
- `src/styles`: Trace Distributor Portal Styles
- `src/tests`: Trace Distributor Portal Unit Tests

## Backend Connectivity

Dev endpoint: `http://trace-backend-dev-pr-204.herokuapp.com`

## General heads-up on ES/Babel lexicals and React Hooks

- '?' in `thing?.prop` is a short circuit operator, which returns null when it hits the '?' if previous variable is null or undefined.

- '!!' not not, always return boolean. Combined with above `!!thing?.prop` will return falsy if thing or prop is undefined.

- `const thing = (conditionMet) ? <componentA /> : <componentB />` ternary conditional component render can be waterfalled as a state switch.

- fast way to generate/copy over to a new object with given params and/or static default object state.
 `const newObject = ({thing1, thing2}) => ({
  	...staticDefault,
  	thing1,
  	thing2
  })`

- `useReducer` in App.js is how react hooks connects the app to the state machine in services/stateMachine.js, very similar to how redux works. In console, you'll see state machine logs grouped by state type, tracing value changes from state to state.

- Pure function all the things: With react hooks, there is really no reason to use classes at all anymore, all components can be purely functional and reactive. Encapsulate state in components with `useState`, and bind/raise all app level state functionality up to state machine via dispatch. We can later break out state and reducer functionality per component, and then combine state/reducers into one with a combiner function, however it will be much more intuitive using existing proven patterns in redux to do that with higher order functions, as opposed to passing down state and dispatch to every component that needs them. With redux, `connect(() => stateToProps(state, dispatch))`, both state and dispatch are attached automatically to any wrapped component and passed in to the component as props, making component development seamless to the state machine entirely.
Trace Distributor Portal

## Getting Started

### `yarn install`
### `yarn start`

### `yarn test`

### `yarn build`

## Project Directory Structure 

- `src/core`: Trace Core Submodule
- `src/layouts`: Trace Distributor Portal Layouts
- `src/pages`: Trace Distributor Portal Pages
- `src/services`: Trace Distributor Portal State Machine and API
- `src/styles`: Trace Distributor Portal Styles
- `src/tests`: Trace Distributor Portal Unit Tests

## Backend Connectivity

Dev endpoint: `http://trace-backend-dev-pr-204.herokuapp.com`

## Using funky new ES/Babel lexicals

	- `?` in `thing?.prop` is a short circuit operator, which returns null when it hits the `?` if previous variable is null/undefined.

	- `!!` is shorthand for return truthy boolean. Combined with above - `!!thing?.prop` will return falsy even if thing is undefined.

  - `const thing = (conditionMet) ? <componentA /> : <componentB />` is fast way to conditonal component render and can be waterfalled infintely as a state switch, in one line of code.

  - `const newObject = ({thing1, thing2}) => ({
  	...staticDefault,
  	thing1,
  	thing2
  })` is fast way to generate/copy over to a new object with given params and/or static default object state.

	- `useReducer` in App.js is how how react hooks connects the app to the state machine in `services/stateMachine.js`, very similar to how redux works. In console, you'll see state machine logs grouped by state type, tracing value changes from state to state.

	- Pure function all the things: With react hooks, there is really no reason to use classes at all anymore, all components can be purely funtional and reactive. Encapsulate state in components with `useState`, and bind/raise all app level / biz code state functionality up to state machine via dispatch. We can break out state and reducer encap'd functionality per component, and then combine state/reducers in App.js, however it will be much more intuitive using existing proven patterns in redux to do that with higher order functions, as opposed to passing down state and dispatch to every component that needs them. With redux, `connect(() => stateToProps(state, dispatch))`, both state and dispatch are attached automatically to each wrapped component, with both automatically passed in as props to the component, making component development seamless to the state machine entirely.

	- If I missed anything / you see something wierd tha I'm doing, please give me a shout about it on slack, and I'll undate this readme to explain better.
# Unresolved actions for redux
React redux library to deal with async actions

## WARNING this is still in development
Major changes might be introduced in near future

## Installation
`npm i unresolved-actions-redux`

## Store setup

```js
// Import unresolvedActionMiddleware
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { unresolvedActionMiddleware } from 'unresolved-actions-redux';
import { reducer } from '../reducers';


// Define dependencies and dependency resolver
const dependencies = {
    api: id => new Promise((res) => {
        setTimeout(() => res(`John`), 3000);
    }),
};
// In this case dependency resolver is simple service object map, 
// but can be any function that takes service name and returns the service
const dependencyResolver = serviceName => dependencies[service];

// add unresolved action middleware and pass dependency resolver 
const configureStore = () => {
    const middleware = applyMiddleware(
        unresolvedActionMiddleware(dependencyResolver),       
    );

    return createStore(createReducedActionReducer(reducers), {}, middleware);
};

export default configureStore;

```

## Usage
This library works by catching async UnresolvedAction type actions and resolving them inside the middleware

### Example of async action
```js
/* login.js */

// Import Resolver
import { Resolver } from 'unresolved-actions-redux';

async function login(id) {
    // getState() and dispatch get injected 
    // into the action and is accessible from this 
    if (!this.getState().app.login) {
        this.dispatch({type: 'LOGIN_WAIT'});
        // dependencies are also accessible from this
        const name = await this.loginManager(id);
        this.dispatch({type: 'LOGIN_RESOLVE', message: `Logged in as ${name}`});
    }
}
// Decorate action with Resolver and pass required dependencies 
// as { alias in action: service name } object
export default Resolver({ loginManager: 'api' })(login);

``` 

### Example of calling async action

```js
...
import login from "./login.js";

...
<Button
    onPress={() => {                        
        this.props.dispatch( login("id_12345") );
    }}
    title="Login"    
/>

```
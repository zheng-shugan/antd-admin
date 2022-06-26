# React-Redux

## 1. Overview

The `connect()` function connects a React component to a Redux store.

```js
function connect(mapStateToProps?, mapDispatchToProps?, mergeProps?, options?)
```

The `mapStateToProps` and `mapDispatchToProps` deals with your Redux store's `state` and `dispatch`, respectively. `state` and `dispatch` will be supplied to your `mapStateToProps` or `mapDispatchToProps` functions as the first argument.

The returns of `mapStateToProps` and `mapDispatchProps` are referred to internally as `stateProps` and `dispatchProps`, respectively. They will be supplied to `mergeProps`, if defined, as the first and the second argument, where the third argument will be `ownProps`. The combined result, commonly referred to as `mergedProps`, will then be supplied to your connected component.

## 2. `connected()` Parameters

`connect` accepts four different parameters, all option. By convention, they are called:

1. `mapStateToProps?: Function`
2. `mapDispatchToProps?: Funtioon | Object`
3. `mergeProps?: Function`
4. `options?: Object`

`mapStateToProps` should be defined as a function:

```js
function mapStateToProps(state, ownProps?)
```

### 2.1 `mapStateToProps`

```js
mapStateToProps?: (state, ownProps?) => Objet
```

If a `mapStateToProps` function is specified, the new wrapper component will subscribe to Redux store updates. This mean that any time the store is updated, `mapStateToProps` will be called. The results of `mapStateToProps` must be a plain object, which will be merged into the wrapped comonent's props. If you don't want to subscribe to store updates, pass `null` or `undefined` in place of `mapStateToProps`.

#### Parameters

1. `state: Object`
2. `ownProps?: Object`

A `mapStateToProps` function takes a maximum of two parameters. The number of declared function parameters affects when it will be called. This also determines whether the function will receive ownProps.

##### `state`

If your `mapStateToProps` function is declared as taking two parameters, it will be called whenever the store state changes or when the wrapper component receives new props (based on shallow equality comparisons). It will be given the store state as the first parameter, and the wrapper component's props as the second parameter.

The second parameter is normally referred to as `ownProps` by convention.

````js
const mapStateToProps = (state, ownProps) => ({
  todo: state.todos[ownProps.id],
})
````

#### Returns

Your `mapStateToProps` functions are expected to return an object. This object, normally referred to as `stateProps`, will be merged as props to you connected component. If you define `mergeProps`, it will be supplied as the first parameter to `mergeProps`.

The return of the `mapStateToProps` determine whether the connected component will-rerender.

### 2.2  `mapDispatchToProps`

Conventionall called `mapDispatchToProps`, this second parameter to `connect()` may either be an object, a function, or not supplied.

Our component will receive `dispatch` by default, i.e, when you do not supply a second parameter to `connect()`:

```js
// Do not pass `mapDispatchProps`
connect()(MyComponent)
connect(mapStateToProps)(MyComponent)
connect(mapStateToProps, null, mergeProps, options)(MyComponent)
```

If you define a m `mapDispatchToProps` as a function, it will be called with a maximum of two parameters.

#### Parameters

1. `dispatch: Function`
2. `ownProps?: Object`

##### `Dispatch`

If your `mapDispatchToProps` is declared as a function take one parameter, it will be given the `dispatch` of your `store`.

```js
const increment = () => ({ type: 'INCREMENT' })
const decrement = () => ({ type: 'DECREMENT' })
const reset = () => ({ type: 'RESET' })

const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching plain actions
    increment: () => dispatch(increment()),
    decrement: () => dispatch(decrement()),
    reset: () => dispatch(reset())
  }
}
```

##### `ownProps`

If your `mapDispatchToProps` take two parameters, it will be called with `dispatch` as the first parameter and the props passed ot the wrapper component as the parameter, and will be re-invoked whenever the connected component receives new props.

The second parameter is normally referred to as `ownProps` by convention.

```js
// binds on component re-rendering
<button onClick={() => this.props.toggleTodo(this.props.todoId)} />

// binds on `props` change
const mapDispatchToProps = (dispatch, ownProps) => ({
  toggleTodo: () => dispatch(toggleTodo(ownProps.todoId)),
})
```

#### Returns

`mapDispatchToProps` function are expected to return an object. Each fields of the object should be a function, calling which is expected to dispatch an action to the store.

The return of `mapDispatchToProps` functions are regarded as `dispatchProps`. It wil be merged as props as props to your connected component. If you define `mergeProps`, it will be supplied as the second parameter to `mergeProps`.

### 2.3 `mergeProps`

If specified, defines how the final props for you own wrapped component are determined. iF you do not provide `mergeProps`, your wrapped component receives `{ ...ownProps, ...stateProps, ...dispatchProps }` by default.

#### 2.3.1 Parameters

`mergeProps` should be specified with maxiumu of three parameters. They are the result of `mapStateToProps)`, `mapDispatchToProps()`, and the wrapper component's `props`, respectively :

1. `stateProps`
2. `dispatchProps`
3. `ownProps`

The fields in the plain object you return from it will be used as the props for the wrapped component. You may specify this function to select a slice of the state based on props, or to bind action creators to particular variable from props.

#### 2.3.2 Returns

The return value of `mergedProps` is referred to as `mergedProps` and the fields will be used as the props for the wrapped component.

#### 2.4 `options`

```js
{
  context?: Object,
  areStatesEqual?: Function,
  areOwnPropsEqual?: Function,
  areStatePropsEqual?: Function,
  areMergedPropsEqual?: Function,
  forwardRef?: boolean,
}
```

React-Redux v6 allows you to supply a custom context instance to be used by React-Redux. You need to pass the instance of your context to both `<Provider />` and your connected component. You may pass the context to your connected component either by passing it here as a field of option, or as a prop to your connected component in rending.

```js
// const MyContext = React.createContext()
connect(mapStateToProps, mapDispatchToProps, null, { context: MyContext })(
  MyComponent
)
```

### 2.4 Returns

The return of `connect()` is a wrapper function that takes your component and returns a wrapper component with the additional props it injects.

```js
import { login, logout } from './actionCreators'

const mapState = (state) => state.user
const mapDispatch = { login, logout }

// first call: returns a hoc that you can use to wrap any component
const connectUser = connect(mapState, mapDispatch)

// second call: returns the wrapper component with mergedProps
// you may use the hoc to enable different components to get the same behavior
const ConnectedUserLogin = connectUser(Login)
const ConnectedUserProfile = connectUser(Profile)
```

In most cases, the wrapper function will be called right away, without being saved in a temporary variable:

```js
import { login, logout } from './actionCreators'

const mapState = (state) => state.user
const mapDispatch = { login, logout }

// call connect to generate the wrapper function, and immediately call
// the wrapper function to generate the final wrapper component.

export default connect(mapState, mapDispatch)(Login)
```

### 2.5 Example Usage

Because `connect` is so flexible, it may help to see some additional examples of how it can be called"

Inject just `dispatch` and don't listen to store

```js
export default connect()(TodoApp)
```

Inject all action creators `(addTodo, completeTodo, ......)` without subscribing to the store

```js
import * as actionCreators from './actionCreators'

export default connect(null, actionCreators)(TodoApp)
```

Inject `dispatch` and every field in the global state

> Don't do this! It will kill any performance optimizations because `TodoApp` will render after state change.

```js
// don't do this!
export default connect((state) => state)(TodoApp)
```

Inject `dispatch` and `todos`

```js
const mapStateToProps = state => ({ todos: state.todos })

export default connect(mapStateToProps, actionCreators)(TodoApp)
```




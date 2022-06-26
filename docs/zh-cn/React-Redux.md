# Redux

## 1. 什么是 Redux

**Redux 是使用一个叫做“action”的事件来管理和更新应用状态的模式和工具库**，它以集中式的 *Store* （centralized store）的方式对整个应用的使用的状态进行**集中**的管理，其规则保证状态只能以可以预测的方式更新。

### 1.1 为什么要使用 Redux

Redux 帮我们管理“全局”的状态-哪些应用程序的许多部分都需要的状态。

**Redux 提供的模式和工具使我们可以更容易（？）理解应用程序中的状态何时、何地、为什么、如何更新，以及当这些更改发生的时候应用程序的逻辑将会如何表现**。

### 1.2 什么时候应该使用 Redux

Redux 在以下情况下推荐使用：

- 在应用大量地方都存在大量的状态
- 应用状态会随着时间的推移而频繁更新
- 更新改状态的逻辑可能很复杂
- 中型和大型代码的应用，很多人协同开发

**并非所有应用程序都需要 Redux**。花一些时间思考正在构建应用程序的类型，并决定哪些工具能最高效的解决正在处理的问题。

### 1.3 Redux 术语和概念

#### 1.3.1 State 管理

让我们从一个小的 React 计数器组件开始。 它跟踪组件状态中的数字，并在单击按钮时增加数字：

```js
function Counter() {
  // State: a counter value
  const [counter, setCounter] = useState(0)

  // Action: 当事件发生后，触发状态更新的代码
  const increment = () => {
    setCounter(prevCounter => prevCounter + 1)
  }

  // View: UI 定义
  return (
    <div>
      Value: {counter} <button onClick={increment}>Increment</button>
    </div>
  )
}
```

这个计数器组件包含了：

- State：驱动应用的真实数据源头
- view：基于当前状态 `UI` 声明性的描述
- actions：根据用户输入在应用程序中发生的事件，并触发更新。

**单向数据流（one-way data flow）"**:

- 用 state 来描述应用程序在特定时间点的状态
- 基于 state 来渲染出 view
- 当发生某些事件时（例如用户点击按钮），state 会根据发生的事情进行更新，生成新的 state
- 基于新的 state 重新渲染 view

![one-way-data-flow-04fe46332c1ccb3497ecb04b94e55b97](http://cn.redux.js.org/assets/images/one-way-data-flow-04fe46332c1ccb3497ecb04b94e55b97.png)

当我们有**多个组件需要共享和使用相同的 `state` 时**，事情会变得很复杂，尤其是当这些组件位于不同的父组件时。

解决这个问题的一中方法是从组件中提取共享 state ，并将其放入组件树之外的一个集中位置。这样，我们的组件树就变成了一个大的 view，任何组件组件都可以访问 state 或触发 action，无论他们在树中的哪个位置！

通过定义和分离 state 管理中涉及的概念并强制维护 view 和 state 之间独立性的规则，使得代码变得更加结构化和易于维护。

这就是 Redux 背后的基本思想：应用中使用集中式的全局 state 来管理，并明确其更新状态的模式，以便让代码具有可预测行。

#### 1.3.2 不可变性 Immutability

"Mutable" 意为 "可改变的"，而 "immutable" 意为永不可改变。

JavaScript 对象（`Object`）和数组（`Array`）默认都是 mutable 的。

```js
const obj = { a: 1, b: 2 }
// 对外仍然还是那个对象，但它的内容已经变了
obj.b = 3

const arr = ['a', 'b']
// 同样的，数组的内容改变了
arr.push('c')
arr[1] = 'd'
```

内存中还是原来的对象或数组的引用，但是里面的内容变化了。

**如果想要不可变的方式来更新，代码就必须先复制原来的 `Object`/`Array` ，然后更新它的复制体**。

JavaScript 里的展开运算符就可以实现这个操作：

```js
const obj = {
  a: {
    // 为了安全的更新 obj.a.c，需要先复制一份
    c: 3
  },
  b: 2
}

const obj2 = {
  // obj 的备份
  ...obj,
  // 覆盖 a
  a: {
    // obj.a 的备份
    ...obj.a,
    // 覆盖 c
    c: 42
  }
}

const arr = ['a', 'b']
// 创建 arr 的备份，并把 c 拼接到最后。
const arr2 = arr.concat('c')

// 或者，可以对原来的数组创建复制体
const arr3 = arr.slice()
// 修改复制体
arr3.push('c')
```

**Redux 期望所有状态更新都是使用不可变的方式**。

#### 1.3.3 术语

*Action*

action 是应该具有 `type` 字段的普通 JavaScript 对象，**可以将 action 视为描述应用程序中发生了什么事件**。

`type` 字段是一个字符串，给这个 `action` 一个描述性的名字，比如：“todos/todoAdded“。通常把那个类型的字符串写成：”域/事件名称“，其中第一部分是这个 `action` 所属的特征或类别，第二部分是发生的具体时间。

`action` 对象可以有其他的字段，其中包含有关发生的事情的附加信息。按照惯例我们将该信息放入 `payload` 字段中。例如：

```js
const addTodoAction = {
  type: 'todos/todoAdded',
  payload: 'Buy milk'
}
```

*Action Creator*

`action creator` 是一个创建并返回一个 `action` 对象的函数。它的作用是让你不必每次都手动编写 action 对象：

```js
const addTodo = text => {
  return {
    type: 'todos/todoAdded',
    payload: text
  }
}
```

*Reducer*

reducer 是一个函数，接收当前的 `state` 和 `action` 对象，必要时决定如何更新状态，并返回新状态。函数的签名是：`(state, action) => newState`。**可以将 reducer 视为一个事件监听器，它根据接收到的 action 类型处理事件**。

*reducer* 必须符合以下规则：

- 仅使用 state 和 action 参数计算新的 state
- 禁止直接修改 `state`。必须必须通过复制现有的 `state` 并对复制的值进行更改的方式来做 *不可变更新（immutable updates）*。
- 禁止任何异步逻辑、依赖随机值或带有其他“副作用”的代码。

reducer 函数内部的逻辑通常遵循以下步骤：

- 检查 reducer 是否关心这个 action
  - 如果是，则复制 state，并使用新值更新 state 副本，然后返回新的 state
- 否则，返回原来的 state

```js
const initialState = { value: 0 }

function counterReducer(state = initialState, action) {
  // 检查 reducer 是否关心这个 action
  if (action.type === 'counter/increment') {
    // 如果是，复制 `state`
    return {
      ...state,
      // 使用新值更新 state 副本
      value: state.value + 1
    }
  }
  // 返回原来的 state 不变
  return state
}
```

*Store*

当前 Redux 应用的状态存在于一个名为 **store** 的对象中。

store 是通过传入一个 reducer 来创建的，并且有一个名为 `getState` 的方法，它返回当前的 state：

```js
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({ reducer: counterReducer })

console.log(store.getState())
// {value: 0}
```

*Dispatch*

Redux store 有一个方法叫做 dispatch。**更新 state 的唯一方法是调用 `store.dispatch()` 并传入一个 action 对象**。store 将执行所有 reducer 函数并计算出更新后的 state，调用 `getState()` 可以获取最新的 state。

```js
store.dispatch({ type: 'counter/increment' })

console.log(store.getState())
// {value: 1}
```

**dispatch 一个 action 可以理解为“触发一个事件”**。发生一些事件，我们希望 store 知道这件事。Reducer 就像事件监听器应用，当它们收到关注的 action 之后，它就会更新 state 来作为响应。

通过调用 action creator 来调用 action：

```js
const increment = () => {
  return {
    type: 'counter/increment'
  }
}

store.dispatch(increment())

console.log(store.getState())
// {value: 2}
```

*Selector*

Selector 函数可以从 store 状态树中提取指定的片段。随着应用变得越来越大，会遇到应用程序的不同部分需要读取相同的数据，selector 可以避免重复这样的读取逻辑：

```js
const selectCounterValue = state => state.value

const currentValue = selectCounterValue(store.getState())
console.log(currentValue)
// 2
```

#### 1.3.4 Redux 数据流

“单向数据流”，它描述了更新应用程序的以下步骤序列：

- State 描述了应用程序在特定时间点的状态
- 基于 state 来渲染 UI
- 当发生某些事件的时候，state 会根据当前的更新
- 基于新的 state 重新渲染 UI

对于 Redux，可以将这些步骤分解为更详细的内容：

- 初始启动：
  - 使用顶层 root reducer 函数创建 Redux store。
  - store 调用一次 root reducer，并将返回值作为它的初始 state
  - 当 UI 首次渲染的时候，UI 组件访问 Redux store 当前的 state，并使用该数据来决定需要渲染的内容。同时监听 store 的更新，以便它们知道 state 是否已经更改。
- 更新环节：
  - 应用程序发生某些事件
  - dispatch 一个 action 到 Redux store ，例如 `dispatch({ type: 'conter/increment' })`
  - store 用之前返回的 state 和当前的 action 再次运行 reducer 函数，并将返回值保存为新的 state。
  - store 通知所有订阅过的 UI，通知他们 store 发生更新
  - 每个订阅过 store 数据的 UI 组件都会检查它们需要的 state 部分是否被更新。
  - 发现数据被更新的每个组件都强制使用新数据重新渲染，紧接着更新网页

![ReduxDataFlowDiagram-49fa8c3968371d9ef6f2a1486bd40a26](http://cn.redux.js.org/assets/images/ReduxDataFlowDiagram-49fa8c3968371d9ef6f2a1486bd40a26.gif)

## 2. React-Redux

### 2.1 概述

要在 React 中用到 Redux 里的 state 需要借助于 `connected()` 方法，让 React 组件能够获取到 Redux 里的 store：

```js
function connect(mapStateToProps?, mapDispatchToProps?, mergeProps?, options?)
```

`mapStateToProps` 是将 store 里的 state 通过 props 的方法传递给组件；`mapDispatchToProps` 将 `dispatch()` 方法通过 props 传递给组件的。它们的返回值在 `connect()` 内部被定义为 `stateProps` 和 `disparchProps`。如果前 `mapStateToProps` 和 `mapDispatchToProps` 有定义，它们的返回值将会作为 `mergeProps` 的第一二个参数；`mergeProps` 就是这些 props 组合的结果，然后将它提供给需要的组件。

### 2.2 `connect()` 的参数

`connect()` 接收四个不同的参数，全部都是可选的；为了方便起见称之为

1.  `mapStateProps?: Function`
2.  `mapDispatchToProps?: Function | Object`
3.  `mergeProps?: Function`
4.  `options?: Object`

#### 2.2.1 `mapStateToProps`

```js
mapStateToProps = (state, ownProps) => Object
```

如果定义了 `mapStateToProps`，React 组件将会订阅 store 的更新。这意味着，**任何时候** store 更新，`mapStateToProps` 都会被调用。

##### 参数

1. `state: Object`
2. `ownProps?: Object`

一个 `mapStateToProps` 函数最多有两个参数，参数的数量会影响它何时被调用，也决定了是否接受 `ownProps`。

如果 `mapStateToProps` 携带了两个参数，每当 store 里的 state 发生变化时和组件自己收到的 props（`ownProps`） 收到变化的时候（基于 shallow equality comparisons ）就会被调用。`state` 作为第一个参数传递给 `mapStateToProps`，父组件通过参数传递的参数就称为 `ownProps`。

```js
const mapStateToProps = (state, ownProps) => ({
  todo: state.todos[ownProps.id],
})
```

##### 返回值

`mapStateToProps` 的返回值时一个对象，通常称为 `stateProps` ，它将作为参数传递给 React 组件；如果定义了 `mergeProps` ，它将会为作为 `mergeProps` 的参数。

`mapStateToProps` 的返回值决定了组件是否需要重新渲染。

#### 2.2.2 `mapDispatchToProps`

第二个传递给 `connect()` 的参数通常称为 `mapDispatchToProps`，它可以是一个对象也可以是一个函数，是 `null` 或者 `undefined`。

如果没有向 `connect()` 传递 `mapDispatchToProps` ，我们的组件还是会默认的收到一个 `dispatch` 。

```js
// 不传递 `mapDispatchToProps` 的情况
connect()(MyComponent)
connect(mapStateToProps)(MyComponent)
connect(mapStateToProps, null, mergeProps, options)(MyComponent)
```

如果 `mapDispatchToProps` 作为一个函数，它至多有两个参数。

##### 参数

1. `dispatch: Function`
2. `ownProps?: Object`

如果 `mapDispatchToProps` 只有一个参数，它将会给 store 一个 `dispatch`。

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

如果 `mapDispatchProps` 定义为有两个参数，将会把 `dispatch` 作为第一个参数，传递给 React 组件，并且在组件接收到新 props 是重新调用。

第二个参数一般称为 `ownProps`：

```js
// binds on component re-rendering
<button onClick={() => this.props.toggleTodo(this.props.todoId)} />

// binds on `props` change
const mapDispatchToProps = (dispatch, ownProps) => ({
  toggleTodo: () => dispatch(toggleTodo(ownProps.todoId)),
})
```

##### 返回值

`mapDispatchToProps` 的返回值是一个对象，该对象的每个成员都是一个函数，调用它们可以修改 store 里的 state 值。一般来说，`mapDispatchToProps` 的返回值称为 `dispatchProps`，它会作为 props 传递给 React 组件，如果还定义了 `mergeProps` 它将会作为其的第二个参数。

#### 2.2.3 `mergeProps`

如果在 `connect()` 中没有定义 `mergeProps`，React 组件将会默认接收到 `{ ...ownProps, ...stateProps, ...dispatchProps }`。

##### 参数

`mergeProps` 最多有三个参数，分别是：

1. `stateProps`
2. `dispatchProps`
3. `ownProps`

##### 返回值

`mergeProps` 就是将先前获得的 props 统一的合成为一个 `mergedProps`，按照惯例 `mergeProps` 的返回值称为 `mergedProps`，将会传递给定义好的 React 组件。

## 1. React 没有解决的问题

React 本身只是一个 `DOM` 的抽象层，使用组件构建 `Virtual DOM`。

如果需要开发大应用，还需要解决

- 组件件通信——组件之间如何交换数据
- 数据流——数据如何和 View 串联起来，路由和数据如何绑定？如何编写异步逻辑.....

### 1.1 通信问题

React 组件有以下几个通信对象

1. 子组件
2. 父组件
3. 其他组件

React 中向子组件传递信息可以直接通过 `this.props` 传递，例如：

```js
class Son extends React.Component {
  render() {
    return <input onChange={this.props.onChange}/>;
  }
}

class Father extends React.Component {
  constructor() {
    super();
    this.state = {
      son: ""
    }
  }
  changeHandler(e) {
    this.setState({
      son: e.target.value
    });
  }
  render() {
    return <div>
      <Son onChange={this.changeHandler.bind(this)}/>
      <p>这里显示 Son 组件的内容：{this.state.son}</p>
    </div>;
  }
}

ReactDOM.render(<Father/>, mountNode);
```

### 1.2 数据流问题

主流的数据流解决方案有：

- Flux：单向数据流，以 [Redux](http://cn.redux.js.org/) 为代表
- Reactive：响应式数据流，以 [Mobx](https://cn.mobx.js.org/) 为代表

## 2. dva 是什么

### 2.1 dva 应用的最简结构

```js
import dva from 'dva';
const App = () => <div>Hello dva</div>;

// 创建应用
const app = dva();
// 注册视图
app.router(() => <App />);
// 启动应用
app.start('#root');
```

### 2.2 数据流

![img](https://zos.alipayobjects.com/rmsportal/hUFIivoOFjVmwNXjjfPE.png)

### 2.3 核心概念

- State：一个对象，保存整个应用的状态
- View：React 组件构成的视图层
- Action：一个对象，描述事件
- connect：一个函数，绑定 State 到 View
- dispatch：一个函数，发送 Action 到 State

#### 2.3.1 State 和 View

State 是存储数据的地方，收到 Action 之后会更新数据。

View 就是 React 组件构成的 UI 层，从 State 获取到数据之后，渲染成 HTML 页面。只要 State 有变化，View 就会自动更新。

#### 2.3.2 Action

Action 是用来描述 UI 层的一个事件

```js
{
  type: 'click-submit-button',
  payload: this.form.data
}
```

#### 2.3.4 connect

绑定 State 到 View

```js
import { connect } from 'dva';

function mapStateToProps(state) {
  return { todos: state.todos };
}
connect(mapStateToProps)(App);
```

`connect()` 返回的也是一个 React 组件，通常称为容器组件。因为它是原始的 UI 组件的容器，即在外面包了一层 State。

`connect()` 方法传入的第一个参数是 `mapStateToProps` 函数，它会返回一个对象，用户建立 State 到 Props 的映射关系。

#### 2.3.5 dispatch

`dispatch()` 用来将 Action 发送给 State

```javascript
dispatch({
    type: 'click-submit-button',
    payload: this.form.data
})
```

`dispatch()` 不是从石头蹦出来的，而是被 `connect()` 的组件会自动在 props 中拥有 `dispatch()` 方法。

> `connect()` 的数据又是从哪来的？

#### 2.3.6 Model

```javascript
// 创建应用
const app = dva()

// 注册 Model
app.model({
  namespace: 'count',
  state: 0,
  reducers: {
    add(state) { return state + 1 }
  },
  effects: {
    *addAfter1Second(action, { call, put }) {
      yield call(delay, 1000)
      yield put({ type: 'add' })
    }
  }
})

// 注册 View
app.router(() => <ConnectedApp />);

// 启动
app.start('#root')
```

**数据流**

![img](https://zos.alipayobjects.com/rmsportal/cyzvnIrRhJGOiLliwhcZ.png)

![img](https://zos.alipayobjects.com/rmsportal/pHTYrKJxQHPyJGAYOzMu.png)

##### 2.3.6.1 Model 对象的属性

1. namespace：当前 Model 的名称。整个应用的 State，由多个小的 Model 的 State 以 namespace 为 key 合成。
2. state：该 Model 当前的状态。数据都保存在这里。
3. reducers：Action 处理器，处理同步动作，用来计算最新的 State。
4. effects：Action 处理器，处理异步动作。

#### 2.3.7 Reducer

Reducer 是 Action 处理器，用来处理同步操作，可以看作是 state 的计算器。它的作用是根据 Action，从上一个 State 算出当前的 State。

#### 2.3.8 Effect

Action 处理器，处理异步动作，基于 Redux-saga 实现，Effect 指的是副作用。根据函数式编程，计算意外的操作都属于 Effect。

#### 2.3.9 Generator

Effect 是一个 Generator 函数，内部使用 yield 关键字，标识每一步的操作（不管是异步还是同步）。

#### 2.3.10 call 和 put

dva 提供多个 effect 函数内部的处理函数，比较常用的有 `call()` 和 `put()`。

- call：执行异步函数
- put：发出一个 Action，类似于 `dispatch()`


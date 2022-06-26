## Mock Data

这个项目所有的数据都是由 [Mock.js ](http://mockjs.com/) 生成的，在 Umi 项目中，`/mock` 文件夹里的所有文件都被视为 Mock 数据文件

在 `/mock` 里的文件，最后都有一行 `module.exports = { }`

`/mock/dashboard.js`

```js
module.exports = {
  [`GET ${ApiPrefix}/dashboard`](req, res) {
    res.json(Dashboard)
  },
}
```

这段代码的意思是生成了一个 GET 方法，地址为 `localhost:port/APIPrefix/dashboard` 的后端接口，使用 Postman 等工具也可以测试的出来返回结果。

同样的也可以使用 *ESM* 来导出：

```js
export default {
  [`GET ${ApiPrefix}/dashboard`](req, res) {
    res.json(Dashboard)
  }
}
```

Mock 数据生成规则详情见 Mock.js 官网。

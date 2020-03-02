## 
[npm.js地址](https://www.npmjs.com/package/element-json-scheme-component)

发布
```bash
// 1.修改package.json版本号
"version": "1.0.xxx"

npm run build

npm publish
```


使用
```bash
npm i element-json-scheme-component -D
```

具体使用文档[文档&&示例](https://github.com/xiaofengz/element-json-scheme-component)

[在线demo](https://xiaofengz.github.io/element-json-scheme-component/#/compelete-demo)



更新日志
```
v1.0.8  2020.3.2

- 优化jsonTable, 支持v-loading
- 优化jsonForm, 增加类antd form的部分api，
    - validateFields() // 异步校验表单，直接返回values
    - setFieldValue()  // 提供手动设置表单项的value的方法
    - getFieldsValue()  // 获取表单values
    - 其他优化。 表单项json支持style属性，自定义样式
    
```


```
v1.0.7  2020.2.21

- 优化jsonTable, 优化分页参数的callback
- 优化jsonForm, formItem支持原生events事件

```


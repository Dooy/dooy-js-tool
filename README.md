# dooy-js-tool 小工具

## 安装
```
npm i dooy-js-tool

const dooy = require("dooy-js-tool");
```

## 浏览器引入

```html
<script src="dist/dooy-js-tool.min.js"></script>
```

## 方法使用
```js


console.log( dooy.dateFormat(new Date(),"yyyy-MM-dd hh:mm:ss"));
console.log( dooy.timeToDate( 1661656271,"yyyy-MM-dd hh:mm:ss"));
console.log( dooy.nowStr( 1664400496));
console.log( dooy.getQueryStr("abc")); // ?abc=123

```
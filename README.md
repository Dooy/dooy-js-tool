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

## 一般工具 方法使用
```js


console.log( dooy.tool.dateFormat("yyyy-MM-dd hh:mm:ss" ) );
console.log( dooy.tool.dateFormat("yyyy-MM-dd hh:mm:ss",new Date()) );
console.log( dooy.tool.dateFormat("yyyy-MM-dd hh:mm:ss",'2022-09-10') );
console.log( dooy.tool.dateFormat("yyyy-MM-dd hh:mm:ss",1664400496) );

console.log( dooy.tool.now( 1664400496));
console.log( dooy.tool.now( "2022-10-01 05:28:16"));
console.log( dooy.tool.now( new Date("2022-10-01 05:28:16")));

console.log( dooy.tool.getQueryStr("abc")); // ?abc=123 仅支持 浏览器模式

```

## 腾讯COS

 需要腾讯COS库支持 引入腾讯COS
```
<script src="https://cdn.jsdelivr.net/npm/cos-js-sdk-v5/dist/cos-js-sdk-v5.min.js"></script>
#或者
let COS = require('cos-js-sdk-v5');
```
调动

```html
<input type="file"   onchange="upload">
<script>
function upload(e){
        const file = e.target.files && e.target.files[0];

        dooy.cos.init({COS
            ,stsMyServer:'/pigai?c=mpad&a=cos&do=1'
            ,callback: res=>{
            console.log("返回>>",res);
            }
        }).upload(file
            ,{onProgress: info=>{
                    let percent = Math.floor(info.percent * 10000) / 100;
                    let speed = Math.floor(info.speed / 1024 / 1024 * 100) / 100;
                    console.log('进度：' + percent + '%; 速度：' + speed + 'Mb/s;');
                }
        });

    }
</script>
```
 
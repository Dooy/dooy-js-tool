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

## 工具 方法使用
[在线运行](https://codepen.io/dooy/pen/qBYywzm)
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
调用

```html
<input type="file"   onchange="upload">
<script>
    /**
     * init(opt) 
     * opt 参数
     * @param COS 腾讯云COS js
     * @param {function} callback
     * @param {String} stsMyServer 验证码服务器地址
     * @param cosCdn 存放cos CDN 远程域名
     * @param Bucket 存储桶
     * @param Region 腾讯云园区
     */
    let opt={
        COS
        ,stsMyServer:'/pigai?c=mpad&a=cos&do=1' //批改网验证服务器
        ,callback: res=>{
            console.log("返回>>",res);
        }
    }
function upload(e){
        const file = e.target.files && e.target.files[0];

        dooy.cos.init(opt).upload(file
            ,{onProgress: info=>{
                    let percent = Math.floor(info.percent * 10000) / 100;
                    let speed = Math.floor(info.speed / 1024 / 1024 * 100) / 100;
                    console.log('进度：' + percent + '%; 速度：' + speed + 'Mb/s;');
                }
        });

    }
</script>
```
## ES
需要  axios支持
```html
<script src="https://cdn.jsdelivr.net/npm/axios@0.27.2/dist/axios.min.js"></script>
```
使用
```js
 let es= dooy.es.init({axios});
 //新建一个buckets
 let ts = es.createBuckets(res.data.aggregations.ts.buckets);
 //获取bucket中 key 为 1的值
 let t2 = ts.getObjectByKey('1');

//获取bucket 中的日志 带 key doc_cnt 和file.value 
 let rz=ts.getValue();
```
## 批改ES
需要 lodash axios支持

```html
<script src="https://cdn.jsdelivr.net/npm/axios@0.27.2/dist/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>
```

调用

```js
getPigaiEs(){
    let opt={
        school:'',//学校 支持多学校[’北京大学‘,'南京大学']
        stime:'2010-01-01',//开始日期
        etime:'2022-10-01',//截止日期
        rank:'y',//排序方式 y 年，m 月，w 周，d 日
        where:{},//其他条件 比如地域 where.city=['北京市'，’北京‘]
    }
    let es= dooy.es.init({axios});
    let pigaiEs = new dooy.pigaiEs(es,_, opt);
    return pigaiEs;
}
//获取概况统计 分别获取
loadInit(){
    this.getPigaiEs().getMember().then(res=>{
        this.smain= _.extend(this.smain ,res[0].data);
        //console.log('main>>', this.smain);
    });
    this.getPigaiEs().getRequest().then(res=>{
        this.st.request = true;
        this.request= _.extend(this.request ,res[0].data);
        //console.log('request>>', res[0]);
    });
    this.getPigaiEs().getEssay({all:1}).then(res=>{
        this.st.essay = true;
        this.essay= _.extend(this.essay ,res[0].data);
        //console.log('essay>>', res[0]);
    });
}

//获取按年、月、周、日统计 多次请求等等回来 像 jquery.wehn,axios.all
this.getPigaiEs().rankRequest().rankEssay().rankMember().then( res=>{
    let request= res[0].data;
    let essay= res[1].data;
    let member= res[2].data;
});

```
## 批改网登录登出
初始化
```js
let pigaiLogin=  dooy.pigaiLogin.init({axios})
```
获取登录信息
```js
let u = pigaiLogin.getJsPigaiInfo();
#未登录为 null
#有登录为 返回
{
    "userName": "用户名",
    "userId": "123",
    "isLogin": true,
    "nickName": "显示名字",
    "lang": "cn",
    "isV": 1,
    "ts": 2,
    "school": "学校"
}
```

登录
```js
pigaiLogin.login(this.form.name,this.form.psw).then(res=>{
                    console.log('dddd',res);
                    if(res.error==0){
                        userInfo=res.data;
                    }
                });
```
登出
```js
pigaiLogin.login();
```
 
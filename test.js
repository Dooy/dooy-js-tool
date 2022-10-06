// import m from "./dooy-js-tool.js";
//const userApi = require("./index")
// const productApi = require("./product")
const dooy = require("./dooy-js-tool")


// console.log( dooy.tool.dateFormat("yyyy-MM-dd hh:mm:ss" ) );
// console.log( dooy.tool.dateFormat("yyyy-MM-dd hh:mm:ss",new Date()) );
// console.log( dooy.tool.dateFormat("yyyy-MM-dd hh:mm:ss",'2022-09-10') );
// console.log( dooy.tool.dateFormat("yyyy-MM-dd hh:mm:ss",1664400496) );

// console.log( dooy.tool.now( 1664400496));
console.log( dooy.tool.now( "2022-10-04 09:55:16"));
// console.log( dooy.tool.now( new Date("2022-10-01 05:28:16")));

// let v1={cnt:1,ent:2} ,v2={a:2,b:2,cnt:2}

// let v3= dooy.tool.extend(v1,v2,3);
// console.log(v1,v2,v3);

// console.log( dooy.tool.numStr(208000000) )


//是适合在浏览器下使用
//console.log( dooy.getQueryStr("abc")); // ?abc=123

let es =dooy.es.init({axios,esServer:'abc'});
es.createBuckets();




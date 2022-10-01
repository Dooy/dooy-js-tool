// import m from "./dooy-js-tool.js";
//const userApi = require("./index")
// const productApi = require("./product")
const dooy = require("./dooy-js-tool")


console.log( dooy.tool.dateFormat("yyyy-MM-dd hh:mm:ss" ) );
console.log( dooy.tool.dateFormat("yyyy-MM-dd hh:mm:ss",new Date()) );
console.log( dooy.tool.dateFormat("yyyy-MM-dd hh:mm:ss",'2022-09-10') );
console.log( dooy.tool.dateFormat("yyyy-MM-dd hh:mm:ss",1664400496) );

console.log( dooy.tool.now( 1664400496));
console.log( dooy.tool.now( "2022-10-01 05:28:16"));
console.log( dooy.tool.now( new Date("2022-10-01 05:28:16")));



//是适合在浏览器下使用
//console.log( dooy.getQueryStr("abc")); // ?abc=123


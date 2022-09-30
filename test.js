// import m from "./dooy-js-tool.js";
//const userApi = require("./index")
// const productApi = require("./product")
const dooy = require("./dooy-js-tool")


console.log( dooy.dateFormat(new Date(),"yyyy-MM-dd hh:mm:ss"));
console.log( dooy.timeToDate( 1661656271,"yyyy-MM-dd hh:mm:ss"));
console.log( dooy.nowStr( 1664400496));
//是适合在浏览器下使用
//console.log( dooy.getQueryStr("abc")); // ?abc=123


const tool = require("./src/tool")
const pigaiCos = require('./src/cos')

module.exports = {tool
    ,cos:{
        init({COS,callback,stsMyServer,cosCdn,Bucket,Region}){
            return new pigaiCos(arguments[0]);
        }
    }
};

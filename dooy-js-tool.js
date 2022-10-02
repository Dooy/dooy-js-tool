const tool = require("./src/tool")
const pigaiCos = require('./src/cos')
const es = require('./src/es')

module.exports = {tool,es
    ,cos:{
        init({COS,callback,stsMyServer,cosCdn,Bucket,Region}){
            return new pigaiCos(arguments[0]);
        }
    }
};

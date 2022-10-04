const tool = require("./src/tool")
const pigaiCos = require('./src/cos')
const es = require('./src/es')
const pigaiEs =require('./src/es-pigai')

module.exports = {tool,pigaiEs,
    es:{
        init({ axios, esServer }) {
            //console.log('ddddd', axios);
            return new es(arguments[0]);
        }
    }
    ,cos:{
        init({COS,callback,stsMyServer,cosCdn,Bucket,Region}){
            return new pigaiCos(arguments[0]);
        }
    }
};

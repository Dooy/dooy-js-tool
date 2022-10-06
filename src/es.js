const tool= require('./tool')
class es{
    /**
     * 
     * @param {axios} axios 
     * @param {String} esServer 
     */
    constructor({axios,esServer='/_sql'}) {
        this.axios=axios;
        this.esServer=esServer;
    }
    request(sql){
        let server=  this.axios({
            headers:{'Content-Type':'application/json;charset=utf-8'},
            url:this.esServer,
            //timeout:10000
            method: 'post',
            responseType: 'json',
            //async: true,
            data:sql,
        });
        //console.log('ddd',server.then);
        return server;
    }

    /**
     * 创建一个 Buckets
     * @param {Object} buckets
     * @returns {Buckets}
     */
    createBuckets(buckets){
        return new Buckets(arguments[0]);
    }

    /**
     * 创建一个并发
     * @param {Array} sqls
     * @param {function} callBack
     * @returns {axios}
     */

    when(sqls,callBack){
        let rq=[];
        for(let i in sqls){
            rq.push( this.request(sqls[i]));
        }
        let axios= this.axios;
        return axios.all(rq).then(axios.spread(callBack));
    }
}

class Buckets{
    constructor(buckets) {
        this.buckets=buckets;
    }
    getObjectByKey(key){
        for(let i in this.buckets){
            let obj= this.buckets[i];
            if(obj.key==key) return obj;
            if(typeof  obj.key_as_string!="undefined" && obj.key_as_string==key) return  obj;
        }
        return null;
    }
    init(opt){
        return new Buckets(opt);
    }
    getValue(){
        let rz=[];
        for(let i in this.buckets){
            let obj= this.buckets[i];
            let key= obj.key_as_string || obj.key;
            let o={key:key,doc_count:obj.doc_count};
            for(let j in obj){
                if(tool.isDefined( obj[j].value)){
                    o[j]= obj[j].value;
                }
            }
            rz.push(o);
        }
        return rz;
    }
}

module.exports=es
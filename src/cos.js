//首先要引入 <script src="https://cdn.jsdelivr.net/npm/cos-js-sdk-v5/dist/cos-js-sdk-v5.min.js"></script>

/**
 * 使用
 * pigaiCos.upload( file, res=>{
                console.log('返回',res);
            } );

 pigaiCos.upload( file, res=>{
                console.log('返回',res);
            }
 ,{
                onProgress:info=>{
                    var percent = Math.floor(info.percent * 10000) / 100;
                var speed = Math.floor(info.speed / 1024 / 1024 * 100) / 100;
                console.log('进度：' + percent + '%; 速度：' + speed + 'Mb/s;');
                }
        } );
 */

const tool= require('./tool');


class  pigaiCos  {
    /**
     *
     * @param COS 腾讯云COS js
     * @param {function} callback
     * @param {String} stsMyServer 验证码服务器地址
     * @param cosCdn 存放cos CDN 远程域名
     * @param Bucket 存储桶
     * @param Region 腾讯云园区
     */
    constructor({COS,callback,stsMyServer,cosCdn,Bucket,Region}) {
        this.COS=COS
        this.config={
            callback(){}
            ,stsMyServer:'/?c=mpad&a=cos&do=1'
            ,cosCdn:'//cos.pigai.org'
            ,Bucket:'pigaicos-1255341547'
            ,Region:'ap-nanjing'
        }
        this.initRdate();

        if(  arguments.length>0) tool.extend(this.config,arguments[0]);
    }
    initRdate(){
        this.rdata={
            error: 0,
            error_des: '',
            data: {}
        }
    }
    //upload(file, callFun)  {
    upload(file, {callFun,onProgress})  {
        this.initRdate();
        tool.isFunction(callFun) &&( this.config.callback=callFun);

        if( arguments.length>2){
            for(let p in arguments[2]){
                if(config[p]) config[p]= arguments[2][p];
            }
        }
        let cos = this.getCos( callFun );
        //const file = e.target.files && e.target.files[0];
        //console.log( e.target.files );
        let str=file.name; ;
        let ext= str.substring( str.lastIndexOf('.'));

        if( ! this.getExt(ext) ) return false;

        var fname = this.getFileName( ext) ;
        console.log( 'fname>>',fname );

        /* 直接调用cos sdk的方法 */


        cos.uploadFile({
            Bucket: this.config.Bucket, /* 填写自己的bucket，必须字段 */
            Region: this.config.Region,     /* 存储桶所在地域，必须字段 */
            Key: fname,              /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
            Body: file, // 上传文件对象
            SliceSize: 1024 * 1024 * 15,     /* 触发分块上传的阈值，超过5MB使用分块上传，小于5MB使用简单上传。可自行设置，非必须 */
            onProgress: info=>{ tool.isFunction(onProgress) && onProgress(info) },
        }, (err, data) => {
            console.log('上传' + (err ? '失败' : '完成'));
            console.log('uploadFile:', err || data);
            //callFun(err, data);
            if (err) {
                // this.rdata.error = 404;
                // this.rdata.error_des = '上传失败 ['+err+']';
                this.error(404,'上传失败 ['+err+']');
            } else {
                let rz={
                    f:fname,
                    fdes:file.name,
                    fhttp:this.config.cosCdn+'/'+fname,
                }
                this.success(rz);

            }
            //this.doCallBack();
        });
    }
    getCos(){
        //const COS = require('cos-js-sdk-v5')
        //let cos = new COS({
        let cos = new this.COS({
            // getAuthorization 必选参数
            getAuthorization: (options, callback) => {

                var url = this.config.stsMyServer; // url替换成您自己的后端服务
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.onload =  e=> {
                    try {
                        var data = JSON.parse(e.target.responseText);
                        data = data.Response;
                        var credentials = data.Credentials;
                    } catch (er) {
                        //console.log('error', e );
                    }
                    if (!data || !credentials) {
                        // this.rdata.error = 401;
                        // this.rdata.error_des = '凭证错误';
                        // this.doCallBack();
                        this.error(401, '凭证错误')

                        //callFun(this.rdata);
                        return console.error('credentials invalid:\n' + JSON.stringify(data, null, 2))
                    }
                    ;
                    callback({
                        TmpSecretId: credentials.TmpSecretId,
                        TmpSecretKey: credentials.TmpSecretKey,
                        SecurityToken: credentials.Token,
                        // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
                        //StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
                        ExpiredTime: data.ExpiredTime, // 时间戳，单位秒，如：1580000000
                    });
                };
                xhr.send();
            }
        });
        return cos;
    }

    getFileName(ext) {
        function getDay() {
            // let nowdate = new Date();
            // let year = nowdate.getFullYear(),
            //     month = nowdate.getMonth() + 1,
            //     date = nowdate.getDate();
            // if (month < 10) month = '0' + month;
            //
            // return "" + year + '/' + month+'/' + date;
            return tool.dateFormat("yyyy/MM/dd");
        }
        function generateMixed(n) {
            let chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

            var res = "";
            for (var i = 0; i < n; i++) {
                var id = Math.ceil(Math.random() * 35);
                res += chars[id];
            }
            return res;

        }

        let re = 'cup/' + getDay() + '/' + generateMixed(8)  + ext;
        return re;
    }
    getExt(ext){

        let str='doc,docx,ppt,ppt,xls,xxls,xlsx,vsd,pot,pps,rtf,wps,et,dps,pdf,rar,zip,tgz,tar,jpg,png,gif,jpe,jpeg';
        let arr= str.split(',');
        for(let i in arr ){
            var o = '.'+arr[i];
            if(o==ext.toLocaleLowerCase()){
                return true;
            }
        }
        this.error(402,ext+' 格式不支持');
        return false;
    }
    error(error,error_des){
        this.rdata.error = error;
        this.rdata.error_des =error_des;
        this.rdata.data={}
        this.doCallBack();
    }
    success(data){
        this.rdata.error = 0;
        this.rdata.error_des ='';
        this.rdata.data=data;
        this.doCallBack();
    }
    doCallBack(){
        this.config.callback(this.rdata);
    }
}

module.exports = pigaiCos;
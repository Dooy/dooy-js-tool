let J={};


J.readCookie=function(key){

    let cookieValue = "";
    let search = key + "=";
    if (document.cookie.length > 0) {
        let  offset = document.cookie.indexOf(search);
        if (offset != -1) {
            offset += search.length;
            let end = document.cookie.indexOf(";", offset);
            if (end == -1) {
                end = document.cookie.length;
            }
            cookieValue = document.cookie.substring(offset, end);
        }
    }
    return decodeURIComponent(cookieValue);
}

J.getInfo=function(){
    let u=J.readCookie('_JUKU_USER');
    try{

        if(u!=''){
            u= eval('('+u+')');

            J.config.userId=u.i;
            J.config.userName=u.u;
            J.config.isLogin=true;
            J.config.nickName=u.u2;
            J.config.nickName=J.config.nickName.replace(/\++/ig,' ');
            J.config.isV= u.iv;
            J.config.ts= u.ts;

            J.config.school = u.s;
            return  J.config;
        }
    }catch(e){
        //alert('J.setUserInfo');
    }
    return null;
}

J.config={ userName:'' ,userId:0,isLogin:false,nickName:'',lang:'cn',isV:0 }


J.setCookie=function(name,value) {
    let date=new Date();
    let now=date.getTime();
    date.setTime(now+60*60*1000*30*24);
    document.cookie=name+"="+encodeURIComponent (value)+"; path=/; expires="+date.toGMTString();
}


class PigaiLogin{
    /**
     *
     * @param {axios} axios
     */
    constructor({axios}) {
        this.axios=axios;
        //this.esServer=esServer;
        this.setRequest();
        this.j= this.getJ();
        this.cb= ()=>{};
    }
    getJsPigaiInfo(){
        return J.getInfo();
    }
    setRequest(){
        const service = this.axios.create({
            headers:{'Content-Type':'application/x-www-form-urlencoded'},
            baseURL:'',
            timeout:10000
        })
        service.defaults.withCredentials = true;
        service.interceptors.request.use(
            config=>{
                config.headers['Content-Type'] = config.headers['Content-Type']? config.headers['Content-Type']: 'application/x-www-form-urlencoded';
                if(config.method == 'post' && config.headers['Content-Type'] == 'application/x-www-form-urlencoded'){
                    // config.data = QS.stringify({
                    //     ...config.data //将参数变为 a=xx&b=xx&c=cc这样的参数列表
                    // });
                    //console.log('dddd',JS);
                    let d='';
                    for(let p in config.data){
                        d+= encodeURIComponent(p)+'='+encodeURIComponent( config.data[p])+'&';
                    }
                    config.data=d;
                }
                config.url='/pigai'+config.url+"&_display=json";
                //console.log('url>> ',config);
                return config;
            },error => {
                return Promise.reject(error);
            }
        );
        service.interceptors.response.use(res=>{
                return res.data;
            }
            ,error=>{
                let opt={
                    error:105,error_des:'服务器连接错误', data:error
                }
                this.cb(opt);
            });
        console.log('dssdsd')
        this.request = service;
        return this;
    }
    login( name,psw){

        this.request({
            url:'/?c=ajax&a=m_login',
            data:{uname:name,psw:psw},
            method:'post'
        }).then(res=>{
            if(typeof this.cb=='function'){

                let opt={
                    error:0,error_des:'', data:[]
                }
                if(res==1){
                    opt.error=0;
                    opt.error_des='success';
                    opt.data=J.getInfo();
                }else {
                    opt.error=101;
                    opt.error_des='账号或者密码错误';
                    //opt.data=J.getInfo();
                }
                this.cb(opt);
            }
        }).catch(e=>{
            if( typeof this.cb=='function'){
                let opt={
                    error:400,error_des:'', data:[]
                }
                this.cb(opt);
            }
        });
        return this;
    }
    then( cb){
        this.cb=cb;
    }

    getJ(){
        return J;
    }
    logout(){
        location.href='https://www.pigai.org/?a=logout&api_reurl='+encodeURIComponent(location.href);
    }

}

module.exports=PigaiLogin;
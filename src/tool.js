const tool={

    /**
     *
     * @param {String} format  格式：yyyy-MM-dd hh:mm:ss
     * @param {Number | String | Date} time 可以空、时间戳、日期字符、时间类型
     * @returns {String}
     */
    dateFormat(format,time){
        let date = new Date();
        if(arguments.length<=1) {
            // }else if(typeof time=='number'&& time>0){
            //     date= new Date(time*1000);
            // }else if(typeof time=='string'){
            //     if(Date.parse(time)) date =  new Date(time);
            // }else if(time.constructor==Date){
            //     date=time;
            // }
        }else{
            date=this.parseDate(time);
        }
        return  this.dateFormatDone(format,date);
    },
    /**
     *
     * @param {Number | String | Date} time 可以时间戳、日期字符、时间类型
     * @returns {Date}
     */
    parseDate(time){

        try {
            if (typeof time == 'number' && time > 0) {
                 return  new Date(time * 1000);
            } else if (typeof time == 'string') {
                if (Date.parse(time)) return  new Date(time);
            } else if (time.constructor == Date) {
                 return  time;

            }
        }catch (e) {

        }
        throw "必须是时间戳、日期字符、时间类型三者其一";

        return new Date();
    },
    /**
     *
     * @param {String} format "yyyy-MM-dd hh:mm:ss"
     * @param {Date} date
     * @param {Number} timesTamp
     * @param {String} timeStr
     * @returns {String}
     */
    dateFormatDone(format,date){
        Date.prototype.format = function(format) {
            var o = {
                "M+" :this.getMonth() + 1, // month
                "d+" :this.getDate(), // day
                "h+" :this.getHours(), // hour
                "m+" :this.getMinutes(), // minute
                "s+" :this.getSeconds(), // second
                "q+" :Math.floor((this.getMonth() + 3) / 3), // quarter
                "S" :this.getMilliseconds()
                // millisecond
            }
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (this.getFullYear() + "")
                    .substr(4 - RegExp.$1.length));
            }
            for ( var k in o) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                        : ("00" + o[k]).substr(("" + o[k]).length));
                }
            }
            return format;
        }

        return date.format(format);
    },

    /**
     *
     * @param {Number} timesTamp
     * @param {String} format "yyyy-MM-dd hh:mm:ss"
     * @returns {String}
     */
    timeToDate(timesTamp,format){
        let d= new Date(timesTamp*1000);
        return this.dateFormatDone( format,d);
        //return this.dateFormat(format,{timesTamp:timesTamp});
    },
    /**
     *
     * @param {Number} timesTamp
     * @returns {string}
     */
    nowStr(timesTamp){
        let now= Math.round(new Date() / 1000);
        let dt= now-timesTamp;
        //let today= new Date( this.dateFormat(new Date(),"yyyy-MM-dd"));
        if(dt<120) return '刚刚';
        if(dt<60*30) return Math.round(dt/60)+'分钟前';
        if(dt<60*40) return '半小时前';
        if(this.timeToDate(now,"yyyy-MM-dd") ==this.timeToDate(timesTamp,"yyyy-MM-dd") ){
            if(dt<12*3600){
                return Math.round(dt/3600)+'小时前';
            }
            return this.timeToDate(timesTamp,'hh:mm');
        }
        if(dt<2*24*3600) return '1天前';
        if(dt<3*24*3600) return '2天前';
        if(dt<4*24*3600) return '3天前';
        return this.timeToDate(timesTamp,"yyyy-MM-dd");

    },
    /**
     *
     * @param {String | Number | Date }time 时间戳、日期字符、时间类型三者其一
     * @returns {String}
     */
    now(time){
        let tm=Math.round( this.parseDate(time)/1000);
        return this.nowStr(tm)
    },

    /**
     * 获取 获取 url上的值 类似php $_GET
     * @param {String} key
     * @returns {String}
     */
    getQueryStr(key) {
        var url = location.href,
            rs = new RegExp("(^|)" + key + "=([^\&]*)(\&|$)", "gi").exec(url),
            tmp;
        if (tmp = rs) {
            return tmp[2];
        }
        return "";
    },
    /**
     * 判断是否函数
     * @param func
     * @returns {boolean}
     */
    isFunction( func){
      return typeof func ==='function';
    },
    isDefined(obj){
      return !(typeof obj ==='undefined');
    },
    isObject(obj){
        return typeof obj==='object' ;
    },
    /**
     *
     * @param v
     * @param {Array} arr
     * @returns {boolean}
     */
    inArray(v,arr){
        for(let k in arr){
            if(arr[k]===v) return true;
        }
        return false;
    },
    // extend(targetObject,copyObject){
    //     return this.extend(targetObject,copyObject,{})
    // },
    /**
     * 函数赋值
     * @param {Object} targetObject
     * @param {Object} copyObject
     * @param {Number} type 1 赋值，2 不赋值只增加 ， 3赋值并增加
     * @returns {Object}
     */
    extend(targetObject,copyObject){
        //let deep=false;
        //console.log('input>>',type,arguments);
        let type=1;
        if(arguments.length>2) type=arguments[2];

        const target=targetObject;
        if(!this.isObject(copyObject)) return target;

        for(let k in copyObject){
            let isDef=this.isDefined(target[k]);
            //console.log('isDef>>',k,isDef);
            if( isDef ){
                if( this.inArray(type,[1,3] )) target[k]=copyObject[k];
            }else {

                let isIn = this.inArray(type,[2,3] );
                //console.log(" new>>",k,isIn,type);
                if( isIn ) {
                    target[k]=copyObject[k];
                }
            }
        }
        //console.log('target',target,targetObject);
        return target;
    }
}

module.exports = tool;
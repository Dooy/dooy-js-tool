const tool={

    /**
     *
     * @param   {Date} date
     * @param   {String} format "yyyy-MM-dd hh:mm:ss"
     * @returns {String}
     */
    dateFormat(date,format){
        Date.prototype.format = function(format) {
            /*
             * eg:format="YYYY-MM-dd hh:mm:ss";

             */
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
     * @param {Number} timemap
     * @param {String} format "yyyy-MM-dd hh:mm:ss"
     * @returns {String}
     */
    timeToDate(timemap,format){
        let d= new Date(timemap*1000);
        return this.dateFormat(d,format);
    },
    /**
     *
     * @param {Number} timemap
     * @returns {string}
     */
    nowStr(timemap){
        let now= Math.round(new Date() / 1000);
        let dt= now-timemap;
        //let today= new Date( this.dateFormat(new Date(),"yyyy-MM-dd"));
        if(dt<120) return '刚刚';
        if(dt<60*30) return Math.round(dt/60)+'分钟前';
        if(dt<60*40) return '半小时前';
        if(this.timeToDate(now,"yyyy-MM-dd") ==this.timeToDate(timemap,"yyyy-MM-dd") ){
            if(dt<12*3600){
                return Math.round(dt/3600)+'小时前';
            }
            return this.timeToDate(timemap,'hh:mm');
        }
        if(dt<2*24*3600) return '1天前';
        if(dt<3*24*3600) return '2天前';
        if(dt<4*24*3600) return '3天前';
        return this.timeToDate(timemap,"yyyy-MM-dd");

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
    }
}

module.exports = tool;
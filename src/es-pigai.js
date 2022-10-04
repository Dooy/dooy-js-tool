

class esPigai{
    /**
     *
     * @param {es} es
     * @param {lodash} _
     * @param school
     * @param rank 统计方式 year month week day 只有这4种格式 其他默认都是按年
     * @param etime 节省时间
     * @param stime 开始时间
     * @param where 把 其他还需要带入公共where 里面的放着里面 比如 where.city='北京'
     */
    constructor(es,_,{school='',rank='year',etime='',stime='2010-01-01',where={}}){
        // this.school=school;
        //
        // this.rank=rank;
        // this.stime=stime;
        // this.etime=etime;
        // this.where=where;
        this.es= es;
        this._=_;
        this.cf={
            school:school,
            rank:rank,
            stime:stime,
            etime:etime,
            where:where
        }
        this._rq=[];
    }
    _rank(){
        let arg = arguments.length>0?arguments[0]:{};
        let rank= arg.rank|| this.cf.rank;
        if( ['d','D','day','DAY'].indexOf( rank)>-1 ) return "date_histogram(field='ctime','interval'='1d','alias'='ctime',format='yyyy-MM-dd')";
        if( ['w','W','week','WEEK'].indexOf( rank)>-1 ) return "date_histogram(field='ctime','interval'='1w','alias'='ctime',format='yyyy-MM-dd')";
        if( ['m','M','month','MONTH'].indexOf( rank)>-1 ) return "date_histogram(field='ctime','interval'='1M','alias'='ctime',format='yyyy-MM')";
        return "date_histogram(field='ctime','interval'='1y','alias'='ctime',format='yyyy年')";
    }
   
    getGWhere(){
        //const {}
        let wh=[];
        let arg= arguments.length>0?arguments[0]:{};

        let school= arg.school || this.cf.school;
        let stime= arg.stime || this.cf.stime;
        let etime= arg.etime || this.cf.etime;
        let where= arg.where || this.cf.where;

        //if(school.length>0) wh.push("school in ('"+school.join("','")+"')");
        if(school) wh.push( this._whereIn("school",school));
        wh.push("ctime>='"+stime+"'");
        if(etime) wh.push("ctime<'"+etime+"'");
        for(let f in where ){
            //wh.push(f+"='"+where[f]+"'");
            wh.push( this._whereIn(f,where[f]) );
        }
        return wh.join(" AND ");
    }
    _whereIn(file,arrString){
        return typeof arrString ==='string'? (file+"='"+arrString+"'"):(file+" in('"+arrString.join("','")+"')");
    }
    getMember(){
        let where= arguments.length>0? this.getGWhere(arguments[0] ): this.getGWhere();
        let sql="select ts,rz,count(*) as cnt from pigaimember where "+where+" group by  ts,rz ";
        this._initRq(sql,'getMember'); //JSON.parse()

        return this;
    }

    _parseMember(res) {
        let rz = {total: 0, teacher_rz: 0, teacher: 0, student: 0}
        rz.total = res.data.hits.total;
        let es = this.es;
        let ts = es.createBuckets(res.data.aggregations.ts.buckets);
        let t2 = ts.getObjectByKey('1');
        if (t2) {
            rz.teacher = t2.doc_count;
            let t2null = es.createBuckets(t2.rz.buckets).getObjectByKey("");
            //console.log('t2null',t2null);
            if (t2null) rz.teacher_rz = t2.doc_count - t2null.doc_count;

        }
        rz.student = rz.total - rz.teacher;
        return rz;
    }
    //_parseRequest(res){
    _parse(res){
        let es = this.es;
        //console.log('返回',res.data.aggregations);
        let rz={} ;//{ rq_cnt: 0, t_essay_cnt: 0, t_user_cnt: 0 }
        try{
            for(let i in res.data.aggregations){
                let o=res.data.aggregations[i];
                if( !this._.isUndefined(o.value)) rz[i]= o.value;
            }
        }catch (e) {
        }
        return  rz;
    }
    _parseRank(rq){
        let es = this.es;
        let rqValue= es.createBuckets(rq.data.aggregations.ctime.buckets).getValue();
        return rqValue;
    }
    _parseRankMember(rq){
        let es = this.es;
        let bk1= es.createBuckets(rq.data.aggregations.ctime.buckets);//.getValue();
        let rz=bk1.getValue();
        for(let i in bk1.buckets){
            rz[i].total= rz[i].doc_count;
            let bkT= es.createBuckets(bk1.buckets[i].ts.buckets ).getObjectByKey('1');
            rz[i].teacher_cnt= bkT? bkT.doc_count:0;
            rz[i].student_cnt=rz[i].total-rz[i].teacher_cnt;
        }
        console.log('bk1>>',rz);
        return rz;
    }
    getEssay(){
        let conf={all:0}
        if(arguments.length>0) this._.extend(conf,arguments[0]);
        let where= arguments.length>0? this.getGWhere(arguments[0] ): this.getGWhere();

        let file='';
        if(conf.all) file=' ,count(distinct user_id) as s_user_cnt,count(distinct request_id) as s_rq_cnt  ';
        let sql="select count(*) as essay_cnt,sum(version) as version "+file+" from pigaiessay where  "+ where ;
        this._initRq(sql,'getEssay');
        return this;
    }
    getRequest(){
        let where= arguments.length>0? this.getGWhere(arguments[0] ): this.getGWhere();
        let sql="select count(distinct user_id) as t_user_cnt,count(*) as rq_cnt,sum(essay_cnt) as t_essay_cnt from pigairequest where "+ where;
        this._initRq(sql,'getRequest');
        return this;
    }
    _initRq(sql,source){
        let es= this.es;
        this._rq.push({sql:sql,source:source});
    }
    then(callBack){
        let sql =this._.map(this._rq,'sql');
        let rq= {};
        this._.extend(rq,this._rq);
        //console.log(sql);
        this._rq=[];
        let _self= this;
        let te= this.es.when( sql,function (){
            //console.log('返回>>',arguments.length,rq,_self._rq);
            for(let i in arguments){
                rq[i].time=arguments[i].data.took;
                rq[i].time_out=arguments[i].data.time_out?1:0;

                if(rq[i].source=='getMember')  rq[i].data= _self._parseMember(arguments[i]);
                else if(['getRequest','getEssay'].indexOf(rq[i].source)>-1 )  rq[i].data= _self._parse(arguments[i]);
                else if(['rankRequest','rankEssay'].indexOf(rq[i].source)>-1 )  rq[i].data= _self._parseRank(arguments[i]);
                else if(['rankMember'].indexOf(rq[i].source)>-1 )  rq[i].data= _self._parseRankMember(arguments[i]);
                //else if(rq[i].source=='getEssay')  rq[i].data= _self._parse(arguments[i]);
                //else if(rq[i].source=='getEssay')  rq[i].data= _self._parse(arguments[i]);
                else{
                    rq[i].data=arguments[i].data;
                }

            }
            callBack(rq);
        });
        return te;
    }
    rankRequest(){
        let where= arguments.length>0? this.getGWhere(arguments[0] ): this.getGWhere();
        let sql="select ctime,count(distinct user_id) as t_user_cnt,count(*) as rq_cnt,sum(essay_cnt) as t_essay_cnt from pigairequest where "+ where ;
        sql+=" group by "+ this._rank(  arguments.length>0? arguments[0]:{});
        this._initRq(sql,'rankRequest');
        return this;
    }
    rankEssay(){
        let conf = {all: 0};
        if(arguments.length>0) this._.extend(conf,arguments[0]);
        let where= arguments.length>0? this.getGWhere(arguments[0] ): this.getGWhere();

        let file='';
        if(conf.all) file=' ,count(distinct user_id) as s_user_cnt,count(distinct request_id) as s_rq_cnt  ';
        let sql="select ctime, count(*) as essay_cnt,sum(version) as version "+file+" from pigaiessay where  "+ where ;
        sql+=" group by "+ this._rank(  arguments.length>0? arguments[0]:{});
        this._initRq(sql,'rankEssay');
        return this;
    }
    rankMember(){
        let where= arguments.length>0? this.getGWhere(arguments[0] ): this.getGWhere();
        let sql="select ctime, ts,count(*) as user_cnt from pigaimember where "+where+" group by  ";
        sql+=" "+ this._rank(  arguments.length>0? arguments[0]:{});
        sql+=",ts"
        this._initRq(sql,'rankMember'); //JSON.parse()

        return this;
    }
    concat(esValue,rqValue,type){
        let rqV=[];
        let f_null= {};
        let _= this._;
        if('request'==type) f_null={rq_cnt:0,t_user_cnt:0,t_essay_cnt:0};
        if('member'==type) f_null={teacher_cnt:0,total:0,student_cnt:0};
        if('essay'==type) f_null={essay_cnt:0,version:0,s_user_cnt:0,s_rq_cnt:0};
        for(let i in esValue){
            let o2={}
            _.extend(o2, esValue[i]);
            let ei=_.findIndex(rqValue,{ 'key':  esValue[i].key });
            _.extend(o2,ei>-1?rqValue[ei]:f_null);
            rqV.push(o2);
        }
        return rqV;
    }
}

module.exports=esPigai;


let datePick={

        shortcuts: [{
            text: '今年至今',
            onClick(picker) {
                const end = new Date();
                const start = new Date(new Date().getFullYear(), 0);
                picker.$emit('pick', [start, end]);
            }
        }, {
            text: '最近六个月',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setMonth(start.getMonth() - 6);
                picker.$emit('pick', [start, end]);
            }
        }, {
            text: '最近1年',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setFullYear(start.getFullYear() - 1);
                picker.$emit('pick', [start, end]);}
        }, {
            text: '2021年',
            onClick(picker) {
                picker.$emit('pick', ['2021-01-01', '2021-12-31']);
            }
        }, {
            text: '2020年',
            onClick(picker) {
                picker.$emit('pick', ['2020-01-01', '2020-12-31']);
            }
        }, {
            text: '2019年',
            onClick(picker) {
                picker.$emit('pick', ['2019-01-01', '2019-12-31']);
            }
        }, {
            text: '2018年',
            onClick(picker) {
                picker.$emit('pick', ['2018-01-01', '2018-12-31']);
            }
        }, {
            text: '2017年',
            onClick(picker) {
                picker.$emit('pick', ['2017-01-01', '2017-12-31']);
            }
        }]

}
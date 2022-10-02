var HTC={
    credits: {
        enabled: true,
        href: 'http://pigai.org',
        text: 'PIGAI.ORG'
    },
    chart: {
        zoomType: 'xy'
    },
    title: {
        text: ' 年使用概况'
    },
    subtitle: {
        text: '数据来源: pigai.org'
    },
    tooltip: {
        shared: true
    },
    legend: {
        layout: 'vertical',
        align: 'left',
        x: 80,
        verticalAlign: 'top',
        y: 55,
        floating: true,
        backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
    },
    xAxis: [{
        categories: [
            '一月', '二月', '三月', '四月', '五月', '六月','七月', '八月', '九月', '十月', '十一月', '十二月'
        ],
        crosshair: true
    }],
    yAxis: [{ // Primary yAxis
        labels: {
            format: '{value} 题',
            style: {
                color: Highcharts.getOptions().colors[2]
            }
        },
        title: {
            text: '教师出题',
            style: {
                color: Highcharts.getOptions().colors[2]
            }
        },
        opposite: true
    }, { // Secondary yAxis
        gridLineWidth: 0,
        title: {
            text: '学生提交',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        },
        labels: {
            format: '{value} 篇',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        }
    }, { // Tertiary yAxis
        gridLineWidth: 0,
        title: {
            text: '学生版本',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        },
        labels: {
            format: '{value} 次',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        },
        opposite: true
    }],

    series: [{
        name: '学生提交',
        type: 'column',
        yAxis: 1,
        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
        tooltip: {
            valueSuffix: ' 篇'
        }
    }, {
        name: '学生版本',
        type: 'column',
        yAxis: 2,
        data: [1016, 1016, 1015.9, 1015.5, 1012.3, 1009.5, 1009.6, 1010.2, 1013.1, 1016.9, 1018.2, 1016.7],
        // marker: {
        //     enabled: false
        // },
        // dashStyle: 'shortdot',
        tooltip: {
            valueSuffix: ' 次'
        }
    }, {
        name: '老师布置',
        type: 'spline',
        data: [1007.0, 1006.9, 1009.5, 1014.5, 1018.2, 1021.5, 1025.2, 1026.5, 1023.3, 1018.3, 1013.9, 1009.6],
        tooltip: {
            valueSuffix: ' 题'
        }
    }]
};
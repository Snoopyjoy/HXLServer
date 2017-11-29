/**
 * Created by Jay on 8/4/15.
 */

Chart.$updateCanvas = function(chartName) {
    var c1 = document.getElementById(chartName);
    var c12d = c1.getContext('2d');

    var w = $(c1).parent().width();
    if (w != c1.width) {
        c1.width = w;
        c12d.fillRect(0, 0, w, c1.height);
        c12d.fill();
        if (c1._chartData) {
            var type = c1._chartType ? c1._chartType : 'Line';
            new Chart(c12d)[type](c1._chartData, c1._chartOpt ? c1._chartOpt : {});
        }
    }
}

Chart.$renderLineChart = function(chartName, now, data, days, opt, field) {
    field = field ? field : ['num'];
    if (typeof field == 'string') field = field.split(',');
    var chartData = opt ? opt : {
        labels: [],
        datasets: [
            {
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "#0069F3",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "#000fff",
                segmentStrokeColor : "#000fff",
                data: [ ]
            }
        ]
    };

    var setArr = [];
    var setHash = {};

    for (var i = 0; i < days; i++) {
        var dt = new Date();
        dt.setTime(now - 24 * 60 * 60 * 1000 * (i + 1));
        dt = (dt.getMonth() + 1) + "月" + dt.getDate() + "日";
        var obj = { label:dt, value:[] };
        field.forEach(function() {
            obj.value.push(0);
        });
        setArr.splice(0, 0, obj);
        setHash[dt] = obj;
    }

    for (var i = 0; i < data.length; i++) {
        var dt = new Date();
        dt.setTime(data[i].date);
        dt = (dt.getMonth() + 1) + "月" + dt.getDate() + "日";
        if (setHash[dt]) {
            field.forEach(function(prop, index) {
                setHash[dt].value[index] = data[i][prop];
            });
        }
    }

    setArr.forEach(function(obj) {
        obj.value.forEach(function(val, index) {
            chartData.datasets[index].data.push(val);
        });
        chartData.labels.push(obj.label);
    });

    var c = document.getElementById(chartName);
    c._chartData = chartData;
    c._chartType = 'Line';
    Chart.$updateCanvas(chartName);
}

$(function() {
    var charts = $('canvas.chart');
    $(window).resize(function() {
        charts.each(function(i, chart) {
            Chart.$updateCanvas(chart.id);
        });
    });
});
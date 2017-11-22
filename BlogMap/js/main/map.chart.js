if (typeof DCI == "undefined") { var DCI = {}; }
DCI.chart = {        
    map: null,
    chartLayer: null,
    data: [
          { code: 1, male: 25, female: 12, name: "人口比例图", x: 121.639, y: 39.563 },
          { code: 2, male: 14, female: 45, name: "人口比例图", x: 121.891, y: 39.229 },
          { code: 3, male: 88, female: 55, name: "人口比例图", x: 122.211, y: 39.813 },
          { code: 4, male: 45, female: 23, name: "人口比例图", x: 122.614, y: 39.652 },
          { code: 5, male: 8, female: 66, name: "人口比例图", x: 123.144, y: 39.865 }
    ],
    //模块初始化函数
    Init:function(map){
        DCI.chart.map = map;
            //监听check点击事件
            $("[name = chartlayer]:checkbox").bind("click", function () {
                if ($(this).attr("checked")) {
                    if (DCI.chart.map.getLayer("chart")) {
                        DCI.cluster.map.getLayer("chart").show();
                    } else {
                        DCI.chart.chartLayer = new MapChart.MapChartGraphicLayer({
                            id: "chart",
                            chartDiv: "map",
                            displayOnPan: false
                        });
                        DCI.chart.map.addLayer(DCI.chart.chartLayer);
                        for (var i = 0, dl = DCI.chart.data.length; i < dl; i++) {
                            var series = [DCI.chart.data[i].male, DCI.chart.data[i].female];
                            var chartGraphic = new MapChart.MapChartGraphic({
                                map: DCI.chart.map,
                                id: DCI.chart.data[i].code,
                                attribute: DCI.chart.data[i],
                                type: "Pie",
                                series: series,
                                sr: new esri.SpatialReference(4326)
                            });
                            DCI.chart.chartLayer.add(chartGraphic);
                        }

                    }
                }
                else {
                    if (DCI.cluster.map.getLayer("chart"))
                        DCI.cluster.map.getLayer("chart").hide();
                }
            })
        },


}
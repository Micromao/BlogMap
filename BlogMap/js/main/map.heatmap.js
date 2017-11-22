if (typeof DCI == "undefined") { var DCI = {}; }
DCI.heatmap = {        
    map: null,
    heatmapFeatureLayer: null,
        //模块初始化函数
        Init:function(map){
            DCI.heatmap.map = map;
            //测试
            var serviceURL = "http://localhost:6080/arcgis/rest/services/dlsde/FeatureServer/0";
            var heatmapFeatureLayerOptions = {
                mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
                outFields: ["NAME", "KIND"]
                //infoTemplate: infoTemplate
            };
            var heatmapFeatureLayer = new esri.layers.FeatureLayer(serviceURL, heatmapFeatureLayerOptions);
            heatmapFeatureLayer.id = "heatmap";
            var heatmapRenderer = new esri.renderers.HeatmapRenderer({
                field: "KIND",
                colors: ["rgba(0, 0, 255, 0)", "rgb(0, 0, 255)", "rgb(255, 0, 255)", "rgb(255, 0, 0)"],
                blurRadius: 12,
                maxPixelIntensity: 250,
                minPixelIntensity: 10
            });
            //监听check点击事件
            $("[name = heatmapFeatureLayer]:checkbox").bind("click", function () {
                if ($("input[type='checkbox']").is(':checked')) {
                    if (DCI.heatmap.map.getLayer("heatmap")) {
                        DCI.heatmap.map.getLayer("heatmap").show();
                    } else {
                        heatmapFeatureLayer.setRenderer(heatmapRenderer);
                        DCI.heatmap.map.addLayer(heatmapFeatureLayer);
                    }
                }
                else {
                    if (DCI.heatmap.map.getLayer("heatmap"))
                        DCI.heatmap.map.getLayer("heatmap").hide();
                }
            })
            //自定义热力图监听check点击事件
            $("[name = heatmapJS]:checkbox").bind("click", function () { })
                /*if ($("input[type='checkbox']").is(':checked')) {
                    // create a heatmap instance
                    var heatmap = h337.create({
                        container: document.getElementById('map'),
                        maxOpacity: .5,
                        radius: 10,
                        blur: .75

                    });
                    var extremas = [(Math.random() * 1000) >> 0, (Math.random() * 1000) >> 0];
                    var max = Math.max.apply(Math, extremas);
                    var min = Math.min.apply(Math, extremas);
                    var t = [];
                    for (var i = 0; i < 1000; i++) {
                        var x = (Math.random()+122) >> 0;
                        var y = (Math.random()+39) >> 0;
                        var c = ((Math.random() * max - min) >> 0) + min;
                        // btw, we can set a radius on a point basis
                        var r = (Math.random() * 80) >> 0;
                        // add to dataset
                        t.push({ x: x, y: y, value: c, radius: r });
                    }
                    heatmap.setData({
                        min: 0,
                        max: 1000,
                        data: t
                    });


                }
                else {
                }
            })*/

        },


}
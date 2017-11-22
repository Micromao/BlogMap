if (typeof DCI == "undefined") { var DCI = {}; }
DCI.cluster = {        
    map: null,
    clusterLayer:null,
        //模块初始化函数
        Init:function(map){
            DCI.cluster.map = map;
            //监听check点击事件
            $("[name = clusterlayer]:checkbox").bind("click", function () {
                if ($(this).attr("checked")) {
                    if (DCI.cluster.map.getLayer("clusters")) {
                        DCI.cluster.map.getLayer("clusters").show();
                    } else {
                        //采用地图服务的餐饮图层来作为聚合效果的数据来源
                        var typeUrl = MapConfig.vecMapUrl + "/" + 0;//餐饮图层
                        var queryTask = "";
                        var query = new esri.tasks.Query();
                        query.returnGeometry = true;
                        query.outFields = ["NAME"];
                        query.where = "1=1";
                        queryTask = new esri.tasks.QueryTask(typeUrl);
                        queryTask.execute(query, DCI.cluster.resultInfo);
                    }
                }
                else {
                    if (DCI.cluster.map.getLayer("clusters"))
                        DCI.cluster.map.getLayer("clusters").hide();
                }
            })
        },
        /**
         * 餐饮图层查询
         */
        resultInfo: function (results) {
            var data = [];//聚合数据源定义
            if (results.features.length > 0) {
                for (var i = 0; i < results.features.length; i++) {//遍历查询的图层结果集合,构造聚合效果的数据源
                    var info = {};
                    var latlng = results.features[i].geometry;
                    var webMercator = esri.geometry.webMercatorUtils.geographicToWebMercator(latlng);//地理坐标系必须要转换摩卡托的投影坐标系,不然聚合没效果
                    info.x = webMercator.x;
                    info.y = webMercator.y;
                    info.attributes = results.features[i].attributes;//气泡窗口模型的属性
                    data.push(info);
                }
                // popupTemplate to work with attributes specific to this dataset
                var popupTemplate = new esri.dijit.PopupTemplate({//气泡窗口模型定义
                    "title": "",
                    "fieldInfos": [{
                        "fieldName": "NAME",//字段值
                        "label": "名称:",//字段显示别名
                        visible: true//设置是否可见
                    }]
                });
                // cluster layer that uses OpenLayers style clustering
                DCI.cluster.clusterLayer = new ExtensionClusterLayer.ClusterLayer({
                    "data": data,//绑定聚合数据源
                    "distance": 8000000,//设置聚合距离，根据地图分辨率来设置合适的值，默认是50
                    "id": "clusters",
                    "labelColor": "#fff",//图标字体颜色值，白色字体
                    "labelOffset": 10,//字体偏移位置
                    "resolution": DCI.cluster.map.extent.getWidth() / DCI.cluster.map.width,//计算当前地图的分辨率
                    "singleColor": "#888",
                    "singleTemplate": popupTemplate//绑定气泡窗口模型
                });
                //下面是设置聚合效果模型，根据聚合的点数来分三个等级，不同等级用不同的大小以及颜色图标来表示，0-2为蓝色；2-200为绿色；200-1001为红色
                var defaultSym = new esri.symbol.SimpleMarkerSymbol().setSize(4);
                var renderer = new esri.renderers.ClassBreaksRenderer(defaultSym, "clusterCount");
                var picBaseUrl = getRootPath() + "Content/images/clusterlayer/";
                var blue = new esri.symbol.PictureMarkerSymbol(picBaseUrl + "BluePin1LargeB.png", 32, 32).setOffset(0, 15);
                var green = new esri.symbol.PictureMarkerSymbol(picBaseUrl + "GreenPin1LargeB.png", 64, 64).setOffset(0, 15);
                var red = new esri.symbol.PictureMarkerSymbol(picBaseUrl + "RedPin1LargeB.png", 72, 72).setOffset(0, 15);
                renderer.addBreak(0, 2, blue);
                renderer.addBreak(2, 200, green);
                renderer.addBreak(200, 1001, red);
                //设置聚合图层的分级模板
                DCI.cluster.clusterLayer.setRenderer(renderer);
                //聚合图层叠加在地图展示
                DCI.cluster.map.addLayer(DCI.cluster.clusterLayer);
            }

        }




}
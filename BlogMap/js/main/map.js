﻿var allMap;//全局map变量
var baselayer;//地图底图
if (typeof DCI == "undefined") { var DCI = {}; }
dojo.addOnLoad(function () {
    DCI.sidebarCtrl.initLayout();//动态初始化界面的布局
    load2DMap();//初始化地图加载部分
});
(function () {
    dojo.require("esri.dijit.Legend");
    dojo.require("Extension.DrawEx");
    dojo.require("ExtensionDraw.DrawExt");
    dojo.require("esri.toolbars.draw");
    dojo.require("esri.geometry.Extent");
    dojo.require("esri.geometry.webMercatorUtils");
    dojo.require("esri.dijit.OverviewMap");
    dojo.require("esri.dijit.Scalebar");
    dojo.require("esri.tasks.FindTask");
    dojo.require("esri.tasks.FindParameters");
    dojo.require("esri.tasks.IdentifyTask");
    dojo.require("esri.tasks.IdentifyParameters");
    //实现聚合效果需要引用
    dojo.require("ExtensionClusterLayer.ClusterLayer");
    dojo.require("esri.dijit.PopupTemplate");
    dojo.require("esri.renderers.ClassBreaksRenderer");
    //实现热力图效果需要引用
    dojo.require("esri.layers.FeatureLayer");
    dojo.require("esri.renderers.HeatmapRenderer");
    //实现统计图效果需要引用
    dojo.require("MapChart.MapChartGraphic");
    dojo.require("MapChart.MapChartGraphicLayer");
    //最短路径分析需要引用
    dojo.require("esri.tasks.RouteTask");
    dojo.require("esri.tasks.RouteParameters");
    dojo.require("esri.tasks.locator");
    dojo.require("esri.tasks.ClosestFacilityTask");
    dojo.require("esri.tasks.ClosestFacilityParameters");
    dojo.require("esri.symbols.TextSymbol");
    dojo.require("esri.symbols.SimpleMarkerSymbol");
    dojo.require("esri.symbols.SimpleLineSymbol");
    dojo.require("esri.renderers.SimpleRenderer");
    dojo.require("esri.tasks.FeatureSet");
    dojo.require("esri.geometry.Circle");

})();
/**
 * 初始化地图加载
*/
function load2DMap() {
    var map = new esri.Map("map", { logo: false, lods: MapConfig.mapInitParams.lods, slider: false });//创建一个map对象，然后地图填充在div容器，通过div的ID（map）来关联;{}里面是构造地图的可选参数设置，logo设置图标是否显示，lods是设置瓦片地图的显示级别level有哪些，从配置文件config获取
    allMap = map;
    baselayer = new esri.layers.ArcGISTiledMapServiceLayer(MapConfig.imgMapUrl);//创建一个ArcGISTiledMapServiceLayer对象，解析arcgis的瓦片服务图层；MapConfig.imgMapUrl是layer对象的参数，请求发布地图服务的url，用来获取地图服务的数据来渲染
    baselayer.id = "img";//layer的id，用来方便后面获取getLayer（id)图层
    map.addLayer(baselayer);//layer添加到地图map对象
    //设置地图初始范围
    var initExtent = new esri.geometry.Extent({ xmin: MapConfig.mapInitParams.extent.xmin, ymin: MapConfig.mapInitParams.extent.ymin, xmax: MapConfig.mapInitParams.extent.xmax, ymax: MapConfig.mapInitParams.extent.ymax, spatialReference: MapConfig.mapInitParams.spatialReference });
    map.setExtent(initExtent);
    //加载鹰眼
    var overviewMapDijit = new esri.dijit.OverviewMap({
        map: map,
        attachTo: "bottom-right",
        color: " #D84E13",
        opacity: .40
    });
    overviewMapDijit.startup();
    //加载比例尺
    var scalebar = new esri.dijit.Scalebar({
        map: map,
        attachTo: "bottom-left",
        scalebarStyle: "ruler",//line
        scalebarUnit: "metric"
    });
    //滚动条样式
    //$("#legendDiv").mCustomScrollbar({
    //    theme: "minimal-dark",
    //});
    //加载底图图例
    var legend = new esri.dijit.Legend({//创建图例对象
        map: map,//map对象赋值
        autoUpdate: true,//设置根据地图的不同缩放比例自动刷新图例
        layerInfos: [{ layer: baselayer,title:"图例" }],//指定显示图例的图层以及设置图例标题
        arrangement: esri.dijit.Legend.ALIGN_LEFT//图例图层显示的位置靠左
    }, "map_Legend");
    legend.startup();//启动图例控件
    //加载地图显示坐标
    showCoordinates(map);
    //自定义地图导航控件
    showSlider(initExtent, MapConfig.sliderConfig, map);
    //地图加载函数
    map.on("load", function () {
    });
    //地图范围变化事件
    map.on("extent-change", function (evt) {
    });
    map.on("click", cleanUp);
    //清空聚合选中元素
    function cleanUp() {
        map.infoWindow.hide();
        if (DCI.cluster.clusterLayer)
            DCI.cluster.clusterLayer.clearSingles();
    }
    //地图切换
    $("#BasemapToggle img").bind("click", function () {
        var type = $(this).attr("id");
        if (map.getLayer("img"))
            map.removeLayer(map.getLayer("img"));
        if (map.getLayer("vec"))
            map.removeLayer(map.getLayer("vec"));
        //三角形标识切换
        switch (type) {
            case "imgmap"://加载ArcGIS切图服务
                baselayer = new esri.layers.ArcGISTiledMapServiceLayer(MapConfig.imgMapUrl);
                baselayer.id = "img";
                map.addLayer(baselayer);
                break;
            case "vecmap"://加载ArcGIS动态服务
                var layer = new esri.layers.ArcGISDynamicMapServiceLayer(MapConfig.vecMapUrl);
                layer.id = "vec";
                map.addLayer(layer);
                break;
            case "tdtmap"://加载天地图服务
                location.href = "tdt.html";//location.href实现客户端页面的跳转 
                break;
        }
    });
    //显示地图工具栏
    DCI.map2dTool.InitTool(map);
    //动态创建主界面左边菜单栏
    //地图图层
    var panel2 = DCI.sidebarCtrl.createItem("地图图层", "图层", true, "nav_but_layer", "layermodel");
    panel2.append(DCI.Catalog.Html);//加载显示的内容
    DCI.Catalog.Init(map);
    //图层属性查询
    var panel = DCI.sidebarCtrl.createItem("地图搜索", "搜索", false, "nav_but_poisearch", "poisearch");
    panel.append(DCI.Poi.InitHtml);//加载显示的内容
    DCI.Poi.Init(map);
    //空间查询
    var pane1 = DCI.sidebarCtrl.createItem("空间查询", "查询", false, "nav_but_spa", "spatialQuery");
    pane1.append(DCI.SpatialQuery.Html);//加载显示的内容
    DCI.SpatialQuery.Init(map);
    //加载聚合效果图
    DCI.cluster.Init(map);
    //加载热力图
    DCI.heatmap.Init(map);
    //加载统计图
    DCI.chart.Init(map);
    //最短路径分析
    var panel = DCI.sidebarCtrl.createItem("路线导航", "导航", false, "nav_but_ml", "road");
    panel.append(DCI.Route.html);//加载显示的内容
    DCI.Route.Init(map);
    //路径附近设施服务分析
    var panel = DCI.sidebarCtrl.createItem("路线设施", "设施", false, "nav_but_ml", "closestroad");
    panel.append(ems.route.html);//加载显示的内容
    ems.route.Init(map);


}
/**
 * 自定义地图导航控件
*/
function showSlider(fullExtent,config,map) {
    config.targetId = "map";
    var toolBar = new MapNavigationToolbar(config);
    var _map = map;
    /* 地图上移 */
    toolBar.onMoveUp = function () { _map.panUp(); };
    /* 地图下移 */
    toolBar.onMoveDown = function () { _map.panDown(); };
    /* 地图左移 */
    toolBar.onMoveLeft = function () { _map.panLeft(); };
    /* 地图右移 */
    toolBar.onMoveRight = function () { _map.panRight(); };
    /* 地图全图 */
    toolBar.onFullMap = function () { _map.setExtent(fullExtent); };
    /* 地图放大 */
    toolBar.onZoomIn = function () { _map.setLevel(toolBar.getValue()); };
    /* 地图缩小 */
    toolBar.onZoomOut = function () { _map.setLevel(toolBar.getValue()); };
    /* 滑动条滑动结束 */
    toolBar.onSliderEnd = function () { _map.setLevel(toolBar.getValue()); };
    /* 地图级别标记-街道 */
    toolBar.onMark_Street = function () { _map.setLevel(config.marksShow.streetLevel); };
    /* 地图级别标记-城市 */
    toolBar.onMark_City = function () { _map.setLevel(config.marksShow.cityLevel); };
    /* 地图级别标记-省级 */
    toolBar.onMark_Province = function () { _map.setLevel(config.marksShow.provinceLevel); };
    /* 地图级别标记-国家 */
    toolBar.onMark_Country = function () { _map.setLevel(config.marksShow.countryLevel); };
    toolBar.create();
    dojo.connect(_map, "onZoomEnd", zoomEnd);
    function zoomEnd(extent, zoomFactor, anchor, level) {
        toolBar.setValue(level);
    }
    return toolBar;
}
/**
 * 显示地图坐标
*/
function showCoordinates(map) {
    var coordinatesDiv = document.getElementById("map_coordinates");
    if (coordinatesDiv) {
        coordinatesDiv.style.display = "block";
    }
    else {
        var _divID_coordinates = "map_coordinates";
        coordinatesDiv = document.createElement("div");
        coordinatesDiv.id = _divID_coordinates;
        coordinatesDiv.className = "map-coordinates";
        coordinatesDiv.innerHTML = "";
        document.getElementById("map").appendChild(coordinatesDiv);
        dojo.connect(map, "onMouseMove", showCoords);
        dojo.connect(map, "onMouseDrag", showCoords);
        function showCoords(evt) {
            evt = evt ? evt : (window.event ? window.event : null);
            var mp = evt.mapPoint;
            coordinatesDiv.innerHTML = "<span id='cd_label' style='font-size:13px;text-align:center;font-family:微软雅黑;'>" + "横坐标：" + mp.x.toFixed(3) + "&nbsp;纵坐标：" + mp.y.toFixed(3) + "</span>";
        }
    }
}
/**
 * 动态初始化界面的布局
 * 控制左边的导航菜单
*/
DCI.sidebarCtrl = {
    NavBar: null,
    NavContent: null,

    initLayout: function () {
        NavBar = $('<div id="nav_bar" class="nav_bar"></div>');
        NavContent = $('<div id="nav_Content" class="nav_Content"></div>');
        $("#sidebar").append(NavBar);
        $("#sidebar").append(NavContent);
    },

    createItem: function (title, name, isHigh, cssName, id) {
        var navItem = $('<div></div>');
        navItem.attr("id", id);
        navItem.attr("title", title);
        var css = isHigh == true ? "nav_but nav_sel" : "nav_but";
        navItem.attr("class", css);
        var img = $('<div></div>');
        cssName = cssName ? cssName : "nav_but_ss";
        img.attr("class", cssName);
        navItem.append(img);
        var span = $('<span></span>');
        span.text(name);
        navItem.append(span);

        $("#nav_bar").append(navItem);
        var navItemContent = $('<div class="nav_Item_Content"></div>');
        $("#nav_Content").append(navItemContent);
        navItem.click(function () {
            $(".nav_Item_Content").css("display", "none");
            navItemContent.css("display", "block");
            $(".nav_but").attr("class", "nav_but");
            this.className = "nav_but nav_sel";
            var id = this.id;
            switch (id) {
                case "poisearch"://地图搜索
                    DCI.Poi.InitState();
                    break;
                case "spatialQuery"://空间查询
                    DCI.SpatialQuery.InitState();
                    break;
                case "layermodel"://地图图层
                    break;
                case "road"://最短路径分析
                    DCI.Route.InitState();
                    break;
            }
            //各个不同功能模块之间切换--清空Graphic
            $("#bClear").click();
        });
        return navItemContent;
    },
    clear: function () {
        $("#nav_bar").children().remove();
        $("#nav_Content").children().remove();
    }

}

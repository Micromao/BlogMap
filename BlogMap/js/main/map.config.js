/* --------------------------------地图初始信息配置-------------------------------- */
function MapConfig() { }
MapConfig.mapInitParams = {
    fullExtent: {//全图范围
        xmin: 121.29585473952106,
        ymin: 39.49550677343447,
        xmax: 123.05162192862765,
        ymax: 139.982938778863684
    },
    extent: {//初始化范围
        xmin: 120.8696333,
        ymin: 38.65953686,
        xmax: 123.6199347,
        ymax: 40.202622
    },
    spatialReference: {//地图空间参考坐标系
        wkid: 4326
    },
    lods: [//针对瓦片的地图服务的,用来控制瓦片级别的显示，有时候切片级别太多的话，可以只显示部分的级别地图
           //resolution scale这些值的获取参照发布的切片地图服务详情
           { "level": 0, "resolution": 0.00118973050291514, "scale": 500000 },
           { "level": 1, "resolution": 5.9486525145757E-4, "scale": 250000 },
           { "level": 2, "resolution": 2.3794610058302802E-4, "scale": 100000 },
           { "level": 3, "resolution": 5.710706413992673E-5, "scale": 24000 },
           { "level": 4, "resolution": 2.3794610058302804E-5, "scale": 10000 }
    ]
}
/*导航条配置参数*/
MapConfig.sliderConfig = {
    targetId: "mapDiv",
    minValue: 0,     
    maxValue: 4,    
    startValue: 0,  
    toolbarCss: ["toolBar", "toolBar_button", "toolBar_slider", "toolBar_mark"],
    marksShow: {
        countryLevel: null,
        provinceLevel: null,
        cityLevel: null,
        streetLevel: null
    }
};
/*地图调用*/
MapConfig.vecMapUrl = "http://localhost:6080/arcgis/rest/services/dlsearch/MapServer";//ArcGIS动态服务
MapConfig.imgMapUrl = "http://localhost:6080/arcgis/rest/services/dlMap/MapServer";//ArcGIS切图服务
MapConfig.locatorUrl = "http://localhost:6080/arcgis/rest/services/dlLocator/GeocodeServer";//地理编码服务
MapConfig.routetaskUrl = "http://localhost:6080/arcgis/rest/services/dlroad/NAServer/Route";//路网服务
MapConfig.routeUrl = "http://localhost:6080/arcgis/rest/services/dlClosestFacility/NAServer/Closest%20Facility";//Closest Facility服务
/*图层目录构造*/
MapConfig.zNodes = [
    { id: 1, pId: 0, name: "图层目录", checked: false, iconOpen: "" + getRootPath() + "Content/images/legend/1_open.png", iconClose: "" + getRootPath() + "Content/images/legend/1_close.png" },
    { id: 11, pId: 1, name: "餐饮", layerurl: MapConfig.vecMapUrl, layerid: "layer0", checked: false, icon: "" + getRootPath() + "Content/images/legend/0.png" },
    { id: 12, pId: 1, name: "购物", layerurl: MapConfig.vecMapUrl, layerid: "layer1", checked: false, icon: "" + getRootPath() + "Content/images/legend/1.png" },
    { id: 13, pId: 1, name: "金融服务", layerurl: MapConfig.vecMapUrl, layerid: "layer2", checked: false, icon: "" + getRootPath() + "Content/images/legend/2.png" },
    { id: 14, pId: 1, name: "科研教育", layerurl: MapConfig.vecMapUrl, layerid: "layer3", checked: false, icon: "" + getRootPath() + "Content/images/legend/3.png" },
    { id: 15, pId: 1, name: "医疗服务", layerurl: MapConfig.vecMapUrl, layerid: "layer4", checked: false, icon: "" + getRootPath() + "Content/images/legend/4.png" },
    { id: 16, pId: 1, name: "住宿", layerurl: MapConfig.vecMapUrl, layerid: "layer5", checked: false, icon: "" + getRootPath() + "Content/images/legend/5.png" }

];
MapConfig.printGPURL = "http://localhost:6080/arcgis/rest/services/ExportWebMap/GPServer/Export%20Web%20Map";//打印GP服务
MapConfig.printTemplateMXD = [//打印模版
                              {
                                  eName: "LOutput",//mxd名称
                                  cName: "横向"//显示中文名
                              },
                              {
                                  eName: "POutput",
                                  cName: "纵向"
                              }
];
MapConfig.printcopyRight = { Title: "大连市国土局", copyRight: "@大连市国土局" };




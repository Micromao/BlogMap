if (typeof BX == "undefined") { var BX = {}; }
BX.Print = {//打印模块
    pmapToolbar: null,
    printExt: null,
    printExtDrawHandler: null,
    dialog:null,
    map:null,
    graphicslayer:null,
    Init: function (map) {
        dojo.require("esri.tasks.PrintTemplate");
        dojo.require("esri.tasks.PrintTask");
        dojo.require("esri.tasks.PrintParameters");
        dojo.require("esri.tasks.LegendLayer");

        BX.Print.map = map;
        /*BX.Print.map = new esri.Map("map-print", {
            logo: false
        });*/
        /*BX.Print.graphicslayer = new esri.layers.GraphicsLayer();
        BX.Print.graphicslayer.id = "print_plot";
        BX.Print.map.addLayer(BX.Print.graphicslayer);  //将图层赋给地图*/
        /*var baseLyr = new esri.layers.ArcGISDynamicMapServiceLayer(MapConfig.vecMap.Url);
        baseLyr.id = "baseLyr";
        baseLyr.setImageFormat("png32");
        BX.Print.map.addLayer(baseLyr);
        BX.Print.map.setExtent(map.esriMap.extent);*/
                
        $("#inputTitle").val(MapConfig.printcopyRight.Title);
        $("#inputAuthor").val(MapConfig.printcopyRight.copyRight);

        printResult = function (e) {//打印成功
            $("#completeState").html("已完成");
            setTimeout(function () {
               
                 $("#completeState").css({ "display": "none" });
                $("#imgLoading32").css({ "display": "none" });
            }, 2000);
           
         
            BX.Print.map.graphics.clear();
            window.open(e.url, "_blank");
            window.location = getRootPath() + "/handler/SavePrintResultHandler.ashx?resultUrl=" + e.url;//请求后台，弹出下载
            //window.open(e.url, "_blank");
            //window.location = getRootPath() + "MapPrintStream?resultUrl=" + e.url;//请求后台，弹出下载
        };
          
        printError = function (e) {//打印失败callback
            alert("打印失败！");
            console.log(e.error);
        };

        $("#startPrint").bind("click", function (e) {
        	//BX.Print.reloadGraphics();
            //esriConfig.defaults.io.proxyUrl = getRootPath() + "pages/map/print/proxy.jsp";
            esriConfig.defaults.io.proxyUrl = getRootPath() + "proxy.ashx";
            esriConfig.defaults.io.alwaysUseProxy = true;
            var printMapObject = BX.Print.map;
            //var printMapObject =map.esriMap;
            if (BX.Print.printExt) {
                printMapObject.extent = BX.Print.printExt;
                printMapObject.graphics.clear();
                BX.Print.printExt = null;
            }

            $("#imgLoading32").css({ "display": "" });
            $("#completeState").html("正在生成...");
            $("#completeState").css({ "display": "block" });
            var printTask = new esri.tasks.PrintTask(MapConfig.printGPURL, { async: true });

            var tText = $("#inputTitle").val();
            var aText = $("#inputAuthor").val();

            var oLayout = $('#cbxLayout').val();
            var oFormat = $('#cbxFormat').val();
            //var legendLayer = new esri.tasks.LegendLayer();
            //legendLayer.layerId = "";
            var layouts = [{
                options: {
                    scalebarUnit: "Meters",
                    //legendLayers:[],//图例图层设置
                    titleText: tText,
                    authorText: aText
                }
            }];

            var template = new esri.tasks.PrintTemplate();
            template.format = oFormat;
            template.layout = oLayout;
            template.preserveScale = false;
            template.layoutOptions = layouts[0].options;

            var params = new esri.tasks.PrintParameters();
            params.map = printMapObject;
            params.template = template;
            printTask.execute(params, printResult, printError);
        });
    },
    reloadGraphics:function(){
    	//BX.Print.graphicslayer.clear();
        //加载标绘其他图层
        var lyrsArr = map.esriMap.getLayersVisibleAtScale();
        for (var i = 0; i < lyrsArr.length; i++) {
        	if(lyrsArr[i].graphics)
        	{
         	   var graphics = lyrsArr[i].graphics;
           	   for(var j= 0;j<graphics.length;j++){
           		BX.Print.graphicslayer.add(graphics[j]);       		
           	   }       		
        	}
        }    	
    },
    initHtml:function(){
        var htmlStr = "<div style='overflow-x:auto;'><div class='tool-widget-content' style='padding-right:10px; padding-top:2px;'>";
        htmlStr += "<div class='tool-widget-expression'>";
        htmlStr += "<div>挂图标题：<input type='text' id='inputTitle' style='width:308px;'/></div>";
        htmlStr += "<div>编制信息：<textArea type='text'disabled='disabled' id='inputAuthor' style='margin-top:3px; width:308px;'/></div>";
        htmlStr += "<div>打印模版：<select id='cbxLayout' class='combobox' style='margin-top:3px; margin-right:10px; width:124px;'>";
        for (var k = 0; k < MapConfig.printTemplateMXD.length; k++) {
            htmlStr += "<option value='" + MapConfig.printTemplateMXD[k].eName + "'>" + MapConfig.printTemplateMXD[k].cName + "</option>";                
        }
        //htmlStr += "<option value='POutput'>纵向</option>";
        //htmlStr += "<option value='LOutput'>横向</option>";
        htmlStr += "</select>";
        htmlStr += "输出格式：<select id='cbxFormat' class='combobox' style='margin-top:3px; width:104px;'>";
        htmlStr += "<option value='jpg'>JPEG</option>";
        htmlStr += "<option value='png8'>PNG</option>";
        htmlStr += "<option value='gif'>GIF</option>";
        htmlStr += "<option value='pdf'>PDF</option>";
        htmlStr += "</select></div>";
        htmlStr += "<div style='margin-top:3px;'>";
        htmlStr += "框选范围：<input type='button' class='btn'id='mapKuang' value='地图框选' onclick='BX.Print.createDrawTool(\"rectangle\");' style='width:308px;'/>";
        htmlStr += "</div>";
        htmlStr += "<div>";
        htmlStr += "<div class='tool-widget-btn' style='width:100%; margin-top:5px;'>";
        htmlStr += "<img id='imgLoading32'  src = '" + getRootPath() + "Content/images/index/loading32.gif' style='float:left; display:none;'/><span id='completeState' style='display:none; position:relative;top:18px;left:82px;width:101px;'>正在生成...</span><input class='btn btn-info' id='startPrint' type='button' value='打印' style='float:right;height:27px;line-height:7px;'/>";
        htmlStr += "</div></div><div>";
        return htmlStr;
    },   
    //绘制图形
    createDrawTool: function (type) {
        //if (BX.Print.dialog)
        //    BX.Print.dialog.close();

        if (this.pmapToolbar == null) {
            this.pmapToolbar = new esri.toolbars.Draw(BX.Print.map);
        }
        switch (type) {
            case "rectangle":
                try {//移除打印弹窗绘制的框选graphic
                    for (var i = 0; i < BX.Print.map.graphics.graphics.length; i++) {
                        if (BX.Print.printExt) {
                            if (BX.Print.map.graphics.graphics[i].geometry.type == "polygon") {
                                if (BX.Print.map.graphics.graphics[i].geometry.cache._extent.xmax == BX.Print.printExt.xmax &&
                                    BX.Print.map.graphics.graphics[i].geometry.cache._extent.xmin == BX.Print.printExt.xmin &&
                                    BX.Print.map.graphics.graphics[i].geometry.cache._extent.ymax == BX.Print.printExt.ymax &&
                                    BX.Print.map.graphics.graphics[i].geometry.cache._extent.ymin == BX.Print.printExt.ymin
                                    ) {
                                	BX.Print.map.graphics.remove(BX.Print.map.graphics.graphics[i]);
                                }
                            }
                        }
                    }
                }
                catch (ex) {

                }
                if (this.printExtDrawHandler == null) {
                    this.printExtDrawHandler = dojo.connect(this.pmapToolbar, "onDrawEnd", BX.Print.PrintExt);
                }
                this.pmapToolbar.activate(esri.toolbars.Draw.RECTANGLE);
                break;
            default:
                break;
        }
    },
    //框选打印范围
    PrintExt: function (geometry) {
        BX.Print.pmapToolbar.deactivate();
        var curExt = new esri.geometry.Extent(geometry.cache._extent.xmin, geometry.cache._extent.ymin, geometry.cache._extent.xmax, geometry.cache._extent.ymax, new esri.SpatialReference(geometry.spatialReference.wkid));
        BX.Print.printExt = curExt;
        var sfs = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new esri.Color([255, 0, 0]), 2), new esri.Color([255, 0, 0, 0.25]));
        var extG = new esri.Graphic(geometry, sfs);
        BX.Print.map.graphics.add(extG);       
        dojo.disconnect(BX.Print.printExtDrawHandler);
        BX.Print.printExtDrawHandler = null;
    }
}
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var count_point = 1;
var count_line = 1;
var count_polygon = 1;

MapControl = function (options) {
    var me = this;
    me.options = $.extend({
    }, options);

    me._init();

};

MapControl.prototype._init = function () {
    var me = this;
    me.div = $("#" + me.options.div);


    me.bdmapID = uuid();

    $("<div>").appendTo(me.div).attr({
        id: me.bdmapID
    });
    console.log(document.getElementById(me.bdmapID));


    me.bdmap = new BMap.Map("viewDiv", {enableMapClick: false});
    //初始化地图，设置坐标点在哪
    me.bdmap.centerAndZoom(new BMap.Point(113.000139, 28.160198), 10);

    //启用滚轮放大缩小
    me.bdmap.enableScrollWheelZoom(true);

    //向地图添加一个平移缩放控件、一个比例尺控件和一个缩略图控件
    me.bdmap.addControl(new BMap.NavigationControl());
    me.bdmap.addControl(new BMap.ScaleControl());
    me.bdmap.addControl(new BMap.OverviewMapControl());
    me.bdmap.addControl(new BMap.MapTypeControl());

    setTimeout(function () {
        me._hideCopyrights();
    }, 1000);

    me.localSearch = new BMap.LocalSearch(me.bdmap);
    me.localSearch.enableAutoViewport(); //允许自动调节窗体大小

    me.overlays = [];
    var overlaycomplete = function (e) {
        me.overlays.push(e.overlay);
    };
    me.styleOptions = {
        strokeColor: "red", //边线颜色。
        fillColor: "yellow", //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3, //边线的宽度，以像素为单位。
        strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
        fillOpacity: 0.6, //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
    };
    //实例化鼠标绘制工具
    var drawingManager = new BMapLib.DrawingManager(me.bdmap, {
        isOpen: false, //是否开启绘制模式
        enableDrawingTool: true, //是否显示工具栏
        drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
            offset: new BMap.Size(10, 40), //偏离值
            drawingModes: [BMAP_DRAWING_POLYLINE, BMAP_DRAWING_POLYGON], //设置只显示画矩形、圆的模式
        },
        circleOptions: me.styleOptions, //圆的样式
        polylineOptions: me.styleOptions, //线的样式
        polygonOptions: me.styleOptions, //多边形的样式
        rectangleOptions: me.styleOptions //矩形的样式
    });
    //添加鼠标绘制工具监听事件，用于获取绘制结果
    drawingManager.addEventListener('overlaycomplete', overlaycomplete);
    drawingManager.addEventListener('polylinecomplete', function (overlay) {
        me.polylinecomplete(overlay);
    });
    drawingManager.addEventListener('polygoncomplete', function (overlay) {
        me.polygoncomplete(overlay);
    });

};


MapControl.prototype._hideCopyrights = function () {
    var me = this;
    $(".anchorBL").remove();//执行删除
    // $(".amap-copyright").remove();
};

MapControl.prototype._measureDistance = function () {
    var me = this;


    me.myDis = new BMapLib.DistanceTool(me.bdmap);
    console.log("1");
    me.myDis.open();  //开启鼠标测距
    me.bdmap.addEventListener("load", function () {
        me.myDis.open();  //开启鼠标测距
        console.log("2");
        //myDis.close();  //关闭鼠标测距
    });
};
MapControl.prototype._addPoint = function () {
    var me = this;

    function addInfo(e) {
        me.point = new BMap.Point(e.point.lng, e.point.lat);
        me.point.id = count_point;

        me.point.name = $("#pointName").val();
        me.point.info = $("#pointInfo").val();
        me._addMarker(me.point);
        count_point++;
        me.bdmap.removeEventListener("click", addInfo);
    }
    me.bdmap.addEventListener("click", addInfo);
};

MapControl.prototype.polylinecomplete = function (overlay) {
    var me = this;
    me.line = overlay;
    me.line.id = count_line;
    me.line.name = $("#lineName").val();
    me.line.info = $("#lineInfo").val();

    me.line.addEventListener("click",
            function (e) {

                var myline = me.line;

                me.sContent =
                        '<ul style="margin:0 0 5px 0;padding:0.2em 0">'
                        + '<li style="line-height: 26px;font-size: 15px;">'
                        + '<span style="width: 50px;display: inline-block;">id：</span>' + myline.id + '</li>'
                        + '<li style="line-height: 26px;font-size: 15px;">'
                        + '<span style="width: 50px;display: inline-block;">名称：</span>' + myline.name + '</li>'
                        + '<span style="width: 50px;display: inline-block;">备注：</span>' + myline.info + '</li>'
                        + '</ul>';
                me.infoWindowLine = new BMap.InfoWindow(me.sContent); //创建信息窗口对象
                me.bdmap.openInfoWindow(me.infoWindowLine, e.point);
            });

    count_line++;
};

MapControl.prototype.polygoncomplete = function (overlay) {
    var me = this;
    me.polygon = overlay;
    me.polygon.id = count_polygon;
    me.polygon.name = $("#polygonName").val();
    me.polygon.info = $("#polygonInfo").val();

    me.polygon.addEventListener("click",
            function (e) {

                var mypolygon = me.polygon;

                me.sContent =
                        '<ul style="margin:0 0 5px 0;padding:0.2em 0">'
                        + '<li style="line-height: 26px;font-size: 15px;">'
                        + '<span style="width: 50px;display: inline-block;">id：</span>' + mypolygon.id + '</li>'
                        + '<li style="line-height: 26px;font-size: 15px;">'
                        + '<span style="width: 50px;display: inline-block;">名称：</span>' + mypolygon.name + '</li>'
                        + '<span style="width: 50px;display: inline-block;">备注：</span>' + mypolygon.info + '</li>'
                        + '</ul>';
                me.infoWindowLine = new BMap.InfoWindow(me.sContent); //创建信息窗口对象
                me.bdmap.openInfoWindow(me.infoWindowLine, e.point);
            });

    count_polygon++;
};





//创建标注点并添加到地图中
MapControl.prototype._addMarker = function (pt) {
    //循环建立标注点
    var me = this;
    if (count_point === 1) {
        var myIcon = new BMap.Icon("image/pic1.png", new BMap.Size(23, 25), {
            anchor: new BMap.Size(10, 30)//这句表示图片相对于所加的点的位置
        });
    } else if (count_point === 2) {
        var myIcon = new BMap.Icon("image/pic2.png", new BMap.Size(23, 25), {
            anchor: new BMap.Size(10, 30)//这句表示图片相对于所加的点的位置
        });
    } else if (count_point === 3) {
        var myIcon = new BMap.Icon("image/pic3.png", new BMap.Size(23, 25), {
            anchor: new BMap.Size(10, 30)//这句表示图片相对于所加的点的位置
        });
    } else if (count_point === 4) {
        var myIcon = new BMap.Icon("image/pic4.png", new BMap.Size(23, 25), {
            anchor: new BMap.Size(10, 30)//这句表示图片相对于所加的点的位置
        });
    } else if (count_point === 5) {
        var myIcon = new BMap.Icon("image/pic5.png", new BMap.Size(23, 25), {
            anchor: new BMap.Size(10, 30)//这句表示图片相对于所加的点的位置
        });
    } else if (count_point === 6) {
        var myIcon = new BMap.Icon("image/pic6.png", new BMap.Size(23, 25), {
            anchor: new BMap.Size(10, 30)//这句表示图片相对于所加的点的位置
        });
    } else if (count_point === 7) {
        var myIcon = new BMap.Icon("image/pic7.png", new BMap.Size(23, 25), {
            anchor: new BMap.Size(10, 30)//这句表示图片相对于所加的点的位置
        });
    } else if (count_point === 8) {
        var myIcon = new BMap.Icon("image/pic8.png", new BMap.Size(23, 25), {
            anchor: new BMap.Size(10, 30)//这句表示图片相对于所加的点的位置
        });
    } else if (count_point === 9) {
        var myIcon = new BMap.Icon("image/pic9.png", new BMap.Size(23, 25), {
            anchor: new BMap.Size(10, 30)//这句表示图片相对于所加的点的位置
        });
    }

    var point = new BMap.Point(pt.lng, pt.lat); //将标注点转化成地图上的点
    var marker = new BMap.Marker(point, {icon: myIcon}); //将点转化成标注点

    me.bdmap.addOverlay(marker);  //将标注点添加到地图上
    //添加监听事件
    (function () {
        var thePoint = pt;
        marker.addEventListener("click",
                function () {
                    me._showInfoPoint(this, thePoint);
                });
    })();

};

MapControl.prototype._showInfoLine = function (thisMarker, line) {
    //获取点的信息
    var me = this;
    me.sContent =
            '<ul style="margin:0 0 5px 0;padding:0.2em 0">'
            + '<li style="line-height: 26px;font-size: 15px;">'
            + '<span style="width: 50px;display: inline-block;">id：</span>' + line.id + '</li>'
            + '<li style="line-height: 26px;font-size: 15px;">'
            + '<span style="width: 50px;display: inline-block;">名称：</span>' + line.name + '</li>'
            + '<span style="width: 50px;display: inline-block;">备注：</span>' + line.info + '</li>'
            + '</ul>';
    me.infoWindowLine = new BMap.InfoWindow(me.sContent); //创建信息窗口对象
    thisMarker.openInfoWindow(me.infoWindowLine); //图片加载完后重绘infoWindow
};

MapControl.prototype._showInfoPoint = function (thisMarker, point) {
    //获取点的信息
    var me = this;
    me.sContent =
            '<ul style="margin:0 0 5px 0;padding:0.2em 0">'
            + '<li style="line-height: 26px;font-size: 15px;">'
            + '<span style="width: 50px;display: inline-block;">id：</span>' + point.id + '</li>'
            + '<li style="line-height: 26px;font-size: 15px;">'
            + '<span style="width: 50px;display: inline-block;">名称：</span>' + point.name + '</li>'
            + '<span style="width: 50px;display: inline-block;">备注：</span>' + point.info + '</li>'
            + '</ul>';
    me.infoWindow = new BMap.InfoWindow(me.sContent); //创建信息窗口对象
    thisMarker.openInfoWindow(me.infoWindow); //图片加载完后重绘infoWindow
};


MapControl.prototype._getpath = function () {
    var me = this;
    var startAddrr = document.getElementById("startAddress").value;//获得起点地名
    if (startAddrr === "") {
        alert("请输入出发地！");
        me._searchByStationName();
    } else {
        var localSearch = new BMap.LocalSearch(me.bdmap);
        localSearch.setSearchCompleteCallback(function (searchResult) {
            var poi = searchResult.getPoi(0);//获得起点经纬度坐标
            if (poi !== null) { //判断地名是否存在
                //console.log('from poi', poi);
                me.from = poi.point;
                // console.log('from', me.from);
                me._searchByStationName();
            } else {
                alert("请输入正确的地名！");
            }
        });
        localSearch.search(startAddrr);
    }
};

MapControl.prototype._searchByStationName = function () {
    var me = this;
    var endAddrr = document.getElementById("endAddress").value; //获得目的地地名
    var localSearch = new BMap.LocalSearch(me.bdmap);
    if (endAddrr === "") {
        alert("请输入目的地！");
    } else {
        localSearch.setSearchCompleteCallback(function (searchResult) {
            var poi = searchResult.getPoi(0); //获得目的地经纬度坐标
            if (poi !== null) { //判断目的地是否存在
                me.to = poi.point;
                me._run();
            } else {
                alert("请输入正确的地名！");
            }
        });
        localSearch.search(endAddrr);
    }
};

MapControl.prototype._run = function () {
    var me = this;

    me.bdmap.clearOverlays(); // 清除地图上所有的覆盖物
    var walking = new BMap.WalkingRoute(me.bdmap); // 创建步行实例
    walking.search(me.from, me.to); // 第一个步行搜索

    let that = this;
    walking.setSearchCompleteCallback(function () {
        console.log('completeCallback start!');
        var pts = walking.getResults().getPlan(0).getRoute(0).getPath() // 通过步行实例，获得一系列点的数组

        var polyline = new BMap.Polyline(pts);
        me.bdmap.addOverlay(polyline);
        console.log('pollyline!', polyline);
        var m1 = new BMap.Marker(that.from); // 创建2个marker
        var m2 = new BMap.Marker(that.to);
        me.bdmap.addOverlay(m1);
        me.bdmap.addOverlay(m2);

        var lab1 = new BMap.Label('起点', {position: that.from}); // 创建2个label
        var lab2 = new BMap.Label('终点', {position: that.to});
        me.bdmap.addOverlay(lab1);
        me.bdmap.addOverlay(lab2);
        console.log('setTimeout!');
        setTimeout(function () {
            me.bdmap.setViewport([that.from, that.to]); // 调整到最佳视野
        }, 1000);
    });
};


MapControl.prototype.clearPoint = function () {
    var me = this;

    count_point = 1;
    var allmap = me.bdmap.getOverlays();
    var map_length = allmap.length;
    for (var i = 0; i < map_length; i++) {
        if (allmap[i].toString() == "[object Marker]") {
            if (allmap[i].getIcon()) {
                me.bdmap.removeOverlay(allmap[i]);
            }
        }
    }
};

MapControl.prototype.clearLine = function () {
    var me = this;

    count_line = 1;
    var allmap = me.bdmap.getOverlays();
    var map_length = allmap.length;
    for (var i = 0; i < map_length; i++) {
        if (allmap[i].toString().indexOf("Polyline") > 0)
        {//删除折线
            me.bdmap.removeOverlay(allmap[i]);
        }

    }
};

MapControl.prototype.clearPolygon = function () {
    var me = this;

    count_polygon = 1;
    var allmap = me.bdmap.getOverlays();
    var map_length = allmap.length;
    for (var i = 0; i < map_length; i++) {
        if (allmap[i].toString().indexOf("Polygon") > 0)
        {//删除折线
            me.bdmap.removeOverlay(allmap[i]);
        }

    }
};






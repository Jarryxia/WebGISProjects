/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
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

//    me._timer = setInterval(function () {
//        me._initBackgroundMap();
//    }, 1000);

    //me.bdmap = new BMap.Map(me.div);
    //enableMapClick:false 设置景点不可点，默认为true，点击景点时，弹出景点详情
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

    // me._addDrawInteractions();
    //me._drawFeature();
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
////自定义样式
//    var customStyle = {
//        "borderColor": "#20A0E4", //标点之间连线颜色
//        "redMarkerSrc": "./images/red_marker.png", //已提交的标点样式
//        "blueMarkerSrc": "./images/blue_marker.png" //本次待提交的标点样式
//    };
//
//    //地图测距功能初始化
//    var opts = {
//        "followText": "单击确定标点，双击结束标点",
//        "lineColor": "#20A0E4",
//        "secIcon": new BMap.Icon(customStyle.blueMarkerSrc, new BMap.Size(21, 35)),
//    };
};
MapControl.prototype._addPoint = function () {
    var me = this;
    var i = 1;
    me.bdmap.addEventListener("click", function (e) {
        me.point = new BMap.Point(e.point.lng, e.point.lat);
        me.point.id = i;
        me.point.name = "test" + i;
        me.point.info = "用于测试";
        me._addMarker(me.point);
        i++;
    });
};


//创建标注点并添加到地图中
MapControl.prototype._addMarker = function (pt) {
    //循环建立标注点
    var me = this;

    var point = new BMap.Point(pt.lng, pt.lat); //将标注点转化成地图上的点
    var marker = new BMap.Marker(point); //将点转化成标注点

    me.bdmap.addOverlay(marker);  //将标注点添加到地图上
    //添加监听事件
    (function () {
        var thePoint = pt;
        marker.addEventListener("click",
                function () {
                    me._showInfo(this, thePoint);
                });
    })();

}

MapControl.prototype._showInfo = function (thisMarker, point) {
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
}

MapControl.prototype._getpath = function () {
    var me = this;
    var startAddrr = document.getElementById("startAddress").value;//获得起点地名
    var localSearch = new BMap.LocalSearch(me.bdmap);
    localSearch.setSearchCompleteCallback(function (searchResult) {
        var poi = searchResult.getPoi(0);//获得起点经纬度坐标
        if (poi != null) { //判断地名是否存在
            //console.log('from poi', poi);
            me.from = poi.point;
           // console.log('from', me.from);
            me._searchByStationName();
        } else {
            alert("请输入正确的地名！")
        }
    });
    localSearch.search(startAddrr);
};

MapControl.prototype._searchByStationName = function () {
    var me = this;
    var endAddrr = document.getElementById("endAddress").value; //获得目的地地名
    var localSearch = new BMap.LocalSearch(me.bdmap);
    localSearch.setSearchCompleteCallback(function (searchResult) {
        var poi = searchResult.getPoi(0); //获得目的地经纬度坐标
        if (poi != null) { //判断目的地是否存在
            me.to = poi.point;
            me._run();
        } else {
            alert("请输入正确的地名！")
        }
    });
    localSearch.search(endAddrr);
   
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







MapControl.prototype._drawFeature = function () {
    var me = this;

    me.overlays = [];
    var overlaycomplete = function (e) {
        me.overlays.push(e.overlay);
    };
    var styleOptions = {
        strokeColor: "red", //边线颜色。
        fillColor: "red", //填充颜色。当参数为空时，圆形将没有填充效果。
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
            offset: new BMap.Size(5, 5), //偏离值
        },
        circleOptions: styleOptions, //圆的样式
        polylineOptions: styleOptions, //线的样式
        polygonOptions: styleOptions, //多边形的样式
        rectangleOptions: styleOptions //矩形的样式
    });
    //添加鼠标绘制工具监听事件，用于获取绘制结果
    drawingManager.addEventListener('overlaycomplete', overlaycomplete);
    clearAll();

};
function clearAll() {
    var me = this;

    for (var i = 0; i < me.overlays.length; i++) {
        me.bdmap.removeOverlay(me.overlays[i]);
    }
    me.overlays.length = 0;
}
;





